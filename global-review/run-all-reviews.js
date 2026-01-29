#!/usr/bin/env node

/**
 * Global Review Engine
 * 
 * Runs all course reviews and aggregates pathway-level results
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateWeightedAverage, determineBadgeLevel, aggregateStrengths, aggregateImprovements } from './scoring-engine/index.js';
import { aggregateAIFeedback, generatePathwayInsights } from './ai-review/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(__dirname, '..');
const PATHWAY_CONFIG = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');
const PATHWAY_SUMMARY = join(ROOT_DIR, 'pathway-review', 'pathway-summary.json');

async function main() {
  console.log('🚀 Starting Global Review Engine\n');
  console.log('='.repeat(60));

  // Load pathway config
  const pathwayConfig = JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));

  const courseResults = [];

  // Run review for each course
  for (const course of pathwayConfig.courses) {
    console.log(`\n📚 Reviewing Course: ${course.name} (${course.id})\n`);
    console.log('-'.repeat(60));

    try {
      const courseDir = join(ROOT_DIR, 'courses', course.id);
      const reviewScript = join(courseDir, 'review-engine', 'index.js');

      if (!existsSync(reviewScript)) {
        console.log(`⚠️  Review engine not found for ${course.id}, skipping...`);
        continue;
      }

      // Run the course review engine
      execSync(`node "${reviewScript}"`, {
        cwd: courseDir,
        stdio: 'inherit'
      });

      // Load course summary
      const courseSummaryPath = join(courseDir, 'results', 'course-summary.json');
      if (existsSync(courseSummaryPath)) {
        const courseSummary = JSON.parse(readFileSync(courseSummaryPath, 'utf-8'));
        courseResults.push({
          courseId: course.id,
          courseName: course.name,
          weight: course.weight,
          ...courseSummary
        });
        console.log(`✅ Course ${course.name} completed`);
      } else {
        console.log(`⚠️  Course summary not found for ${course.id}`);
      }

    } catch (error) {
      console.error(`❌ Error reviewing course ${course.id}:`, error.message);
      courseResults.push({
        courseId: course.id,
        courseName: course.name,
        weight: course.weight,
        error: error.message,
        averageScore: 0,
        completionPercentage: 0
      });
    }
  }

  // Aggregate AI feedback
  const aiFeedback = aggregateAIFeedback(join(ROOT_DIR, 'courses'));
  const aiInsights = generatePathwayInsights(aiFeedback);

  // Generate pathway summary
  const pathwaySummary = generatePathwaySummary(courseResults, pathwayConfig, aiInsights);

  // Write pathway summary
  writeFileSync(PATHWAY_SUMMARY, JSON.stringify(pathwaySummary, null, 2));

  // Write AI insights to learner-results (global cache)
  const learnerResultsDir = join(ROOT_DIR, 'learner-results');
  if (!existsSync(learnerResultsDir)) {
    mkdirSync(learnerResultsDir, { recursive: true });
  }
  writeFileSync(
    join(learnerResultsDir, 'ai-insights.json'),
    JSON.stringify(aiInsights, null, 2)
  );

  // Refresh README evidence (pathway + all course READMEs)
  try {
    execSync('node scripts/update-readme-evidence.js', { cwd: ROOT_DIR, stdio: 'pipe' });
    console.log('✅ README evidence updated');
  } catch (_) { /* ignore */ }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Pathway Summary');
  console.log('='.repeat(60));
  console.log(`Pathway: ${pathwaySummary.pathwayName}`);
  console.log(`Overall Score: ${pathwaySummary.overallScore.toFixed(1)}%`);
  console.log(`Completion: ${pathwaySummary.completionPercentage.toFixed(1)}%`);
  console.log(`Badge Level: ${pathwaySummary.badgeLevel}`);
  console.log(`\n✅ Pathway summary saved to: ${PATHWAY_SUMMARY}`);
}

function generatePathwaySummary(courseResults, pathwayConfig, aiInsights) {
  // Calculate weighted average score using scoring engine
  const courseSummaries = courseResults
    .filter(c => !c.error)
    .map(course => ({
      courseId: course.courseId,
      courseName: course.courseName,
      score: course.averageScore || 0,
      completion: course.completionPercentage || 0,
      badgeLevel: course.badgeLevel || 'none',
      skillStrengths: course.skillStrengths || [],
      improvementAreas: course.improvementAreas || []
    }));

  const weights = pathwayConfig.courses.map(c => c.weight);
  const scores = courseSummaries.map(c => c.score);
  const overallScore = calculateWeightedAverage(
    courseSummaries.map(c => ({ averageScore: c.score })),
    weights
  );

  const totalChallenges = courseSummaries.reduce((sum, c) => sum + (c.completion ? 1 : 0), 0);
  const completedChallenges = courseSummaries.filter(c => c.completion === 100).length;
  const completionPercentage = courseSummaries.length > 0
    ? (completedChallenges / courseSummaries.length) * 100
    : 0;

  // Determine badge level using scoring engine
  const badgeLevel = determineBadgeLevel(
    overallScore,
    completionPercentage,
    pathwayConfig.badgeLevels
  );

  // Aggregate skill strengths and improvements using scoring engine
  const allStrengths = aggregateStrengths(courseSummaries);
  const allImprovements = aggregateImprovements(courseSummaries);

  // Get git info if available
  let repositoryUrl = '';
  let commitSha = '';
  try {
    repositoryUrl = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
    commitSha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    // Git not available or not a git repo
  }

  return {
    pathwayName: pathwayConfig.pathwayName || 'Modern React Engineer',
    version: pathwayConfig.pathwayVersion || '1.0.0',
    lastUpdated: new Date().toISOString(),
    overallScore: Math.round(overallScore * 10) / 10,
    completionPercentage: Math.round(completionPercentage * 10) / 10,
    badgeLevel,
    courses: courseSummaries,
    totalChallenges: courseSummaries.length,
    completedChallenges,
    averageScore: overallScore,
    skillStrengths: allStrengths,
    improvementAreas: allImprovements,
    aiInsights: aiInsights || null,
    repositoryUrl,
    commitSha
  };
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
