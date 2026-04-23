import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DiscoveryPage} from "./pages/DiscoveryPage";
import {JournalPage} from "./pages/JournalPage";

function App() {

  return (
    <Router>
      <ToastContainer position="top-center"
            autoClose={3000}
            toastStyle={{
              marginTop: "40vh",
              textAlign: "center"
            }} />

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
