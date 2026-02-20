import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostContract = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Contract</h1>
          <p className="text-gray-500 mt-1 text-sm">Create a new opportunity for beginner freelancers</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>Contract Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                placeholder="e.g., React Frontend Development for E-commerce Site"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Description <span className="text-red-400">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength="2000"
                placeholder="Describe the project requirements, deliverables, and expectations..."
                rows="6"
                className={`${inputCls} min-h-[140px] resize-y`}
              />
            </div>

            <div>
              <label className={labelCls}>Required Skills <span className="text-red-400">*</span> <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                required
                placeholder="e.g., React, Node.js, MongoDB, UI/UX Design"
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Budget (USD) <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="500"
                    className={`${inputCls} pl-8`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Deadline <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={today}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Post Contract'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/contracts')}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
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
