import { useState } from 'react';
import {
  Paper, Typography, Button, TextField, Box, Chip, Alert,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { FileText, CheckCircle, RotateCcw } from 'lucide-react';

export default function PeerReviewScreen() {
  const [comment, setComment] = useState('');
  const [version, setVersion] = useState('v1.0');
  const [actionTaken, setActionTaken] = useState<'approved' | 'revision' | null>(null);

  const handleApprove = () => setActionTaken('approved');
  const handleRevision = () => setActionTaken('revision');

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Peer Review</Typography>
        <Typography variant="body2" className="text-gray-500">
          CS301 — Database Management Systems
        </Typography>
      </Box>

      <div className="max-w-7xl mx-auto px-8 py-6 h-[calc(100%-80px)]">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left — Document Preview */}
          <Paper sx={{ borderRadius: '8px', p: 4, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Syllabus Preview
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  CS301 — Database Management Systems
                </Typography>
              </div>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select value={version} onChange={e => setVersion(e.target.value)}>
                  <MenuItem value="v1.0">v1.0</MenuItem>
                  <MenuItem value="v1.1">v1.1</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Document placeholder */}
            <Box
              className="flex-1 bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200"
              sx={{ minHeight: 400 }}
            >
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <Typography variant="body2" className="text-gray-400">
                CS301_Syllabus_{version}.pdf
              </Typography>
              <Typography variant="caption" className="text-gray-300 mt-1">
                Document preview placeholder
              </Typography>
            </Box>
          </Paper>

          {/* Right — Review Panel */}
          <Paper sx={{ borderRadius: '8px', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Notification banner */}
            <Alert severity="info" sx={{ borderRadius: '8px' }}>
              You and 1 other faculty member handle this subject. Both approvals are required before ED review.
            </Alert>

            {/* Review from co-faculty */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Review from Dr. Ana Reyes
              </Typography>

              <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                <Typography variant="body2" className="text-gray-700">
                  "The learning outcomes section is well-structured. Please ensure Week 7 topics align with the
                  CMO requirements for database systems. Minor formatting issues on pages 3 and 5."
                </Typography>
              </Box>

              <div className="flex items-center gap-2 mb-4">
                <Chip
                  label={actionTaken ? (actionTaken === 'approved' ? 'Approved' : 'Revision Requested') : 'Pending Your Review'}
                  color={actionTaken === 'approved' ? 'success' : actionTaken === 'revision' ? 'warning' : 'default'}
                  size="small"
                />
              </div>

              {!actionTaken ? (
                <div className="flex gap-3 mb-4">
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={handleApprove}
                    sx={{ textTransform: 'none', borderRadius: '8px', flex: 1, py: 1.5, minHeight: 44 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleRevision}
                    sx={{ textTransform: 'none', borderRadius: '8px', flex: 1, py: 1.5, minHeight: 44 }}
                  >
                    Request Revision
                  </Button>
                </div>
              ) : (
                <Alert
                  severity={actionTaken === 'approved' ? 'success' : 'warning'}
                  sx={{ borderRadius: '8px', mb: 3 }}
                >
                  {actionTaken === 'approved'
                    ? 'You have approved this syllabus. Awaiting approval from Dr. Reyes.'
                    : 'You have requested a revision. The faculty member will be notified.'}
                </Alert>
              )}

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Add Comment (optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Type your comment or feedback here..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                disabled={!comment.trim()}
                sx={{ textTransform: 'none', borderRadius: '8px', py: 1.5, minHeight: 44 }}
              >
                Submit Comment
              </Button>
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
}
