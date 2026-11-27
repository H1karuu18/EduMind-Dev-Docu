import { Paper, Typography, Box, Chip, Button, Breadcrumbs, Link } from '@mui/material';
import { Download, Lock } from 'lucide-react';

interface VersionEntry {
  version: string;
  actor: string;
  actorName: string;
  timestamp: string;
  summary: string;
  status: 'Submitted' | 'Revised' | 'Peer Approved' | 'ED Approved' | 'Locked';
  isCurrent?: boolean;
}

const VERSION_ENTRIES: VersionEntry[] = [
  {
    version: 'v1.0',
    actor: 'Submitted by',
    actorName: 'Dr. Juan Dela Cruz',
    timestamp: '2026-05-10 09:00 AM',
    summary: 'Initial submission of CS301 syllabus for 1st Semester 2025-2026.',
    status: 'Submitted',
  },
  {
    version: 'v1.0',
    actor: 'Peer Approved by',
    actorName: 'Dr. Ana Reyes',
    timestamp: '2026-05-12 02:15 PM',
    summary: 'Peer review completed. Minor recommendations noted in comments.',
    status: 'Peer Approved',
  },
  {
    version: 'v1.1',
    actor: 'Revised by',
    actorName: 'Dr. Juan Dela Cruz',
    timestamp: '2026-05-15 11:30 AM',
    summary: 'Updated Week 7 topics per CMO alignment. Fixed formatting on pages 3 and 5.',
    status: 'Revised',
  },
  {
    version: 'v1.1',
    actor: 'Peer Approved by',
    actorName: 'Dr. Ana Reyes',
    timestamp: '2026-05-18 10:00 AM',
    summary: 'Revisions accepted. Approved for ED review.',
    status: 'Peer Approved',
  },
  {
    version: 'v1.1',
    actor: 'Peer Approved by',
    actorName: 'Dr. Juan Dela Cruz',
    timestamp: '2026-05-18 03:45 PM',
    summary: 'Co-faculty approval confirmed.',
    status: 'Peer Approved',
  },
  {
    version: 'v1.1',
    actor: 'ED Approved by',
    actorName: 'Dr. Maria Santos',
    timestamp: '2026-05-20 04:00 PM',
    summary: 'Final approval granted. Syllabus locked for distribution.',
    status: 'ED Approved',
    isCurrent: true,
  },
  {
    version: 'v1.1',
    actor: 'Locked by',
    actorName: 'System',
    timestamp: '2026-05-20 04:01 PM',
    summary: 'Version locked and archived. No further edits allowed.',
    status: 'Locked',
  },
];

const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  Submitted: 'info',
  Revised: 'warning',
  'Peer Approved': 'success',
  'ED Approved': 'success',
  Locked: 'default',
};

const STATUS_DOT: Record<string, string> = {
  Submitted: 'bg-blue-400',
  Revised: 'bg-amber-400',
  'Peer Approved': 'bg-green-400',
  'ED Approved': 'bg-green-600',
  Locked: 'bg-gray-400',
};

export default function VersionHistory() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <Breadcrumbs sx={{ mb: 0.5 }}>
          <Link underline="hover" color="inherit" href="#" sx={{ cursor: 'pointer' }}>My Syllabi</Link>
          <Typography color="text.primary">Version History</Typography>
        </Breadcrumbs>
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Version History & Audit Trail</Typography>
            <Typography variant="body2" className="text-gray-500">
              CS301 — Database Management Systems · 1st Semester 2025-2026
            </Typography>
          </div>
          <Button
            variant="outlined"
            startIcon={<Download className="w-4 h-4" />}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
          >
            Export Audit Log
          </Button>
        </div>
      </Box>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-0">
            {VERSION_ENTRIES.map((entry, index) => (
              <div key={index} className="flex gap-6 pb-8 relative">
                {/* Dot */}
                <div className={`w-3 h-3 rounded-full ${STATUS_DOT[entry.status]} mt-2 shrink-0 z-10 relative ml-[18px]`} />

                {/* Content */}
                <Paper
                  sx={{
                    borderRadius: '8px',
                    p: 3,
                    flex: 1,
                    border: entry.isCurrent ? '2px solid #16a34a' : '1px solid #e5e7eb',
                    bgcolor: entry.isCurrent ? '#f0fdf4' : 'white',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip
                        label={entry.version}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={entry.status}
                        size="small"
                        color={STATUS_COLORS[entry.status]}
                      />
                      {entry.isCurrent && (
                        <Chip
                          label="Current Version"
                          size="small"
                          color="success"
                          variant="filled"
                          icon={<Lock className="w-3 h-3" />}
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </div>
                    <Typography variant="caption" className="text-gray-400 shrink-0 ml-2">
                      {entry.timestamp}
                    </Typography>
                  </div>

                  <Typography variant="body2" className="text-gray-700 mb-1">
                    <span className="text-gray-500">{entry.actor}</span>{' '}
                    <span className="font-medium">{entry.actorName}</span>
                  </Typography>

                  <Typography variant="body2" className="text-gray-600">
                    {entry.summary}
                  </Typography>
                </Paper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
