import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  'Web & App Development': '💻', 'Design & Creative': '🎨',
  'Writing & Content': '✍️', 'Digital Marketing': '📣',
  'Video & Animation': '🎬', 'Music & Audio': '🎵',
  'Photography & Art': '📸', 'Business & Finance': '💼',
  'Legal': '⚖️', 'Education & Tutoring': '📚',
  'Virtual Assistant': '🤖', 'Data & Analytics': '📊',
  'Architecture & Engineering': '🏗️', 'Other': '🌟'
};

const getSafeUrl = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const t = url.trim();
  if (t.startsWith('https://') || t.startsWith('http://') || t.startsWith('/')) {
    try { return encodeURI(decodeURI(t)); } catch { return '#'; }
  }
  return '#';
};

const PublicPortfolio = () => {
  const { userId } = useParams();
  const { user: authUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, portRes] = await Promise.all([
        axios.get(`/api/users/${userId}`),
        axios.get(`/api/portfolio/${userId}`)
      ]);
      setProfile(profRes.data.data);
      setProjects(portRes.data.data);
    } catch (err) {
      console.error('Error loading portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-canvas">
      <div className="w-14 h-14 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen pt-24 bg-canvas">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-sora font-bold text-slate-800 mb-2">Portfolio not found</h2>
        <p className="text-slate-500">This user doesn't exist or their portfolio is unavailable.</p>
      </div>
    </div>
  );

  const featured = projects.filter(p => p.featured);
  const allUsedCats = ['All', ...new Set(projects.map(p => p.category))];
  const displayed = filterCat === 'All' ? projects : projects.filter(p => p.category === filterCat);
  const isOwnPortfolio = authUser?.id === userId;

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              {profile.profilePhoto && profile.profilePhoto !== '#' ? (
                <img src={getSafeUrl(profile.profilePhoto)} alt={profile.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-xl border-4 border-white/20" />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white/20">
                  {profile.name?.charAt(0)}
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-sora font-bold mb-2">{profile.name}</h1>
              {profile.profession && (
                <p className="text-blue-100 text-lg font-medium mb-2">{profile.profession}</p>
              )}
              <p className="text-blue-100/80 text-sm mb-4 max-w-xl leading-relaxed">
                {profile.bio || 'Talented freelancer available for projects.'}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-amber-300 text-sm">{'★'.repeat(Math.round(profile.rating || 0))}{'☆'.repeat(5 - Math.round(profile.rating || 0))}</span>
                  <span className="text-blue-100/70 text-xs">({profile.totalReviews || 0} reviews)</span>
                </div>
                {(profile.skills || []).slice(0, 5).map((skill, i) => (
                  <span key={i} className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 shrink-0">
              {isOwnPortfolio ? (
                <Link to="/portfolio" className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition shadow-lg text-center text-sm">
                  ✏️ Edit Portfolio
                </Link>
              ) : (
                <>
                  {isAuthenticated && (
                    <Link to={`/chat/${profile._id}`} className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition shadow-lg text-center text-sm">
                      💬 Hire Me
                    </Link>
                  )}
                  <Link to={`/profile/${profile._id}`} className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition text-center text-sm">
                    👤 View Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/20">
            {[
              [projects.length, 'Total Projects'],
              [featured.length, 'Featured Work'],
              [profile.totalReviews || 0, 'Client Reviews']
            ].map(([n, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-sora font-bold">{n}</div>
                <div className="text-blue-100/70 text-xs uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <div className="bg-white border-b border-borderSubtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl font-sora font-bold text-slate-900">Featured Work</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(p => <PublicProjectCard key={p._id} project={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* All Projects */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-sora font-bold text-slate-900">All Projects</h2>
          {/* Category filter */}
          {allUsedCats.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {allUsedCats.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filterCat === cat ? 'bg-primary text-white shadow-sm' : 'bg-white border border-borderSubtle text-slate-600 hover:border-primary/40'
                  }`}>
                  {cat === 'All' ? '🌐 All' : `${CATEGORY_ICONS[cat] || '📁'} ${cat}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>No projects in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map(p => <PublicProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Public Project Card (read-only) ── */
const PublicProjectCard = ({ project }) => {
  const safeImage = project.imageUrl && project.imageUrl.startsWith('http') ? project.imageUrl : null;
  const safeLive = project.liveUrl && project.liveUrl.startsWith('http') ? project.liveUrl : null;
  const safeLink = project.projectLink && project.projectLink.startsWith('http') ? project.projectLink : null;

  return (
    <div className="bg-white rounded-2xl border border-borderSubtle shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {safeImage ? (
          <img src={safeImage} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {CATEGORY_ICONS[project.category] || '🌟'}
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-sora font-semibold text-slate-900 leading-tight">{project.title}</h3>
          <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {CATEGORY_ICONS[project.category]} {project.category}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3 flex-1">{project.description || 'No description provided.'}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {(project.tags || []).slice(0, 4).map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          {safeLive && (
            <a href={safeLive} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition">
              🌐 Live Demo
            </a>
          )}
          {safeLink && (
            <a href={safeLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center text-xs py-2 border border-borderSubtle text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
              🔗 View Project
            </a>
          )}
        </div>
        {project.completedAt && (
          <p className="text-xs text-slate-400 mt-3 text-right">
            Completed {new Date(project.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicPortfolio;
