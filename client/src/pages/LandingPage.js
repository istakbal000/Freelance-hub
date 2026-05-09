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
    { name: 'Sarah Chen', role: 'Experienced Freelancer', content: 'Freelance Hub transformed how I scale my business. I now take on larger projects by delegating to talented beginners I trust.', rating: 5, colorKey: 'primary' },
    { name: 'Michael Rodriguez', role: 'Beginner Freelancer', content: 'Within 3 months, I completed 8 contracts and built a solid portfolio. The rating system helped me establish credibility quickly.', rating: 5, colorKey: 'secondary' },
    { name: 'Emily Watson', role: 'Experienced Freelancer', content: 'The real-time chat and contract management features are game-changers. Everything I need is in one place.', rating: 5, colorKey: 'tertiary' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-slate-600 font-sans">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-canvas border-b border-borderSubtle">
        {/* Background elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full filter blur-[100px] opacity-70 motion-safe:animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[100px] opacity-70 motion-safe:animate-float-delay" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-borderSubtle rounded-full text-primary text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary motion-safe:animate-pulse" /> The Professional Freelance Network
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-sora text-slate-900 leading-tight mb-6">
              Empowering the Next Generation of <span className="text-primary">Professionals.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-sans">
              The premier platform connecting established freelance talent with eager beginners. Experience seamless collaboration, reliable delegation, and accelerated career growth.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to="/contracts" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                  Explore Contracts
                </Link>
              ) : (
                <>
                  <Link to="/register" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="px-8 py-4 bg-white border border-borderSubtle text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition shadow-sm">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16 border-t border-borderSubtle pt-8">
              {[['10K+', 'Active Contracts'], ['5K+', 'Freelancers'], ['98%', 'Satisfaction']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-3xl font-sora font-bold text-primary mb-1">{num}</div>
                  <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – floating cards */}
          <div className="relative h-96 hidden md:block">
            <div className="motion-safe:animate-float absolute top-10 right-12 bg-white border border-borderSubtle rounded-2xl p-5 text-slate-900 shadow-xl w-64">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl">💼</div>
                <div>
                  <div className="font-semibold text-sm font-sora">New Contract Posted</div>
                  <div className="text-xs text-slate-500 mt-1">2 mins ago</div>
                </div>
              </div>
              <div className="text-sm text-slate-600">Frontend Developer Needed for Enterprise Dashboard</div>
              <div className="mt-3 text-xs font-semibold text-secondary">$4,500 - $6,000</div>
            </div>
            
            <div className="motion-safe:animate-float-delay absolute top-48 right-0 bg-white border border-borderSubtle rounded-2xl p-5 text-slate-900 shadow-xl w-64">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary text-xl">✅</div>
                <div>
                  <div className="font-semibold text-sm font-sora">Application Accepted</div>
                  <div className="text-xs text-slate-500 mt-1">Just now</div>
                </div>
              </div>
              <div className="text-sm text-slate-600">You've been hired by Sarah Chen</div>
              <div className="mt-3 text-xs font-semibold text-tertiary">Status: In Progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-slate-900 mb-6">Engineered for Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful tools designed specifically for professional freelancer collaboration and growth.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-canvas rounded-2xl p-8 border border-borderSubtle hover:border-secondary hover:shadow-md transition-all duration-300 group">
                <div className="w-14 h-14 bg-white shadow-sm border border-borderSubtle rounded-xl flex items-center justify-center text-2xl mb-6 text-primary group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-sora font-semibold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-canvas relative border-y border-borderSubtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-slate-900 mb-6">How the Platform Operates</h2>
            <p className="text-lg text-slate-600">Simple steps to integrate and start collaborating</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Beginners */}
            <div className="bg-white border border-borderSubtle rounded-3xl p-10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider rounded-full mb-8">For Beginners</div>
              <h3 className="text-2xl font-sora font-bold text-slate-900 mb-8">Looking for Opportunities</h3>
              <div className="space-y-6">
                {stepsBeginner.map((s, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-canvas border border-borderSubtle text-secondary font-bold text-sm flex items-center justify-center shrink-0">{s.step}</div>
                    <div className="pt-1">
                      <div className="font-sora font-semibold text-slate-900 mb-1">{s.title}</div>
                      <div className="text-sm text-slate-600">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Experienced */}
            <div className="bg-white border border-borderSubtle rounded-3xl p-10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-8">For Experienced</div>
              <h3 className="text-2xl font-sora font-bold text-slate-900 mb-8">Ready to Delegate</h3>
              <div className="space-y-6">
                {stepsExperienced.map((s, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-canvas border border-borderSubtle text-primary font-bold text-sm flex items-center justify-center shrink-0">{s.step}</div>
                    <div className="pt-1">
                      <div className="font-sora font-semibold text-slate-900 mb-1">{s.title}</div>
                      <div className="text-sm text-slate-600">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold text-slate-900 mb-6">Network Consensus</h2>
            <p className="text-lg text-slate-600">Join thousands of elite professionals already growing together</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-canvas border border-borderSubtle rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="text-amber-400 text-lg mb-4">{'★'.repeat(t.rating)}</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-8">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${t.colorKey === 'primary' ? 'bg-primary' : t.colorKey === 'secondary' ? 'bg-secondary' : 'bg-tertiary'} text-white font-bold flex items-center justify-center text-lg shadow-sm`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-sora font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-sora font-bold text-white mb-6">Ready to Transform Your Trajectory?</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto">Join the premium platform designed for professionals who refuse to settle for average.</p>
          <div className="flex flex-wrap justify-center gap-6">
            {isAuthenticated ? (
              <Link to="/contracts" className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition shadow-lg">
                Access Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition shadow-lg">
                  Initialize Profile
                </Link>
                <Link to="/login" className="px-10 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition">
                  Already Authenticated?
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-sora font-extrabold text-white mb-4">Freelance Hub</h3>
              <p className="text-sm leading-relaxed">The professional network empowering freelancers to collaborate, scale, and succeed.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/contracts" className="hover:text-white transition-colors">Browse Contracts</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Initialize</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Authenticate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-6">Intel</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Systems</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Protocols</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Consensus</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2026 Freelance Hub Core. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
