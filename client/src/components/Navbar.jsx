import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectDisplayName } from "../store/userSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const displayName = useSelector(selectDisplayName);

  return (
    <nav className="top-nav">
      <div className="top-nav__left">
        <div
          className="top-nav__dropdown"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button
            type="button"
            className="top-nav__button"
            onClick={() => setIsOpen((open) => !open)}
          >
            Explore
          </button>

          {isOpen && (
            <div className="top-nav__menu">
              <Link
                to="/journal"
                className="top-nav__menu-link"
                onClick={() => setIsOpen(false)}
              >
                JournalPage
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="top-nav__brand">
        <Link to="/" className="top-nav__brand-link">
          Taste Vault
        </Link>
      </div>

      <div className="top-nav__right">Hi, {displayName}</div>
    </nav>
  );
}

export default Navbar;
