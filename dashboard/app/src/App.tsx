import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const API = '/api';

type Progress = {
  lastUpdated: string | null;
  pathway: {
    name: string;
    overallScore: number;
    completionPercentage: number;
    badgeLevel: string;
    totalChallenges: number;
    completedChallenges: number;
  };
  courses: Record<string, CourseProgress>;
};

type CourseProgress = {
  courseId: string;
  courseName: string;
  averageScore: number;
  completionPercentage: number;
  badgeLevel: string;
  challenges: Record<string, { passed: boolean; score: number; lastRun: string | null }>;
};

type Course = {
  id: string;
  name: string;
  weight?: number;
  averageScore?: number;
  completionPercentage?: number;
  badgeLevel?: string;
};

type Challenge = {
  id: string;
  name: string;
  weight?: number;
  passed?: boolean;
  score?: number;
  lastRun?: string | null;
};

/** Review result from challenge-results.json – full per-layer data */
type ReviewResult = {
  totalScore?: number;
  passed?: boolean;
  scores?: Record<string, number>;
  testResults?: {
    score: number;
    passed: boolean;
    totalTests?: number;
    passedTests?: number;
    failedTests?: number;
    details?: Array<{ assertionResults?: Array<{ title: string; status: string; failureMessages?: string[] }>; message?: string; name?: string }>;
    error?: string;
  };
  lintResults?: {
    score: number;
    passed: boolean;
    totalIssues?: number;
    errors?: number;
    warnings?: number;
    details?: Array<{ filePath: string; messages?: Array<{ line: number; message: string; severity?: number }> }>;
  };
  architectureResults?: {
    score: number;
    passed: boolean;
    patternsFound?: string[];
    patternsMissing?: string[];
    details?: Array<{ file: string; patternsFound?: string[]; patternsMissing?: string[] }>;
  };
  bestPracticesResults?: {
    score: number;
    passed: boolean;
    issues?: Array<{ message?: string; type?: string } | string>;
    details?: Array<{ file: string; issues?: Array<{ message?: string } | string>; score: number }>;
  };
  e2eResults?: {
    score: number;
    passed: boolean;
    error?: string;
    note?: string;
    details?: unknown[];
  };
  aiReviewResults?: {
    score: number;
    readability?: number;
    maintainability?: number;
    strengths?: string[];
    improvements?: string[];
    overall?: string;
    error?: string;
  };
};

type ChallengeDetail = Challenge & {
  instructions: string;
  result: ReviewResult | null;
  aiFeedback: Record<string, unknown> | null;
};

