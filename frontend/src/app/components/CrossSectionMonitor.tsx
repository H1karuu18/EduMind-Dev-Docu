import { useState } from 'react';
import { Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import { ArrowRight, Flag, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SECTIONS = [
  { section: 'A', faculty: 'Dr. Juan Dela Cruz', currentWeek: 6, expectedWeek: 6, status: 'on-track', lastUpdated: 'Today' },
  { section: 'B', faculty: 'Prof. Jane Santos', currentWeek: 4, expectedWeek: 6, status: 'behind', lastUpdated: '3 days ago' },
  { section: 'C', faculty: 'Dr. Mark Reyes', currentWeek: 7, expectedWeek: 6, status: 'ahead', lastUpdated: 'Yesterday' },
  { section: 'D', faculty: 'Prof. Lisa Tan', currentWeek: 6, expectedWeek: 6, status: 'on-track', lastUpdated: 'Today' },
];

const CHART_DATA = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  'Section A': i < 6 ? 1 : 0,
  'Section B': i < 4 ? 1 : 0,
  'Section C': i < 7 ? 1 : 0,
  'Section D': i < 6 ? 1 : 0,
}));

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'info' | 'error'; badge: string }> = {
  'on-track': { label: '✅ On Track', color: 'success', badge: 'On Track' },
  'behind': { label: '⚠️ 2 Weeks Behind', color: 'warning', badge: 'Behind' },
  'ahead': { label: '✅ Slightly Ahead', color: 'info', badge: 'Ahead' },
};

export default function CrossSectionMonitor() {
  const [flagOpen, setFlagOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [message, setMessage] = useState('');

  const openFlag = (section: string) => {
    setSelectedSection(section);
    setFlagOpen(true);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <div className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
          <span>Dashboard</span><ArrowRight className="w-3 h-3" />
          <span className="text-[#1A202C] font-medium">Cross-Section Monitor</span>
        </div>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>
          Cross-Section Delivery Alignment Monitor
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096' }}>
          MNTSDEV — T1 AY 2026–2027 — Cross-Section Delivery Progress
        </Typography>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
                {['Section', 'Faculty', 'Current Week Covered', 'Expected Week', 'Status', 'Last Updated', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((row, i) => (
                <tr key={row.section} className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'} hover:bg-[#F0F5FF]`}>
                  <td className="px-5 py-4">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A5F' }}>
                      Section {row.section}
                    </Typography>
                  </td>
                  <td className="px-5 py-4">
                    <Typography variant="body2" sx={{ color: '#4A5568' }}>{row.faculty}</Typography>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center gap-1">
                      <div className="flex-1 bg-[#E2E8F0] rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(row.currentWeek / 16) * 100}%`,
                            backgroundColor: row.status === 'behind' ? '#D69E2E' : '#1E3A5F',
                          }}
                        />
                      </div>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3A5F', ml: 1, whiteSpace: 'nowrap' }}>
                        Week {row.currentWeek}
                      </Typography>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Typography variant="body2" sx={{ color: '#718096' }}>Week {row.expectedWeek}</Typography>
                  </td>
                  <td className="px-5 py-4">
                    <Chip
                      label={STATUS_CONFIG[row.status].badge}
                      size="small"
                      color={STATUS_CONFIG[row.status].color}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Typography variant="caption" sx={{ color: '#718096' }}>{row.lastUpdated}</Typography>
                  </td>
                  <td className="px-5 py-4">
                    {row.status === 'behind' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<Flag className="w-3.5 h-3.5" />}
                        onClick={() => openFlag(row.section)}
                        sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 36, fontSize: '0.75rem' }}
                      >
                        Flag
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-[#1E3A5F]" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C' }}>
              Weekly Progress by Section
            </Typography>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barSize={12} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} domain={[0, 1]} hide />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Section A" fill="#1E3A5F" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Section B" fill="#D69E2E" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Section C" fill="#38A169" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Section D" fill="#6B46C1" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Flag Modal */}
      <Dialog open={flagOpen} onClose={() => setFlagOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Flag Misalignment — Section {selectedSection}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
            An automated notification will be sent to the faculty member and the Executive Director.
          </Typography>
          <TextField
            fullWidth multiline rows={4}
            label="Message (optional)"
            placeholder="Add context about the misalignment..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setFlagOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained" color="warning"
            onClick={() => setFlagOpen(false)}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
          >
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
