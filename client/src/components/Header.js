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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight"
          >
            Freelance Hub
          </Link>

          {/* Desktop Nav */}
          {isAuthenticated ? (
            <ul className="hidden md:flex items-center gap-6 list-none">
              <li>
                <Link
                  to="/contracts"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Browse Contracts
                </Link>
              </li>
              {user?.role === 'experienced' && (
                <>
                  <li>
                    <Link
                      to="/post-contract"
                      className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Post Contract
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/applications"
                      className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
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
                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/chat"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0)}
                  </span>
                  {user?.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="hidden md:flex items-center gap-3 list-none">
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-indigo-200"
                >
                  Register
                </Link>
              </li>
            </ul>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link to="/contracts" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>Browse Contracts</Link>
                {user?.role === 'experienced' && (
                  <>
                    <Link to="/post-contract" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>Post Contract</Link>
                    <Link to="/applications" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>Applicants</Link>
                  </>
                )}
                {user?.role === 'beginner' && (
                  <Link to="/applications" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>My Applications</Link>
                )}
                <Link to="/chat" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>Messages</Link>
                <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>{user?.name}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 rounded-lg" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
