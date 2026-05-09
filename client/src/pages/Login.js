import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12 font-sans">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md border border-borderSubtle p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-sora font-extrabold text-primary">
              Freelance Hub
            </Link>
            <h1 className="text-2xl font-sora font-bold text-slate-900 mt-4">Welcome back</h1>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your professional account</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-borderSubtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-slate-50 focus:bg-white text-slate-900"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-borderSubtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-slate-50 focus:bg-white text-slate-900"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary font-semibold hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
