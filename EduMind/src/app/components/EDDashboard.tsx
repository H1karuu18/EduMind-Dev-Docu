import { useState } from 'react';
import {
  Paper, Typography, Box, Chip, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Switch,
  FormControlLabel, Badge, Alert
} from '@mui/material';

interface EDDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const PENDING_SYLLABI = [
  {
    id: '1',
    subject: 'CS301 — Database Management Systems',
    faculty: 'Dr. Juan Dela Cruz',
    version: 'v1.1',
    submitted: '2026-05-20',
    peerStatus: 'Peer Approved',
  },
  {
    id: '2',
    subject: 'CS201 — Data Structures and Algorithms',
    faculty: 'Prof. Ana Reyes',
    version: 'v1.0',
    submitted: '2026-05-19',
    peerStatus: 'Peer Approved',
  },
  {
    id: '3',
    subject: 'CS401 — Software Engineering',
    faculty: 'Dr. Ramon Santos',
    version: 'v2.0',
    submitted: '2026-05-18',
    peerStatus: 'Pending (1 of 2)',
  },
  {
    id: '4',
    subject: 'CS205 — Web Development',
    faculty: 'Prof. Liza Cruz',
    version: 'v1.2',
    submitted: '2026-05-17',
    peerStatus: 'Peer Approved',
  },
  {
    id: '5',
    subject: 'CS305 — Computer Networks',
    faculty: 'Dr. Jose Mendoza',
    version: 'v1.0',
    submitted: '2026-05-16',
    peerStatus: 'Peer Approved',
  },
];

export default function EDDashboard({ userName, onNavigate }: EDDashboardProps) {
  const [isFacultyView, setIsFacultyView] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top bar */}
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Good morning, {userName}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Executive Director — School of Computing and Information Technologies, APC
            </Typography>
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={isFacultyView}
                onChange={e => setIsFacultyView(e.target.checked)}
                disabled
              />
            }
            label={
              <Typography variant="body2" className="text-gray-400">
                Viewing as: Executive Director {isFacultyView ? '| Faculty View' : ''}
              </Typography>
            }
          />
        </div>
      </Box>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Pending Approvals badge */}
        <div className="flex items-center gap-3 mb-6">
          <Badge badgeContent={5} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '1rem', height: 28, minWidth: 28, borderRadius: '14px' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mr: 2 }}>
              Pending Approvals
            </Typography>
          </Badge>
        </div>

        <Alert severity="warning" sx={{ borderRadius: '8px', mb: 4 }}>
          5 syllabi are awaiting your final review and approval.
        </Alert>

        {/* Pending Syllabi Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Faculty Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Submitted</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Peer Review Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PENDING_SYLLABI.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.subject}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.faculty}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.version} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.submitted}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.peerStatus}
                      size="small"
                      color={row.peerStatus === 'Peer Approved' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => onNavigate('ed-approval')}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', minHeight: 44, borderRadius: '8px' }}
                      >
                        Review
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ textTransform: 'none', fontSize: '0.75rem', minHeight: 44, borderRadius: '8px' }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{ textTransform: 'none', fontSize: '0.75rem', minHeight: 44, borderRadius: '8px' }}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
