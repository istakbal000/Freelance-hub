import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'beginner',
    bio: '',
    skills: '',
    portfolioLinks: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleSelect = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const userData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      portfolioLinks: formData.portfolioLinks.split(',').map(l => l.trim()).filter(l => l)
    };
    const result = await register(userData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 px-4 py-12">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl shadow-indigo-900/30 p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Freelance Hub
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">Join the freelancer collaboration platform</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className={labelCls}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'beginner', label: 'Beginner Freelancer', sub: 'Looking for opportunities' },
                  { value: 'experienced', label: 'Experienced Freelancer', sub: 'Want to delegate work' },
                ].map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => handleRoleSelect(opt.value)}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.role === opt.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                      }`}
                  >
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="John Doe" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" className={inputCls} placeholder="••••••••" />
            </div>
            <div>
              <label className={labelCls}>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." maxLength="500"
                className={`${inputCls} min-h-[90px] resize-y`} />
            </div>
            <div>
              <label className={labelCls}>Skills <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className={inputCls} placeholder="JavaScript, React, Node.js" />
            </div>
            <div>
              <label className={labelCls}>Portfolio Links <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input type="text" name="portfolioLinks" value={formData.portfolioLinks} onChange={handleChange} className={inputCls} placeholder="https://myportfolio.com" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
