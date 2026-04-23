// import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {DiscoveryPage} from "./pages/DiscoveryPage";
import {JournalPage} from "./pages/JournalPage";

function App() {

  return (
    <Router>
      {/* NavBar */}
      <nav >
        <Link to="/" >Discovery</Link>
        <Link to="/journal">Journal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/journal" element={<JournalPage />} />
        
        {/* Error handling */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
