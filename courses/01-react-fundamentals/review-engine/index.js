#!/usr/bin/env node

/**
 * Review Engine for React Fundamentals Course
 * 
 * Evaluates challenges using:
 * - Functional tests
 * - Code quality (ESLint)
 * - Architecture checks (AST parsing)
 * - Best practices
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runTests } from './test-runner.js';
import { runE2ETests } from './e2e-runner.js';
import { runLinting } from './linter.js';
import { checkArchitecture } from './architecture-checker.js';
import { checkBestPractices } from './best-practices.js';
import { reviewCodeWithAI } from '../ai-review/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COURSE_DIR = join(__dirname, '..');
const PROJECT_DIR = join(COURSE_DIR, 'project');
const RESULTS_DIR = join(COURSE_DIR, 'results');
const CONFIG_FILE = join(COURSE_DIR, 'course-config.json');

// Parse command line arguments
const args = process.argv.slice(2);
const challengeArg = args.find(arg => arg.startsWith('--challenge'));
const challengeId = challengeArg ? challengeArg.split('=')[1] : null;

async function main() {
  console.log('🔍 Starting review engine...\n');

  // Ensure results directory exists
  if (!existsSync(RESULTS_DIR)) {
    mkdirSync(RESULTS_DIR, { recursive: true });
  }

  // Load course config
  const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  
  // Determine which challenges to review
  const challengesToReview = challengeId
    ? config.challenges.filter(c => c.id === challengeId)
    : config.challenges;

  if (challengesToReview.length === 0) {
    console.error(`❌ Challenge "${challengeId}" not found`);
    process.exit(1);
  }

  console.log(`📋 Reviewing ${challengesToReview.length} challenge(s)\n`);

  const challengeResults = [];

  for (const challenge of challengesToReview) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 Challenge: ${challenge.name} (${challenge.id})`);
    console.log('='.repeat(60));

    const result = await reviewChallenge(challenge, config);
    challengeResults.push(result);

    console.log(`\n✅ Challenge ${challenge.id} completed`);
    console.log(`   Score: ${result.totalScore.toFixed(1)}%`);
  }

  // Generate course summary
  const courseSummary = generateCourseSummary(challengeResults, config);
  
  // Write results
  writeFileSync(
    join(RESULTS_DIR, 'challenge-results.json'),
    JSON.stringify(challengeResults, null, 2)
  );

  writeFileSync(
    join(RESULTS_DIR, 'course-summary.json'),
    JSON.stringify(courseSummary, null, 2)
  );

  // Write AI feedback separately as per project rules
  const aiFeedback = challengeResults.map(r => ({
    challengeId: r.challengeId,
    challengeName: r.challengeName,
    aiReview: r.aiReviewResults || r.aiResults || null
  })).filter(f => f.aiReview !== null);

  if (aiFeedback.length > 0) {
    writeFileSync(
      join(RESULTS_DIR, 'ai-feedback.json'),
      JSON.stringify(aiFeedback, null, 2)
    );
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Course Summary');
  console.log('='.repeat(60));
  console.log(`Overall Score: ${courseSummary.averageScore.toFixed(1)}%`);
  console.log(`Completion: ${courseSummary.completionPercentage}%`);
  console.log(`Badge Level: ${courseSummary.badgeLevel}`);
  console.log(`\n✅ Results saved to: ${RESULTS_DIR}`);

  // Update pathway-level progress and PROGRESS.md
  try {
    const REPO_ROOT = join(COURSE_DIR, '..', '..');
    execSync(`node "${join(REPO_ROOT, 'scripts', 'update-progress.js')}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
  } catch (_) { /* ignore if update-progress not available */ }
}

