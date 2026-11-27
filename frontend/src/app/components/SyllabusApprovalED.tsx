import { useState } from 'react';
import {
  Paper, Typography, Box, Chip, Button, TextField, Alert,
  MenuItem, Select, Divider
} from '@mui/material';
import { FileText, Lock, RotateCcw, CheckCircle } from 'lucide-react';

const VERSION_HISTORY = [
  { version: 'v1.0', actor: 'Submitted by Dr. Juan Dela Cruz', time: '2026-05-15 09:00 AM', status: 'Submitted' },
  { version: 'v1.1', actor: 'Revised by Dr. Juan Dela Cruz', time: '2026-05-18 02:30 PM', status: 'Revised' },
  { version: 'v1.1', actor: 'Peer Approved by Dr. Ana Reyes', time: '2026-05-19 11:00 AM', status: 'Peer Approved' },
  { version: 'v1.1', actor: 'Peer Approved by Dr. Juan Dela Cruz', time: '2026-05-20 10:00 AM', status: 'Peer Approved' },
];

const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  Submitted: 'info',
  Revised: 'warning',
  'Peer Approved': 'success',
  'ED Approved': 'success',
  Locked: 'default',
};

export default function SyllabusApprovalED() {
  const [version, setVersion] = useState('v1.1');
  const [edComment, setEdComment] = useState('');
  const [actionTaken, setActionTaken] = useState<'approved' | 'returned' | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Syllabus Approval — Executive Director</Typography>
        <Typography variant="body2" className="text-gray-500">
          CS301 — Database Management Systems
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ borderRadius: 0, px: 8 }}>
        This action is final. Approved versions are locked and logged.
      </Alert>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left — Document Preview */}
          <Paper sx={{ borderRadius: '8px', p: 4 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Document Preview</Typography>
                <Typography variant="body2" className="text-gray-500">CS301 — Database Management Systems</Typography>
              </div>
              <Select size="small" value={version} onChange={e => setVersion(e.target.value)} sx={{ minWidth: 90 }}>
                <MenuItem value="v1.0">v1.0</MenuItem>
                <MenuItem value="v1.1">v1.1</MenuItem>
              </Select>
            </div>

            <Box
              className="bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200 mb-6"
              sx={{ minHeight: 320 }}
            >
              <FileText className="w-16 h-16 text-gray-300 mb-3" />
              <Typography variant="body2" className="text-gray-400">
                CS301_Syllabus_{version}.pdf
              </Typography>
              <Typography variant="caption" className="text-gray-300 mt-1">
                Document preview placeholder
              </Typography>
            </Box>

            {/* Version History Timeline */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Version History</Typography>
            <div className="space-y-3">
              {VERSION_HISTORY.map((entry, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0" />
                    {index !== VERSION_HISTORY.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Chip label={entry.version} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                      <Chip
                        label={entry.status}
                        size="small"
                        color={STATUS_COLORS[entry.status] || 'default'}
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                    </div>
                    <Typography variant="caption" className="text-gray-600 block">{entry.actor}</Typography>
                    <Typography variant="caption" className="text-gray-400">{entry.time}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Paper>

          {/* Right — Approval Panel */}
          <Paper sx={{ borderRadius: '8px', p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Approval Panel</Typography>

            <Box className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#16a34a' }}>
                  Peer Review Status: Approved by all co-faculty
                </Typography>
              </div>
              <Typography variant="caption" className="text-green-700">
                Dr. Juan Dela Cruz and Dr. Ana Reyes both approved on 2026-05-20.
              </Typography>
            </Box>

            {actionTaken ? (
              <Alert
                severity={actionTaken === 'approved' ? 'success' : 'warning'}
                sx={{ borderRadius: '8px', mb: 3 }}
              >
                {actionTaken === 'approved'
                  ? 'Syllabus approved and locked. Version v1.1 is now the official current version.'
                  : 'Syllabus returned for revision. The faculty member has been notified.'}
              </Alert>
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Executive Director Comments
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Add comments or feedback for the faculty member..."
                  value={edComment}
                  onChange={e => setEdComment(e.target.value)}
                  sx={{ mb: 4 }}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Lock className="w-5 h-5" />}
                    onClick={() => setActionTaken('approved')}
                    sx={{ textTransform: 'none', borderRadius: '8px', py: 1.75, minHeight: 44 }}
                  >
                    Approve and Lock Version
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="large"
                    startIcon={<RotateCcw className="w-5 h-5" />}
                    onClick={() => setActionTaken('returned')}
                    sx={{ textTransform: 'none', borderRadius: '8px', py: 1.75, minHeight: 44 }}
                  >
                    Return for Revision
                  </Button>
                </div>
              </>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
}
