import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Web & App Development', 'Design & Creative', 'Writing & Content',
  'Digital Marketing', 'Video & Animation', 'Music & Audio',
  'Photography & Art', 'Business & Finance', 'Legal',
  'Education & Tutoring', 'Virtual Assistant', 'Data & Analytics',
  'Architecture & Engineering', 'Other'
];

const CATEGORY_ICONS = {
  'Web & App Development': '💻', 'Design & Creative': '🎨',
  'Writing & Content': '✍️', 'Digital Marketing': '📣',
  'Video & Animation': '🎬', 'Music & Audio': '🎵',
  'Photography & Art': '📸', 'Business & Finance': '💼',
  'Legal': '⚖️', 'Education & Tutoring': '📚',
  'Virtual Assistant': '🤖', 'Data & Analytics': '📊',
  'Architecture & Engineering': '🏗️', 'Other': '🌟'
};

const statusColors = {
  open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
};

const Contracts = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  
  // Initialize category from URL if present
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);

  useEffect(() => { fetchContracts(); }, [statusFilter, categoryFilter]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      const res = await axios.get(`/api/contracts?${params.toString()}`);
      setContracts(res.data.data);
    } catch (err) {
      setError('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-canvas">
      <div className="w-14 h-14 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold text-slate-900">Browse Contracts</h1>
            <p className="text-slate-500 mt-1 text-sm">Find opportunities that match your skills</p>
          </div>
          {user?.role === 'experienced' && (
            <Link to="/post-contract" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition shadow-sm">
              + Post Contract
            </Link>
          )}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-borderSubtle mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                categoryFilter === 'All' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 text-slate-600 border-borderSubtle hover:border-primary/40'
              }`}
            >
              🌐 All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                  categoryFilter === cat ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 text-slate-600 border-borderSubtle hover:border-primary/40'
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-borderSubtle mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          {['open', 'in_progress', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                statusFilter === s ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

        {contracts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-borderSubtle text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-sora font-semibold text-slate-700 mb-1">No contracts found</h3>
            <p className="text-slate-400 text-sm">Try a different category or status filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contracts.map(contract => (
              <div key={contract._id} className="bg-white rounded-2xl p-5 shadow-sm border border-borderSubtle hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-sora font-semibold text-slate-900 leading-tight line-clamp-2">{contract.title}</h3>
                  <span className={`ml-1 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[contract.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {contract.status?.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                  </span>
                </div>

                {contract.category && contract.category !== 'Other' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full mb-2 self-start">
                    {CATEGORY_ICONS[contract.category]} {contract.category}
                  </span>
                )}

                <div className="text-xl font-sora font-bold text-tertiary mb-3">${contract.budget}</div>
                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-3 flex-1">{contract.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {contract.skillsRequired?.map((skill, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-slate-400 mb-4">
                  <span>📅 {formatDate(contract.deadline)}</span>
                  <span>👤 {contract.client?.name}</span>
                </div>

                <Link to={`/contracts/${contract._id}`} className="block text-center text-sm text-primary font-semibold border border-primary/30 py-2 rounded-xl hover:bg-primary/5 transition">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
