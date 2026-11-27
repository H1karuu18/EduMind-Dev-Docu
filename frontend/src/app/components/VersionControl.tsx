import { useState } from 'react';
import { Paper, Typography, Chip, Button, Avatar, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { GitBranch, Clock, User, FileText, Download, Eye, ChevronDown } from 'lucide-react';

interface Version {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changeType: 'created' | 'updated' | 'approved' | 'revision';
  description: string;
  changes: string[];
}

interface Document {
  id: string;
  title: string;
  courseCode: string;
  currentVersion: string;
  versions: Version[];
}

const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Introduction to Programming Syllabus',
    courseCode: 'CS101',
    currentVersion: 'v2.1',
    versions: [
      {
        id: 'v2.1',
        version: 'v2.1',
        timestamp: '2026-05-05T14:30:00',
        author: 'Dr. Juan Dela Cruz',
        changeType: 'approved',
        description: 'Approved by executive director',
        changes: ['Syllabus approved for 1st Semester 2025-2026']
      },
      {
        id: 'v2.0',
        version: 'v2.0',
        timestamp: '2026-05-03T10:15:00',
        author: 'Dr. Juan Dela Cruz',
        changeType: 'updated',
        description: 'Updated assessment breakdown and learning outcomes',
        changes: [
          'Modified final project weight from 25% to 30%',
          'Added new learning outcome for Week 8',
          'Updated course prerequisites'
        ]
      },
      {
        id: 'v1.1',
        version: 'v1.1',
        timestamp: '2026-04-28T16:45:00',
        author: 'Dr. Juan Dela Cruz',
        changeType: 'revision',
        description: 'Addressed feedback from review',
        changes: [
          'Clarified grading criteria for assignments',
          'Added more detailed weekly topics'
        ]
      },
      {
        id: 'v1.0',
        version: 'v1.0',
        timestamp: '2026-04-20T09:00:00',
        author: 'Dr. Juan Dela Cruz',
        changeType: 'created',
        description: 'Initial syllabus creation',
        changes: ['Created initial syllabus for CS101']
      }
    ]
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms Syllabus',
    courseCode: 'CS201',
    currentVersion: 'v1.2',
    versions: [
      {
        id: 'v1.2',
        version: 'v1.2',
        timestamp: '2026-05-03T11:20:00',
        author: 'Prof. Maria Santos',
        changeType: 'approved',
        description: 'Approved by executive director',
        changes: ['Syllabus approved for 1st Semester 2025-2026']
      },
      {
        id: 'v1.1',
        version: 'v1.1',
        timestamp: '2026-04-30T14:00:00',
        author: 'Prof. Maria Santos',
        changeType: 'updated',
        description: 'Updated algorithm analysis topics',
        changes: [
          'Added Big-O notation exercises for Week 3',
          'Updated recommended textbook'
        ]
      },
      {
        id: 'v1.0',
        version: 'v1.0',
        timestamp: '2026-04-25T10:30:00',
        author: 'Prof. Maria Santos',
        changeType: 'created',
        description: 'Initial syllabus creation',
        changes: ['Created initial syllabus for CS201']
      }
    ]
  }
];

export default function VersionControl() {
  const [expandedDoc, setExpandedDoc] = useState<string | false>('1');

  const getChangeTypeConfig = (type: string) => {
    switch (type) {
      case 'created':
        return { color: '#3b82f6', label: 'Created' };
      case 'updated':
        return { color: '#10b981', label: 'Updated' };
      case 'approved':
        return { color: '#8b5cf6', label: 'Approved' };
      case 'revision':
        return { color: '#f59e0b', label: 'Revision' };
      default:
        return { color: '#6b7280', label: 'Unknown' };
    }
  };

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedDoc(isExpanded ? panel : false);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-blue-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Version Control
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600">
            Complete revision history and document integrity tracking
          </Typography>
        </div>

        <div className="space-y-4">
          {SAMPLE_DOCUMENTS.map((doc) => (
            <Accordion
              key={doc.id}
              expanded={expandedDoc === doc.id}
              onChange={handleAccordionChange(doc.id)}
              elevation={2}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                sx={{ bgcolor: expandedDoc === doc.id ? '#f8fafc' : 'white' }}
              >
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <Typography variant="h6" className="font-semibold text-gray-800">
                        {doc.courseCode}: {doc.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        {doc.versions.length} versions
                      </Typography>
                    </div>
                  </div>
                  <Chip
                    label={doc.currentVersion}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className="space-y-4">
                  {doc.versions.map((version, index) => {
                    const config = getChangeTypeConfig(version.changeType);
                    const isLatest = index === 0;

                    return (
                      <Box
                        key={version.id}
                        className={`border-l-4 pl-6 py-4 relative ${
                          isLatest ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <div
                          className="absolute left-0 top-6 -ml-2 w-4 h-4 rounded-full border-4"
                          style={{
                            backgroundColor: config.color,
                            borderColor: isLatest ? '#eff6ff' : 'white'
                          }}
                        />

                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Typography variant="h6" className="font-bold text-gray-800">
                                {version.version}
                              </Typography>
                              <Chip
                                label={config.label}
                                size="small"
                                sx={{
                                  bgcolor: config.color,
                                  color: 'white',
                                  fontWeight: 500
                                }}
                              />
                              {isLatest && (
                                <Chip
                                  label="Latest"
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </div>
                            <Typography variant="body2" className="text-gray-700 mb-2">
                              {version.description}
                            </Typography>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{version.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(version.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        <Box className="bg-white rounded p-3 mb-3">
                          <Typography variant="caption" className="font-semibold text-gray-700 block mb-2">
                            Changes:
                          </Typography>
                          <ul className="list-disc list-inside space-y-1">
                            {version.changes.map((change, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                {change}
                              </li>
                            ))}
                          </ul>
                        </Box>

                        <div className="flex gap-2">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Eye className="w-4 h-4" />}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Download className="w-4 h-4" />}
                          >
                            Download
                          </Button>
                          {!isLatest && (
                            <Button size="small" variant="outlined">
                              Restore
                            </Button>
                          )}
                        </div>
                      </Box>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
