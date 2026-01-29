#!/usr/bin/env node
/**
 * Runs review only for challenges whose code has changed (git diff).
 * Then updates progress and README evidence.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getChallengesForFiles } from './lib/file-to-challenge-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

function getChangedFiles(ref = null) {
  const gitDir = join(ROOT_DIR, '.git');
  if (!existsSync(gitDir)) return [];
  try {
    let cmd;
    if (ref === '--root' || ref === '--root HEAD') {
      // First commit: compare against empty tree
      cmd = 'git diff --name-only --root HEAD';
    } else if (ref) {
      cmd = `git diff --name-only ${ref} HEAD`;
    } else {
      cmd = 'git diff --name-only HEAD';
    }
    const output = execSync(cmd, { cwd: ROOT_DIR, encoding: 'utf-8' });
    return output.trim().split(/\n/).filter(Boolean).map(f => f.replace(/\\/g, '/'));
  } catch (e) {
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  const refIndex = args.indexOf('--ref');
  const ref = refIndex >= 0 && args[refIndex + 1] ? args[refIndex + 1] : null;

  const changedFiles = getChangedFiles(ref);
  const challenges = getChallengesForFiles(changedFiles);

  if (challenges.length === 0) {
    console.log('No challenge files changed. Nothing to review.');
    execSync('node scripts/update-progress.js', { cwd: ROOT_DIR, stdio: 'inherit' });
    return;
  }

  const byCourse = new Map();
  for (const c of challenges) {
    if (!byCourse.has(c.courseId)) byCourse.set(c.courseId, []);
    byCourse.get(c.courseId).push(c.challengeId);
  }

  console.log('🔄 Running review for changed challenges only:\n');
  for (const [courseId, challengeIds] of byCourse) {
    for (const cid of challengeIds) {
      console.log(`  ${courseId} / ${cid}`);
    }
  }
  console.log('');

  for (const [courseId, challengeIds] of byCourse) {
    const courseDir = join(ROOT_DIR, 'courses', courseId);
    const reviewScript = join(courseDir, 'review-engine', 'index.js');
    if (!existsSync(reviewScript)) {
      console.warn(`⚠️  Review engine not found: ${courseId}`);
      continue;
    }
    for (const challengeId of challengeIds) {
      console.log(`\n📝 Reviewing ${courseId} → ${challengeId}`);
      try {
        execSync(`node "${reviewScript}" --challenge=${challengeId}`, {
          cwd: courseDir,
          stdio: 'inherit',
        });
      } catch (e) {
        console.error(`❌ Review failed for ${courseId}/${challengeId}`);
      }
    }
  }

  console.log('\n📊 Updating progress...');
  execSync('node scripts/update-progress.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('\n✅ Done.');
}

main();
