import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectDisplayName } from "../store/userSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const displayName = useSelector(selectDisplayName);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d3b8ad] bg-[#f8f1e7]/95 shadow-[0_10px_30px_rgba(96,17,40,0.12)] backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-3 px-4 py-4 text-center md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-6">
        <div className="justify-self-center md:justify-self-start">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button
              type="button"
              className="rounded-full border border-[#6f102e] bg-[#6f102e] px-5 py-2 text-sm font-semibold text-[#fff9f2] transition hover:bg-[#581024] focus:outline-none focus:ring-2 focus:ring-[#9f5066] focus:ring-offset-2 focus:ring-offset-[#f8f1e7]"
              onClick={() => setIsOpen((open) => !open)}
            >
              Explore
            </button>

            {isOpen && (
              <div className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 rounded-2xl border border-[#dcc4ba] bg-[#fff8ef] p-2 text-left shadow-[0_16px_34px_rgba(96,17,40,0.16)] md:left-0 md:translate-x-0">
                
                <Link
                  to="/journal"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#5b1228] transition hover:bg-[#f2e2d6]"
                  onClick={() => setIsOpen(false)}
                >
                  Journal Page
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="justify-self-center">
          <Link
            to="/"
            className="text-2xl font-bold tracking-[0.18em] text-[#6f102e] no-underline"
          >
            Taste Vault
          </Link>
        </div>

        <div className="justify-self-center text-sm font-semibold text-[#6f102e] md:justify-self-end">
          Hi, {displayName}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
