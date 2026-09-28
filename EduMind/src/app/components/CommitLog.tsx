import { useState } from 'react';
import { Typography, Chip, Button, Box, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { ArrowRight, GitCommit, Eye, RotateCcw, X, Lock } from 'lucide-react';

interface Commit {
  version: string;
  message: string;
  author: string;
  initials: string;
  timestamp: string;
  status: 'active' | 'archived' | 'draft';
}

const COMMITS: Commit[] = [
  {
    version: 'v1.3', message: 'Updated Week 4 after class suspension — added makeup topic on Activity Diagrams',
    author: 'Sam Chen', initials: 'SC', timestamp: '2026-09-20 03:45 PM', status: 'active',
  },
  {
    version: 'v1.2', message: 'Added Week 3 quiz reference and updated learning objectives to SMART format',
    author: 'Sam Chen', initials: 'SC', timestamp: '2026-09-15 10:00 AM', status: 'archived',
  },
  {
    version: 'v1.1', message: 'Assessment weight fix — midterm changed from 30% to 25%, added lab component',
    author: 'Sam Chen', initials: 'SC', timestamp: '2026-09-10 02:20 PM', status: 'archived',
  },
  {
    version: 'v1.0', message: 'Initial commit — MNTSDEV Lesson Plan T1 AY 2026–2027',
    author: 'Sam Chen', initials: 'SC', timestamp: '2026-09-01 09:00 AM', status: 'archived',
  },
];

const STATUS_COLORS: Record<string, 'success' | 'default' | 'warning'> = {
  active: 'success',
  archived: 'default',
  draft: 'warning',
};

interface DiffEntry {
  type: 'removed' | 'added' | 'unchanged';
  text: string;
}

const DIFF_DATA: DiffEntry[] = [
  { type: 'unchanged', text: 'Week 3: Use Case Modeling' },
  { type: 'removed', text: 'Week 4: TBA' },
  { type: 'added', text: 'Week 4: Makeup Session: Activity Diagrams' },
  { type: 'unchanged', text: 'Week 5: Sequence Diagrams' },
  { type: 'removed', text: 'Midterm assessment weight: 30%' },
  { type: 'added', text: 'Midterm assessment weight: 25%' },
];

export default function CommitLog() {
  const [diffOpen, setDiffOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <div className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
          <span>Dashboard</span><ArrowRight className="w-3 h-3" />
          <span>Version History</span><ArrowRight className="w-3 h-3" />
          <span className="text-[#1A202C] font-medium">MNTSDEV Syllabus</span>
        </div>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>Version History — Commit Log</Typography>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-[#E2E8F0]" />

          {COMMITS.map((commit, index) => (
            <div key={commit.version} className="flex gap-5 pb-8 relative">
              <div className="w-11 flex justify-center shrink-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 relative mt-1 ${commit.status === 'active' ? 'bg-[#38A169]' : 'bg-[#E2E8F0]'}`}>
                  {commit.status === 'active'
                    ? <Lock className="w-2.5 h-2.5 text-white" />
                    : <GitCommit className="w-2.5 h-2.5 text-[#718096]" />
                  }
                </div>
              </div>

              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip
                      label={commit.version}
                      size="small"
                      sx={{ bgcolor: '#1E3A5F', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                    <Chip
                      label={commit.status === 'active' ? 'Active Version' : commit.status}
                      size="small"
                      color={STATUS_COLORS[commit.status]}
                    />
                  </div>
                  <Typography variant="caption" sx={{ color: '#718096', shrink: 0 }}>
                    {commit.timestamp}
                  </Typography>
                </div>

                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A202C', mb: 2 }}>
                  {commit.message}
                </Typography>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E3A5F] flex items-center justify-center">
                    <Typography variant="caption" sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>
                      {commit.initials}
                    </Typography>
                  </div>
                  <Typography variant="caption" sx={{ color: '#718096' }}>{commit.author}</Typography>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="small" variant="outlined"
                    startIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setDiffOpen(true)}
                    sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem', borderColor: '#E2E8F0', color: '#1E3A5F', minHeight: 36 }}
                  >
                    View Diff
                  </Button>
                  {commit.status !== 'active' && (
                    <Button
                      size="small" variant="outlined"
                      startIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem', borderColor: '#E2E8F0', color: '#718096', minHeight: 36 }}
                    >
                      Restore This Version
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff Modal */}
      <Dialog open={diffOpen} onClose={() => setDiffOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Diff — v1.2 → v1.3</span>
          <IconButton size="small" onClick={() => setDiffOpen(false)}>
            <X className="w-4 h-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="bg-[#F8F9FA] rounded-lg p-4 mb-4 border border-[#E2E8F0]">
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              <strong>Summary:</strong> Week 4 topic changed from "TBA" to "Makeup Session: Activity Diagrams." Assessment weight for midterm changed from 30% to 25%.
            </Typography>
          </Box>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#718096', display: 'block', mb: 2 }}>
                v1.2 — Previous
              </Typography>
              <div className="space-y-1 font-mono text-xs">
                {DIFF_DATA.map((line, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded"
                    style={{
                      backgroundColor: line.type === 'removed' ? '#FFF5F5' : '#F8F9FA',
                      color: line.type === 'removed' ? '#C53030' : '#4A5568',
                      textDecoration: line.type === 'added' ? 'none' : undefined,
                      display: line.type === 'added' ? 'none' : undefined,
                    }}
                  >
                    {line.type === 'removed' ? '− ' : '  '}{line.text}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#718096', display: 'block', mb: 2 }}>
                v1.3 — Current
              </Typography>
              <div className="space-y-1 font-mono text-xs">
                {DIFF_DATA.map((line, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded"
                    style={{
                      backgroundColor: line.type === 'added' ? '#F0FFF4' : '#F8F9FA',
                      color: line.type === 'added' ? '#276749' : '#4A5568',
                      display: line.type === 'removed' ? 'none' : undefined,
                    }}
                  >
                    {line.type === 'added' ? '+ ' : '  '}{line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
