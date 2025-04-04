import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ReportItem from './pages/ReportItem';
import MatchedItems from './pages/MatchedItems';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/report/:type" element={<ReportItem />} />
            <Route path="/matched-items/:itemId" element={<MatchedItems />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;