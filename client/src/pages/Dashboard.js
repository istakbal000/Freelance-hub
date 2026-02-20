import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ value, label, icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{icon}</div>
    <div>
      <div className="text-3xl font-extrabold text-indigo-600">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ contracts: 0, applications: 0 });
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'experienced') {
        const res = await axios.get('/api/contracts/my/contracts');
        setStats(prev => ({ ...prev, contracts: res.data.count }));
        setRecentContracts(res.data.data.slice(0, 3));
      } else {
        const res = await axios.get('/api/contracts');
        setStats(prev => ({ ...prev, contracts: res.data.count }));
        setRecentContracts(res.data.data.slice(0, 3));
        const appsRes = await axios.get('/api/applications/my-applications');
        setStats(prev => ({ ...prev, applications: appsRes.data.count }));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    open: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'experienced' ? 'Experienced Freelancer Dashboard' : 'Beginner Freelancer Dashboard'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            value={stats.contracts}
            label={user?.role === 'experienced' ? 'My Contracts' : 'Available Contracts'}
            icon="📋"
          />
          {user?.role === 'beginner' && (
            <StatCard value={stats.applications} label="My Applications" icon="📝" />
          )}
          <StatCard
            value={(user?.rating || 0).toFixed(1)}
            label={`Rating (${user?.totalReviews || 0} reviews)`}
            icon="⭐"
          />
        </div>

        {/* Recent Contracts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'experienced' ? 'Recent Contracts' : 'Recent Opportunities'}
            </h2>
            <Link to="/contracts" className="text-sm text-indigo-600 font-medium hover:underline">
              View all →
            </Link>
          </div>

          {recentContracts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-700 mb-1">No contracts yet</h3>
              <p className="text-gray-400 text-sm mb-4">
                {user?.role === 'experienced' ? 'Start by posting your first contract' : 'Check back soon for new opportunities'}
              </p>
              {user?.role === 'experienced' && (
                <Link to="/post-contract" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition">
                  + Post Contract
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentContracts.map(contract => (
                <div key={contract._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{contract.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-2 shrink-0 ${statusColors[contract.status] || 'bg-gray-100 text-gray-600'}`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 mb-2">${contract.budget}</div>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed line-clamp-2">{contract.description}</p>
                  <Link to={`/contracts/${contract._id}`} className="block text-center text-xs text-indigo-600 font-medium border border-indigo-200 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions (experienced) */}
        {user?.role === 'experienced' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/post-contract" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">
                + Post New Contract
              </Link>
              <Link to="/applications" className="px-4 py-2 border border-indigo-500 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50 transition">
                View Applicants
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
