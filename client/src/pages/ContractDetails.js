import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
};

const appStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const ContractDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [contract, setContract] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchContractDetails(); }, [id]);

  const fetchContractDetails = async () => {
    try {
      const res = await axios.get(`/api/contracts/${id}`);
      setContract(res.data.data);
      if (user?.role === 'experienced' && res.data.data.client?._id === user?.id) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to fetch contract details', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/api/applications/contract/${id}`);
      setApplications(res.data.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/applications', { contract: id, proposal });
      setShowApplyModal(false);
      setProposal('');
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      await axios.put(`/api/applications/${applicationId}/${action}`);
      fetchApplications();
      fetchContractDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application');
    }
  };

  const handleCompleteContract = async () => {
    try {
      await axios.put(`/api/contracts/${id}`, { status: 'completed' });
      fetchContractDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete contract');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="spinner" />
    </div>
  );

  if (!contract) return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">Contract not found</div>
      </div>
    </div>
  );

  const isOwner = contract.client?._id === user?.id;
  const isAssigned = contract.freelancer?._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/contracts" className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium mb-6 hover:underline">
          ← Back to Contracts
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{contract.title}</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[contract.status] || 'bg-gray-100 text-gray-600'}`}>
                {contract.status?.replace('_', ' ')}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">${contract.budget}</div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{contract.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {contract.skillsRequired?.map((skill, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="text-xs text-gray-400 mb-1">Deadline</div>
              <div className="font-semibold text-gray-800 text-sm">{formatDate(contract.deadline)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Posted By</div>
              <Link to={`/profile/${contract.client?._id}`} className="font-semibold text-indigo-600 text-sm hover:underline">
                {contract.client?.name}
              </Link>
            </div>
            {contract.freelancer && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Assigned To</div>
                <Link to={`/profile/${contract.freelancer?._id}`} className="font-semibold text-indigo-600 text-sm hover:underline">
                  {contract.freelancer?.name}
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {user?.role === 'beginner' && contract.status === 'open' && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-md"
              >
                Apply Now
              </button>
            )}
            {isOwner && contract.status === 'in_progress' && (
              <button
                onClick={handleCompleteContract}
                className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-md"
              >
                Mark as Complete
              </button>
            )}
            {(isOwner || isAssigned) && (
              <Link
                to={`/chat/${isOwner ? contract.freelancer?._id : contract.client?._id}`}
                className="px-5 py-2.5 border border-indigo-500 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition"
              >
                💬 Message
              </Link>
            )}
          </div>
        </div>

        {/* Applications */}
        {isOwner && applications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications ({applications.length})</h2>
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                        {app.freelancer?.name?.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/profile/${app.freelancer?._id}`} className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition">
                          {app.freelancer?.name}
                        </Link>
                        <div className="text-xs text-gray-400">Rating: {app.freelancer?.rating || 0}/5 ⭐</div>
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
                        onClick={() => handleApplicationAction(app._id, 'accepted')}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleApplicationAction(app._id, 'rejected')}
                        className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Application</h2>
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Proposal</label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Explain why you're a great fit for this contract..."
                    required
                    maxLength="1000"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-gray-50 focus:bg-white transition"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
