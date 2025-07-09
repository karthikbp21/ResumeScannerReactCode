import React, { useState } from 'react';
import axios from 'axios';

const CandidateQuery = ({ setCandidates, setLoading }) => {
  const [query, setQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const predefinedQueries = [
    { text: 'Less than 5 years experience', icon: 'bi-person-badge', color: 'primary' },
    { text: 'Python programming skills', icon: 'bi-code-slash', color: 'success' },
    { text: 'Senior level (8+ years)', icon: 'bi-award', color: 'warning' },
    { text: 'Located in North America', icon: 'bi-geo-alt', color: 'info' },
    { text: 'Machine learning background', icon: 'bi-cpu', color: 'danger' },
    { text: 'PhD degree holders', icon: 'bi-mortarboard', color: 'dark' }
  ];

  const handleQuery = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setLocalLoading(true);
    if (setLoading) {
      setLoading(true);
    }

    try {
      const response = await axios.post('http://localhost:3000/candidates/query', { prompt: query }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      console.log(`RENDERING TABLE with ${response.data.length} candidates`);
      console.log(`Candidates IDs: ${response.data.map(c => c.id)}`);
      console.log('API response:', response.data);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error querying candidates:', error);
      alert('Failed to query candidates.');
    } finally {
      setLocalLoading(false);
      if (setLoading) {
        setLoading(false);
      }
    }
  };

  const handlePredefinedQuery = (queryText) => {
    setQuery(`Find candidates with ${queryText.toLowerCase()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleQuery();
    }
  };

  const isLoading = localLoading;

  return (
    <div className="card h-100">
      <div className="card-header bg-success text-white py-2">
        <h6 className="mb-0">
          <i className="bi bi-search me-2"></i>
          Query Candidates
        </h6>
      </div>
      <div className="card-body p-3 d-flex flex-column">
        <div className="mb-3">
          <label htmlFor="queryTextarea" className="form-label small fw-bold mb-1">
            Ask AI about candidates:
          </label>
          <textarea
            id="queryTextarea"
            className="form-control form-control-sm"
            rows="3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., 'Show me candidates with Python skills and 3-5 years experience'"
            disabled={isLoading}
          />
          <small className="text-muted">
            Press Ctrl+Enter to search
          </small>
        </div>
        
        <div className="mb-3 flex-grow-1">
          <label className="form-label small fw-bold mb-2">
            <i className="bi bi-lightning-charge me-1"></i>
            Quick Queries:
          </label>
          <div className="quick-queries-grid">
            {predefinedQueries.map((item, index) => (
              <div key={index} className="quick-query-item">
                <button
                  className={`btn btn-outline-${item.color} btn-sm quick-query-btn w-100 text-start`}
                  onClick={() => handlePredefinedQuery(item.text)}
                  disabled={isLoading}
                >
                  <i className={`${item.icon} me-2`}></i>
                  <span className="quick-query-text">{item.text}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info py-2 px-3 mb-3">
              <i className="bi bi-info-circle me-2"></i>
              <small><strong>Tip:</strong> Ask natural language questions for best results</small>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setQuery('')}
              disabled={isLoading}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear
            </button>
            <button 
              className="btn btn-success flex-grow-1"
              onClick={handleQuery}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Searching...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>
                  Search Candidates
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateQuery;
