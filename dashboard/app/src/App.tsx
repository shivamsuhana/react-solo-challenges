import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const API = '/api';

type Progress = {
  lastUpdated: string | null;
  pathway: {
    name: string;
    overallScore: number;
    completionPercentage: number;
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
  challenges: Record<string, { passed: boolean; score: number; lastRun: string | null }>;
};

type Course = {
  id: string;
  name: string;
  weight?: number;
  averageScore?: number;
  completionPercentage?: number;
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
  const [resultsCollapsed, setResultsCollapsed] = useState(false);
  const [instructionsCollapsed, setInstructionsCollapsed] = useState(true);
  const [courseSearch, setCourseSearch] = useState('');
  const [challengeSearch, setChallengeSearch] = useState('');

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

  // URL routing - sync with URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('course');
    const challengeId = params.get('challenge');
    
    if (courseId) {
      // Fetch course data first
      fetch(`${API}/courses/${courseId}`)
        .then(r => r.json())
        .then(courseData => {
          const course = { id: courseId, name: courseData.name || courseId };
          setSelectedCourse(course);
          if (challengeId) {
            setSelectedChallengeId(challengeId);
            setView('detail');
          } else {
            setSelectedChallengeId(null);
            setView('challenges');
          }
        })
        .catch(() => {
          // If course not found, just show courses list
          setView('courses');
          setSelectedCourse(null);
          setSelectedChallengeId(null);
        });
    }
  }, []);

  // Update URL when view/state changes
  useEffect(() => {
    // Build new URL params based on current state
    const newParams = new URLSearchParams();
    if (selectedCourse) {
      newParams.set('course', selectedCourse.id);
      if (selectedChallengeId) {
        newParams.set('challenge', selectedChallengeId);
      }
    }
    
    const newSearch = newParams.toString();
    const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
    const currentUrl = window.location.pathname + window.location.search;
    
    // Only update if URL is different to avoid unnecessary updates
    if (currentUrl !== newUrl) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedCourse, selectedChallengeId, view]);

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
    setSelectedChallengeId(null);
    setChallengesPage(1);
    setSelectedCourse(course);
    setView('challenges');
  };

  const openDetail = (challengeId: string) => {
    // Update both state values - React will batch these updates
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

  // Helper function to get progress bar color class based on score
  const getScoreColorClass = (score: number | null | undefined): string => {
    if (score == null) return 'score-pending';
    if (score < 50) return 'score-red';
    if (score < 80) return 'score-yellow';
    return 'score-green';
  };

  return (
    <div className="app">
      {progress && view === 'courses' && (
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
              <span>{Math.round(pathway.completionPercentage ?? 0)}%</span>
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
                {pathway.completedChallenges ?? 0} / {pathway.totalChallenges ?? 0} challenges completed ({Math.round(pathway.completionPercentage ?? 0)}%)
              </div>
            </div>
          </section>
        </>
      )}

      {error && <div className="error">{error}</div>}

      {view === 'courses' && (
        <>
          <div className="view-header">
            <h2>Courses</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="loading">Loading courses…</div>
          ) : (
            <>
              <div className="card-list">
                {courses
                  .filter((c) =>
                    !courseSearch ||
                    c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                    c.id.toLowerCase().includes(courseSearch.toLowerCase())
                  )
                  .map((c) => {
                  const courseProgress = progress?.courses?.[c.id];
                  const passed = courseProgress?.completedChallenges ?? 0;
                  const total = courseProgress?.totalChallenges ?? 0;
                  const completion = total > 0 ? Math.round((passed / total) * 100) : 0;
                  return (
                    <div key={c.id} className="card">
                      <div style={{ flex: 1 }}>
                        <h3>{c.name}</h3>
                        <div className="meta">
                          Score: {c.averageScore != null ? Math.round(c.averageScore) : '—'}% · Completion: {c.completionPercentage != null ? Math.round(c.completionPercentage) : '—'}%
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

      {view === 'challenges' && selectedCourse && progress && (
        <>
          {progress.courses[selectedCourse.id] && (
            <section className="course-progress-bar">
              <div className="course-progress-stats">
                <div className="stat-item">
                  <span className="stat-label">Course Progress</span>
                  <span className="stat-value">{Math.round(progress.courses[selectedCourse.id].completionPercentage || 0)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Challenges</span>
                  <span className="stat-value">{progress.courses[selectedCourse.id].completedChallenges || 0} / {progress.courses[selectedCourse.id].totalChallenges || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">{Math.round(progress.courses[selectedCourse.id].averageScore || 0)}%</span>
                </div>
              </div>
              <div className="course-progress-bar-visual">
                <div className="progress-bar-slim">
                  <div 
                    className="progress-bar-fill-slim" 
                    style={{ width: `${progress.courses[selectedCourse.id].completionPercentage || 0}%` }}
                  />
                </div>
              </div>
            </section>
          )}
          <div className="breadcrumb">
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setView('courses');
              setSelectedCourse(null);
              setSelectedChallengeId(null);
            }}>Courses</a>
            {' / '}
            <span>{selectedCourse.name}</span>
          </div>
          <div className="view-header">
            <h2>Challenges – {selectedCourse.name}</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search challenges..."
              value={challengeSearch}
              onChange={(e) => setChallengeSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="loading">Loading challenges…</div>
          ) : (
            <>
              <div className="card-list">
                {challenges
                  .filter((ch) =>
                    !challengeSearch ||
                    ch.name.toLowerCase().includes(challengeSearch.toLowerCase()) ||
                    ch.id.toLowerCase().includes(challengeSearch.toLowerCase())
                  )
                  .map((ch) => {
                    const score = ch.score != null ? Math.round(ch.score) : null;
                    const scoreColorClass = getScoreColorClass(ch.score);
                    return (
                      <div key={ch.id} className="card">
                        <div style={{ flex: 1 }}>
                          <h3>{ch.name}</h3>
                          <div className="meta">
                            <span className={`badge ${ch.passed ? 'passed' : ch.score != null ? 'failed' : 'pending'}`}>
                              {ch.passed ? 'Passed' : ch.score != null ? 'Not passed' : 'Not run'}
                            </span>
                            {score != null && ` · Score: ${score}%`}
                            {ch.lastRun && ` · Last run: ${new Date(ch.lastRun).toLocaleString()}`}
                          </div>
                          {score != null && (
                            <div className="challenge-score-progress" style={{ marginTop: '0.5rem' }}>
                              <div className={`score-progress-bar ${scoreColorClass}`}>
                                <div 
                                  className="score-progress-fill" 
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={() => openDetail(ch.id)}>Details</button>
                      </div>
                    );
                  })}
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

      {view === 'detail' && detail && selectedCourse && progress && (
        <div className="detail-panel">
          {progress.courses[selectedCourse.id] && (
            <section className="course-progress-bar">
              <div className="course-progress-stats">
                <div className="stat-item">
                  <span className="stat-label">Course Progress</span>
                  <span className="stat-value">{Math.round(progress.courses[selectedCourse.id].completionPercentage || 0)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Challenges</span>
                  <span className="stat-value">{progress.courses[selectedCourse.id].completedChallenges || 0} / {progress.courses[selectedCourse.id].totalChallenges || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">{Math.round(progress.courses[selectedCourse.id].averageScore || 0)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Badge</span>
                  <span className="stat-value badge-small">{progress.courses[selectedCourse.id].badgeLevel || 'none'}</span>
                </div>
              </div>
              <div className="course-progress-bar-visual">
                <div className="progress-bar-slim">
                  <div 
                    className="progress-bar-fill-slim" 
                    style={{ width: `${progress.courses[selectedCourse.id].completionPercentage || 0}%` }}
                  />
                </div>
              </div>
            </section>
          )}
          <div className="back">
            <button type="button" onClick={() => {
              setSelectedChallengeId(null);
              setView('challenges');
            }}>← Back to challenges</button>
          </div>
          <div className="breadcrumb">
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setView('courses');
              setSelectedCourse(null);
              setSelectedChallengeId(null);
            }}>Courses</a>
            {' / '}
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              setSelectedChallengeId(null);
              setView('challenges');
            }}>{selectedCourse.name}</a>
            {' / '}
            <span>{detail.name}</span>
          </div>
          <div className="detail-header">
            <div>
              <h2>{detail.name}</h2>
              <div className="detail-meta">
                <span className={`badge ${detail.passed ? 'passed' : detail.score != null ? 'failed' : 'pending'}`}>
                  {detail.passed ? '✓ Passed' : detail.score != null ? '✗ Not passed' : '○ Not run'}
                </span>
                {detail.score != null && <span className="detail-score">Score: {Math.round(detail.score)}%</span>}
              </div>
              {detail.score != null && (
                <div className="challenge-score-progress" style={{ marginTop: '0.75rem' }}>
                  <div className={`score-progress-bar ${getScoreColorClass(detail.score)}`}>
                    <div 
                      className="score-progress-fill" 
                      style={{ width: `${Math.round(detail.score)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn-primary"
              disabled={runningReview !== null}
              onClick={() => runReview(selectedCourse.id, detail.id)}
            >
              {runningReview === `${selectedCourse.id}/${detail.id}` ? (
                <>
                  <span className="btn-spinner">⟳</span> Running review…
                </>
              ) : (
                <>
                  <span className="btn-icon">▶</span> Run review
                </>
              )}
            </button>
          </div>
          {detail.instructions && (
            <section className="instructions-section">
              <h3 className="instructions-header" onClick={() => setInstructionsCollapsed(!instructionsCollapsed)}>
                <span>Instructions</span>
                <span className={`collapse-icon ${instructionsCollapsed ? 'collapsed' : ''}`}>▼</span>
              </h3>
              {!instructionsCollapsed && (
                <div className="instructions markdown-body">
                  <ReactMarkdown>{detail.instructions}</ReactMarkdown>
                </div>
              )}
            </section>
          )}
          {detail.result && (
            <div className="review-results">
              <div className="review-results-header">
                <h3>Review results</h3>
                <button
                  type="button"
                  className="btn-toggle"
                  onClick={() => {
                    const el = document.querySelector('.review-results-content');
                    if (el) el.classList.toggle('collapsed');
                  }}
                >
                  <span className="toggle-icon">▼</span> Toggle all
                </button>
              </div>
              <div className="review-results-content">
              <div className="results-summary">
                <div className="results-summary-row">
                  <strong>Total score</strong>
                  <span>{typeof detail.result.totalScore === 'number' ? `${Math.round(detail.result.totalScore)}%` : '—'}</span>
                </div>
                <div className="results-summary-row">
                  <strong>Passed</strong>
                  <span className={`badge ${detail.result.passed ? 'passed' : 'failed'}`}>
                    {detail.result.passed ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {(() => {
                // Collect all layers with their scores
                const layers: Array<{ key: string; score: number; component: JSX.Element }> = [];
                
                if (detail.result.testResults) {
                  const score = typeof detail.result.testResults.score === 'number' ? Math.round(detail.result.testResults.score) : 0;
                  layers.push({
                    key: 'testResults',
                    score,
                    component: (
                      <section key="testResults" className={`result-layer collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                        <h4 className="result-layer-header" onClick={(e) => {
                          const section = e.currentTarget.closest('.result-layer');
                          if (section) section.classList.toggle('collapsed');
                        }}>
                          <span>Functional tests</span>
                          <span className="collapse-icon">▼</span>
                        </h4>
                        <div className="result-layer-content">
                          <div className="result-layer-score">
                            Score: {score}%
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
                          {score === 100 && (
                            <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ All tests passed</p>
                          )}
                        </div>
                      </section>
                    )
                  });
                }

                if (detail.result.lintResults) {
                  const score = typeof detail.result.lintResults.score === 'number' ? Math.round(detail.result.lintResults.score) : 0;
                  layers.push({
                    key: 'lintResults',
                    score,
                    component: (
                      <section key="lintResults" className={`result-layer collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                        <h4 className="result-layer-header" onClick={(e) => {
                          const section = e.currentTarget.closest('.result-layer');
                          section?.classList.toggle('collapsed');
                        }}>
                          <span>Code quality (lint)</span>
                          <span className="collapse-icon">▼</span>
                        </h4>
                        <div className="result-layer-content">
                          <div className="result-layer-score">
                            Score: {score}%
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
                          {score === 100 && (
                            <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ No code quality issues</p>
                          )}
                        </div>
                      </section>
                    )
                  });
                }

                if (detail.result.architectureResults) {
                  const score = typeof detail.result.architectureResults.score === 'number' ? Math.round(detail.result.architectureResults.score) : 0;
                  layers.push({
                    key: 'architectureResults',
                    score,
                    component: (
                      <section key="architectureResults" className={`result-layer collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                        <h4 className="result-layer-header" onClick={(e) => {
                          const section = e.currentTarget.closest('.result-layer');
                          section?.classList.toggle('collapsed');
                        }}>
                          <span>Architecture</span>
                          <span className="collapse-icon">▼</span>
                        </h4>
                        <div className="result-layer-content">
                          <div className="result-layer-score">
                            Score: {score}%
                          </div>
                          {detail.result.architectureResults.patternsMissing?.length ? (
                            <>
                              <p className="result-issue-msg">
                                Patterns expected but not found: <strong>{[...new Set(detail.result.architectureResults.patternsMissing)].join(', ')}</strong>.
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
                          {score === 100 && (
                            <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ All required patterns found</p>
                          )}
                        </div>
                      </section>
                    )
                  });
                }

                if (detail.result.bestPracticesResults) {
                  const score = typeof detail.result.bestPracticesResults.score === 'number' ? Math.round(detail.result.bestPracticesResults.score) : 0;
                  layers.push({
                    key: 'bestPracticesResults',
                    score,
                    component: (
                      <section key="bestPracticesResults" className={`result-layer collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                        <h4 className="result-layer-header" onClick={(e) => {
                          const section = e.currentTarget.closest('.result-layer');
                          section?.classList.toggle('collapsed');
                        }}>
                          <span>Best practices</span>
                          <span className="collapse-icon">▼</span>
                        </h4>
                        <div className="result-layer-content">
                          <div className="result-layer-score">
                            Score: {score}%
                          </div>
                          {detail.result.bestPracticesResults.note && (
                            <p className="result-issue-msg" style={{ fontStyle: 'italic' }}>{detail.result.bestPracticesResults.note}</p>
                          )}
                          {(() => {
                            const allIssues = [
                              ...(detail.result.bestPracticesResults.issues || []),
                              ...(detail.result.bestPracticesResults.details || []).flatMap(d => d.issues || [])
                            ];
                            const uniqueIssues = allIssues.filter((issue, idx, arr) => {
                              const msg = typeof issue === 'string' ? issue : (issue as { message?: string }).message ?? '';
                              return arr.findIndex(i => (typeof i === 'string' ? i : (i as { message?: string }).message ?? '') === msg) === idx;
                            });
                            return uniqueIssues.length > 0 ? (
                              <>
                                {uniqueIssues.map((issue, i) => {
                                  const msg = typeof issue === 'string' ? issue : (issue as { message?: string }).message ?? 'Issue';
                                  const file = (issue as { file?: string }).file;
                                  return file ? (
                                    <div key={i} className="result-issue">
                                      <strong>{file}</strong>
                                      <p className="result-issue-msg">• {msg}</p>
                                    </div>
                                  ) : (
                                    <p key={i} className="result-issue-msg">• {msg}</p>
                                  );
                                })}
                              </>
                            ) : score === 100 ? (
                              <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ All best practices requirements met</p>
                            ) : null;
                          })()}
                        </div>
                      </section>
                    )
                  });
                }

                if (detail.result.e2eResults) {
                  const score = typeof detail.result.e2eResults.score === 'number' ? Math.round(detail.result.e2eResults.score) : 0;
                  layers.push({
                    key: 'e2eResults',
                    score,
                    component: (
                      <section key="e2eResults" className={`result-layer collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                        <h4 className="result-layer-header" onClick={(e) => {
                          const section = e.currentTarget.closest('.result-layer');
                          section?.classList.toggle('collapsed');
                        }}>
                          <span>E2E tests</span>
                          <span className="collapse-icon">▼</span>
                        </h4>
                        <div className="result-layer-content">
                          <div className="result-layer-score">
                            Score: {score}%
                            {detail.result.e2eResults.passedTests != null && detail.result.e2eResults.totalTests != null && (
                              <> · {detail.result.e2eResults.passedTests}/{detail.result.e2eResults.totalTests} passed</>
                            )}
                          </div>
                          {detail.result.e2eResults.error ? (
                            <p className="result-layer-error">{detail.result.e2eResults.error.split('\n')[0]}</p>
                          ) : detail.result.e2eResults.note ? (
                            <p className="result-issue-msg">{detail.result.e2eResults.note}</p>
                          ) : null}
                          {(detail.result.e2eResults as { details?: unknown[] }).details?.length ? (
                            <p className="result-issue-msg">See test output for failed steps.</p>
                          ) : null}
                          {score === 100 && !detail.result.e2eResults.error && (
                            <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ All E2E tests passed</p>
                          )}
                        </div>
                      </section>
                    )
                  });
                }

                if (detail.result.aiReviewResults || detail.aiFeedback) {
                  const ai = detail.result.aiReviewResults || (detail.aiFeedback as Record<string, unknown>);
                  if (ai && !ai.error) {
                    const score = typeof ai.score === 'number' ? Math.round(ai.score) : 0;
                    layers.push({
                      key: 'aiReviewResults',
                      score,
                      component: (
                        <section key="aiReviewResults" className={`result-layer result-layer-ai collapsible ${score === 100 ? 'result-layer-perfect' : ''}`}>
                          <h4 className="result-layer-header" onClick={(e) => {
                            const section = e.currentTarget.closest('.result-layer');
                            section?.classList.toggle('collapsed');
                          }}>
                            <span>AI review</span>
                            <span className="collapse-icon">▼</span>
                          </h4>
                          <div className="result-layer-content">
                            {ai.error ? (
                              <p className="result-layer-error">
                                AI review skipped: set GROQ_API_KEY to enable. Other layers still run.
                              </p>
                            ) : (
                              <>
                                <div className="result-layer-score">
                                  Score: {score}%
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
                                {score === 100 && (
                                  <p className="result-issue-msg" style={{ color: '#155724', fontWeight: 500 }}>✅ Excellent code quality</p>
                                )}
                              </>
                            )}
                          </div>
                        </section>
                      )
                    });
                  } else if (ai?.error) {
                    layers.push({
                      key: 'aiReviewResults',
                      score: 0,
                      component: (
                        <section key="aiReviewResults" className="result-layer result-layer-ai collapsible">
                          <h4 className="result-layer-header" onClick={(e) => {
                            const section = e.currentTarget.closest('.result-layer');
                            section?.classList.toggle('collapsed');
                          }}>
                            <span>AI review</span>
                            <span className="collapse-icon">▼</span>
                          </h4>
                          <div className="result-layer-content">
                            <p className="result-layer-error">
                              AI review skipped: set GROQ_API_KEY to enable. Other layers still run.
                            </p>
                          </div>
                        </section>
                      )
                    });
                  }
                }

                // Sort: non-100% first, then 100% ones
                layers.sort((a, b) => {
                  if (a.score === 100 && b.score !== 100) return 1;
                  if (a.score !== 100 && b.score === 100) return -1;
                  return 0;
                });

                return layers.map(l => l.component);
              })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
