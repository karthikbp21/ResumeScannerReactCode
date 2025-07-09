import React from 'react';

const ExcelExport = () => {
  const handleDownload = () => {
    window.location.href = 'http://localhost:3000/candidates/download_excel.xlsx';
  };

  return (
    <div>
      <h2>Export Candidates to Excel</h2>
      <button onClick={handleDownload}>Download Excel</button>
    </div>
  );
};

export default ExcelExport;
