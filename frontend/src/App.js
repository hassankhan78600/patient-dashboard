import React from 'react';
import PatientDashboard from './components/PatientDashboard';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <PatientDashboard />
      
      <footer className="app-footer">
        <p>Patient Management System © 2025 | Built with React + Node.js + PostgreSQL</p>
      </footer>
    </div>
  );
}

export default App;