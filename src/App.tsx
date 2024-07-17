// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Stories from './components/Stories';
import Feed from './components/Feed';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import Applications from './components/Applications';
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<><Stories /><Feed /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/new" element={<Applications />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
