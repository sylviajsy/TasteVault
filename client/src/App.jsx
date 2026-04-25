import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { JournalPage } from "./pages/JournalPage";
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUser,
  setLoadingUser,
  setUserError,
} from "./store/userSlice";


function App() {
  const dispatch = useDispatch();
  const { currentUser, loadingUser, error } = useSelector(
    (state) => state.user
  );
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchUser() {
      try {
        dispatch(setLoadingUser(true));

        const res = await fetch(`${API_URL}/api/user`);

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        dispatch(setCurrentUser(data));
        console.log('user data', data);
      } catch (err) {
        dispatch(setUserError(err.message));
      } finally {
        dispatch(setLoadingUser(false));
      }
    }

    fetchUser();
  }, [dispatch]);

  if (loadingUser) return <p>Loading user...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Router>
      <ToastContainer position="top-center"
            autoClose={3000}
            toastStyle={{
              marginTop: "40vh",
              textAlign: "center"
            }} />

      <Navbar />

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
