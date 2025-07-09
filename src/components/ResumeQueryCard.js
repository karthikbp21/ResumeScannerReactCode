import React, { useState } from 'react';
import axios from 'axios';

const ResumeQueryCard = ({ setCandidates, setLoading, onUploadSuccess }) => {
  const [activeTab, setActiveTab] = useState('upload');
  
  // Upload states
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  // Query states
  const [query, setQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const predefinedQueries = [
    // Experience queries
    'More than 5 years experience',
    'Postdoctoral experience',
    'Experience supervising PhD students',
    'Grant writing experience',
    'Less than 3 years experience',
    'Exactly 7 years experience',
    '5 to 10 years experience',
    'Both teaching and research experience',
    'Experience managing research groups',
    
    // Skills queries
    'Python programming skills',
    'Quantum optics experience',
    'Spectroscopy or NMR experience',
    'Strong communication skills',
    'Technical and soft skills',
    'Skills in Python or R',
    'Skills in both Python and Data Analysis',
    'Proficiency in Chemdraw',
    
    // Education queries
    'PhD in Physics',
    'PhD in Chemistry',
    'Master\'s degree in Chemistry',
    'Bachelor\'s degree from Stanford University',
    'Graduated from MIT or Harvard',
    'Ongoing education',
    'Certifications in Data Science',
    
    // Location queries
    'Located in North America',
    'Located in India or Europe',
    'Willing to relocate',
    'Remote work experience',
    'Located in Philadelphia, PA',
    
    // Work Experience queries
    'Academic and industry experience',
    'Assistant Professor experience',
    'Research Fellow or Postdoctoral Scholar',
    'Worked at Drexel University',
    'Worked at Stanford or MIT',
    'Experience at more than one university',
    'Held the title of Assistant Professor',
    'Held the title of Research Fellow',
    
    // Achievements queries
    'NIH or NSF grants received',
    'Published journal articles',
    'More than 10 publications',
    'Teaching awards won',
    'Won teaching awards',
    'More than 20 journal articles',
    'Received both NIH and NSF grants',
    
    // Specialized queries
    'Curriculum development experience',
    'Interdisciplinary collaboration',
    'New lab modules development',
    'Experience developing new lab modules',
    'Experience in both organic and medicinal chemistry',
    'Experience in quantum optics and spectroscopy',
    'Experience in grant writing and curriculum development',
    
    // Fit & Rating
    'Strong fit rating',
    'Candidates who need review',
    'Not a fit',
    'Strong fit for Assistant Professor of Physics',
    
    // Natural language examples
    'Best fit for Assistant Professor of Physics',
    'PhD and more than 10 years experience',
    'At least 7 years experience and PhD',
    'Experience in both teaching and research and located in Europe',
    'More than 10 publications or received NSF grants',
    'Strong fit rating and experience in curriculum development'
  ];

  // Upload functions
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('resumes[]', file);
    });

    try {
      const response = await axios.post('http://localhost:3000/candidates/upload_resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      console.log('Backend response:', response.data);
      alert('Resumes uploaded successfully!');
      setFiles([]);
      setUploadProgress(0);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading resumes:', error);
      alert('Failed to upload resumes.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // Query functions
  const handleQuery = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setLocalLoading(true);
    setShowSuggestions(false);
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

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = predefinedQueries.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Show max 8 suggestions
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const isLoading = uploading || localLoading;

  return (
    <div className="card h-100">
      <div className="card-header p-0">
        <ul className="nav nav-tabs card-header-tabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
              type="button"
            >
              <i className="bi bi-cloud-upload me-2"></i>
              Upload
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'query' ? 'active' : ''}`}
              onClick={() => setActiveTab('query')}
              type="button"
            >
              <i className="bi bi-search me-2"></i>
              Query
            </button>
          </li>
        </ul>
      </div>
      
      <div className="card-body p-3">
        {activeTab === 'upload' && (
          <div className="d-flex flex-column h-100">
            <div className="flex-grow-1">
              <div 
                className={`border-2 border-dashed rounded-3 p-3 text-center mb-3 ${
                  dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mb-2">
                  <i className="bi bi-file-earmark-pdf text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <p className="mb-2 small">
                  <strong>Drag & drop PDF files</strong> or click to select
                </p>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  className="form-control form-control-sm"
                  disabled={uploading}
                />
                <small className="text-muted mt-1 d-block">
                  PDF files only
                </small>
              </div>

              {files.length > 0 && (
                <div className="mb-3">
                  <h6 className="small">Selected Files ({files.length}):</h6>
                  <div className="file-list" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {files.slice(0, 3).map((file, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center py-1 px-2 bg-light rounded mb-1">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                          <div>
                            <span className="small fw-medium">{file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}</span>
                            <br />
                            <small className="text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</small>
                          </div>
                        </div>
                        {!uploading && (
                          <button 
                            className="btn btn-sm btn-outline-danger p-1"
                            onClick={() => removeFile(index)}
                            style={{ fontSize: '12px' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    {files.length > 3 && (
                      <small className="text-muted">+{files.length - 3} more files</small>
                    )}
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mb-3">
                  <div className="progress mb-2" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">Uploading... {uploadProgress}%</small>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <button 
                className="btn btn-primary w-100"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-2"></i>
                    Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? 's' : ''}` : 'Resumes'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="d-flex flex-column h-100">
            <div className="mb-3">
              <label className="form-label small fw-bold mb-1">
                Ask AI about candidates:
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  value={query}
                  onChange={handleQueryChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g., 'Python skills and 3-5 years experience'"
                  disabled={isLoading}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Start typing to see suggestions, or enter your own query
              </small>
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
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeQueryCard; 