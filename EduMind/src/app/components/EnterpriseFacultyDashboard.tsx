import { Card, CardContent, CardActions, Button, Typography, Box, Chip, Alert } from '@mui/material';
import { Clock, AlertCircle, Star, Bell, Search, Monitor } from 'lucide-react';

interface EnterpriseFacultyDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const SUBJECTS = [
  { code: 'MNTSDEV', name: 'Systems Analysis and Design', term: 'T1 AY 2026–2027', section: 'A', submissionStatus: 'In Review' },
  { code: 'CS201', name: 'Data Structures and Algorithms', term: 'T1 AY 2026–2027', section: 'B', submissionStatus: 'Approved' },
  { code: 'CS301', name: 'Database Management Systems', term: 'T1 AY 2026–2027', section: 'A', submissionStatus: 'Draft' },
  { code: 'CS401', name: 'Software Engineering', term: 'T1 AY 2026–2027', section: 'C', submissionStatus: 'Submitted' },
];

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'success' | 'info' | 'error'> = {
  Draft: 'default', Submitted: 'info', 'In Review': 'warning', Approved: 'success', Returned: 'error',
};

const RECENT_ACTIVITY = [
  { text: 'You submitted MNTSDEV syllabus for peer review.', time: '2026-09-21 10:32 AM' },
  { text: 'Dr. Reyes approved your CS201 peer review.', time: '2026-09-21 09:15 AM' },
  { text: 'New recommendation added for CS301 — Week 4.', time: '2026-09-20 04:00 PM' },
  { text: 'CS401 syllabus returned for revision by ED.', time: '2026-09-20 02:45 PM' },
];

export default function EnterpriseFacultyDashboard({ userName, onNavigate }: EnterpriseFacultyDashboardProps) {
  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
          Good morning, {userName}
        </Typography>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg px-3 py-2 gap-2 w-56">
            <Search className="w-4 h-4 text-[#718096]" />
            <input placeholder="Search..." className="bg-transparent text-sm outline-none flex-1 placeholder-[#718096]" />
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-[#718096]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E63946] flex items-center justify-center">
              <Typography variant="caption" sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>2</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Alert banner */}
        <Alert severity="warning" sx={{ borderRadius: '8px', mb: 4 }}>
          <strong>2 syllabi require your peer review</strong> — due in 3 days.{' '}
          <button onClick={() => onNavigate('peer-review')} className="underline text-[#744210]">Review now</button>
        </Alert>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Peer Reviews', value: 2, color: '#D69E2E', icon: AlertCircle, action: () => onNavigate('peer-review') },
            { label: 'Syllabi Approved', value: 1, color: '#38A169', icon: Star, action: () => onNavigate('my-syllabi') },
            { label: 'Syllabi Pending', value: 2, color: '#2B6CB0', icon: Clock, action: () => onNavigate('my-syllabi') },
            { label: 'Cross-Section Alert', value: 1, color: '#E63946', icon: Monitor, action: () => onNavigate('cross-section') },
          ].map(card => {
            const Icon = card.icon;
            return (
              <Card key={card.label} sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <CardContent sx={{ pb: 1 }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: card.color }}>{card.value}</Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>{card.label}</Typography>
                    </div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                    </div>
                  </div>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button size="small" onClick={card.action} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>View</Button>
                </CardActions>
              </Card>
            );
          })}
        </div>

        {/* Upcoming Deadline banner */}
        <div className="bg-[#EBF0F8] border border-[#1E3A5F]/20 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#1E3A5F]" />
          <Typography variant="body2" sx={{ color: '#1E3A5F' }}>
            <strong>Upcoming Deadline:</strong> T1 Syllabus Submission — 5 days remaining
          </Typography>
        </div>

        {/* My Subjects */}
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>My Subjects This Term</Typography>
          <Button
            variant="contained" size="small"
            onClick={() => onNavigate('submit-syllabus')}
            sx={{ bgcolor: '#1E3A5F', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#162d4a' } }}
          >
            Submit New Syllabus
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SUBJECTS.map(sub => (
            <Card key={sub.code} sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <CardContent className="pb-2">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3A5F' }}>{sub.code}</Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>{sub.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#718096' }}>{sub.term} · Section {sub.section}</Typography>
                  </div>
                  <Chip label={sub.submissionStatus} size="small" color={STATUS_COLORS[sub.submissionStatus]} />
                </div>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => onNavigate('ai-session')} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>Open AI Session</Button>
                <Button size="small" onClick={() => onNavigate('my-syllabi')} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>View Syllabus</Button>
              </CardActions>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Activity</Typography>
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i !== RECENT_ACTIVITY.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-[#1E3A5F] shrink-0" />
              <Typography variant="body2" sx={{ flex: 1, color: '#4A5568' }}>{item.text}</Typography>
              <Typography variant="caption" sx={{ color: '#718096' }}>{item.time}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
