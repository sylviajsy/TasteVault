import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectDisplayName } from "../store/userSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const displayName = useSelector(selectDisplayName);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border-soft bg-surface-soft/95 shadow-shell backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 text-center md:gap-4 md:px-6">
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
            >
              Explore
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 pt-2">
                <div className="w-44 rounded-2xl border border-border bg-surface p-2 text-left shadow-popover">
                  <Link
                    to="/"
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-text transition hover:bg-surface-deep"
                    onClick={() => setIsOpen(false)}
                  >
                    Discovery Page
                  </Link>
                  <Link
                    to="/journal"
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
            className="text-xl font-bold tracking-[0.18em] text-brand no-underline md:text-2xl"
          >
            TasteVault
          </Link>
        </div>

        <div className="justify-self-end text-sm font-semibold text-brand">
          Hi, {displayName}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
