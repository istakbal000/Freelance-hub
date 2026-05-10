import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// Strict URL allowlist — same pattern as Profile.js
const getSafeUrl = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const t = url.trim();
  if (t.startsWith('https://') || t.startsWith('http://') || t.startsWith('/')) {
    try { return encodeURI(decodeURI(t)); } catch { return '#'; }
  }
  return '#';
};

const EMPTY_FORM = {
  title: '', description: '', imageUrl: '', category: 'Other',
  tags: '', liveUrl: '', projectLink: '', featured: false, completedAt: ''
};

const PortfolioDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // project being edited
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    if (user?.id) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profRes, portRes] = await Promise.all([
        axios.get(`/api/users/${user.id}`),
        axios.get(`/api/portfolio/${user.id}`)
      ]);
      setProfileData(profRes.data.data);
      setProjects(portRes.data.data);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '', description: p.description || '',
      imageUrl: p.imageUrl || '', category: p.category || 'Other',
      tags: (p.tags || []).join(', '), liveUrl: p.liveUrl || '',
      projectLink: p.projectLink || '', featured: p.featured || false,
      completedAt: p.completedAt ? p.completedAt.split('T')[0] : ''
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        completedAt: form.completedAt || undefined
      };
      if (editing) {
        await axios.put(`/api/portfolio/${editing}`, payload);
      } else {
        await axios.post('/api/portfolio', payload);
      }
      await fetchAll();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/portfolio/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleFeature = async (id) => {
    try {
      const res = await axios.patch(`/api/portfolio/${id}/feature`);
      setProjects(prev => prev.map(p => p._id === id ? res.data.data : p));
    } catch (err) {
      alert('Feature toggle failed');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${user?.id}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const displayed = filterCat === 'All' ? projects : projects.filter(p => p.category === filterCat);
  const usedCats = ['All', ...new Set(projects.map(p => p.category))];

  const inputCls = "w-full px-4 py-3 border border-borderSubtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-slate-50 focus:bg-white text-slate-900";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-canvas">
      <div className="w-14 h-14 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-16 font-sans">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
              {profileData?.name?.charAt(0) || user?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-sora font-bold mb-1">{profileData?.name || user?.name}</h1>
              <p className="text-blue-100 text-sm mb-3">
                {profileData?.profession || 'Freelancer'} &nbsp;·&nbsp;
                {'★'.repeat(Math.round(profileData?.rating || 0))}{'☆'.repeat(5 - Math.round(profileData?.rating || 0))}
                &nbsp;({profileData?.totalReviews || 0} reviews)
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition"
                >
                  {copied ? '✅ Copied!' : '🔗 Copy Share Link'}
                </button>
                <Link
                  to={`/portfolio/${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm"
                >
                  👁️ View Public Page
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="flex gap-8 md:text-right">
              {[
                [projects.length, 'Projects'],
                [profileData?.skills?.length || 0, 'Skills'],
                [profileData?.totalReviews || 0, 'Reviews']
              ].map(([n, label]) => (
                <div key={label}>
                  <div className="text-3xl font-sora font-bold">{n}</div>
                  <div className="text-blue-100 text-xs uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-sora font-bold text-slate-900">My Portfolio</h2>
            <p className="text-slate-500 text-sm mt-1">Showcase your best work to attract clients</p>
          </div>
          <button
            onClick={openAdd}
            id="add-project-btn"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-sm"
          >
            <span className="text-lg leading-none">+</span> Add Project
          </button>
        </div>

        {/* Category filter */}
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {usedCats.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterCat === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-borderSubtle text-slate-600 hover:border-primary/40'
                }`}
              >
                {cat === 'All' ? '🌐 All' : `${CATEGORY_ICONS[cat] || '📁'} ${cat}`}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="bg-white rounded-3xl border border-borderSubtle p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-sora font-bold text-slate-800 mb-2">
              {projects.length === 0 ? 'Your portfolio is empty' : 'No projects in this category'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {projects.length === 0
                ? 'Add your first project to showcase your skills to potential clients.'
                : 'Try a different category filter.'}
            </p>
            {projects.length === 0 && (
              <button onClick={openAdd} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition">
                Add Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={() => openEdit(project)}
                onDelete={() => setDeleteId(project._id)}
                onFeature={() => handleFeature(project._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <ProjectModal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          editing={!!editing}
          inputCls={inputCls}
          labelCls={labelCls}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-sora font-bold text-slate-900 mb-2">Delete Project?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-borderSubtle text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Project Card ── */
const ProjectCard = ({ project, onEdit, onDelete, onFeature }) => {
  const safeImage = project.imageUrl && project.imageUrl.startsWith('http') ? project.imageUrl : null;
  const safeLive = project.liveUrl && project.liveUrl.startsWith('http') ? project.liveUrl : null;
  const safeLink = project.projectLink && project.projectLink.startsWith('http') ? project.projectLink : null;

  return (
    <div className="bg-white rounded-2xl border border-borderSubtle shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {safeImage ? (
          <img src={safeImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {CATEGORY_ICONS[project.category] || '🌟'}
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</div>
        )}
        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button onClick={onFeature} title={project.featured ? 'Unfeature' : 'Feature'} className="w-9 h-9 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center text-sm transition">⭐</button>
          <button onClick={onEdit} title="Edit" className="w-9 h-9 bg-white hover:bg-slate-100 text-slate-800 rounded-full flex items-center justify-center text-sm transition">✏️</button>
          <button onClick={onDelete} title="Delete" className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition">🗑️</button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-sora font-semibold text-slate-900 leading-tight line-clamp-1">{project.title}</h3>
          <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {CATEGORY_ICONS[project.category]} {project.category}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">{project.description || 'No description provided.'}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {(project.tags || []).slice(0, 4).map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          {safeLive && <a href={safeLive} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition">🌐 Live</a>}
          {safeLink && <a href={safeLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs py-2 border border-borderSubtle text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">🔗 View</a>}
        </div>
      </div>
    </div>
  );
};

/* ── Project Modal ── */
const ProjectModal = ({ form, setForm, onSave, onClose, saving, editing, inputCls, labelCls }) => {
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-borderSubtle px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-sora font-bold text-slate-900">{editing ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition text-xl">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className={labelCls}>Title <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g., Brand Identity for Coffee Shop" maxLength={100} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the project, your role, and the outcome..." maxLength={1000} rows={4} className={`${inputCls} resize-y min-h-[100px]`} />
          </div>
          <div>
            <label className={labelCls}>Cover Image URL <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Live / Demo URL</label>
              <input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Project Link <span className="text-slate-400 font-normal">(GitHub, Behance…)</span></label>
              <input type="url" value={form.projectLink} onChange={e => set('projectLink', e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Skills / Tags <span className="text-slate-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g., Figma, Branding, Typography" className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Completion Date</label>
              <input type="date" value={form.completedAt} onChange={e => set('completedAt', e.target.value)} className={inputCls} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer select-none pb-3">
                <button
                  type="button"
                  onClick={() => set('featured', !form.featured)}
                  aria-pressed={form.featured}
                  className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${form.featured ? 'bg-amber-400' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-semibold text-slate-700">Featured project ⭐</span>
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-borderSubtle px-6 py-4 flex gap-3 rounded-b-3xl">
          <button onClick={onSave} disabled={saving || !form.title.trim()} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Project'}
          </button>
          <button onClick={onClose} className="flex-1 py-3 border border-borderSubtle text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
