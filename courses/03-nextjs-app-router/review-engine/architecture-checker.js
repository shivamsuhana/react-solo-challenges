import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from '@babel/parser';
import traverseImport from '@babel/traverse';
const traverse = traverseImport.default || traverseImport;

/**
 * Checks architecture patterns using AST parsing
 * Adapted for Next.js App Router patterns
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

  let allPatternsFound = new Set();

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
      
      fileResults.patternsFound.forEach(p => allPatternsFound.add(p));
      
      results.patternsFound.push(...fileResults.patternsFound);
      results.patternsMissing.push(...fileResults.patternsMissing);
      results.details.push({
        file,
        patternsFound: fileResults.patternsFound,
        patternsMissing: fileResults.patternsMissing
      });
    } catch (error) { console.error("BABEL ERROR:", error);
      results.details.push({
        file,
        error: error.message,
        patternsFound: [],
        patternsMissing: patternsRequired
      });
    }
  }

  // Calculate score based on unique patterns found across all files
  let passedChecks = 0;
  for (const pattern of patternsRequired) {
    if (allPatternsFound.has(pattern)) {
      passedChecks++;
    }
  }
  
  results.score = patternsRequired.length > 0 
    ? Math.round((passedChecks / patternsRequired.length) * 100 * 10) / 10
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
      // Check for 'use client' and 'use server' directives
      Directive(path) {
        if (path.node.value.value === 'use client') {
          foundPatterns.add('useClient');
          foundPatterns.add('clientComponent');
        }
        if (path.node.value.value === 'use server') {
          foundPatterns.add('useServer');
        }
      },

      // Check for Server Component (no 'use client') and app directory structure
      Program(path) {
        const hasUseClient = path.node.directives?.some(
          d => d.value.value === 'use client'
        );
        if (!hasUseClient && (fileName.includes('page.tsx') || fileName.includes('layout.tsx'))) {
          foundPatterns.add('serverComponent');
        }
        
        if (fileName.includes('app/')) {
          foundPatterns.add('appDirectory');
        }
        if (fileName.includes('page.tsx') || fileName.includes('layout.tsx')) {
          foundPatterns.add('fileBasedRouting');
        }
        
        if (fileName.includes('loading.tsx')) {
          foundPatterns.add('loadingTsx');
        }
        
        if (fileName.includes('[id]') || fileName.includes('[slug]')) {
          foundPatterns.add('dynamicSegment');
        }
        
        if (fileName.includes('error.tsx')) {
          foundPatterns.add('errorTsx');
        }
      },

      // Check for Link component
      ImportDeclaration(path) {
        if (path.node.source.value === 'next/link') {
          foundPatterns.add('Link');
        }
        if (path.node.source.value === 'next/navigation') {
          foundPatterns.add('navigation');
        }
        if (path.node.source.value === 'next/image') {
          foundPatterns.add('nextImage');
        }
        if (path.node.source.value.startsWith('next/font')) {
          foundPatterns.add('nextFont');
        }
      },


      ArrowFunctionExpression(path) {
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          foundPatterns.add('asyncServerComponent');
        }
      },

      // Check for metadata and dynamic export
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          const decl = path.node.declaration;
          if (decl.id && decl.id.name === 'metadata') {
            foundPatterns.add('metadata');
          }
          if (decl.id && decl.id.name === 'generateMetadata') {
            foundPatterns.add('generateMetadata');
          }
          if (decl.type === 'VariableDeclaration') {
            decl.declarations.forEach(d => {
              if (d.id && d.id.name === 'dynamic') {
                foundPatterns.add('dynamicExport');
                if (d.init && d.init.type === 'StringLiteral') {
                  if (d.init.value === 'force-static' || d.init.value === 'force-dynamic') {
                    foundPatterns.add('forceStaticOrDynamic');
                  }
                  if (d.init.value === 'force-dynamic') {
                    foundPatterns.add('forceDynamic');
                  }
                }
              }
            });
          }
        }
        path.node.specifiers.forEach(spec => {
          if (spec.exported.name === 'metadata') {
            foundPatterns.add('metadata');
          }
        });
      },

      // Check for GET export
      FunctionDeclaration(path) {
        if (path.node.id && path.node.id.name === 'GET') {
          foundPatterns.add('GET');
          foundPatterns.add('routeHandler');
        }
        if (path.node.id && path.node.id.name === 'POST') {
          foundPatterns.add('POST');
          foundPatterns.add('routeHandler');
        }
        if (path.node.id && path.node.id.name === 'generateMetadata') {
          foundPatterns.add('generateMetadata');
        }
        
        // Retain previous async logic
        if (path.node.async) {
          foundPatterns.add('asyncComponent');
          foundPatterns.add('asyncServerComponent');
        }
        if (path.node.async && 
            (path.node.id?.name?.includes('action') || 
             content.includes('use server'))) {
          foundPatterns.add('serverAction');
        }
      },

      // Check for API route (route.ts) and Server Actions
      CallExpression(path) {
        if (path.node.callee.name === 'fetch') {
          foundPatterns.add('fetch');
        }
        if (path.node.callee.name === 'revalidatePath') {
          foundPatterns.add('revalidatePath');
          foundPatterns.add('revalidate');
        }
        if (path.node.callee.name === 'revalidateTag') {
          foundPatterns.add('revalidateTag');
          foundPatterns.add('revalidate');
        }
        if (path.node.callee.name === 'notFound') {
          foundPatterns.add('notFound');
        }
        if (path.node.callee.name === 'configureStore') {
          foundPatterns.add('configureStore');
        }
        if (path.node.callee.name === 'useSelector') {
          foundPatterns.add('useSelector');
        }
        if (path.node.callee.name === 'useDispatch') {
          foundPatterns.add('useDispatch');
        }
        if (path.node.callee.name === 'createApi') {
          foundPatterns.add('createApi');
        }
        if (path.node.callee.name === 'fetchBaseQuery') {
          foundPatterns.add('fetchBaseQuery');
        }
        if (typeof path.node.callee.name === 'string') {
          if (path.node.callee.name.startsWith('use') && path.node.callee.name.endsWith('Query')) {
            foundPatterns.add('useQuery');
          }
          if (path.node.callee.name.startsWith('use') && path.node.callee.name.endsWith('Mutation')) {
            foundPatterns.add('useMutation');
          }
        }
        
        const isResponseJson = path.node.callee.object && 
            (path.node.callee.object.name === 'Response' || path.node.callee.object.name === 'NextResponse') &&
            path.node.callee.property &&
            path.node.callee.property.name === 'json';
            
        if (isResponseJson || path.node.callee.name === 'NextResponse') {
          foundPatterns.add('apiRoute');
          foundPatterns.add('ResponseJson');
          foundPatterns.add('routeHandler');
        }
      },

      AwaitExpression(path) {
        foundPatterns.add('await');
      },

      // Removed duplicate FunctionDeclaration visitor

      // Check for form handling and Suspense
      JSXElement(path) {
        if (path.node.openingElement.name.name === 'form') {
          foundPatterns.add('formHandling');
        }
        if (path.node.openingElement.name.name === 'Suspense') {
          foundPatterns.add('Suspense');
        }
        if (path.node.openingElement.name.name === 'Provider') {
          foundPatterns.add('Provider');
        }
      },

      Identifier(path) {
        if (path.node.name === 'params') {
          foundPatterns.add('params');
        }
        if (path.node.name === 'searchParams') {
          foundPatterns.add('searchParams');
          foundPatterns.add('pagination');
        }
      },

      ObjectProperty(path) {
        if (path.node.key && path.node.key.name === 'cache') {
          if (path.node.value && path.node.value.value === 'no-store') {
            foundPatterns.add('cacheNoStore');
          }
          if (path.node.value && path.node.value.value === 'force-cache') {
            foundPatterns.add('fetchCache');
          }
        }
        if (path.node.key && path.node.key.name === 'revalidate') {
          foundPatterns.add('fetchCache');
          foundPatterns.add('revalidate');
        }
      },

      // Removed duplicate Program visitor
    });

    // Check which required patterns were found
    for (const pattern of patternsRequired) {
      if (foundPatterns.has(pattern)) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }

  } catch (error) { console.error("BABEL ERROR:", error);
    // If parsing fails, try simple string matching as fallback
    for (const pattern of patternsRequired) {
      if (content.includes(pattern) || content.includes(pattern.replace(/([A-Z])/g, '-$1').toLowerCase())) {
        patternsFound.push(pattern);
      } else {
        patternsMissing.push(pattern);
      }
    }
  }

  return { patternsFound, patternsMissing };
}