async function reviewChallenge(challenge, config) {
  const challengeMetadata = loadChallengeMetadata(challenge.id);
  
  const result = {
    challengeId: challenge.id,
    challengeName: challenge.name,
    timestamp: new Date().toISOString(),
    scores: {},
    totalScore: 0,
    passed: false,
    errors: [],
    warnings: []
  };

  try {
    // 1. Functional Tests (40%)
    console.log('\n🧪 Running functional tests...');
    const testResults = await runTests(challenge.id, PROJECT_DIR);
    result.scores.functionalTests = testResults.score;
    result.testResults = testResults;
    console.log(`   Score: ${testResults.score.toFixed(1)}%`);

    // 2. Code Quality - Linting (25%)
    console.log('\n🔍 Running code quality checks...');
    const lintResults = await runLinting(challengeMetadata.filesToCheck, PROJECT_DIR, challengeMetadata);
    result.scores.codeQuality = lintResults.score;
    result.lintResults = lintResults;
    if (lintResults.note) {
      console.log(`   ${lintResults.note}`);
    }
    console.log(`   Score: ${lintResults.score.toFixed(1)}%`);

    // 3. Architecture Checks (20%)
    console.log('\n🏗️  Checking architecture...');
    const archResults = await checkArchitecture(challengeMetadata, PROJECT_DIR);
    result.scores.architecture = archResults.score;
    result.architectureResults = archResults;
    console.log(`   Score: ${archResults.score.toFixed(1)}%`);

    // 4. Best Practices (10%)
    console.log('\n✨ Checking best practices...');
    const bpResults = await checkBestPractices(challengeMetadata, PROJECT_DIR);
    result.scores.bestPractices = bpResults.score;
    result.bestPracticesResults = bpResults;
    if (bpResults.note) {
      console.log(`   ${bpResults.note}`);
    }
    console.log(`   Score: ${bpResults.score.toFixed(1)}%`);

    // 5. E2E Tests (Visual/Interaction Verification) - 15%
    console.log('\n🎭 Running E2E tests (Playwright - visual verification)...');
    try {
      const e2eResults = await runE2ETests(challenge.id, PROJECT_DIR);
      result.scores.e2eTests = e2eResults.score || 0;
      result.e2eResults = e2eResults;
      console.log(`   Score: ${(e2eResults.score || 0).toFixed(1)}%`);
      if (e2eResults.error) {
        console.log(`   ⚠️  Note: ${e2eResults.error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  E2E tests skipped: ${error.message}`);
      result.scores.e2eTests = 0;
      result.e2eResults = { error: error.message };
    }

    // 6. AI Review (5%)
    console.log('\n🤖 Running AI code review...');
    try {
      const aiResults = await reviewCodeWithAI(
        challenge.id,
        challengeMetadata.filesToCheck,
        PROJECT_DIR
      );
      result.scores.aiReview = aiResults.score || 0;
      result.aiReviewResults = aiResults;
      result.aiResults = aiResults; // Also store as aiResults for compatibility
      console.log(`   Score: ${(aiResults.score || 0).toFixed(1)}%`);
    } catch (error) {
      console.log(`   ⚠️  AI review skipped: ${error.message}`);
      result.scores.aiReview = 0; // Score 0 if AI review fails
      result.aiReviewResults = { error: error.message, score: 0 };
    }

    // Calculate total score (comprehensive end-to-end)
    const e2eWeight = config.scoring.e2eTests || 0.15;
    const aiWeight = config.scoring.aiReview || 0.05;
    
    result.totalScore = (
      result.scores.functionalTests * config.scoring.functionalTests +
      result.scores.codeQuality * config.scoring.codeQuality +
      result.scores.architecture * config.scoring.architecture +
      result.scores.bestPractices * config.scoring.bestPractices +
      (result.scores.e2eTests || 0) * e2eWeight +
      (result.scores.aiReview || 0) * aiWeight
    ) / (
      config.scoring.functionalTests +
      config.scoring.codeQuality +
      config.scoring.architecture +
      config.scoring.bestPractices +
      e2eWeight +
      aiWeight
    );

    result.passed = result.totalScore >= config.requirements.minScore;

  } catch (error) {
    result.errors.push(error.message);
    console.error(`❌ Error reviewing challenge: ${error.message}`);
  }

  return result;
}

function loadChallengeMetadata(challengeId) {
  const metadataPath = join(PROJECT_DIR, 'challenges', challengeId, 'metadata.json');
  if (!existsSync(metadataPath)) {
    throw new Error(`Metadata file not found: ${metadataPath}`);
  }
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
  
  // Load README.md for requirements (merged from requirements.md)
  const readmePath = join(PROJECT_DIR, 'challenges', challengeId, 'README.md');
  if (existsSync(readmePath)) {
    const readmeContent = readFileSync(readmePath, 'utf-8');
    metadata.requirements = parseRequirements(readmeContent);
  }
  
  return metadata;
}

function parseRequirements(content) {
  const requirements = {
    functional: [],
    codeQuality: [],
    architecture: [],
    bestPractices: []
  };
  
  if (!content) {
    return requirements;
  }
  
  let currentSection = null;
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Detect section headers - look for "Technical Requirements" section
    if (line.includes('## Technical Requirements')) {
      // Reset to look for subsections
      currentSection = null;
    } else if (line.includes('### Functional Requirements')) {
      currentSection = 'functional';
    } else if (line.includes('### Code Quality Requirements')) {
      currentSection = 'codeQuality';
    } else if (line.includes('### Architecture Requirements')) {
      currentSection = 'architecture';
    } else if (line.includes('### Best Practices Requirements')) {
      currentSection = 'bestPractices';
    } else if (currentSection && (line.trim().startsWith('-') || line.trim().startsWith('✅') || line.trim().match(/^\d+\./))) {
      // Extract requirement text (remove checkbox, number, etc.)
      const requirement = line.replace(/^[-*✅]\s*/, '').replace(/^\d+\.\s*/, '').replace(/✅\s*/, '').trim();
      if (requirement && requirements[currentSection]) {
        requirements[currentSection].push(requirement);
      }
    }
  }
  
  return requirements;
}

function generateCourseSummary(challengeResults, config) {
  const totalChallenges = config.challenges.length;
  const completedChallenges = challengeResults.filter(r => r.passed).length;
  const averageScore = challengeResults.reduce((sum, r) => sum + r.totalScore, 0) / challengeResults.length;
  const completionPercentage = (completedChallenges / totalChallenges) * 100;

  // Determine badge level
  let badgeLevel = 'none';
  if (averageScore >= 90 && completionPercentage === 100) {
    badgeLevel = 'gold';
  } else if (averageScore >= 75 && completionPercentage >= 75) {
    badgeLevel = 'silver';
  } else if (averageScore >= 60 && completionPercentage >= 50) {
    badgeLevel = 'bronze';
  }

  // Identify strengths and improvements
  const strengths = challengeResults
    .filter(r => r.totalScore >= 80)
    .map(r => r.challengeName);

  const improvements = challengeResults
    .filter(r => r.totalScore < 70)
    .map(r => r.challengeName);

  return {
    courseId: config.courseId,
    courseName: config.courseName,
    lastUpdated: new Date().toISOString(),
    totalChallenges,
    completedChallenges,
    averageScore: averageScore || 0,
    completionPercentage: completionPercentage || 0,
    badgeLevel,
    challengeResults: challengeResults.map(r => ({
      challengeId: r.challengeId,
      challengeName: r.challengeName,
      score: r.totalScore,
      passed: r.passed
    })),
    skillStrengths: strengths,
    improvementAreas: improvements
  };
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
