import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Sanitize user-provided URLs to prevent XSS injections
const getSafeUrl = (url) => {
  if (!url) return '';
  const sanitized = url.trim().toLowerCase();
  if (sanitized.startsWith('javascript:') || sanitized.startsWith('data:text/html') || sanitized.startsWith('vbscript:')) {
    return '#';
  }
  return url;
};

const Profile = () => {
  const { id } = useParams();
  const { user, updateProfile, uploadPhoto } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', skills: '', portfolioLinks: '' });
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const isOwnProfile = !id || id === user?.id;
  const profileId = id || user?.id;

  useEffect(() => { fetchProfile(); }, [profileId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/users/${profileId}`);
      setProfile(res.data.data);
      setFormData({
        name: res.data.data.name,
        bio: res.data.data.bio || '',
        skills: (res.data.data.skills || []).join(', '),
        portfolioLinks: (res.data.data.portfolioLinks || []).join(', ')
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      portfolioLinks: formData.portfolioLinks.split(',').map(l => l.trim()).filter(l => l)
    });
    if (result.success) {
      setEditing(false);
      fetchProfile();
    } else {
      alert(result.message);
    }
    setSaving(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image must be under 5 MB');
      return;
    }

    setPhotoError('');
    setPhotoUploading(true);

    const result = await uploadPhoto(file);
    if (result.success) {
      setProfile(prev => ({ ...prev, profilePhoto: result.profilePhoto }));
    } else {
      setPhotoError(result.message);
    }
    setPhotoUploading(false);
    // Reset so same file can be re-uploaded if needed
    e.target.value = '';
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 focus:bg-white";

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="spinner" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">Profile not found</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with upload overlay */}
            <div className="relative shrink-0 group">
              {profile.profilePhoto ? (
                <img
                  src={getSafeUrl(profile.profilePhoto)}
                  alt={profile.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                  {profile.name.charAt(0)}
                </div>
              )}

              {/* Upload overlay — only visible on own profile */}
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                    className="absolute inset-0 rounded-2xl bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    title="Change profile photo"
                  >
                    {photoUploading ? (
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  type="text"
                  className={`${inputCls} text-xl font-semibold mb-2`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              )}
              <p className="text-sm text-gray-400 mb-2">{profile.email}</p>
              {photoError && (
                <p className="text-xs text-red-500 mb-2">⚠️ {photoError}</p>
              )}
              {isOwnProfile && !photoUploading && (
                <p className="text-xs text-gray-400 mb-2">Hover over photo to change it</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {profile.role}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(profile.rating || 0))}{'☆'.repeat(5 - Math.round(profile.rating || 0))}</span>
                  <span className="text-xs text-gray-400">({profile.totalReviews || 0} reviews)</span>
                </div>
                {profile.totalReviews > 0 && (
                  <Link to={`/reviews/${profile._id}`} className="text-xs text-indigo-600 font-medium hover:underline">
                    See reviews →
                  </Link>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <div className="shrink-0">
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About</h3>
          {editing ? (
            <textarea
              className={`${inputCls} min-h-[100px] resize-y`}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              maxLength="500"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed text-sm">{profile.bio || 'No bio provided yet.'}</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
          {editing ? (
            <input type="text" className={inputCls} value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Comma-separated skills" />
          ) : (
            profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No skills listed yet.</p>
            )
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Portfolio</h3>
          {editing ? (
            <input type="text" className={inputCls} value={formData.portfolioLinks} onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })} placeholder="Comma-separated links" />
          ) : (
            profile.portfolioLinks?.length > 0 ? (
              <div className="space-y-2">
                {profile.portfolioLinks.map((link, i) => (
                  <a key={i} href={getSafeUrl(link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 text-sm hover:underline">
                    🔗 {link}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No portfolio links provided yet.</p>
            )
          )}
        </div>

        {!isOwnProfile && (
          <Link to={`/chat/${profile._id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-md">
            💬 Send Message
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
