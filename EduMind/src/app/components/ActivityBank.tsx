import { useState } from 'react';
import {
  TextField, Button, Typography, Paper, Box, Chip,
  MenuItem, Select, FormControl, InputLabel, InputAdornment
} from '@mui/material';
import { Search, FileText, Upload, Eye } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  subject: string;
  type: string;
  uploader: string;
  date: string;
}

const ACTIVITIES: Activity[] = [
  { id: '1', title: 'ER Diagram Practice Set', subject: 'CS301', type: 'Activity', uploader: 'Dr. Dela Cruz', date: '2026-05-15' },
  { id: '2', title: 'Week 3 Sorting Quiz', subject: 'CS201', type: 'Quiz', uploader: 'Prof. Reyes', date: '2026-05-10' },
  { id: '3', title: 'HTML/CSS Mini Project Brief', subject: 'CS205', type: 'Project', uploader: 'Prof. Cruz', date: '2026-05-08' },
  { id: '4', title: 'Algorithm Analysis Worksheet', subject: 'CS201', type: 'Worksheet', uploader: 'Prof. Reyes', date: '2026-05-05' },
  { id: '5', title: 'Network Topology Case Study', subject: 'CS305', type: 'Case Study', uploader: 'Dr. Mendoza', date: '2026-05-03' },
  { id: '6', title: 'SE Design Patterns Lecture Notes', subject: 'CS401', type: 'Notes', uploader: 'Dr. Santos', date: '2026-04-28' },
  { id: '7', title: 'Python Basics Assessment', subject: 'CS101', type: 'Assessment', uploader: 'Dr. Dela Cruz', date: '2026-04-25' },
  { id: '8', title: 'SQL Join Exercises', subject: 'CS301', type: 'Activity', uploader: 'Dr. Dela Cruz', date: '2026-04-20' },
  { id: '9', title: 'Agile Retrospective Worksheet', subject: 'CS401', type: 'Worksheet', uploader: 'Dr. Santos', date: '2026-04-18' },
];

const TYPE_COLORS: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'default'> = {
  Quiz: 'warning',
  Activity: 'primary',
  Project: 'success',
  Worksheet: 'info',
  'Case Study': 'secondary',
  Notes: 'default',
  Assessment: 'warning',
};

export default function ActivityBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = ACTIVITIES.filter(a => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = subjectFilter === 'All' || a.subject === subjectFilter;
    const matchType = typeFilter === 'All' || a.type === typeFilter;
    return matchSearch && matchSubject && matchType;
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Activity Bank</Typography>
            <Typography variant="body2" className="text-gray-500">
              Shared resources within SOCIT
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<Upload className="w-4 h-4" />}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
          >
            Contribute to Activity Bank
          </Button>
        </div>
      </Box>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Search and Filters */}
        <Paper sx={{ borderRadius: '8px', p: 4, mb: 6 }}>
          <TextField
            fullWidth
            placeholder="Search activities, quizzes, or materials..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-5 h-5 text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <div className="flex gap-3">
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Subject</InputLabel>
              <Select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} label="Subject">
                <MenuItem value="All">All Subjects</MenuItem>
                {['CS101', 'CS201', 'CS301', 'CS401', 'CS205', 'CS305'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Document Type</InputLabel>
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} label="Document Type">
                <MenuItem value="All">All Types</MenuItem>
                {['Quiz', 'Activity', 'Project', 'Worksheet', 'Case Study', 'Notes', 'Assessment'].map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={() => { setSearchQuery(''); setSubjectFilter('All'); setTypeFilter('All'); }}
              sx={{ textTransform: 'none' }}
            >
              Clear Filters
            </Button>
          </div>
        </Paper>

        {/* Results count */}
        <Typography variant="body2" className="text-gray-500 mb-4">
          Showing {filtered.length} of {ACTIVITIES.length} activities
        </Typography>

        {/* Activity Card Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(activity => (
            <Paper key={activity.id} sx={{ borderRadius: '8px', p: 3 }} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }} className="truncate">
                    {activity.title}
                  </Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip label={activity.subject} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                    <Chip
                      label={activity.type}
                      size="small"
                      color={TYPE_COLORS[activity.type] || 'default'}
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <Typography variant="caption" className="text-gray-500 block">
                  Uploaded by {activity.uploader}
                </Typography>
                <Typography variant="caption" className="text-gray-400 block">
                  {activity.date}
                </Typography>
              </div>

              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Eye className="w-3 h-3" />}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1, minHeight: 44, borderRadius: '8px' }}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1, minHeight: 44, borderRadius: '8px' }}
                >
                  Use This
                </Button>
              </div>
            </Paper>
          ))}
        </div>

        {filtered.length === 0 && (
          <Box className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <Typography variant="body1" className="text-gray-500">
              No activities found matching your search.
            </Typography>
          </Box>
        )}

        <Box className="mt-8 text-center">
          <Typography variant="caption" className="text-gray-400">
            Activities are shared within SOCIT only.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
