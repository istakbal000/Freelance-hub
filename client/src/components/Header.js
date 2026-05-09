import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-borderSubtle shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-sora font-extrabold text-primary tracking-tight"
          >
            Freelance Hub
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated ? (
            <ul className="hidden md:flex items-center gap-6 list-none font-sans">
              <li>
                <Link
                  to="/contracts"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Browse Contracts
                </Link>
              </li>
              {user?.role === 'experienced' && (
                <>
                  <li>
                    <Link
                      to="/post-contract"
                      className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                    >
                      Post Contract
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/applications"
                      className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                    >
                      Applicants
                    </Link>
                  </li>
                </>
              )}
              {user?.role === 'beginner' && (
                <li>
                  <Link
                    to="/applications"
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/chat"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-borderSubtle rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0)}
                  </span>
                  {user?.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-secondary hover:text-error transition-colors"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="hidden md:flex items-center gap-3 list-none font-sans">
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 border border-transparent rounded-lg hover:bg-slate-50 hover:border-borderSubtle transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </li>
            </ul>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-borderSubtle py-3 space-y-1 bg-surface rounded-b-xl shadow-lg">
            {isAuthenticated ? (
              <>
                <Link to="/contracts" className="block px-4 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary rounded-lg" onClick={() => setMobileOpen(false)}>Browse Contracts</Link>
                {user?.role === 'experienced' && (
                  <>
                    <Link to="/post-contract" className="block px-4 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary rounded-lg" onClick={() => setMobileOpen(false)}>Post Contract</Link>
                    <Link to="/applications" className="block px-4 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary rounded-lg" onClick={() => setMobileOpen(false)}>Applicants</Link>
                  </>
                )}
                {user?.role === 'beginner' && (
                  <Link to="/applications" className="block px-4 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary rounded-lg" onClick={() => setMobileOpen(false)}>My Applications</Link>
                )}
                <Link to="/chat" className="block px-4 py-2 text-sm font-medium text-secondary hover:bg-slate-50 hover:text-primary rounded-lg" onClick={() => setMobileOpen(false)}>Messages</Link>
                <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-primary hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>{user?.name}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-medium text-secondary hover:text-error hover:bg-error/10 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg mt-2 mx-2 text-center" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
