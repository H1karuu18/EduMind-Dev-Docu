import { useState } from 'react';
import { Typography, Tabs, Tab, Chip, Button, Box } from '@mui/material';
import { GitMerge, ArrowRight } from 'lucide-react';

const INCOMING = [
  {
    id: '1', doc: 'MNTSDEV T1 Lesson Plan', version: 'v1.2',
    proposer: 'J. Lopez', initials: 'JL',
    summary: 'Updated 3 learning objectives and added Week 6 activity — Group Case Study on Agile Sprint Planning.',
    time: '2 hours ago',
  },
  {
    id: '2', doc: 'WEBPROG Week 5 Lab Guide', version: 'v1.0',
    proposer: 'M. Cruz', initials: 'MC',
    summary: 'Added responsive design checklist and updated Bootstrap 5 reference examples.',
    time: '1 day ago',
  },
];

const OUTGOING = [
  {
    id: '1', doc: 'DBMS101 Reference List', version: 'v1.1',
    owner: 'Dr. A. Santos', initials: 'AS',
    summary: 'Updated 2 references with newer editions (2023 and 2024).',
    time: '3 days ago', status: 'Pending',
  },
  {
    id: '2', doc: 'ALGODES Problem Set', version: 'v2.0',
    owner: 'Prof. R. Lim', initials: 'RL',
    summary: 'Added 5 new dynamic programming problems with solutions.',
    time: '1 week ago', status: 'Merged',
  },
  {
    id: '3', doc: 'CS101 Intro Roadmap', version: 'v1.3',
    owner: 'Dr. B. Reyes', initials: 'BR',
    summary: 'Restructured Week 1-3 to introduce Python syntax earlier.',
    time: '2 weeks ago', status: 'Declined',
  },
];

const STATUS_COLORS: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
  Pending: 'warning',
  Merged: 'success',
  Declined: 'error',
};

export default function CollaborationsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <div className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
          <span>Dashboard</span><ArrowRight className="w-3 h-3" /><span className="text-[#1A202C] font-medium">Collaborations</span>
        </div>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>Collaborations</Typography>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-6">
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: '1px solid #E2E8F0', mb: 4,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#1E3A5F' },
            '& .MuiTabs-indicator': { backgroundColor: '#1E3A5F' }
          }}
        >
          <Tab label={`Incoming Requests (${INCOMING.length})`} />
          <Tab label={`My Requests (${OUTGOING.length})`} />
        </Tabs>

        {tab === 0 && (
          <div className="space-y-4">
            {INCOMING.map(pr => (
              <div key={pr.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-[#1E3A5F]" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A202C' }}>
                      {pr.doc}
                    </Typography>
                    <Chip label={pr.version} size="small" variant="outlined" />
                  </div>
                  <Typography variant="caption" sx={{ color: '#718096' }}>{pr.time}</Typography>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#1E3A5F] flex items-center justify-center">
                    <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>
                      {pr.initials}
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>
                    <strong>{pr.proposer}</strong> proposed changes:
                  </Typography>
                </div>
                <div className="bg-[#F8F9FA] rounded-lg p-3 mb-4 border border-[#E2E8F0]">
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>{pr.summary}</Typography>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small" variant="outlined"
                    sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#1E3A5F', color: '#1E3A5F', minHeight: 44, fontSize: '0.75rem' }}
                  >
                    Review Changes
                  </Button>
                  <Button
                    size="small" variant="contained" color="success"
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, fontSize: '0.75rem' }}
                  >
                    Merge
                  </Button>
                  <Button
                    size="small" variant="outlined" color="error"
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, fontSize: '0.75rem' }}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-4">
            {OUTGOING.map(pr => (
              <div key={pr.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-[#718096]" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A202C' }}>
                      {pr.doc}
                    </Typography>
                    <Chip label={pr.version} size="small" variant="outlined" />
                    <Chip label={pr.status} size="small" color={STATUS_COLORS[pr.status]} />
                  </div>
                  <Typography variant="caption" sx={{ color: '#718096' }}>{pr.time}</Typography>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#718096] flex items-center justify-center">
                    <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>
                      {pr.initials}
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>
                    Sent to <strong>{pr.owner}</strong>
                  </Typography>
                </div>
                <div className="bg-[#F8F9FA] rounded-lg p-3 border border-[#E2E8F0]">
                  <Typography variant="body2" sx={{ color: '#4A5568' }}>{pr.summary}</Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
