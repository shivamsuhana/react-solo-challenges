#!/usr/bin/env node
/**
 * Aggregates all course results into learner-results/progress.json
 * and updates README evidence (course + root).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const PATHWAY_CONFIG = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');
const LEARNER_RESULTS = join(ROOT_DIR, 'learner-results');
const PROGRESS_JSON = join(LEARNER_RESULTS, 'progress.json');

function loadPathway() {
  if (!existsSync(PATHWAY_CONFIG)) return { pathwayName: 'Pathway', courses: [] };
  return JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
}

function aggregateProgress() {
  const pathway = loadPathway();
  const courses = pathway.courses || [];
  const progress = {
    lastUpdated: new Date().toISOString(),
    pathway: {
      name: pathway.pathwayName || 'Pathway',
      version: pathway.pathwayVersion || '1.0.0',
      overallScore: 0,
      completionPercentage: 0,
      badgeLevel: 'none',
      totalChallenges: 0,
      completedChallenges: 0,
    },
    courses: {},
  };

  let totalScoreSum = 0;
  let totalWeight = 0;
  let totalChallenges = 0;
  let completedChallenges = 0;

  for (const course of courses) {
    const courseId = course.id;
    const resultsDir = join(ROOT_DIR, 'courses', courseId, 'results');
    const challengeResultsPath = join(resultsDir, 'challenge-results.json');
    const courseSummaryPath = join(resultsDir, 'course-summary.json');

    const courseProgress = {
      courseId,
      courseName: course.name,
      averageScore: 0,
      completionPercentage: 0,
      badgeLevel: 'none',
      totalChallenges: 0,
      completedChallenges: 0,
      challenges: {},
    };

    const courseConfigPath = join(ROOT_DIR, 'courses', courseId, 'course-config.json');
    let numChallengesInCourse = 0;
    if (existsSync(courseConfigPath)) {
      const config = JSON.parse(readFileSync(courseConfigPath, 'utf-8'));
      numChallengesInCourse = (config.challenges || []).length;
    }

    if (existsSync(courseSummaryPath)) {
      const summary = JSON.parse(readFileSync(courseSummaryPath, 'utf-8'));
      courseProgress.averageScore = summary.averageScore ?? 0;
      courseProgress.completionPercentage = summary.completionPercentage ?? 0;
      courseProgress.badgeLevel = summary.badgeLevel ?? 'none';
      courseProgress.totalChallenges = summary.totalChallenges ?? numChallengesInCourse;
      courseProgress.completedChallenges = summary.completedChallenges ?? 0;
    } else {
      courseProgress.totalChallenges = numChallengesInCourse;
    }

    if (existsSync(challengeResultsPath)) {
      const results = JSON.parse(readFileSync(challengeResultsPath, 'utf-8'));
      for (const r of results) {
        courseProgress.challenges[r.challengeId] = {
          challengeId: r.challengeId,
          challengeName: r.challengeName,
          passed: r.passed ?? false,
          score: r.totalScore ?? 0,
          lastRun: r.timestamp || null,
          scores: r.scores || {},
        };
      }
    }

    progress.courses[courseId] = courseProgress;
    totalChallenges += courseProgress.totalChallenges;
    completedChallenges += courseProgress.completedChallenges;
    const weight = course.weight || 1 / courses.length;
    totalScoreSum += (courseProgress.averageScore || 0) * weight;
    totalWeight += weight;
  }

  progress.pathway.totalChallenges = totalChallenges;
  progress.pathway.completedChallenges = completedChallenges;
  progress.pathway.overallScore = totalWeight > 0 ? Math.round((totalScoreSum / totalWeight) * 10) / 10 : 0;
  progress.pathway.completionPercentage = totalChallenges > 0
    ? Math.round((completedChallenges / totalChallenges) * 1000) / 10
    : 0;

  const badgeLevels = pathway.badgeLevels || {};
  if (badgeLevels.silver && progress.pathway.overallScore >= (badgeLevels.silver?.minScore ?? 75) &&
      progress.pathway.completionPercentage >= (badgeLevels.silver?.minCompletion ?? 75)) {
    progress.pathway.badgeLevel = 'silver';
  } else if (badgeLevels.bronze && progress.pathway.overallScore >= (badgeLevels.bronze?.minScore ?? 60) &&
             progress.pathway.completionPercentage >= (badgeLevels.bronze?.minCompletion ?? 50)) {
    progress.pathway.badgeLevel = 'bronze';
  } else {
    progress.pathway.badgeLevel = 'none';
  }

  return progress;
}

function main() {
  if (!existsSync(LEARNER_RESULTS)) {
    mkdirSync(LEARNER_RESULTS, { recursive: true });
  }
  const progress = aggregateProgress();
  writeFileSync(PROGRESS_JSON, JSON.stringify(progress, null, 2));
  try {
    execSync('node scripts/update-readme-evidence.js', { cwd: ROOT_DIR, stdio: 'pipe' });
    console.log('✅ README evidence updated');
  } catch (_) {
    console.log('⚠️  update-readme-evidence.js skipped');
  }
  console.log('✅ Progress updated:', PROGRESS_JSON);
}

main();
