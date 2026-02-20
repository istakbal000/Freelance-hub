import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: '🤝', title: 'Smart Matching', description: 'Intelligent matching connects experienced freelancers with talented beginners based on skills and project requirements.' },
    { icon: '💬', title: 'Real-time Collaboration', description: 'Built-in messaging with instant notifications. Communicate seamlessly throughout the project lifecycle.' },
    { icon: '⭐', title: 'Verified Ratings', description: 'Transparent ratings build trust. Review completed work and grow your reputation in the community.' },
    { icon: '📋', title: 'Contract Management', description: 'Post, apply, and manage contracts all in one place. Track progress from open to completed.' },
    { icon: '🔒', title: 'Secure Platform', description: 'Enterprise-grade security with JWT authentication. Your data and communications are always protected.' },
    { icon: '🚀', title: 'Career Growth', description: 'Beginners build portfolios. Experienced freelancers scale their business through smart delegation.' },
  ];

  const stepsBeginner = [
    { step: '01', title: 'Create Profile', desc: 'Sign up and showcase your skills' },
    { step: '02', title: 'Browse Contracts', desc: 'Explore available opportunities' },
    { step: '03', title: 'Submit Proposals', desc: 'Apply with compelling proposals' },
    { step: '04', title: 'Deliver & Earn', desc: 'Complete work and build reputation' },
  ];

  const stepsExperienced = [
    { step: '01', title: 'Post Contracts', desc: 'Create detailed contract listings' },
    { step: '02', title: 'Review Applicants', desc: 'Select the best beginner freelancers' },
    { step: '03', title: 'Collaborate', desc: 'Work via integrated chat tools' },
    { step: '04', title: 'Scale Up', desc: 'Build a reliable freelancer network' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Experienced Freelancer', content: 'Freelance Hub transformed how I scale my business. I now take on larger projects by delegating to talented beginners I trust.', rating: 5, color: 'from-indigo-500 to-purple-600' },
    { name: 'Michael Rodriguez', role: 'Beginner Freelancer', content: 'Within 3 months, I completed 8 contracts and built a solid portfolio. The rating system helped me establish credibility quickly.', rating: 5, color: 'from-emerald-500 to-teal-600' },
    { name: 'Emily Watson', role: 'Experienced Freelancer', content: 'The real-time chat and contract management features are game-changers. Everything I need is in one place.', rating: 5, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white/80 text-sm font-medium mb-6">
              🚀 The Future of Freelancing
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Connect.{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Collaborate.
              </span>
              <br />Grow Together.
            </h1>
            <p className="text-lg text-white/70 mb-10 leading-relaxed">
              The first platform built exclusively for freelancer-to-freelancer collaboration.
              Experienced professionals delegate work to eager beginners. Everyone wins.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to="/contracts" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30">
                  Explore Contracts
                </Link>
              ) : (
                <>
                  <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition backdrop-blur">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[['10K+', 'Active Contracts'], ['5K+', 'Freelancers'], ['98%', 'Satisfaction']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white">{num}</div>
                  <div className="text-sm text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – floating cards */}
          <div className="relative h-80 hidden md:block">
            <div className="animate-float absolute top-0 right-12 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-white shadow-xl w-52">
              <div className="text-2xl mb-1">💼</div>
              <div className="font-semibold text-sm">New Contract Posted</div>
              <div className="text-xs text-white/60">React Developer Needed</div>
            </div>
            <div className="animate-float-delay absolute top-28 right-0 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-white shadow-xl w-52">
              <div className="text-2xl mb-1">✅</div>
              <div className="font-semibold text-sm">Application Accepted</div>
              <div className="text-xs text-white/60">Budget: $2,500</div>
            </div>
            <div className="animate-float-delay2 absolute top-56 right-16 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-white shadow-xl w-52">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-semibold text-sm">New 5-Star Review</div>
              <div className="text-xs text-white/60">"Amazing work!"</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Powerful tools designed specifically for freelancer collaboration</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Process</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500">Simple steps to start collaborating</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Beginners */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-4">For Beginners</div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Looking for Opportunities</h3>
              <div className="space-y-4">
                {stepsBeginner.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{s.step}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Experienced */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full mb-4">For Experienced</div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ready to Delegate</h3>
              <div className="space-y-4">
                {stepsExperienced.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{s.step}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">Testimonials</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-500">Join thousands of freelancers already growing together</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} text-white font-bold flex items-center justify-center`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 gradient-animate">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Freelance Career?</h2>
          <p className="text-white/80 text-lg mb-10">Whether you're gaining experience or scaling your business, Freelance Hub is your platform for success.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/contracts" className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg">
                  Start For Free
                </Link>
                <Link to="/login" className="px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition">
                  Already a Member?
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <h3 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">Freelance Hub</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Empowering freelancers to collaborate, grow, and succeed together.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/contracts" className="hover:text-white transition">Browse Contracts</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            © 2026 Freelance Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
