import React, { useState } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, CheckCircle, FileText } from 'lucide-react';

const API_BASE = '';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Processing dataset...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus(`Success! Loaded ${res.data.rows} records.`);
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Data Ingestion</h1>
      <p className="page-subtitle">Upload a CSV dataset containing job listings to synthesize new intelligence.</p>
      
      <div className="upload-container">
        <div 
          className={`upload-box ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <input 
            type="file" 
            id="fileUpload" 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          
          {file ? (
            <div style={{color: 'var(--text-main)'}}>
              <FileText size={48} className="upload-icon" style={{color: '#10b981'}} />
              <div className="upload-text">{file.name}</div>
              <div className="upload-subtext">Click to change file</div>
            </div>
          ) : (
            <div>
              <UploadIcon size={48} className="upload-icon" />
              <div className="upload-text">Click or drag CSV file to upload</div>
              <div className="upload-subtext">Supports matching by title, skills, location, salary</div>
            </div>
          )}
        </div>
        
        <button 
          className="btn-primary" 
          onClick={handleUpload} 
          disabled={!file || loading}
        >
          {loading ? (
            <><span className="spinner" style={{width: 16, height: 16, borderTopColor:'white', marginRight: 8}}></span> Analyzing...</>
          ) : 'Process Dataset'}
        </button>
        
        {status && (
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: status.includes('Success') ? '#10b981' : '#f43f5e' }}>
            {status.includes('Success') && <CheckCircle size={20} />}
            <span style={{fontWeight: 500}}>{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
