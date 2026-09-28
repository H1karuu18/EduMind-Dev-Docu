import { Typography, Box } from '@mui/material';
import {
  LayoutDashboard, FileText, Map, Bot, Library, GitBranch,
  Users, Settings, ArrowUpCircle, BookOpen
} from 'lucide-react';

type Plan = 'free' | 'pro' | 'pro_plus';

interface IndividualSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userName: string;
  plan: Plan;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'lesson-plans', label: 'My Lesson Plans', icon: FileText },
  { id: 'roadmap', label: 'Curriculum Roadmap', icon: Map },
  { id: 'ai-session', label: 'AI Knowledge Sessions', icon: Bot },
  { id: 'library', label: 'My Library', icon: Library },
  { id: 'commit-log', label: 'Version History', icon: GitBranch },
  { id: 'collaborations', label: 'Collaborations', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  pro: 'Pro',
  pro_plus: 'Pro Plus',
};

const PLAN_COLORS: Record<Plan, string> = {
  free: '#718096',
  pro: '#6B46C1',
  pro_plus: '#2B6CB0',
};

export default function IndividualSidebar({ currentPage, onNavigate, userName, plan, onLogout }: IndividualSidebarProps) {
  const initials = userName.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('');

  return (
    <div className="w-[220px] shrink-0 bg-[#1E3A5F] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg bg-[#E63946] flex items-center justify-center shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
          EduMind
        </Typography>
      </div>

      {/* User avatar */}
      <div className="px-4 py-3 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center shrink-0">
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.65rem' }}>
            {initials}
          </Typography>
        </div>
        <div className="min-w-0 flex-1">
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block', fontSize: '0.75rem' }} className="truncate">
            {userName}
          </Typography>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: `${PLAN_COLORS[plan]}30`, color: PLAN_COLORS[plan] === '#718096' ? '#cbd5e1' : PLAN_COLORS[plan] }}
          >
            {PLAN_LABELS[plan]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-left transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 400, color: 'inherit' }}>
                {item.label}
              </Typography>
            </button>
          );
        })}
      </nav>

      {/* Upgrade CTA (free users only) */}
      {plan === 'free' && (
        <div className="mx-3 mb-3 p-3 bg-[#6B46C1]/20 border border-[#6B46C1]/40 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowUpCircle className="w-3.5 h-3.5 text-[#9f7aea]" />
            <Typography variant="caption" sx={{ color: '#c4b5fd', fontWeight: 600, fontSize: '0.7rem' }}>
              Unlock unlimited sessions
            </Typography>
          </div>
          <Typography variant="caption" sx={{ color: '#a78bfa', display: 'block', mb: 1.5, fontSize: '0.65rem', lineHeight: 1.4 }}>
            Upgrade to Pro for unlimited AI sessions, lesson plans, and more.
          </Typography>
          <button
            className="w-full bg-[#6B46C1] hover:bg-[#553c9a] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-3 border-t border-white/10 pt-3">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
        >
          Log Out
        </button>
        <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.6rem', px: 1 }}>
          Joveinvi Techne © 2026
        </Typography>
      </div>
    </div>
  );
}
