import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
};

const Contracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('open');

  useEffect(() => { fetchContracts(); }, [filter]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/contracts?status=${filter}`);
      setContracts(res.data.data);
    } catch (err) {
      setError('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Contracts</h1>
            <p className="text-gray-500 mt-1 text-sm">Find opportunities that match your skills</p>
          </div>
          {user?.role === 'experienced' && (
            <Link to="/post-contract" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-md">
              + Post Contract
            </Link>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Filter by status:</span>
          {['open', 'in_progress', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${filter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        {contracts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-700 mb-1">No contracts found</h3>
            <p className="text-gray-400 text-sm">Try a different filter or check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contracts.map(contract => (
              <div key={contract._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 leading-tight">{contract.title}</h3>
                  <span className={`ml-2 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[contract.status] || 'bg-gray-100 text-gray-600'}`}>
                    {contract.status}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-600 mb-3">${contract.budget}</div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3 flex-1">{contract.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {contract.skillsRequired?.map((skill, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>📅 {formatDate(contract.deadline)}</span>
                  <span>👤 {contract.client?.name}</span>
                </div>
                <Link to={`/contracts/${contract._id}`} className="block text-center text-sm text-indigo-600 font-medium border border-indigo-200 py-2 rounded-xl hover:bg-indigo-50 transition">
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
