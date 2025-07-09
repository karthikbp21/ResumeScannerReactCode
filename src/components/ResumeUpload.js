import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

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
      
      // Call the callback function to refresh candidates
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

  return (
    <div className="card h-100">
      <div className="card-header bg-primary text-white py-2">
        <h6 className="mb-0">
          <i className="bi bi-cloud-upload me-2"></i>
          Upload Resumes
        </h6>
      </div>
      <div className="card-body p-3 d-flex flex-column">
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
              <div className="file-list" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {files.map((file, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center py-1 px-2 bg-light rounded mb-1">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      <div>
                        <span className="small fw-medium">{file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}</span>
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
                  aria-valuenow={uploadProgress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
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
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
    </div>
  );
};

export default ResumeUpload;
