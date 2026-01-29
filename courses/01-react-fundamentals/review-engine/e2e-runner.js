import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Runs Playwright E2E tests for a specific challenge
 * These tests verify visual output and user interactions
 */
export async function runE2ETests(challengeId, projectDir) {
  const testFile = join(projectDir, 'tests', 'e2e', `challenge-${challengeId.split('-')[0]}.spec.ts`);
  
  if (!existsSync(testFile)) {
    return {
      score: 0,
      passed: false,
      error: `E2E test file not found: ${testFile}`,
      details: []
    };
  }

  try {
    // Run Playwright tests for the specific challenge.
    // CI=1 ensures Playwright always starts the app via webServer (no manual "npm run dev" needed).
    const env = { ...process.env, CI: '1' };
    const output = execSync(
      `npx playwright test ${testFile} --reporter=json`,
      { 
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 120000, // 2 minutes (includes app startup)
        env
      }
    );

    // Parse Playwright JSON output (may have npm prefix)
    const raw = (output || '') + '';
    const jsonMatch = raw.match(/\{[\s\S]*"stats"[\s\S]*\}|\[[\s\S]*"status"[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : raw;
    const testResults = JSON.parse(jsonStr);
    
    const totalTests = testResults.stats?.total || testResults.length || 0;
    const passedTests = testResults.stats?.passed || testResults.filter(t => t.status === 'passed').length || 0;
    const failedTests = testResults.stats?.failed || testResults.filter(t => t.status === 'failed').length || 0;

    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10,
      passed: failedTests === 0 && totalTests > 0,
      totalTests,
      passedTests,
      failedTests,
      details: testResults.suites || testResults,
      screenshots: testResults.screenshots || []
    };
  } catch (error) {
    // Try to parse error output
    try {
      const errorOutput = error.stdout || error.stderr || '';
      
      // Playwright might output JSON even on failure (may have npm prefix)
      const jsonMatch = errorOutput.match(/\{[\s\S]*"stats"[\s\S]*\}|\[[\s\S]*"status"[\s\S]*\]/);
      if (jsonMatch) {
        const testResults = JSON.parse(jsonMatch[0]);
        const totalTests = testResults.stats?.total || testResults.length || 0;
        const passedTests = testResults.stats?.passed || testResults.filter(t => t.status === 'passed').length || 0;
        const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        return {
          score: Math.round(score * 10) / 10,
          passed: false,
          totalTests,
          passedTests,
          failedTests: testResults.stats?.failed || testResults.filter(t => t.status === 'failed').length || 0,
          details: testResults.suites || testResults,
          error: error.message
        };
      }
    } catch (parseError) {
      // Could not parse output
    }

    const needsBrowsers = /Executable doesn't exist|browserType\.launch|playwright install/i.test(error.message || '');
    return {
      score: 0,
      passed: false,
      error: error.message,
      details: [],
      note: needsBrowsers
        ? 'Playwright browsers not installed. Run from repo root: npm run setup (or in project: npx playwright install).'
        : 'E2E failed. The app is started automatically by Playwright (webServer in playwright.config).'
    };
  }
}
