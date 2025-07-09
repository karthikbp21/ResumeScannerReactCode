import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ResumeQueryCard from './components/ResumeQueryCard';
import CandidateTable from './components/CandidateTable';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/candidates.json');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCandidates = () => {
    fetchCandidates();
  };

  return (
    <Router>
      <div className="App">
        <main className="container-fluid my-4">
          <div className="container">
          <Routes>
            <Route
              path="/candidates"
              element={
                <>
                    {error && (
                      <div className="alert alert-danger mb-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button 
                          className="btn btn-link btn-sm p-0 ms-2"
                          onClick={refreshCandidates}
                        >
                          Try again
                        </button>
                      </div>
                    )}
                    
                    {/* Job Posting Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="job-posting-card card border-0">
                          <div className="card-header job-posting-header text-white p-0">
                            <div className="p-4">
                              <div className="row align-items-center">
                                <div className="col-md-12">
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="job-icon me-3">
                                      <i className="bi bi-mortarboard-fill"></i>
                                    </div>
                                    <div>
                                      <h4 className="mb-1 fw-bold">Assistant Professor of Physics</h4>
                                      
                                    </div>
                                  </div>
                                </div>
                                
                              </div>
                            </div>
                          </div>
                          
                          <div className="card-body p-4">
                            
                            <div className="row">
                              <div className="col-12">
                                <div className="job-description">
                                  <h6 className="mb-3">
                                    <i className="bi bi-file-text me-2 text-primary"></i>
                                    Job Description
                                  </h6>
                                  <p className="mb-3 text-muted lh-lg">
                                    We are hiring a full-time Assistant Professor of Physics to join our faculty. The role involves teaching undergraduate/graduate physics courses, conducting research, and mentoring students.
                                  </p>
                                  
                                  <div className="requirements">
                                    <h6 className="mb-3">
                                      <i className="bi bi-check-circle me-2 text-success"></i>
                                      Requirements
                                    </h6>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <ul className="list-unstyled">
                                          <li className="mb-2">
                                            <i className="bi bi-check text-success me-2"></i>
                                            Ph.D. in Physics required
                                          </li>
                                          <li className="mb-2">
                                            <i className="bi bi-check text-success me-2"></i>
                                            Strong commitment to teaching
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="col-md-6">
                                        <ul className="list-unstyled">
                                          <li className="mb-2">
                                            <i className="bi bi-check text-success me-2"></i>
                                            Research experience preferred
                                          </li>
                                          <li className="mb-2">
                                            <i className="bi bi-check text-success me-2"></i>
                                            Interdisciplinary collaboration
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Combined Upload and Query Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <ResumeQueryCard 
                          setCandidates={setCandidates} 
                          setLoading={setIsLoading}
                          onUploadSuccess={refreshCandidates}
                        />
                      </div>
                    </div>

                    {/* Candidates Table Section */}
                    <div className="row">
                      <div className="col-12">
                        <CandidateTable 
                          candidates={candidates} 
                          isLoading={isLoading}
                          onRefresh={refreshCandidates}
                        />
                      </div>
                    </div>
                    
                  <LoadingSpinner isLoading={isLoading} />
                </>
              }
            />
            <Route path="/" element={<Navigate to="/candidates" />} />
          </Routes>
          </div>
        </main>

        <footer className="bg-light text-center py-3 mt-5">
          <div className="container">
            <small className="text-muted">
              Resume Scanner v1.0 - Powered by AI
            </small>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
