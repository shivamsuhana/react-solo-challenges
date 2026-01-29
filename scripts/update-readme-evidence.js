#!/usr/bin/env node
/**
 * Updates README evidence sections from review results.
 * - Course: updates course project README with challenges completed %, average score, pass/fail per challenge.
 * - Pathway: updates root README with completion %, overall score, pass/fail per course.
 * No badge levels (bronze/silver/gold); evidence only.
 *
 * Usage:
 *   node scripts/update-readme-evidence.js                    → update all (each course README + root README)
 *   node scripts/update-readme-evidence.js --course=COURSE_ID → update only that course project README
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const PATHWAY_CONFIG = join(ROOT_DIR, 'pathway-review', 'pathway-config.json');
const PROGRESS_JSON = join(ROOT_DIR, 'learner-results', 'progress.json');

const COURSE_EVIDENCE_HEADING = '## 📊 Progress Evidence';
const ROOT_EVIDENCE_HEADING = '## 📈 Progress Summary';

function loadPathwayConfig() {
  if (!existsSync(PATHWAY_CONFIG)) return { pathwayName: 'Pathway', courses: [] };
  return JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
}

function loadProgress() {
  if (!existsSync(PROGRESS_JSON)) return null;
  return JSON.parse(readFileSync(PROGRESS_JSON, 'utf-8'));
}

/**
 * Update one course project README with evidence from course-summary.json and challenge-results.json.
 */
