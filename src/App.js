import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ResumeUpload from './components/ResumeUpload';
import CandidateQuery from './components/CandidateQuery';
import CandidateTable from './components/CandidateTable';
import ExcelExport from './components/ExcelExport';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      <div className="App">
        {/*<header className="App-header">*/}
        {/*  Resume AI Assistant*/}
        {/*</header>*/}
        <main>
          <Routes>
            <Route
              path="/candidates"
              element={
                <>
                  <ResumeUpload />
                  <CandidateQuery setCandidates={setCandidates} />
                  <CandidateTable candidates={candidates} />
                  <ExcelExport />
                  <LoadingSpinner isLoading={isLoading} />
                </>
              }
            />
            <Route path="/" element={<Navigate to="/candidates" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

