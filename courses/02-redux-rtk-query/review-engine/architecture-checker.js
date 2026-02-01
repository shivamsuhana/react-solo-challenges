import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Checks architecture patterns using AST parsing
 * Adapted for RTK Query patterns
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const patternsRequired = challengeMetadata.patternsRequired || [];
  const filesToCheck = challengeMetadata.filesToCheck || [];
  
  if (patternsRequired.length === 0) {
    return {
      score: 100,
      passed: true,
      details: []
    };
  }

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    
    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileResults = checkFileForPatterns(fileContent, patternsRequired, file);
      
      results.patternsFound.push(...fileResults.patternsFound);
      results.patternsMissing.push(...fileResults.patternsMissing);
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) {
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Score by unique patterns found across all files (patterns can be in different files)
  const uniqueFound = new Set(results.patternsFound);
  const requiredSet = new Set(patternsRequired);
  const foundCount = [...uniqueFound].filter(p => requiredSet.has(p)).length;
  results.score = patternsRequired.length > 0
    ? Math.round((foundCount / patternsRequired.length) * 100 * 10) / 10
    : 0;
  
  results.passed = results.score >= 80;

  return results;
}

function checkFileForPatterns(content, patternsRequired, fileName) {
  const patternsFound = [];
  const patternsMissing = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
    });

    const foundPatterns = new Set();

    traverse(ast, {
      // Check for RTK Query patterns
      CallExpression(path) {
        if (path.node.callee.name === 'createApi') {
          foundPatterns.add('createApi');
        }
        if (path.node.callee.name === 'fetchBaseQuery') {
          foundPatterns.add('fetchBaseQuery');
        }
      },

      // Check for endpoints
      ObjectProperty(path) {
        if (path.node.key.name === 'endpoints') {
          foundPatterns.add('endpoints');
        }
        if (path.node.key.name === 'providesTags') {
          foundPatterns.add('providesTags');
        }
        if (path.node.key.name === 'invalidatesTags') {
          foundPatterns.add('invalidatesTags');
        }
        if (path.node.key.name === 'tagTypes') {
          foundPatterns.add('tagTypes');
        }
      },

      // Check for mutation (RTK Query: builder.mutation(...))
      CallExpression(path) {
        const callee = path.node.callee;
        if (callee.type === 'MemberExpression' && callee.object?.name === 'builder' && callee.property?.name === 'mutation') {
          foundPatterns.add('mutation');
        }
      },
      ObjectMethod(path) {
        if (path.node.key && path.node.key.name === 'mutation') {
          foundPatterns.add('mutation');
        }
      },

      // Check for onQueryStarted (optimistic updates)
      ObjectProperty(path) {
        if (path.node.key.name === 'onQueryStarted') {
          foundPatterns.add('onQueryStarted');
        }
      },

      // Check for useQuery hooks
      CallExpression(path) {
        if (path.node.callee.name && /use.*Query/i.test(path.node.callee.name)) {
          foundPatterns.add('useQueryHook');
        }
        if (path.node.callee.name && /use.*Mutation/i.test(path.node.callee.name)) {
          foundPatterns.add('useMutationHook');
        }
      },

      // Check for multiple endpoints
      ObjectProperty(path) {
        if (path.node.key.name === 'endpoints') {
          const endpointsValue = path.node.value;
          if (endpointsValue.type === 'ArrowFunctionExpression' || 
              endpointsValue.type === 'FunctionExpression') {
            foundPatterns.add('multipleEndpoints');
          }
        }
      },

      // Check for optimistic update
      CallExpression(path) {
        if (path.node.callee.property && 
            path.node.callee.property.name === 'updateQueryData') {
          foundPatterns.add('optimisticUpdate');
        }
      }
    });

    // Map metadata pattern names to AST-found names where different
    const patternAliases = {
      useGetUsersQuery: 'useQueryHook',
      useGetPostsQuery: 'useQueryHook',
      useMutation: 'useMutationHook',
      'builder.query': 'endpoints',
      'builder.mutation': 'mutation',
    };
    for (const pattern of patternsRequired) {
      const astName = patternAliases[pattern] || pattern;
      const foundByAst = foundPatterns.has(astName);
      let foundByString = typeof pattern === 'string' && content.includes(pattern);
      if (!foundByString && pattern === 'useSelector') foundByString = content.includes('useAppSelector');
      if (!foundByString && pattern === 'useMutation') foundByString = content.includes('useAddPostMutation') || content.includes('useMutation');
      if (!foundByString && pattern === 'useGetPostsQuery') foundByString = content.includes('useGetPostsQuery');
      if (foundByAst || foundByString) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) {
    // If parsing fails, try simple string matching as fallback
    for (const pattern of patternsRequired) {
      let found = content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase());
      if (!found && pattern === 'useSelector') found = content.includes('useAppSelector');
      if (!found && pattern === 'useMutation') found = content.includes('useAddPostMutation');
      if (!found && pattern === 'useGetPostsQuery') found = content.includes('useGetPostsQuery');
      if (found) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
