import { Typography, Box, Card, CardContent, CardActions, Button, Chip, LinearProgress, Alert } from '@mui/material';
import { Bot, FileText, GitMerge, Clock, Search, Bell } from 'lucide-react';

type Plan = 'free' | 'pro' | 'pro_plus';

interface IndividualDashboardProps {
  userName: string;
  plan: Plan;
  onNavigate: (page: string) => void;
}

const SUBJECTS = [
  {
    code: 'MNTSDEV',
    name: 'Systems Analysis and Design',
    term: 'AY 2026–2027 T1',
    weekCovered: 4,
    totalWeeks: 16,
  },
  {
    code: 'WEBPROG',
    name: 'Web Programming',
    term: 'AY 2026–2027 T1',
    weekCovered: 6,
    totalWeeks: 16,
  },
  {
    code: 'DBMS101',
    name: 'Database Management Systems',
    term: 'AY 2026–2027 T1',
    weekCovered: 3,
    totalWeeks: 16,
  },
  {
    code: 'ALGODES',
    name: 'Algorithms and Data Structures',
    term: 'AY 2026–2027 T1',
    weekCovered: 5,
    totalWeeks: 16,
  },
];

const RECENT_ACTIVITY = [
  { text: 'You committed v1.2 of MNTSDEV Syllabus', time: '2 hours ago' },
  { text: 'New pull request on WEBPROG Lesson Plan from J. Lopez', time: '5 hours ago' },
  { text: 'DBMS101 AI Session — 12 queries processed', time: 'Yesterday' },
  { text: 'You forked "Intro to OOP Roadmap" from S. Chen', time: '2 days ago' },
  { text: 'ALGODES Week 5 topic updated', time: '3 days ago' },
];

export default function IndividualDashboard({ userName, plan, onNavigate }: IndividualDashboardProps) {
  const firstName = userName.split(' ')[0];
  const isFreeTier = plan === 'free';

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
          Good morning, {firstName} 👋
        </Typography>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg px-3 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-[#718096]" />
            <input
              placeholder="Search your library..."
              className="bg-transparent text-sm text-[#1A202C] outline-none flex-1 placeholder-[#718096]"
            />
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-[#718096]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E63946]" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Free tier limit warning */}
        {isFreeTier && (
          <Alert severity="warning" sx={{ borderRadius: '8px', mb: 4 }}>
            You are on the <strong>Free tier</strong> — 3 of 3 lesson plans used. Upgrade to Pro for unlimited plans.
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3A5F' }}>2</Typography>
                  <Typography variant="body2" sx={{ color: '#718096', mt: 0.5 }}>Active Sessions</Typography>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#1E3A5F]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: isFreeTier ? '#D69E2E' : '#1E3A5F' }}>
                    {isFreeTier ? '3 of 3' : '4'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096', mt: 0.5 }}>Lesson Plans</Typography>
                  {isFreeTier && (
                    <Typography variant="caption" sx={{ color: '#D69E2E' }}>Free tier limit reached</Typography>
                  )}
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#1E3A5F]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E3A5F' }}>1</Typography>
                  <Typography variant="body2" sx={{ color: '#718096', mt: 0.5 }}>Pending Pull Requests</Typography>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center">
                  <GitMerge className="w-5 h-5 text-[#1E3A5F]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Subjects This Term */}
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>My Subjects This Term</Typography>
          <Button
            variant="contained" size="small"
            onClick={() => onNavigate('lesson-plans')}
            sx={{ bgcolor: '#1E3A5F', textTransform: 'none', borderRadius: '8px', '&:hover': { bgcolor: '#162d4a' } }}
          >
            + New Lesson Plan
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {SUBJECTS.map(sub => (
            <Card key={sub.code} sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }} className="hover:shadow-sm transition-shadow">
              <CardContent className="pb-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3A5F' }}>{sub.code}</Typography>
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>{sub.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#718096' }}>{sub.term}</Typography>
                  </div>
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <Typography variant="caption" sx={{ color: '#718096' }}>
                    Roadmap completion
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#1E3A5F', fontWeight: 600 }}>
                    Week {sub.weekCovered} of {sub.totalWeeks}
                  </Typography>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={(sub.weekCovered / sub.totalWeeks) * 100}
                  sx={{
                    height: 6, borderRadius: 3,
                    bgcolor: '#EBF0F8',
                    '& .MuiLinearProgress-bar': { bgcolor: '#1E3A5F', borderRadius: 3 }
                  }}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small" onClick={() => onNavigate('ai-session')}
                  sx={{ textTransform: 'none', color: '#1E3A5F', fontSize: '0.75rem' }}
                >
                  Open AI Session
                </Button>
                <Button
                  size="small" onClick={() => onNavigate('lesson-plans')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  View Lesson Plan
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C', mb: 2 }}>Recent Activity</Typography>
        <Card sx={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-5 py-3.5 ${i !== RECENT_ACTIVITY.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-[#1E3A5F] shrink-0" />
              <Typography variant="body2" sx={{ flex: 1, color: '#4A5568' }}>{item.text}</Typography>
              <Typography variant="caption" sx={{ color: '#718096', shrink: 0 }}>{item.time}</Typography>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
