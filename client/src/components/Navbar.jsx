import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { user } = useAuth0();
  const { logout, isAuthenticated } = useAuth0();
  const menuId = "explore-menu";
  const userMenuId = "user-menu";

  const handleButtonKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin
      } 
    });
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border-soft bg-surface-soft/95 shadow-shell backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 text-center sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-6">
        <div className="justify-self-start">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button
              type="button"
              className="ui-button-primary"
              onClick={() => setIsOpen((open) => !open)}
              onKeyDown={handleButtonKeyDown}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-controls={menuId}
            >
              Explore
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 pt-2">
                <div
                  id={menuId}
                  role="menu"
                  className="w-44 rounded-2xl border border-border bg-surface p-2 text-left shadow-popover"
                >
                  <Link
                    to="/"
                    role="menuitem"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition hover:bg-surface-deep"
                    onClick={() => setIsOpen(false)}
                  >
                    Discovery Page
                  </Link>
                  <Link
                    to="/journal"
                    role="menuitem"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition hover:bg-surface-deep"
                    onClick={() => setIsOpen(false)}
                  >
                    Journal Page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="justify-self-center">
          <Link
            to="/"
            className="text-base font-bold tracking-[0.12em] text-brand no-underline sm:text-xl sm:tracking-[0.18em] md:text-2xl"
          >
            TasteVault
          </Link>
        </div>

        <div className="justify-self-end">
          {isAuthenticated ? (
            <div
              className="relative inline-block"
              onMouseEnter={() => setIsUserOpen(true)}
              onMouseLeave={() => setIsUserOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsUserOpen((open) => !open)}
                onKeyDown={handleButtonKeyDown}
                aria-expanded={isUserOpen}
                aria-haspopup="menu"
                aria-controls={userMenuId}
                className="flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-strong sm:text-sm active:scale-95"
              >
                Hi, {user.nickname}
                <span className={`inline-block transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {isUserOpen && (
                <div className="absolute right-0 top-full z-50 pt-2">
                  <div
                    id={userMenuId}
                    role="menu"
                    className="w-36 rounded-2xl border border-border bg-surface p-1.5 text-right shadow-popover animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full rounded-xl px-4 py-2.5 text-center text-sm font-medium text-[#c0392b] transition hover:bg-red-50"
                    >
                      Logout 
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs font-semibold text-text-soft sm:text-sm">Guest</span>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
