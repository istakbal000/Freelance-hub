import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  'Web & App Development', 'Design & Creative', 'Writing & Content',
  'Digital Marketing', 'Video & Animation', 'Music & Audio',
  'Photography & Art', 'Business & Finance', 'Legal',
  'Education & Tutoring', 'Virtual Assistant', 'Data & Analytics',
  'Architecture & Engineering', 'Other'
];

const PostContract = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    skillsRequired: '',
    budget: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const contractData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s),
        budget: Number(formData.budget)
      };
      const res = await axios.post('/api/contracts', contractData);
      navigate(`/contracts/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const inputCls = "w-full px-4 py-3 border border-borderSubtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-slate-50 focus:bg-white text-slate-900";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold text-slate-900">Post a Contract</h1>
          <p className="text-slate-500 mt-1 text-sm">Create a new opportunity for freelancers across any field</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-borderSubtle">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>Contract Title <span className="text-red-400">*</span></label>
              <input
                type="text" name="title" value={formData.title}
                onChange={handleChange} required maxLength="100"
                placeholder="e.g., Logo Design for Startup, Blog Content Writing, Social Media Campaign"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Category <span className="text-red-400">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Description <span className="text-red-400">*</span></label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange} required maxLength="2000"
                placeholder="Describe the project requirements, deliverables, and expectations..."
                rows="6"
                className={`${inputCls} min-h-[140px] resize-y`}
              />
            </div>

            <div>
              <label className={labelCls}>Required Skills <span className="text-red-400">*</span> <span className="text-slate-400 font-normal">(comma-separated)</span></label>
              <input
                type="text" name="skillsRequired" value={formData.skillsRequired}
                onChange={handleChange} required
                placeholder="e.g., Illustrator, Copywriting, Photoshop, Video Editing, SEO"
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Budget (USD) <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input
                    type="number" name="budget" value={formData.budget}
                    onChange={handleChange} required min="1"
                    placeholder="500"
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Deadline <span className="text-red-400">*</span></label>
                <input
                  type="date" name="deadline" value={formData.deadline}
                  onChange={handleChange} required min={today}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={loading}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Post Contract'}
              </button>
              <button
                type="button" onClick={() => navigate('/contracts')}
                className="flex-1 py-3 border border-borderSubtle text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostContract;
