import React, { useState } from 'react';
import CandidateTable from './CandidateTable';
import ResumeUpload from './ResumeUpload';
import CandidateQuery from './CandidateQuery';
import ExcelExport from './ExcelExport';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Job Posting: Assistant Professor of Physics</h3>
          <p><strong>Location:</strong> North America</p>
          <p><strong>Department:</strong> We are hiring a full-time Assistant Professor of Physics to join our faculty. The role involves teaching undergraduate/graduate physics courses, conducting research, and mentoring students. A Ph.D. in Physics is required, with a strong commitment to teaching and scholarship.
            Candidates with a record of research and interest in interdisciplinary collaboration are preferred.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <ResumeUpload />
          <CandidateQuery setCandidates={setCandidates} />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title mb-0">Candidates</h4>
            <ExcelExport />
          </div>
          <CandidateTable candidates={candidates} />
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
