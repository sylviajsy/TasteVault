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
  setCurrentUser
} from "./store/userSlice";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state) => state.user
  );

  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated && user){
      dispatch(setCurrentUser(user));
      console.log('Auth0 User synchronized to Redux:', user);
    } else if (!isLoading && !isAuthenticated) {
      dispatch(setCurrentUser(null));
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  if (isLoading) return <p>Loading user...</p>;

  return isAuthenticated ? (
    <Router>
      <ToastContainer position="top-center"
            autoClose={3000}
            toastStyle={{
              marginTop: "40vh",
              textAlign: "center"
            }} />

      <Navbar />
      <button onClick={logout}>Logout</button>

      <main className="pt-24 sm:pt-28 md:pt-24">
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/journal" element={<JournalPage />} />
          
          {/* Error handling */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </Router>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-soft via-surface to-tint px-4">
      <div className="w-full max-w-xl rounded-[2rem] bg-surface/95 px-8 py-10 text-center shadow-card backdrop-blur">
        <div className="flex flex-col items-center">
        <h1 className="text-5xl font-semibold tracking-[-0.04em] text-text sm:text-6xl">
          Taste Vault
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-text-soft sm:text-lg">
          Discover wines, and build a personal cellar of what you loved.
        </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={signup}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-contrast shadow-card transition hover:bg-brand-strong"
          >
            Signup
          </button>

          <button
            onClick={login}
            className="rounded-full border border-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand transition hover:bg-surface-deep"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;