export default function App() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesPage, setChallengesPage] = useState(1);
  const [challengesTotalPages, setChallengesTotalPages] = useState(1);
  const [detail, setDetail] = useState<ChallengeDetail | null>(null);
  const [view, setView] = useState<'courses' | 'challenges' | 'detail'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningReview, setRunningReview] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const r = await fetch(`${API}/progress`);
      const data = await r.json();
      setProgress(data);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const fetchCourses = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/courses?page=${page}&limit=20`);
      const data = await r.json();
      setCourses(data.courses || []);
      setCoursesTotalPages(data.totalPages || 1);
      setCoursesPage(page);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChallenges = useCallback(async (courseId: string, page: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/courses/${courseId}/challenges?page=${page}&limit=50`);
      const data = await r.json();
      setChallenges(data.challenges || []);
      setChallengesTotalPages(data.totalPages || 1);
      setChallengesPage(page);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (courseId: string, challengeId: string) => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/courses/${courseId}/challenges/${challengeId}`);
      const data = await r.json();
      setDetail(data);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (view === 'courses') fetchCourses(coursesPage);
  }, [view, coursesPage, fetchCourses]);

  useEffect(() => {
    if (view === 'challenges' && selectedCourse) fetchChallenges(selectedCourse.id, challengesPage);
  }, [view, selectedCourse, challengesPage, fetchChallenges]);

  useEffect(() => {
    if (view === 'detail' && selectedCourse && selectedChallengeId)
      fetchDetail(selectedCourse.id, selectedChallengeId);
  }, [view, selectedCourse, selectedChallengeId, fetchDetail]);

  const openChallenges = (course: Course) => {
    setSelectedCourse(course);
    setChallengesPage(1);
    setView('challenges');
  };

  const openDetail = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setView('detail');
  };

  const runReview = async (courseId: string, challengeId: string) => {
    const key = `${courseId}/${challengeId}`;
    setRunningReview(key);
    try {
      const r = await fetch(`${API}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, challengeId }),
      });
      const data = await r.json();
      if (data.ok && data.progress) setProgress(data.progress);
      if (view === 'detail' && selectedCourse?.id === courseId && selectedChallengeId === challengeId) {
        const res = await fetch(`${API}/courses/${courseId}/challenges/${challengeId}`);
        setDetail(await res.json());
      }
      if (view === 'challenges' && selectedCourse?.id === courseId) {
        const res = await fetch(`${API}/courses/${courseId}/challenges?page=${challengesPage}&limit=50`);
        const d = await res.json();
        setChallenges(d.challenges || []);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setRunningReview(null);
    }
  };

  const pathway = progress?.pathway || {};
  const lastUpdated = progress?.lastUpdated ? new Date(progress.lastUpdated).toLocaleString() : '—';

  return (
    <div className="app">
      <header className="header">
        <h1>Challenge Engine – Progress Dashboard</h1>
        <p>View progress, instructions, and run reviews. Edit code in your editor.</p>
      </header>

      {progress && (
        <>
          <section className="progress-summary">
            <div className="progress-card">
              <strong>Pathway</strong>
              <span>{pathway.name || '—'}</span>
            </div>
            <div className="progress-card">
              <strong>Overall Score</strong>
              <span>{pathway.overallScore ?? 0}%</span>
            </div>
            <div className="progress-card">
              <strong>Completion</strong>
              <span>{pathway.completionPercentage ?? 0}%</span>
            </div>
            <div className="progress-card">
              <strong>Badge</strong>
              <span>{pathway.badgeLevel || 'none'}</span>
            </div>
            <div className="progress-card">
              <strong>Challenges</strong>
              <span>{pathway.completedChallenges ?? 0} / {pathway.totalChallenges ?? 0}</span>
            </div>
            <div className="progress-card">
              <strong>Last updated</strong>
              <span style={{ fontSize: '0.9rem' }}>{lastUpdated}</span>
            </div>
          </section>
          <section className="pathway-progress">
            <h2>Overall Pathway Progress</h2>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${pathway.completionPercentage ?? 0}%` }}
                />
              </div>
              <div className="progress-bar-label">
                {pathway.completedChallenges ?? 0} / {pathway.totalChallenges ?? 0} challenges completed ({pathway.completionPercentage ?? 0}%)
              </div>
            </div>
          </section>
        </>
      )}

      {error && <div className="error">{error}</div>}

      {view === 'courses' && (
        <>
          <h2>Courses</h2>
          {loading ? (
            <div className="loading">Loading courses…</div>
          ) : (
            <>
              <div className="card-list">
                {courses.map((c) => {
                  const courseProgress = progress?.courses?.[c.id];
                  const passed = courseProgress?.completedChallenges ?? 0;
                  const total = courseProgress?.totalChallenges ?? 0;
                  const completion = total > 0 ? Math.round((passed / total) * 100) : 0;
                  return (
                    <div key={c.id} className="card">
                      <div style={{ flex: 1 }}>
                        <h3>{c.name}</h3>
                        <div className="meta">
                          Score: {c.averageScore ?? '—'}% · Completion: {c.completionPercentage ?? '—'}% · Badge: {c.badgeLevel ?? '—'}
                        </div>
                        <div className="course-progress-bar-container" style={{ marginTop: '0.75rem' }}>
                          <div className="progress-bar">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <div className="progress-bar-label-small">
                            {passed} / {total} challenges passed
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => openChallenges(c)}>View challenges</button>
                    </div>
                  );
                })}
              </div>
              {coursesTotalPages > 1 && (
                <div className="pagination">
                  <button type="button" disabled={coursesPage <= 1} onClick={() => setCoursesPage((p) => p - 1)}>Previous</button>
                  <span>Page {coursesPage} of {coursesTotalPages}</span>
                  <button type="button" disabled={coursesPage >= coursesTotalPages} onClick={() => setCoursesPage((p) => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {view === 'challenges' && selectedCourse && (
        <>
          <div className="breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); setView('courses'); }}>Courses</a>
            {' / '}
            <span>{selectedCourse.name}</span>
          </div>
          <h2>Challenges – {selectedCourse.name}</h2>
          {loading ? (
            <div className="loading">Loading challenges…</div>
          ) : (
            <>
              <div className="card-list">
                {challenges.map((ch) => (
                  <div key={ch.id} className="card">
                    <div>
                      <h3>{ch.name}</h3>
                      <div className="meta">
                        <span className={`badge ${ch.passed ? 'passed' : ch.score != null ? 'failed' : 'pending'}`}>
                          {ch.passed ? 'Passed' : ch.score != null ? 'Not passed' : 'Not run'}
                        </span>
                        {ch.score != null && ` · Score: ${ch.score}%`}
                        {ch.lastRun && ` · Last run: ${new Date(ch.lastRun).toLocaleString()}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => openDetail(ch.id)}>Details</button>
                      <button
                        type="button"
                        disabled={runningReview !== null}
                        onClick={() => runReview(selectedCourse.id, ch.id)}
                      >
                        {runningReview === `${selectedCourse.id}/${ch.id}` ? 'Running…' : 'Run review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {challengesTotalPages > 1 && (
                <div className="pagination">
                  <button type="button" disabled={challengesPage <= 1} onClick={() => setChallengesPage((p) => p - 1)}>Previous</button>
                  <span>Page {challengesPage} of {challengesTotalPages}</span>
                  <button type="button" disabled={challengesPage >= challengesTotalPages} onClick={() => setChallengesPage((p) => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {view === 'detail' && detail && selectedCourse && (
        <div className="detail-panel">
          <div className="back">
            <button type="button" onClick={() => setView('challenges')}>← Back to challenges</button>
          </div>
          <div className="breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); setView('courses'); }}>Courses</a>
            {' / '}
            <a href="#" onClick={(e) => { e.preventDefault(); setView('challenges'); }}>{selectedCourse.name}</a>
            {' / '}
            <span>{detail.name}</span>
          </div>
          <h2>{detail.name}</h2>
          <p>
            <span className={`badge ${detail.passed ? 'passed' : detail.score != null ? 'failed' : 'pending'}`}>
              {detail.passed ? 'Passed' : detail.score != null ? 'Not passed' : 'Not run'}
            </span>
            {detail.score != null && ` Score: ${detail.score}%`}
          </p>
          <p>
            <button
              type="button"
              disabled={runningReview !== null}
              onClick={() => runReview(selectedCourse.id, detail.id)}
            >
              {runningReview === `${selectedCourse.id}/${detail.id}` ? 'Running…' : 'Run review'}
            </button>
          </p>
          {detail.instructions && (
            <>
              <h3>Instructions</h3>
              <div className="instructions markdown-body">
                <ReactMarkdown>{detail.instructions}</ReactMarkdown>
              </div>
            </>
          )}
          {detail.result && (
            <div className="review-results">
              <h3>Review results</h3>
              <div className="results-summary">
                <div className="results-summary-row">
                  <strong>Total score</strong>
                  <span>{typeof detail.result.totalScore === 'number' ? `${detail.result.totalScore.toFixed(1)}%` : '—'}</span>
                </div>
                <div className="results-summary-row">
                  <strong>Passed</strong>
                  <span className={`badge ${detail.result.passed ? 'passed' : 'failed'}`}>
                    {detail.result.passed ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {detail.result.scores && Object.keys(detail.result.scores).length > 0 && (
                <>
                  <h4>Score breakdown</h4>
                  <div className="results-table-wrap">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Layer</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(['functionalTests', 'codeQuality', 'architecture', 'bestPractices', 'e2eTests', 'aiReview'] as const).map((key) => {
                          const labels: Record<string, string> = {
                            functionalTests: 'Functional tests',
                            codeQuality: 'Code quality (lint)',
                            architecture: 'Architecture',
                            bestPractices: 'Best practices',
                            e2eTests: 'E2E tests',
                            aiReview: 'AI review',
                          };
                          const v = detail.result!.scores![key];
                          return typeof v === 'number' ? (
                            <tr key={key}>
                              <td>{labels[key] ?? key}</td>
                              <td>{v.toFixed(0)}%</td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {detail.result.testResults && (
                <section className="result-layer">
                  <h4>Functional tests</h4>
                  <div className="result-layer-score">
                    Score: {detail.result.testResults.score.toFixed(0)}%
                    {detail.result.testResults.totalTests != null && (
                      <> · {detail.result.testResults.passedTests ?? 0}/{detail.result.testResults.totalTests} passed</>
                    )}
                  </div>
                  {detail.result.testResults.error && (
                    <p className="result-layer-error">{detail.result.testResults.error}</p>
                  )}
                  {detail.result.testResults.details?.map((suite, i) => (
                    <div key={i}>
                      {suite.assertionResults?.filter((a) => a.status === 'failed').map((a, j) => (
                        <div key={j} className="result-issue">
                          <strong>{a.title}</strong>
                          {a.failureMessages?.map((msg, k) => (
                            <p key={k} className="result-issue-msg">{msg}</p>
                          ))}
                        </div>
                      ))}
                      {suite.message && <p className="result-issue-msg">{suite.message}</p>}
                    </div>
                  ))}
                </section>
              )}

              {detail.result.lintResults && (
                <section className="result-layer">
                  <h4>Code quality (lint)</h4>
                  <div className="result-layer-score">
                    Score: {detail.result.lintResults.score.toFixed(0)}%
                    {detail.result.lintResults.errors != null && detail.result.lintResults.warnings != null && (
                      <> · {detail.result.lintResults.errors} error(s), {detail.result.lintResults.warnings} warning(s)</>
                    )}
                  </div>
                  {detail.result.lintResults.details?.map((file, i) => (
                    file.messages?.length ? (
                      <div key={i} className="result-issue">
                        <strong>{file.filePath.replace(/^.*[/\\]/, '')}</strong>
                        {file.messages.map((m, j) => (
                          <p key={j} className="result-issue-msg">Line {m.line}: {m.message}</p>
                        ))}
                      </div>
                    ) : null
                  ))}
                </section>
              )}

              {detail.result.architectureResults && (
                <section className="result-layer">
                  <h4>Architecture</h4>
                  <div className="result-layer-score">
                    Score: {detail.result.architectureResults.score.toFixed(0)}%
                  </div>
                  {detail.result.architectureResults.patternsMissing?.length ? (
                    <>
                      <p className="result-issue-msg">
                        Patterns expected but not found: <strong>{detail.result.architectureResults.patternsMissing.join(', ')}</strong>.
                        Add these patterns to your code as required by the challenge.
                      </p>
                      <p className="result-issue-msg" style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                        Hint: <code>useState</code> = React state hook; <code>props</code> = component props; <code>functionalComponent</code> = function component (not class).
                      </p>
                    </>
                  ) : null}
                  {detail.result.architectureResults.details?.map((d, i) => (
                    (d.patternsMissing?.length || d.patternsFound?.length) ? (
                      <div key={i} className="result-issue">
                        <strong>{d.file}</strong>
                        {d.patternsMissing?.length ? (
                          <p className="result-issue-msg">Missing: {d.patternsMissing.join(', ')}</p>
                        ) : null}
                        {d.patternsFound?.length ? (
                          <p className="result-issue-msg">Found: {d.patternsFound.join(', ')}</p>
                        ) : null}
                      </div>
                    ) : null
                  ))}
                </section>
              )}

              {detail.result.bestPracticesResults && (
                <section className="result-layer">
                  <h4>Best practices</h4>
                  <div className="result-layer-score">
                    Score: {detail.result.bestPracticesResults.score.toFixed(0)}%
                  </div>
                  {detail.result.bestPracticesResults.issues?.map((issue, i) => (
                    <p key={i} className="result-issue-msg">• {typeof issue === 'string' ? issue : (issue as { message?: string }).message ?? 'Issue'}</p>
                  ))}
                  {detail.result.bestPracticesResults.details?.map((d, i) => (
                    d.issues?.length ? (
                      <div key={i} className="result-issue">
                        <strong>{d.file}</strong>
                        {d.issues.map((issue, j) => (
                          <p key={j} className="result-issue-msg">• {typeof issue === 'string' ? issue : (issue as { message?: string }).message ?? 'Issue'}</p>
                        ))}
                      </div>
                    ) : null
                  ))}
                </section>
              )}

              {detail.result.e2eResults && (
                <section className="result-layer">
                  <h4>E2E tests</h4>
                  <div className="result-layer-score">
                    Score: {detail.result.e2eResults.score.toFixed(0)}%
                  </div>
                  {detail.result.e2eResults.error && (
                    <p className="result-layer-error">{detail.result.e2eResults.error}</p>
                  )}
                  {detail.result.e2eResults.note && (
                    <p className="result-issue-msg">{detail.result.e2eResults.note}</p>
                  )}
                  {(detail.result.e2eResults as { details?: unknown[] }).details?.length ? (
                    <p className="result-issue-msg">See test output for failed steps.</p>
                  ) : null}
                </section>
              )}

              {(detail.result.aiReviewResults || detail.aiFeedback) && (
                <section className="result-layer result-layer-ai">
                  <h4>AI review</h4>
                  {(() => {
                    const ai = detail.result.aiReviewResults || (detail.aiFeedback as Record<string, unknown>);
                    if (!ai) return null;
                    if (ai.error) {
                      return (
                        <p className="result-layer-error">
                          AI review skipped: set GROQ_API_KEY to enable. Other layers still run.
                        </p>
                      );
                    }
                    return (
                      <>
                        <div className="result-layer-score">
                          Score: {typeof ai.score === 'number' ? `${ai.score}%` : '—'}
                          {typeof ai.readability === 'number' && (
                            <> · Readability: {ai.readability}%</>
                          )}
                          {typeof ai.maintainability === 'number' && (
                            <> · Maintainability: {ai.maintainability}%</>
                          )}
                        </div>
                        {ai.overall && (
                          <p className="result-ai-overall">{ai.overall as string}</p>
                        )}
                        {Array.isArray(ai.strengths) && ai.strengths.length > 0 && (
                          <div className="result-ai-list">
                            <strong>Strengths</strong>
                            <ul>
                              {(ai.strengths as string[]).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(ai.improvements) && ai.improvements.length > 0 && (
                          <div className="result-ai-list">
                            <strong>Improvements</strong>
                            <ul>
                              {(ai.improvements as string[]).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
