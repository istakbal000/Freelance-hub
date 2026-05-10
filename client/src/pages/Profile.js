import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Sanitize user-provided URLs using a strict allowlist.
// Only https://, http://, and relative paths (/) are permitted.
// Everything else (javascript:, data:, vbscript:, blob:, etc.) is blocked.
const getSafeUrl = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  ) {
    try {
      return encodeURI(decodeURI(trimmed));
    } catch {
      return '#';
    }
  }
  return '#';
};

// Sanitize a full profile object received from the API before storing in state.
const sanitizeProfile = (data) => ({
  ...data,
  profilePhoto: getSafeUrl(data.profilePhoto || ''),
  portfolioLinks: (data.portfolioLinks || []).map(getSafeUrl),
});

const Profile = () => {
  const { id } = useParams();
  const { user, updateProfile, uploadPhoto } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', profession: '', skills: '', portfolioLinks: '' });
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const isOwnProfile = !id || id === user?.id;
  const profileId = id || user?.id;

  useEffect(() => { fetchProfile(); }, [profileId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/users/${profileId}`);
      const safe = sanitizeProfile(res.data.data);
      setProfile(safe);
      setFormData({
        name: safe.name,
        bio: safe.bio || '',
        profession: safe.profession || '',
        skills: (safe.skills || []).join(', '),
        portfolioLinks: (safe.portfolioLinks || []).join(', ')
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
      profession: formData.profession,
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
              {profile.profilePhoto && profile.profilePhoto !== '#' ? (
                (() => {
                  const safePhotoUrl = getSafeUrl(profile.profilePhoto);
                  return (
                    <img
                      src={safePhotoUrl}
                      alt={profile.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-md"
                    />
                  );
                })()
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                  {profile.name.charAt(0)}
                </div>
              )}

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
                <p className="text-xs text-red-500 mb-2">&#9888;&#65039; {photoError}</p>
              )}
              {isOwnProfile && !photoUploading && (
                <p className="text-xs text-gray-400 mb-2">Hover over photo to change it</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {profile.role}
                </span>
                {profile.profession && (
                  <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {profile.profession}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(profile.rating || 0))}{'☆'.repeat(5 - Math.round(profile.rating || 0))}</span>
                  <span className="text-xs text-gray-400">({profile.totalReviews || 0} reviews)</span>
                </div>
                {profile.totalReviews > 0 && (
                  <Link to={`/reviews/${profile._id}`} className="text-xs text-indigo-600 font-medium hover:underline">
                    See reviews &#8594;
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
                    &#9999;&#65039; Edit Profile
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
            <>
              <textarea
                className={`${inputCls} min-h-[100px] resize-y mb-3`}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
              <input
                type="text"
                className={inputCls}
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="Your profession (e.g., Graphic Designer, Content Writer, Web Developer)"
                maxLength="100"
              />
            </>
          ) : (
            <p className="text-gray-600 leading-relaxed text-sm">{profile.bio || 'No bio provided yet.'}</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
          {editing ? (
            <input type="text" className={inputCls} value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Comma-separated skills (e.g., Illustration, Copywriting, SEO)" />
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Portfolio</h3>
            {isOwnProfile && (
              <Link
                to={`/portfolio/${profile._id}`}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                View Public Portfolio &#8594;
              </Link>
            )}
          </div>
          {isOwnProfile ? (
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm"
            >
              &#127912; Manage My Portfolio
            </Link>
          ) : (
            <Link
              to={`/portfolio/${profile._id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition"
            >
              &#128065;&#65039; View Portfolio
            </Link>
          )}
        </div>

        {!isOwnProfile && (
          <Link to={`/chat/${profile._id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-md">
            &#128172; Send Message
          </Link>
        )}
      </div>
    </div>
  );
};

export default Profile;
