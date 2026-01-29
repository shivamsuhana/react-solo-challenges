#!/usr/bin/env node

/**
 * AI Review Layer for Next.js App Router Course
 * 
 * Uses Groq API (Llama 3.1 8B) to provide qualitative code review
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

/**
 * Reviews code using AI for qualitative feedback
 */
export async function reviewCodeWithAI(challengeId, filesToReview, projectDir) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ''
  };

  try {
    // Load challenge README.md for context
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');
    let challengeContext = '';
    if (existsSync(readmePath)) {
      challengeContext = readFileSync(readmePath, 'utf-8');
    }

    // Read all files to review
    const codeSnippets = [];
    for (const file of filesToReview) {
      const filePath = join(projectDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        codeSnippets.push({
          file,
          content: content.substring(0, 5000) // Limit content size
        });
      }
    }

    if (codeSnippets.length === 0) {
      return {
        ...results,
        error: 'No files found to review'
      };
    }

    // Check if API key is available
    if (!GROQ_API_KEY) {
      return {
        ...results,
        error: 'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    // Prepare prompt
    const prompt = buildReviewPrompt(challengeId, codeSnippets, challengeContext);

    // Call Groq API
    const aiResponse = await callGroqAPI(prompt);

    // Parse response
    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };

  } catch (error) {
    return {
      ...results,
      error: error.message
    };
  }
}

function buildReviewPrompt(challengeId, codeSnippets, challengeContext = '') {
  const codeContext = codeSnippets.map(s => 
    `File: ${s.file}\n\`\`\`typescript\n${s.content}\n\`\`\``
  ).join('\n\n');

  const contextSection = challengeContext
    ? `\n\n## Challenge Instructions and Requirements:\n${challengeContext.substring(0, 3000)}\n`
    : '';

  return `You are an expert Next.js App Router and React code reviewer. Review the following code for challenge "${challengeId}".
${contextSection}
${codeContext}

Provide a structured review focusing on:
1. Code readability (0-100 score)
2. Maintainability (0-100 score)
3. Strengths (list 2-3 key strengths)
4. Areas for improvement (list 2-3 specific improvements)
5. Overall assessment (brief paragraph)

Format your response as JSON:
{
  "readability": <number>,
  "maintainability": <number>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "overall": "<brief assessment>"
}`;
}

async function callGroqAPI(prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Next.js App Router, React, and TypeScript code reviewer. Provide constructive, specific feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.error?.message || data?.error || response.statusText;
    throw new Error(`Groq API error (${response.status}): ${msg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (content == null || typeof content !== 'string') {
    throw new Error('Groq API returned no content (check model/response shape)');
  }
  return content;
}

function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    // Fallback parsing
  }

  // Fallback: extract information manually
  const readabilityMatch = response.match(/readability[:\s]+(\d+)/i);
  const maintainabilityMatch = response.match(/maintainability[:\s]+(\d+)/i);

  return {
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 50,
    maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 50,
    strengths: extractList(response, /strengths?/i),
    improvements: extractList(response, /improvements?/i),
    overall: response.substring(0, 500)
  };
}

function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(keyword)) {
      inList = true;
      continue;
    }
    if (inList && (line.trim().startsWith('-') || line.trim().match(/^\d+\./))) {
      list.push(line.trim().replace(/^[-•\d.]+\s*/, ''));
      if (list.length >= 3) break;
    }
    if (inList && line.trim() === '') {
      break;
    }
  }

  return list.length > 0 ? list : ['Code structure is reasonable'];
}

function calculateAIScore(parsedResponse) {
  const readability = parsedResponse.readability || 50;
  const maintainability = parsedResponse.maintainability || 50;
  return Math.round((readability + maintainability) / 2);
}
