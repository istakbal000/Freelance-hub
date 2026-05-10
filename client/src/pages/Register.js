import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'beginner',
    profession: '',
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

  const inputCls = "w-full px-4 py-3 border border-borderSubtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-slate-50 focus:bg-white text-slate-900";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12 font-sans">
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-md border border-borderSubtle p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-sora font-extrabold text-primary">
              Freelance Hub
            </Link>
            <h1 className="text-2xl font-sora font-bold text-slate-900 mt-4">Create your account</h1>
            <p className="text-slate-500 mt-1 text-sm">Join the professional collaboration platform</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
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
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-borderSubtle hover:border-primary/30 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="font-semibold text-sm font-sora">{opt.label}</div>
                    <div className={`text-xs mt-1 ${formData.role === opt.value ? 'text-primary/70' : 'text-slate-400'}`}>{opt.sub}</div>
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
              <label className={labelCls}>Your Profession <span className="text-slate-400 font-normal">(what you do)</span></label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={inputCls} placeholder="e.g., Graphic Designer, Content Writer, Web Developer" maxLength={100} />
            </div>
            <div>
              <label className={labelCls}>Skills <span className="text-slate-400 font-normal">(comma-separated)</span></label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className={inputCls} placeholder="e.g., Logo Design, Copywriting, Video Editing" />
            </div>
            <div>
              <label className={labelCls}>Portfolio Links <span className="text-slate-400 font-normal">(comma-separated)</span></label>
              <input type="text" name="portfolioLinks" value={formData.portfolioLinks} onChange={handleChange} className={inputCls} placeholder="https://myportfolio.com" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
