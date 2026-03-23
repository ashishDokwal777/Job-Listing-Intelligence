import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Upload from './pages/Upload';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
