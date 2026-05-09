import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeContracts: 0,
    completedContracts: 0,
    totalEarnings: 0,
    pendingApplications: 0
  });
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user's contracts based on role
        const endpoint = user?.role === 'experienced' ? '/api/contracts/user/my-posts' : '/api/contracts/user/my-applications';
        const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const contracts = response.data;
        
        // Calculate stats
        let active = 0;
        let completed = 0;
        let pending = 0;
        let earnings = 0;

        if (user?.role === 'experienced') {
          active = contracts.filter(c => c.status === 'in_progress').length;
          completed = contracts.filter(c => c.status === 'completed').length;
          setStats({ activeContracts: active, completedContracts: completed, totalEarnings: 0, pendingApplications: 0 });
          setRecentContracts(contracts.slice(0, 5));
        } else {
          // For beginners, contracts represents applications
          active = contracts.filter(a => a.status === 'accepted').length;
          completed = contracts.filter(a => a.status === 'completed').length;
          pending = contracts.filter(a => a.status === 'pending').length;
          
          // Simplified earnings calculation from completed contracts
          earnings = contracts
            .filter(a => a.status === 'completed' && a.contract)
            .reduce((sum, a) => sum + (a.contract.budget || 0), 0);
            
          setStats({ activeContracts: active, completedContracts: completed, totalEarnings: earnings, pendingApplications: pending });
          setRecentContracts(
            contracts
              .filter(a => a.contract)
              .map(a => ({ ...a.contract, applicationStatus: a.status }))
              .slice(0, 5)
          );
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-canvas flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-canvas text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-sora font-bold text-slate-900 mb-2">
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-600">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'experienced' ? (
              <Link to="/post-contract" className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-sm">
                Post New Contract
              </Link>
            ) : (
              <Link to="/contracts" className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-sm">
                Find Work
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-borderSubtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Active Projects</div>
            <div className="text-3xl font-sora font-bold text-slate-900">{stats.activeContracts}</div>
          </div>
          
          <div className="bg-white border border-borderSubtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Completed</div>
            <div className="text-3xl font-sora font-bold text-slate-900">{stats.completedContracts}</div>
          </div>

          {user?.role === 'beginner' ? (
            <>
              <div className="bg-white border border-borderSubtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Total Earnings</div>
                <div className="text-3xl font-sora font-bold text-tertiary">${stats.totalEarnings}</div>
              </div>
              <div className="bg-white border border-borderSubtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Pending Apps</div>
                <div className="text-3xl font-sora font-bold text-secondary">{stats.pendingApplications}</div>
              </div>
            </>
          ) : (
            <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-2">
              <div className="text-secondary text-sm font-semibold mb-1 uppercase tracking-wider">Quick Actions</div>
              <div className="flex gap-4 mt-3">
                <Link to="/applications" className="text-sm text-primary hover:text-secondary font-medium transition-colors">Review Applicants →</Link>
                <Link to="/chat" className="text-sm text-primary hover:text-secondary font-medium transition-colors">Open Messages →</Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-borderSubtle rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-borderSubtle bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-sora font-semibold text-slate-900">Recent {user?.role === 'experienced' ? 'Contracts' : 'Applications'}</h2>
            <Link to={user?.role === 'experienced' ? '/contracts' : '/applications'} className="text-sm text-primary hover:text-secondary font-medium transition-colors">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-borderSubtle">
            {recentContracts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No recent activity to show.
              </div>
            ) : (
              recentContracts.map((contract, index) => (
                <div key={contract?._id || index} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-slate-900 font-semibold mb-1 font-sora">{contract?.title || 'Unknown Contract'}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-3">
                      <span className="font-medium text-slate-700">${contract?.budget ?? 'N/A'}</span>
                      <span>•</span>
                      <span>{contract?.duration || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      (contract?.status || contract?.applicationStatus) === 'completed' || (contract?.status || contract?.applicationStatus) === 'accepted' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                      (contract?.status || contract?.applicationStatus) === 'in_progress' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                      (contract?.status || contract?.applicationStatus) === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {((contract?.status || contract?.applicationStatus) || 'pending').replace('_', ' ').toUpperCase()}
                    </span>
                    {contract?._id && (
                      <Link to={`/contracts/${contract._id}`} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-borderSubtle rounded-lg hover:border-primary transition-colors shadow-sm">
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
