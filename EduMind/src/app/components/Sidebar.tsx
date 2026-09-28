import { Typography, Box } from '@mui/material';
import {
  LayoutDashboard, FileText, Bot, CheckSquare, GitBranch, Bell,
  FolderOpen, BarChart2, Monitor, Settings, LogOut, BookOpen,
  UserCog, Shield, Building2, Calendar, ClipboardList, Activity
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '../../imports/Screenshot_2026-05-19_111637.png';

type EnterpriseRole = 'faculty' | 'executive_director' | 'admin';

interface NavItem { id: string; label: string; icon: React.ElementType; }

const FACULTY_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-syllabi', label: 'My Syllabi', icon: FileText },
  { id: 'lesson-plans', label: 'Lesson Plans', icon: FileText },
  { id: 'ai-session', label: 'AI Knowledge Sessions', icon: Bot },
  { id: 'activity-bank', label: 'Activity Bank', icon: BookOpen },
  { id: 'ppt-bank', label: 'PPT Bank', icon: FolderOpen },
  { id: 'collaboration', label: 'Collaboration Space', icon: CheckSquare },
  { id: 'cross-section', label: 'Cross-Section Monitor', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ED_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pending-approvals', label: 'Pending Approvals', icon: CheckSquare },
  { id: 'version-history', label: 'Revision Audit Trail', icon: GitBranch },
  { id: 'cross-section', label: 'Cross-Section Monitor', icon: Monitor },
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart2 },
  { id: 'repository', label: 'Repository Overview', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ADMIN_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'manage-accounts', label: 'Manage Accounts', icon: UserCog },
  { id: 'rbac', label: 'RBAC & Roles', icon: Shield },
  { id: 'departments', label: 'Departments & Subjects', icon: Building2 },
  { id: 'term-settings', label: 'Term Settings', icon: Calendar },
  { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { id: 'system-health', label: 'System Health', icon: Activity },
];

const ROLE_LABELS: Record<EnterpriseRole, string> = {
  faculty: 'Faculty Member',
  executive_director: 'Executive Director',
  admin: 'System Administrator',
};

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: EnterpriseRole;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onNavigate, userRole, userName, onLogout }: SidebarProps) {
  const navItems = userRole === 'faculty' ? FACULTY_NAV : userRole === 'executive_director' ? ED_NAV : ADMIN_NAV;
  const initials = userName.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('');

  return (
    <div className="w-[220px] shrink-0 bg-[#1E3A5F] flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-3 bg-white flex items-center justify-center border-b border-[#E2E8F0]" style={{ minHeight: 72 }}>
        <ImageWithFallback src={logoImage} alt="IknowVate Logo" className="h-14 w-auto object-contain" />
      </div>

      {/* User info */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center shrink-0">
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.65rem' }}>{initials}</Typography>
        </div>
        <div className="min-w-0">
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, display: 'block', fontSize: '0.75rem' }} className="truncate">
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
            {ROLE_LABELS[userRole]}
          </Typography>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-left transition-colors ${
                isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <Typography variant="caption" sx={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 400, color: 'inherit', lineHeight: 1 }}>
                {item.label}
              </Typography>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <Typography variant="caption" sx={{ fontSize: '0.78rem', color: 'inherit' }}>Log Out</Typography>
        </button>
        <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.6rem', px: 1, display: 'block', mt: 1 }}>
          Joveinvi Techne © 2026
        </Typography>
      </div>
    </div>
  );
}
