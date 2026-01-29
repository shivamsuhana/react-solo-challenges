/**
 * Shared Course Summary Generator
 * 
 * Generates course summary from challenge results.
 * Used by all course review engines to avoid duplication.
 */

/**
 * Generate course summary from challenge results
 * @param {Array} challengeResults - Array of challenge result objects
 * @param {Object} config - Course configuration from course-config.json
 * @returns {Object} Course summary object
 */
export function generateCourseSummary(challengeResults, config) {
  const totalChallenges = config.challenges.length;
  const completedChallenges = challengeResults.filter(r => r.passed).length;
  const averageScore = challengeResults.length > 0
    ? challengeResults.reduce((sum, r) => sum + r.totalScore, 0) / challengeResults.length
    : 0;
  const completionPercentage = totalChallenges > 0
    ? (completedChallenges / totalChallenges) * 100
    : 0;

  // Determine badge level (using hardcoded thresholds for course-level badges)
  // Note: Pathway-level badges use config from pathway-config.json
  const badgeLevels = {
    gold: { minScore: 90, minCompletion: 100 },
    silver: { minScore: 75, minCompletion: 75 },
    bronze: { minScore: 60, minCompletion: 50 }
  };

  let badgeLevel = 'none';
  if (averageScore >= badgeLevels.gold.minScore && completionPercentage >= badgeLevels.gold.minCompletion) {
    badgeLevel = 'gold';
  } else if (averageScore >= badgeLevels.silver.minScore && completionPercentage >= badgeLevels.silver.minCompletion) {
    badgeLevel = 'silver';
  } else if (averageScore >= badgeLevels.bronze.minScore && completionPercentage >= badgeLevels.bronze.minCompletion) {
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
    averageScore: Math.round(averageScore * 10) / 10,
    completionPercentage: Math.round(completionPercentage * 10) / 10,
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
