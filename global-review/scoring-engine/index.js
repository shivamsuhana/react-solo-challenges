/**
 * Global Scoring Engine
 * 
 * Provides pathway-level scoring utilities and aggregation logic
 */

/**
 * Calculate weighted average score across courses
 */
export function calculateWeightedAverage(courseResults, weights) {
  if (!courseResults || courseResults.length === 0) {
    return 0;
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (let i = 0; i < courseResults.length; i++) {
    const course = courseResults[i];
    const weight = weights[i] || (1 / courseResults.length);
    const score = course.averageScore || 0;

    totalWeightedScore += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

/**
 * Determine badge level based on score and completion
 */
export function determineBadgeLevel(score, completion, badgeLevels) {
  if (badgeLevels.gold && score >= badgeLevels.gold.minScore &&
      completion >= badgeLevels.gold.minCompletion) {
    return 'gold';
  }
  if (badgeLevels.silver && score >= badgeLevels.silver.minScore &&
      completion >= badgeLevels.silver.minCompletion) {
    return 'silver';
  }
  if (badgeLevels.bronze && score >= badgeLevels.bronze.minScore &&
      completion >= badgeLevels.bronze.minCompletion) {
    return 'bronze';
  }
  return 'none';
}

/**
 * Aggregate skill strengths across all courses
 */
export function aggregateStrengths(courseResults) {
  const allStrengths = courseResults
    .flatMap(c => c.skillStrengths || [])
    .filter((v, i, a) => a.indexOf(v) === i); // Unique

  return allStrengths;
}

/**
 * Aggregate improvement areas across all courses
 */
export function aggregateImprovements(courseResults) {
  const allImprovements = courseResults
    .flatMap(c => c.improvementAreas || [])
    .filter((v, i, a) => a.indexOf(v) === i); // Unique

  return allImprovements;
}
