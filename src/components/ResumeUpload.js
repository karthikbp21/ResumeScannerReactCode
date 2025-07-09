import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('resumes[]', file);
    });

    try {
      const response = await axios.post('http://localhost:3000/candidates/upload_resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Backend response:', response.data);
      alert('Resumes uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resumes:', error);
      alert('Failed to upload resumes.');
    }
  };

  return (
    <div>
      <h2>Upload Resumes</h2>
      <input type="file" multiple accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ResumeUpload;
