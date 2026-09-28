import { Card, CardContent, CardActions, Button, Typography, Paper, Box, Chip } from '@mui/material';
import { Clock, BookOpen, AlertCircle, Star } from 'lucide-react';

interface FacultyDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const SUBJECTS = [
  { code: 'CS101', name: 'Introduction to Programming', term: '1st Sem 2025-2026', section: 'A' },
  { code: 'CS201', name: 'Data Structures and Algorithms', term: '1st Sem 2025-2026', section: 'B' },
  { code: 'CS301', name: 'Database Management Systems', term: '1st Sem 2025-2026', section: 'A' },
  { code: 'CS401', name: 'Software Engineering', term: '1st Sem 2025-2026', section: 'C' },
  { code: 'CS205', name: 'Web Development', term: '1st Sem 2025-2026', section: 'A' },
  { code: 'CS305', name: 'Computer Networks', term: '1st Sem 2025-2026', section: 'B' },
];

const RECENT_ACTIVITY = [
  { time: '2026-05-21 10:32 AM', action: 'You submitted CS301 syllabus for peer review.' },
  { time: '2026-05-21 09:15 AM', action: 'Dr. Reyes approved your CS201 peer review.' },
  { time: '2026-05-20 04:00 PM', action: 'New recommendation added for CS101 — Week 4.' },
  { time: '2026-05-20 02:45 PM', action: 'CS401 syllabus returned for revision by ED.' },
  { time: '2026-05-19 11:00 AM', action: 'You uploaded materials to CS305 AI Session.' },
];

export default function FacultyDashboard({ userName, onNavigate }: FacultyDashboardProps) {
  const firstName = userName.split(' ')[userName.split(' ').length - 1];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top greeting bar */}
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Good morning, {userName}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Faculty Member — School of Computing and Information Technologies, APC
        </Typography>
      </Box>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>2</Typography>
                  <Typography variant="body2" className="text-gray-600 mt-1">Pending Peer Reviews</Typography>
                  <Typography variant="caption" className="text-gray-400">Awaiting your action</Typography>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-400 mt-1" />
              </div>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onNavigate('peer-review')} sx={{ textTransform: 'none' }}>
                View Reviews
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>3</Typography>
                  <Typography variant="body2" className="text-gray-600 mt-1">Upcoming Syllabus Deadlines</Typography>
                  <Typography variant="caption" className="text-gray-400">Within the next 7 days</Typography>
                </div>
                <Clock className="w-8 h-8 text-red-400 mt-1" />
              </div>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onNavigate('my-syllabi')} sx={{ textTransform: 'none' }}>
                View Deadlines
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ borderRadius: '8px' }}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>5</Typography>
                  <Typography variant="body2" className="text-gray-600 mt-1">New Recommendations</Typography>
                  <Typography variant="caption" className="text-gray-400">AI-generated for your subjects</Typography>
                </div>
                <Star className="w-8 h-8 text-purple-400 mt-1" />
              </div>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onNavigate('recommendations')} sx={{ textTransform: 'none' }}>
                See Recommendations
              </Button>
            </CardActions>
          </Card>
        </div>

        {/* My Subjects This Term */}
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            My Subjects This Term
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => onNavigate('submit-syllabus')}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Submit New Syllabus
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {SUBJECTS.map((subject) => (
            <Card key={subject.code} sx={{ borderRadius: '8px' }} className="hover:shadow-md transition-shadow">
              <CardContent className="pb-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{subject.code}</Typography>
                    <Typography variant="body2" className="text-gray-600">{subject.name}</Typography>
                  </div>
                  <Chip label={`Sec ${subject.section}`} size="small" variant="outlined" />
                </div>
                <Typography variant="caption" className="text-gray-400">{subject.term}</Typography>
              </CardContent>
              <CardActions className="pt-0">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onNavigate('ai-session')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Open Session
                </Button>
                <Button
                  size="small"
                  onClick={() => onNavigate('my-syllabi')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  View Syllabus
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Activity
        </Typography>
        <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          {RECENT_ACTIVITY.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 px-6 py-4 ${index !== RECENT_ACTIVITY.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
              <div className="flex-1">
                <Typography variant="body2">{item.action}</Typography>
                <Typography variant="caption" className="text-gray-400">{item.time}</Typography>
              </div>
            </div>
          ))}
        </Paper>
      </div>
    </div>
  );
}
