import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const appStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const contractStatusColors = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
};

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchApplications(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApplications = async () => {
    try {
      if (user?.role === 'beginner') {
        const res = await axios.get('/api/applications/my-applications');
        setApplications(res.data.data);
      } else {
        const res = await axios.get('/api/contracts/my/contracts');
        const contractsWithApps = await Promise.all(
          res.data.data.map(async (contract) => {
            const appsRes = await axios.get(`/api/applications/contract/${contract._id}`);
            return { ...contract, applications: appsRes.data.data };
          })
        );
        setApplications(contractsWithApps);
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (contractId, applicationId, action) => {
    try {
      await axios.put(`/api/applications/${applicationId}/${action}`);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application');
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'beginner' ? 'My Applications' : 'Applicants'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {user?.role === 'beginner'
              ? 'Track the status of your contract applications'
              : 'Review and manage applicants for your contracts'}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
        )}

        {/* ── BEGINNER VIEW ── */}
        {user?.role === 'beginner' ? (
          applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="text-5xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-700 mb-1">No applications yet</h3>
              <p className="text-gray-400 text-sm mb-4">Browse contracts and apply to start your freelance journey.</p>
              <Link to="/contracts" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition">
                Browse Contracts
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <Link to={`/contracts/${app.contract?._id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition">
                        {app.contract?.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">Posted by {app.contract?.client?.name}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${appStatusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{app.proposal}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>💰 ${app.contract?.budget}</span>
                    <span>📅 Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── EXPERIENCED VIEW ── */
          applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-700 mb-1">No contracts posted</h3>
              <p className="text-gray-400 text-sm mb-4">Post your first contract to start receiving applications.</p>
              <Link to="/post-contract" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition">
                + Post Contract
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map(contract => (
                <div key={contract._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <Link to={`/contracts/${contract._id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition">
                        {contract.title}
                      </Link>
                      <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${contractStatusColors[contract.status] || 'bg-gray-100 text-gray-600'}`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">${contract.budget}</div>
                  </div>

                  {contract.applications?.length === 0 ? (
                    <p className="text-sm text-gray-400">No applications yet for this contract.</p>
                  ) : (
                    <div className="space-y-3">
                      {contract.applications.map(app => (
                        <div key={app._id} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                {app.freelancer?.name?.charAt(0)}
                              </div>
                              <div>
                                <Link to={`/profile/${app.freelancer?._id}`} className="font-semibold text-gray-900 text-sm hover:text-indigo-600">
                                  {app.freelancer?.name}
                                </Link>
                                <div className="text-xs text-yellow-500">{'★'.repeat(Math.round(app.freelancer?.rating || 0))} <span className="text-gray-400">{app.freelancer?.rating || 0}/5</span></div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {app.freelancer?.skills?.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{skill}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${appStatusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">{app.proposal}</p>
                          {app.status === 'pending' && contract.status === 'open' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApplicationAction(contract._id, app._id, 'accepted')}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleApplicationAction(contract._id, app._id, 'rejected')}
                                className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                              >
                                Reject
                              </button>
                              <Link
                                to={`/chat/${app.freelancer?._id}`}
                                className="px-3 py-1.5 border border-indigo-300 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition"
                              >
                                💬 Message
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Applications;
