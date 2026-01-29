#!/usr/bin/env node

/**
 * Complete Setup Script
 *
 * Installs all dependencies and Playwright browsers for all courses.
 * Configures git remotes: upstream = course repo, origin = your repo (for learners).
 * Run this once after cloning the repository.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const PATHWAY_CONFIG = join(REPO_ROOT, 'pathway-review', 'pathway-config.json');

/** Upstream = the course/organization repo (where new courses and updates come from). */
const UPSTREAM_URL = 'https://github.com/sparkplustech/challenge-engine-react.git';

function getCourseIds() {
  if (!existsSync(PATHWAY_CONFIG)) return [];
  const pathway = JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
  return (pathway.courses || []).map(c => c.id);
}

const courses = getCourseIds();
if (courses.length === 0) {
  console.warn('⚠️  No courses found in pathway-review/pathway-config.json. Add courses there, then run setup again.');
}

console.log('🚀 Challenge Engine - Complete Setup\n');
console.log('This will install all dependencies and Playwright browsers.');
console.log('This may take a few minutes...\n');

// Step 1: Install root dependencies (dashboard)
console.log('📦 Step 1/4: Installing dashboard dependencies...');
try {
  execSync('npm install', { cwd: join(REPO_ROOT, 'dashboard', 'app'), stdio: 'inherit' });
  console.log('✅ Dashboard dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dashboard dependencies');
  process.exit(1);
}

// Step 2: Install all course project dependencies
console.log('📦 Step 2/5: Installing course project dependencies...');
for (const course of courses) {
  const projectDir = join(REPO_ROOT, 'courses', course, 'project');
  if (existsSync(join(projectDir, 'package.json'))) {
    console.log(`   Installing dependencies for ${course}...`);
    try {
      execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} dependencies installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install ${course} dependencies`);
    }
  }
}
console.log('');

// Step 3: Install review engine dependencies
console.log('📦 Step 3/5: Installing review engine dependencies...');
for (const course of courses) {
  const reviewEngineDir = join(REPO_ROOT, 'courses', course, 'review-engine');
  if (existsSync(join(reviewEngineDir, 'package.json'))) {
    console.log(`   Installing review engine for ${course}...`);
    try {
      execSync('npm install', { cwd: reviewEngineDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} review engine installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install ${course} review engine`);
    }
  }
}
console.log('');

// Step 4: Install Playwright browsers for all courses
console.log('🌐 Step 4/5: Installing Playwright browsers (this may take a few minutes)...');
for (const course of courses) {
  const projectDir = join(REPO_ROOT, 'courses', course, 'project');
  if (existsSync(join(projectDir, 'playwright.config.ts')) || existsSync(join(projectDir, 'playwright.config.js'))) {
    console.log(`   Installing browsers for ${course}...`);
    try {
      execSync('npx playwright install', { cwd: projectDir, stdio: 'inherit' });
      console.log(`   ✅ ${course} browsers installed`);
    } catch (error) {
      console.error(`   ❌ Failed to install browsers for ${course}`);
      console.error(`   You can install them manually later: cd courses/${course}/project && npx playwright install`);
    }
  }
}
console.log('');

// Step 5: Configure git remotes (for learners)
console.log('🔗 Step 5/5: Configuring git remotes (for learners)...');
runRemotesSetup()
  .then(() => {
    console.log('');
    console.log('✅ Setup complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Build dashboard: npm run dashboard:build');
    console.log('2. Start dashboard: npm run dashboard');
    console.log('3. Work on challenges in course projects');
    console.log('4. Push your work to your repo: git push -u origin main');
    console.log('5. Pull new courses/updates: git fetch upstream && git merge upstream/main');
    console.log('\n🎓 Happy learning!');
  })
  .catch((err) => {
    console.error('⚠️  Git remotes step skipped or failed:', err.message);
    console.log('');
    console.log('✅ Setup complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Build dashboard: npm run dashboard:build');
    console.log('2. Start dashboard: npm run dashboard');
    console.log('3. See README "For learners" to set origin and upstream');
    console.log('\n🎓 Happy learning!');
  });

/**
 * Set upstream = course repo; if origin points to course repo, prompt for learner repo and set as origin.
 */
async function runRemotesSetup() {
  if (!existsSync(join(REPO_ROOT, '.git'))) {
    console.log('   (Not a git repo — skipping remotes)');
    return Promise.resolve();
  }

  let originUrl = '';
  try {
    originUrl = execSync('git config --get remote.origin.url', {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    }).trim();
  } catch {
    console.log('   (No remote "origin" — skipping remotes)');
    return Promise.resolve();
  }

  const isUpstreamRepo =
    originUrl.includes('sparkplustech/challenge-engine-react') ||
    originUrl.replace(/\.git$/, '') === UPSTREAM_URL.replace(/\.git$/, '');

  // Ensure upstream exists
  try {
    execSync(`git remote get-url upstream`, { cwd: REPO_ROOT, encoding: 'utf-8' });
  } catch {
    execSync(`git remote add upstream "${UPSTREAM_URL}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    console.log('   ✅ Added remote "upstream" (course repo)');
  }

  if (!isUpstreamRepo) {
    console.log('   ✅ "origin" already points to your repo — nothing to change');
    return Promise.resolve();
  }

  // Origin points to course repo — ask for learner repo URL
  const fromEnv = process.env.SETUP_ORIGIN_URL;
  const fromArg = process.argv.find((a) => a.startsWith('--origin='))?.slice(9);
  const learnerUrl = fromArg || fromEnv;

  if (learnerUrl) {
    execSync(`git remote set-url origin "${learnerUrl}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
    console.log('   ✅ Set "origin" to your repo URL');
    return Promise.resolve();
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve, reject) => {
    rl.question(
      '\n   Enter your GitHub repo URL (where you will push your work), or press Enter to skip: ',
      (answer) => {
        rl.close();
        const url = (answer || '').trim();
        if (!url) {
          console.log('   Skipped. Set origin later: see README "For learners"');
          resolve();
          return;
        }
        try {
          execSync(`git remote set-url origin "${url}"`, { cwd: REPO_ROOT, stdio: 'pipe' });
          console.log('   ✅ Set "origin" to your repo URL');
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
