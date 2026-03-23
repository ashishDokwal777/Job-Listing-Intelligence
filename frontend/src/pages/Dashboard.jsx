import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Briefcase, DollarSign, TrendingUp } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5001';
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [skills, setSkills] = useState([]);
  const [salaryByRole, setSalaryByRole] = useState([]);
  const [jobsByLocation, setJobsByLocation] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sumRes, skillRes, salRes, locRes] = await Promise.all([
        axios.get(`${API_BASE}/summary`).catch(() => ({ data: null })),
        axios.get(`${API_BASE}/skills`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/salary`).catch(() => ({ data: { by_role: [] } })),
        axios.get(`${API_BASE}/jobs_location`).catch(() => ({ data: [] }))
      ]);
      if (sumRes.data && !sumRes.data.error) setSummary(sumRes.data);
      if (skillRes.data && !skillRes.data.error) setSkills(skillRes.data);
      if (salRes.data && !salRes.data.error) setSalaryByRole(salRes.data.by_role);
      if (locRes.data && !locRes.data.error) setJobsByLocation(locRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '10px 15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: '4px' }}>{label}</p>
          <p style={{ margin: 0, color: '#60a5fa', fontWeight: 500 }}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (!summary) {
    return (
      <div className="empty-state">
        <div className="spinner"></div>
        <h3>No Data Available</h3>
        <p>Please navigate to the Upload page to load a dataset.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-fade-in">
      <h1 className="page-title">Market Overview</h1>
      <p className="page-subtitle">Real-time insights on the data analyst job landscape.</p>
      
      <div className="kpi-grid">
        <div className="glass-card">
          <div className="kpi-title"><Briefcase size={16}/> Total Jobs</div>
          <div className="kpi-value">{summary.total_jobs.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <div className="kpi-title"><DollarSign size={16}/> Avg Salary</div>
          <div className="kpi-value">${summary.average_salary.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <div className="kpi-title"><TrendingUp size={16}/> Top Skill</div>
          <div className="kpi-value gradient-text">{summary.top_skill}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card">
          <div className="chart-container-title">Top In-Demand Skills</div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="skill" type="category" stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {skills.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="chart-container-title">Jobs by Location</div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsByLocation.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="location" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {salaryByRole.length > 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <div className="chart-container-title">Average Salary by Role</div>
            <div className="chart-wrapper" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryByRole}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                  <XAxis dataKey="role" stroke="#94a3b8" tick={{fontSize: 12}} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="salary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
