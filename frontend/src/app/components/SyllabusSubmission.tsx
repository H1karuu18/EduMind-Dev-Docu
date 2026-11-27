import { useState } from 'react';
import {
  TextField, Button, Typography, Paper, Box, MenuItem, Select,
  FormControl, InputLabel, Chip, Stepper, Step, StepLabel, Breadcrumbs, Link
} from '@mui/material';
import { UploadCloud, FileText } from 'lucide-react';

const WORKFLOW_STEPS = ['Draft', 'Submitted for Peer Review', 'Pending ED Approval', 'Approved'];

const METADATA_TAGS = [
  { label: 'Subject', value: 'CS301 — Database Management Systems' },
  { label: 'Department', value: 'School of Computing & IT' },
  { label: 'Document Type', value: 'Course Syllabus' },
  { label: 'Term', value: '1st Semester 2025-2026' },
];

export default function SyllabusSubmission() {
  const [subject, setSubject] = useState('CS301');
  const [section, setSection] = useState('A');
  const [term, setTerm] = useState('1st Semester 2025-2026');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const handleSubmit = () => {
    setActiveStep(1);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <Box className="bg-white border-b border-gray-200 px-8 py-4">
        <Breadcrumbs sx={{ mb: 0.5 }}>
          <Link underline="hover" color="inherit" href="#" sx={{ cursor: 'pointer' }}>
            My Syllabi
          </Link>
          <Typography color="text.primary">Submit New Syllabus</Typography>
        </Breadcrumbs>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Submit New Syllabus
        </Typography>
      </Box>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Workflow Status Bar */}
        <Paper sx={{ borderRadius: '8px', p: 3, mb: 6 }}>
          <Typography variant="subtitle2" className="text-gray-500 mb-3">Workflow Status</Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {WORKFLOW_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Two-column form */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left — Form Fields */}
          <Paper sx={{ borderRadius: '8px', p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Syllabus Information
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Subject</InputLabel>
              <Select value={subject} onChange={e => setSubject(e.target.value)} label="Subject">
                <MenuItem value="CS101">CS101 — Introduction to Programming</MenuItem>
                <MenuItem value="CS201">CS201 — Data Structures and Algorithms</MenuItem>
                <MenuItem value="CS301">CS301 — Database Management Systems</MenuItem>
                <MenuItem value="CS401">CS401 — Software Engineering</MenuItem>
                <MenuItem value="CS205">CS205 — Web Development</MenuItem>
                <MenuItem value="CS305">CS305 — Computer Networks</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Section</InputLabel>
              <Select value={section} onChange={e => setSection(e.target.value)} label="Section">
                {['A', 'B', 'C', 'D'].map(s => (
                  <MenuItem key={s} value={s}>Section {s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Term</InputLabel>
              <Select value={term} onChange={e => setTerm(e.target.value)} label="Term">
                <MenuItem value="1st Semester 2025-2026">1st Semester 2025-2026</MenuItem>
                <MenuItem value="2nd Semester 2025-2026">2nd Semester 2025-2026</MenuItem>
                <MenuItem value="Summer 2026">Summer 2026</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select value={academicYear} onChange={e => setAcademicYear(e.target.value)} label="Academic Year">
                <MenuItem value="2025-2026">2025-2026</MenuItem>
                <MenuItem value="2026-2027">2026-2027</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Right — Upload Area */}
          <Paper sx={{ borderRadius: '8px', p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Upload Syllabus
            </Typography>

            <div
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-4 ${
                isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'
              }`}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              style={{ minHeight: 180 }}
            >
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <Typography variant="body2" className="text-gray-600 text-center">
                {uploadedFile
                  ? <span className="text-green-600 font-medium">{uploadedFile}</span>
                  : <>Drag and drop your file here, or <span className="text-blue-600">browse</span></>
                }
              </Typography>
              <Typography variant="caption" className="text-gray-400 mt-1">
                PDF, DOCX, PPTX only
              </Typography>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.pptx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Extracted Metadata Preview */}
            <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Extracted Metadata Preview
                </Typography>
                <Chip label="Auto-generated" size="small" color="info" variant="outlined" />
              </div>
              <div className="space-y-2">
                {METADATA_TAGS.map(tag => (
                  <div key={tag.label} className="flex items-center gap-2">
                    <Typography variant="caption" className="text-gray-500 w-28 shrink-0">{tag.label}:</Typography>
                    <Chip label={tag.value} size="small" sx={{ fontSize: '0.7rem' }} />
                  </div>
                ))}
              </div>
            </Box>
          </Paper>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outlined"
            size="large"
            sx={{ textTransform: 'none', borderRadius: '8px', minWidth: 160 }}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ textTransform: 'none', borderRadius: '8px', minWidth: 200 }}
          >
            Submit for Peer Review
          </Button>
        </div>
      </div>
    </div>
  );
}
