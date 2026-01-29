#!/usr/bin/env node

/**
 * System Test Script
 * 
 * Validates that all required files and structures are in place
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = __dirname;

let errors = [];
let warnings = [];
let passed = 0;

function test(name, condition, errorMsg) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}: ${errorMsg}`);
    errors.push(`${name}: ${errorMsg}`);
  }
}

function warn(name, condition, warningMsg) {
  if (!condition) {
    console.log(`⚠️  ${name}: ${warningMsg}`);
    warnings.push(`${name}: ${warningMsg}`);
  }
}

console.log('🧪 Testing Challenge Engine System\n');
console.log('='.repeat(60));

// Test 1: Root structure
console.log('\n📁 Testing Root Structure...');
test('Root README.md exists', existsSync(join(ROOT_DIR, 'README.md')), 'README.md missing');
test('Pathway config exists', existsSync(join(ROOT_DIR, 'pathway-review', 'pathway-config.json')), 'pathway-config.json missing');
test('Global review engine exists', existsSync(join(ROOT_DIR, 'global-review', 'run-all-reviews.js')), 'run-all-reviews.js missing');
test('Scoring engine exists', existsSync(join(ROOT_DIR, 'global-review', 'scoring-engine', 'index.js')), 'scoring-engine/index.js missing');
test('AI review aggregator exists', existsSync(join(ROOT_DIR, 'global-review', 'ai-review', 'index.js')), 'ai-review/index.js missing');
test('GitHub workflow exists', existsSync(join(ROOT_DIR, '.github', 'workflows', 'solo-skill-review.yml')), 'solo-skill-review.yml missing');

// Test 2: Course structure
console.log('\n📚 Testing Course Structure...');
const courses = ['01-react-fundamentals', '02-rtk-query', '03-nextjs-app-router'];

for (const courseId of courses) {
  const courseDir = join(ROOT_DIR, 'courses', courseId);
  console.log(`\n  Testing ${courseId}...`);
  
  test(`  ${courseId} directory exists`, existsSync(courseDir), 'Course directory missing');
  test(`  ${courseId} course-config.json exists`, existsSync(join(courseDir, 'course-config.json')), 'course-config.json missing');
  test(`  ${courseId} project directory exists`, existsSync(join(courseDir, 'project')), 'project directory missing');
  test(`  ${courseId} review-engine exists`, existsSync(join(courseDir, 'review-engine', 'index.js')), 'review-engine/index.js missing');
  test(`  ${courseId} ai-review exists`, existsSync(join(courseDir, 'ai-review', 'index.js')), 'ai-review/index.js missing');
  test(`  ${courseId} results directory exists`, existsSync(join(courseDir, 'results')), 'results directory missing');
  
  // Test project structure
  const projectDir = join(courseDir, 'project');
  test(`  ${courseId} project package.json exists`, existsSync(join(projectDir, 'package.json')), 'package.json missing');
  
  // Test challenges
  const challengesDir = join(projectDir, 'challenges');
  if (existsSync(challengesDir)) {
    const challenges = readdirSync(challengesDir).filter(f => 
      statSync(join(challengesDir, f)).isDirectory()
    );
    test(`  ${courseId} has 3 challenges`, challenges.length === 3, `Expected 3 challenges, found ${challenges.length}`);
    
    for (const challenge of challenges) {
      const challengeDir = join(challengesDir, challenge);
      test(`    ${challenge} README.md exists`, existsSync(join(challengeDir, 'README.md')), 'README.md missing');
      test(`    ${challenge} metadata.json exists`, existsSync(join(challengeDir, 'metadata.json')), 'metadata.json missing');
    }
  } else {
    test(`  ${courseId} challenges directory exists`, false, 'challenges directory missing');
  }
  
  // Test review engine modules
  const reviewEngineDir = join(courseDir, 'review-engine');
  test(`  ${courseId} test-runner.js exists`, existsSync(join(reviewEngineDir, 'test-runner.js')), 'test-runner.js missing');
  test(`  ${courseId} e2e-runner.js exists`, existsSync(join(reviewEngineDir, 'e2e-runner.js')), 'e2e-runner.js missing');
  test(`  ${courseId} linter.js exists`, existsSync(join(reviewEngineDir, 'linter.js')), 'linter.js missing');
  test(`  ${courseId} architecture-checker.js exists`, existsSync(join(reviewEngineDir, 'architecture-checker.js')), 'architecture-checker.js missing');
  test(`  ${courseId} best-practices.js exists`, existsSync(join(reviewEngineDir, 'best-practices.js')), 'best-practices.js missing');
}

// Test 3: Configuration files
console.log('\n⚙️  Testing Configuration Files...');
for (const courseId of courses) {
  const projectDir = join(ROOT_DIR, 'courses', courseId, 'project');
  warn(`${courseId} ESLint config exists`, existsSync(join(projectDir, '.eslintrc.cjs')) || existsSync(join(projectDir, '.eslintrc.json')), 'ESLint config missing');
  warn(`${courseId} TypeScript config exists`, existsSync(join(projectDir, 'tsconfig.json')), 'tsconfig.json missing');
  warn(`${courseId} Vitest config exists`, existsSync(join(projectDir, 'vitest.config.ts')), 'vitest.config.ts missing');
  warn(`${courseId} Playwright config exists`, existsSync(join(projectDir, 'playwright.config.ts')), 'playwright.config.ts missing');
}

// Test 4: Validate course configs
console.log('\n📋 Validating Course Configurations...');
for (const courseId of courses) {
  try {
    const configPath = join(ROOT_DIR, 'courses', courseId, 'course-config.json');
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      test(`  ${courseId} config is valid JSON`, true, '');
      test(`  ${courseId} has 3 challenges in config`, config.challenges && config.challenges.length === 3, `Expected 3 challenges, found ${config.challenges?.length || 0}`);
      test(`  ${courseId} has scoring config`, config.scoring !== undefined, 'scoring config missing');
    }
  } catch (error) {
    test(`  ${courseId} config is valid JSON`, false, error.message);
  }
}

// Test 5: Validate pathway config
console.log('\n🛤️  Validating Pathway Configuration...');
try {
  const pathwayConfig = JSON.parse(readFileSync(join(ROOT_DIR, 'pathway-review', 'pathway-config.json'), 'utf-8'));
  test('Pathway config is valid JSON', true, '');
  test('Pathway has 3 courses', pathwayConfig.courses && pathwayConfig.courses.length === 3, `Expected 3 courses, found ${pathwayConfig.courses?.length || 0}`);
  test('Pathway has badge levels', pathwayConfig.badgeLevels !== undefined, 'badgeLevels missing');
} catch (error) {
  test('Pathway config is valid JSON', false, error.message);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Errors: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(e => console.log(`   - ${e}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length === 0) {
  console.log('\n✅ All critical tests passed! System structure is valid.');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Please fix the errors above.');
  process.exit(1);
}
