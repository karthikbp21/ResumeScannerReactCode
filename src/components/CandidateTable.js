import React from 'react';

const CandidateTable = ({ candidates }) => {
  console.log('Candidates received from API:', candidates);

  return (
    <table className="table table-hover table-bordered align-middle">
      <thead className="table-primary">
        <tr>
          <th>Name</th>
          <th>Experience</th>
          <th>Skills</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate) => (
          <tr key={candidate.id}>
            <td>{candidate.name}</td>
            <td>{candidate.experience_years} years</td>
            <td>{candidate.skills}</td>
            <td>{candidate.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CandidateTable;
