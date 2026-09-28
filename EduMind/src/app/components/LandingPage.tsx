import { Button, Typography, Box, Chip } from '@mui/material';
import { BookOpen, GitBranch, Brain, Server, Shield, Wifi } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Build Curriculum Roadmaps',
    desc: 'Visual week-by-week lesson planning with progress tracking across your entire term.',
  },
  {
    icon: GitBranch,
    title: 'Version Control for Educators',
    desc: 'Commit your changes like a developer. Diff your syllabus, restore previous versions, fork others.',
  },
  {
    icon: Brain,
    title: 'AI Knowledge Sessions',
    desc: 'Query your own course materials — not the internet. RAG-based AI scoped to your uploads only.',
  },
];

const TRUST_BADGES = [
  { icon: Server, label: 'AWS-Powered' },
  { icon: Brain, label: 'RAG-Based AI' },
  { icon: Wifi, label: 'No Internet Leakage' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
      {/* Nav */}
      <nav className="bg-[#1E3A5F] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E63946] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            EduMind
          </Typography>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Features', 'Pricing', 'About'].map(item => (
            <button
              key={item}
              onClick={() => item === 'Pricing' && onNavigate('pricing')}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onNavigate('login')}
            sx={{
              color: 'white', borderColor: 'rgba(255,255,255,0.4)',
              textTransform: 'none', borderRadius: '8px', minHeight: 36,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onNavigate('login')}
            sx={{
              bgcolor: '#E63946', color: 'white', textTransform: 'none',
              borderRadius: '8px', minHeight: 36,
              '&:hover': { bgcolor: '#cc2f3b' }
            }}
          >
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1E3A5F] px-8 py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800, color: 'white', fontSize: '2.75rem',
                lineHeight: 1.15, letterSpacing: '-0.03em', mb: 3
              }}
            >
              Your Teaching Knowledge.{' '}
              <span style={{ color: '#E63946' }}>Organized.</span>{' '}
              Versioned. Intelligent.
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, mb: 5 }}>
              EduMind is the personal knowledge workspace for educators — build lesson plans,
              version your syllabi like code, and query your course materials through AI.
            </Typography>
            <div className="flex gap-3 mb-8">
              <Button
                variant="contained"
                size="large"
                onClick={() => onNavigate('login')}
                sx={{
                  bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px',
                  minHeight: 44, px: 3, fontWeight: 600,
                  '&:hover': { bgcolor: '#cc2f3b' }
                }}
              >
                Start for Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => onNavigate('enterprise-login')}
                sx={{
                  color: 'white', borderColor: '#1E3A5F',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  textTransform: 'none', borderRadius: '8px',
                  minHeight: 44, px: 3, fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                See Enterprise
              </Button>
            </div>
            <div className="flex gap-4">
              {TRUST_BADGES.map(badge => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-1.5 text-slate-400">
                    <Icon className="w-3.5 h-3.5" />
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                      {badge.label}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
            <div className="bg-[#0f2040] rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <Typography variant="caption" sx={{ color: '#475569', ml: 2, fontSize: '0.7rem' }}>
                  MNTSDEV — Lesson Plan Editor
                </Typography>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="h-8 bg-[#E63946]/20 border border-[#E63946]/30 rounded mt-3 flex items-center px-3">
                  <div className="h-2 bg-[#E63946]/50 rounded w-1/3" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                  Roadmap completion
                </Typography>
                <Typography variant="caption" sx={{ color: '#E63946', fontWeight: 600, fontSize: '0.7rem' }}>
                  Week 4 of 16
                </Typography>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-2 bg-[#E63946] rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096', lineHeight: 1.6 }}>
                  {f.desc}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise CTA strip */}
      <section className="bg-[#1E3A5F] px-8 py-12 text-center">
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
          EduMind Enterprise
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
          Bring EduMind to your institution — custom domain, SSO, admin panel, full RBAC.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => onNavigate('enterprise-login')}
          sx={{
            color: 'white', borderColor: 'rgba(255,255,255,0.4)',
            textTransform: 'none', borderRadius: '8px', minHeight: 44, px: 4,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'white' }
          }}
        >
          Learn About Enterprise
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2040] px-8 py-6 text-center">
        <Typography variant="caption" sx={{ color: '#475569' }}>
          © 2026 EduMind — Joveinvi Techne · School of Computing and Information Technologies, APC
        </Typography>
      </footer>
    </div>
  );
}