function updateCourseReadmeEvidence(courseId) {
  const courseDir = join(ROOT_DIR, 'courses', courseId);
  const projectReadme = join(courseDir, 'project', 'README.md');
  const resultsDir = join(courseDir, 'results');
  const courseSummaryPath = join(resultsDir, 'course-summary.json');
  const challengeResultsPath = join(resultsDir, 'challenge-results.json');

  if (!existsSync(projectReadme)) return;

  let totalChallenges = 0;
  let completedChallenges = 0;
  let averageScore = 0;
  let lastUpdated = new Date().toISOString();
  const challengeRows = [];

  if (existsSync(courseSummaryPath)) {
    const summary = JSON.parse(readFileSync(courseSummaryPath, 'utf-8'));
    totalChallenges = summary.totalChallenges ?? 0;
    completedChallenges = summary.completedChallenges ?? 0;
    averageScore = summary.averageScore ?? 0;
    lastUpdated = summary.lastUpdated || lastUpdated;
  }

  if (existsSync(challengeResultsPath)) {
    const results = JSON.parse(readFileSync(challengeResultsPath, 'utf-8'));
    for (const r of results) {
      const status = r.passed ? 'Pass' : 'Fail';
      challengeRows.push({ name: r.challengeName || r.challengeId, status });
    }
  }

  const completionPct = totalChallenges > 0
    ? Math.round((completedChallenges / totalChallenges) * 1000) / 10
    : 0;
  const scoreStr = Math.round(averageScore * 10) / 10;

  const lines = [
    '',
    COURSE_EVIDENCE_HEADING,
    '',
    `*Auto-updated when you run review. Last run: ${new Date(lastUpdated).toLocaleString()}*`,
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Challenges completed | ${completedChallenges} / ${totalChallenges} (${completionPct}%) |`,
    `| Average score | ${scoreStr}% |`,
    '',
    '| Challenge | Status |',
    '|-----------|--------|',
    ...challengeRows.map(r => `| ${r.name} | ${r.status} |`),
    '',
  ];

  const section = lines.join('\n');
  let readmeContent = readFileSync(projectReadme, 'utf-8');

  const startMarker = readmeContent.indexOf(COURSE_EVIDENCE_HEADING);
  const nextH2 = startMarker >= 0
    ? readmeContent.indexOf('\n## ', startMarker + 1)
    : -1;

  if (startMarker !== -1 && nextH2 !== -1) {
    readmeContent = readmeContent.slice(0, startMarker) + section.trimStart() + readmeContent.slice(nextH2);
  } else if (startMarker !== -1) {
    readmeContent = readmeContent.slice(0, startMarker) + section.trimStart();
  } else {
    const insertBefore = readmeContent.indexOf('## 📋 Challenge Workflow');
    const insertAt = insertBefore !== -1 ? insertBefore : readmeContent.indexOf('## 📁 Project Structure');
    if (insertAt !== -1) {
      readmeContent = readmeContent.slice(0, insertAt) + section + readmeContent.slice(insertAt);
    } else {
      readmeContent = readmeContent.trimEnd() + '\n' + section;
    }
  }

  writeFileSync(projectReadme, readmeContent);
}

/**
 * Update root README with pathway evidence (completion %, overall score, pass/fail per course). No badges.
 */
function updateRootReadmeEvidence() {
  const rootReadme = join(ROOT_DIR, 'README.md');
  if (!existsSync(rootReadme)) return;

  const progress = loadProgress();
  if (!progress || !progress.pathway) return;

  const pathway = progress.pathway;
  const completionPct = Math.round((pathway.completionPercentage ?? 0) * 10) / 10;
  const overallScore = Math.round((pathway.overallScore ?? 0) * 10) / 10;

  const lines = [
    '',
    ROOT_EVIDENCE_HEADING,
    '',
    `**Last updated:** ${new Date(progress.lastUpdated || Date.now()).toLocaleString()}`,
    '',
    '### Pathway',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Challenges completed | ${pathway.completedChallenges ?? 0} / ${pathway.totalChallenges ?? 0} (${completionPct}%) |`,
    `| Overall score | ${overallScore}% |`,
    '',
    '### By course',
    '',
    '| Course | Completed | Score | Status |',
    '|--------|-----------|-------|--------|',
  ];

  for (const [courseId, course] of Object.entries(progress.courses || {})) {
    const total = course.totalChallenges ?? 0;
    const completed = course.completedChallenges ?? 0;
    const pct = total > 0 ? Math.round((completed / total) * 10) / 10 : 0;
    const score = Math.round((course.averageScore ?? 0) * 10) / 10;
    const passed = (course.challenges && Object.values(course.challenges).every(c => c.passed)) || (total > 0 && completed === total);
    const status = passed ? 'Pass' : 'Fail';
    lines.push(`| ${course.courseName ?? courseId} | ${completed}/${total} (${pct}%) | ${score}% | ${status} |`);
  }

  lines.push('', '');

  const section = lines.join('\n');
  let readmeContent = readFileSync(rootReadme, 'utf-8');

  const startMarker = readmeContent.indexOf(ROOT_EVIDENCE_HEADING);
  const dashBoundary = readmeContent.indexOf('---\n\n## 📋 Your Workflow', startMarker >= 0 ? startMarker : 0);
  const nextSection = dashBoundary !== -1 ? dashBoundary : readmeContent.indexOf('\n## 📋 Your Workflow', startMarker >= 0 ? startMarker : 0);

  if (startMarker !== -1 && nextSection !== -1) {
    readmeContent = readmeContent.slice(0, startMarker) + section + readmeContent.slice(nextSection);
  } else if (startMarker !== -1) {
    readmeContent = readmeContent.slice(0, startMarker) + section;
  } else {
    const insertBefore = readmeContent.indexOf('---\n\n## 📋 Your Workflow');
    const insertAt = insertBefore !== -1 ? insertBefore : readmeContent.indexOf('\n## 📋 Your Workflow');
    if (insertAt !== -1) {
      readmeContent = readmeContent.slice(0, insertAt) + '\n' + section + readmeContent.slice(insertAt);
    } else {
      readmeContent = readmeContent.trimEnd() + '\n' + section;
    }
  }

  writeFileSync(rootReadme, readmeContent);
}

function main() {
  const courseArg = process.argv.find(a => a.startsWith('--course='));
  const courseId = courseArg ? courseArg.split('=')[1] : null;

  if (courseId) {
    updateCourseReadmeEvidence(courseId);
    console.log(`✅ Evidence updated: courses/${courseId}/project/README.md`);
    return;
  }

  const pathway = loadPathwayConfig();
  for (const course of pathway.courses || []) {
    updateCourseReadmeEvidence(course.id);
  }
  updateRootReadmeEvidence();
  console.log('✅ Evidence updated: all course READMEs and root README');
}

main();
