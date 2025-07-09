import React, { useState } from 'react';
import axios from 'axios';

const CandidateQuery = ({ setCandidates }) => {
  const [query, setQuery] = useState('');

  const handleQuery = async () => {
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
    }
  };

  return (
    <div>
      <h2>Query Candidates</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me anything about candidates (e.g., 'less than 5 years of experience')"
      />
      <button onClick={handleQuery}>Search</button>
    </div>
  );
};

export default CandidateQuery;
