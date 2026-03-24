import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const API_BASE = '';

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/insights`)
      .then(res => {
        if (res.data.insights) setInsights(res.data.insights);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <h3>Generating Intelligence...</h3>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Insights</h3>
        <p>Please upload a dataset first.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Intelligence Report</h1>
      <p className="page-subtitle">Rule-based logical deductions derived from the data model.</p>
      
      <div className="glass-card">
        <div className="insights-list">
          {insights.map((insight, idx) => (
            <div className="insight-item" key={idx}>
              <CheckCircle className="insight-icon" size={24} />
              <div>{insight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
