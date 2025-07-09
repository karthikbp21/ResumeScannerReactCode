import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import ExcelExport from './ExcelExport';

const CandidateTable = ({ candidates, isLoading, onRefresh }) => {
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  console.log('Candidates received from API:', candidates);

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: '40px', height: '40px', fontSize: '16px' }}>
            {row.name ? row.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="fw-bold">{row.name || 'N/A'}</div>
          </div>
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Experience',
      selector: row => row.experience_years,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <span className="badge bg-info fs-6">
            {row.experience_years || 0} years
          </span>
        </div>
      ),
      width: '120px',
    },
    {
      name: 'Skills',
      selector: row => row.skills,
      sortable: true,
      cell: row => (
        <div>
          {row.skills ? (
            <div className="d-flex flex-wrap gap-1">
              {row.skills.split(',').slice(0, 3).map((skill, index) => (
                <span key={index} className="badge bg-secondary small">
                  {skill.trim()}
                </span>
              ))}
              {row.skills.split(',').length > 3 && (
                <span className="badge bg-light text-dark small">
                  +{row.skills.split(',').length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted">N/A</span>
          )}
        </div>
      ),
      grow: 3,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <i className="bi bi-geo-alt text-primary me-2"></i>
          {row.location || 'N/A'}
        </div>
      ),
      width: '150px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" title="View Details">
            <i className="bi bi-eye"></i>
          </button>
          <button className="btn btn-sm btn-outline-success" title="Download Resume">
            <i className="bi bi-download"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  const filteredItems = useMemo(() => {
    if (!filterText) return candidates;
    
    return candidates.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.skills && item.skills.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [candidates, filterText]);

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#495057',
      },
    },
    rows: {
      style: {
        minHeight: '70px',
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      },
    },
    pagination: {
      style: {
        borderTop: '2px solid #dee2e6',
        backgroundColor: '#f8f9fa',
      },
    },
  };

  if (candidates.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              <i className="bi bi-people-fill text-primary me-2"></i>
              Candidates (0)
            </h4>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
              <ExcelExport />
            </div>
          </div>
          
          {/* Empty State */}
          <div className="text-center py-5">
            <i className="bi bi-people text-muted" style={{ fontSize: '4rem' }}></i>
            <h4 className="text-muted mt-3">No candidates found</h4>
            <p className="text-muted">
              Upload some resumes and query candidates to see them here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Candidates ({filteredItems.length})
          </h4>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
            <ExcelExport />
          </div>
        </div>
        
        {/* Search Section */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {candidates.length > 0 && (
                <span className="badge bg-success me-3">
                  {filteredItems.length} of {candidates.length} shown
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search candidates..."
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                />
                {filterText && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClear}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          customStyles={customStyles}
          striped
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="text-muted mt-3">No matching candidates found</h5>
              <p className="text-muted">Try adjusting your search criteria.</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CandidateTable;
