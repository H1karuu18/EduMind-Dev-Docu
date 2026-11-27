import { useState } from 'react';
import { Paper, Typography, Tabs, Tab, Box, Chip, Button, Avatar, LinearProgress } from '@mui/material';
import { CheckCircle, Clock, AlertCircle, FileText, Calendar, User, MessageSquare } from 'lucide-react';

interface SyllabusSubmission {
  id: string;
  courseCode: string;
  courseTitle: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'revision_needed' | 'rejected';
  reviewer?: string;
  reviewDate?: string;
  comments?: string;
  daysRemaining?: number;
}

const SAMPLE_SUBMISSIONS: SyllabusSubmission[] = [
  {
    id: '1',
    courseCode: 'CS401',
    courseTitle: 'Software Engineering',
    submittedBy: 'Dr. Juan Dela Cruz',
    submittedDate: '2026-05-06',
    status: 'pending',
    daysRemaining: 5
  },
  {
    id: '2',
    courseCode: 'CS305',
    courseTitle: 'Computer Networks',
    submittedBy: 'Prof. Maria Santos',
    submittedDate: '2026-05-05',
    status: 'pending',
    daysRemaining: 6
  },
  {
    id: '3',
    courseCode: 'CS201',
    courseTitle: 'Data Structures and Algorithms',
    submittedBy: 'Dr. Juan Dela Cruz',
    submittedDate: '2026-05-03',
    status: 'approved',
    reviewer: 'Dir. Roberto Cruz',
    reviewDate: '2026-05-05'
  },
  {
    id: '4',
    courseCode: 'CS205',
    courseTitle: 'Web Development',
    submittedBy: 'Prof. Ana Garcia',
    submittedDate: '2026-05-01',
    status: 'revision_needed',
    reviewer: 'Dir. Roberto Cruz',
    reviewDate: '2026-05-04',
    comments: 'Please update the assessment breakdown to align with department standards.',
    daysRemaining: 3
  },
  {
    id: '5',
    courseCode: 'CS102',
    courseTitle: 'Object-Oriented Programming',
    submittedBy: 'Dr. Pedro Reyes',
    submittedDate: '2026-04-28',
    status: 'approved',
    reviewer: 'Dir. Roberto Cruz',
    reviewDate: '2026-05-02'
  },
  {
    id: '6',
    courseCode: 'CS501',
    courseTitle: 'Artificial Intelligence',
    submittedBy: 'Dr. Juan Dela Cruz',
    submittedDate: '2026-05-07',
    status: 'pending',
    daysRemaining: 4
  }
];

export default function ApprovalWorkflow() {
  const [selectedTab, setSelectedTab] = useState(0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: Clock, label: 'Pending Review' };
      case 'approved':
        return { color: 'success', icon: CheckCircle, label: 'Approved' };
      case 'revision_needed':
        return { color: 'error', icon: AlertCircle, label: 'Revision Needed' };
      case 'rejected':
        return { color: 'error', icon: AlertCircle, label: 'Rejected' };
      default:
        return { color: 'default', icon: Clock, label: 'Unknown' };
    }
  };

  const filteredSubmissions = SAMPLE_SUBMISSIONS.filter(sub => {
    if (selectedTab === 0) return sub.status === 'pending';
    if (selectedTab === 1) return sub.status === 'approved';
    if (selectedTab === 2) return sub.status === 'revision_needed';
    return true;
  });

  const handleApprove = (id: string) => {
    alert(`Syllabus ${id} approved! (Frontend demo - no backend)`);
  };

  const handleRequestRevision = (id: string) => {
    alert(`Revision requested for syllabus ${id} (Frontend demo - no backend)`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Syllabus Approval Workflow
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600">
            Streamlined submission and approval pipeline with automated notifications
          </Typography>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Paper className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-orange-500" />
              <Typography variant="h5" className="font-bold text-gray-800">
                {SAMPLE_SUBMISSIONS.filter(s => s.status === 'pending').length}
              </Typography>
            </div>
            <Typography variant="body2" className="text-gray-600">
              Pending Review
            </Typography>
            <LinearProgress
              variant="determinate"
              value={33}
              sx={{ mt: 2, bgcolor: 'orange.100', '& .MuiLinearProgress-bar': { bgcolor: 'orange.500' } }}
            />
          </Paper>

          <Paper className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <Typography variant="h5" className="font-bold text-gray-800">
                {SAMPLE_SUBMISSIONS.filter(s => s.status === 'approved').length}
              </Typography>
            </div>
            <Typography variant="body2" className="text-gray-600">
              Approved
            </Typography>
            <LinearProgress
              variant="determinate"
              value={67}
              sx={{ mt: 2, bgcolor: 'green.100', '& .MuiLinearProgress-bar': { bgcolor: 'green.500' } }}
            />
          </Paper>

          <Paper className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <Typography variant="h5" className="font-bold text-gray-800">
                {SAMPLE_SUBMISSIONS.filter(s => s.status === 'revision_needed').length}
              </Typography>
            </div>
            <Typography variant="body2" className="text-gray-600">
              Needs Revision
            </Typography>
            <LinearProgress
              variant="determinate"
              value={16}
              sx={{ mt: 2, bgcolor: 'red.100', '& .MuiLinearProgress-bar': { bgcolor: 'red.500' } }}
            />
          </Paper>
        </div>

        <Paper elevation={2} className="mb-6">
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Needs Revision" />
          </Tabs>
        </Paper>

        <div className="space-y-4">
          {filteredSubmissions.map((submission) => {
            const statusConfig = getStatusConfig(submission.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Paper key={submission.id} elevation={1} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <Typography variant="h6" className="font-semibold text-gray-800">
                        {submission.courseCode}: {submission.courseTitle}
                      </Typography>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{submission.submittedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {new Date(submission.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Chip
                    icon={<StatusIcon className="w-4 h-4" />}
                    label={statusConfig.label}
                    color={statusConfig.color as any}
                    size="small"
                  />
                </div>

                {submission.status === 'pending' && submission.daysRemaining !== undefined && (
                  <Box className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <Typography variant="body2" className="text-orange-800">
                        <strong>{submission.daysRemaining} days remaining</strong> for review deadline
                      </Typography>
                    </div>
                  </Box>
                )}

                {submission.reviewer && (
                  <Box className="bg-gray-50 rounded p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                        {submission.reviewer.charAt(0)}
                      </Avatar>
                      <div className="flex-1">
                        <Typography variant="body2" className="font-medium text-gray-800">
                          {submission.reviewer}
                        </Typography>
                        <Typography variant="caption" className="text-gray-600">
                          Reviewed on {submission.reviewDate && new Date(submission.reviewDate).toLocaleDateString()}
                        </Typography>
                        {submission.comments && (
                          <Box className="mt-2 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                            <Typography variant="body2" className="text-gray-700">
                              {submission.comments}
                            </Typography>
                          </Box>
                        )}
                      </div>
                    </div>
                  </Box>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FileText className="w-4 h-4" />}
                  >
                    View Syllabus
                  </Button>
                  {submission.status === 'pending' && (
                    <>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRequestRevision(submission.id)}
                      >
                        Request Revision
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(submission.id)}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                  {submission.status === 'revision_needed' && (
                    <Button
                      variant="contained"
                      size="small"
                    >
                      Resubmit
                    </Button>
                  )}
                </div>
              </Paper>
            );
          })}
        </div>

        {filteredSubmissions.length === 0 && (
          <Paper className="p-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <Typography variant="h6" className="text-gray-500 mb-2">
              No submissions in this category
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              All caught up!
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
}
