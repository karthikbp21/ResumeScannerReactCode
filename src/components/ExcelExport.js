import React, { useState } from 'react';

const ExcelExport = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = 'http://localhost:3000/candidates/download_excel.xlsx';
      link.download = `candidates_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download Excel file.');
    } finally {
      // Add a small delay to show the downloading state
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  return (
    <div className="d-flex gap-2">
      <button 
        className="btn btn-success"
        onClick={handleDownload}
        disabled={downloading}
        title="Export candidates to Excel"
      >
        {downloading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Downloading...
          </>
        ) : (
          <>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Export to Excel
          </>
        )}
      </button>
    </div>
  );
};

export default ExcelExport;
