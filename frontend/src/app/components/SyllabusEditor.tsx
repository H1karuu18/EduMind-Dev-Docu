import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Chip } from '@mui/material';
import { Plus, Save, FileText } from 'lucide-react';
import WeeklyPlanEditor from './WeeklyPlanEditor';

interface WeekPlan {
  week: number;
  topic: string;
  learningOutcomes: string[];
  activities: string[];
  assessments: string[];
}

export default function SyllabusEditor() {
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [term, setTerm] = useState('');
  const [weeklyPlans, setWeeklyPlans] = useState<WeekPlan[]>([
    {
      week: 1,
      topic: '',
      learningOutcomes: [''],
      activities: [''],
      assessments: ['']
    }
  ]);

  const addWeek = () => {
    setWeeklyPlans([
      ...weeklyPlans,
      {
        week: weeklyPlans.length + 1,
        topic: '',
        learningOutcomes: [''],
        activities: [''],
        assessments: ['']
      }
    ]);
  };

  const updateWeekPlan = (index: number, updatedPlan: WeekPlan) => {
    const newPlans = [...weeklyPlans];
    newPlans[index] = updatedPlan;
    setWeeklyPlans(newPlans);
  };

  const handleSave = () => {
    console.log('Saving syllabus...', {
      courseCode,
      courseTitle,
      courseDescription,
      instructor,
      term,
      weeklyPlans
    });
    alert('Syllabus saved successfully! (Frontend demo - no backend)');
  };

  return (
    <div className="h-full overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Create Syllabus
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ textTransform: 'none' }}
          >
            Save Syllabus
          </Button>
        </div>

        <Paper elevation={2} className="p-6 mb-6">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Course Information
          </Typography>

          <Box className="grid grid-cols-2 gap-4 mb-4">
            <TextField
              label="Course Code"
              placeholder="e.g., CS101"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              fullWidth
            />
            <TextField
              label="Academic Term"
              placeholder="e.g., 1st Semester 2024-2025"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Course Title"
            placeholder="e.g., Introduction to Programming"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            fullWidth
            className="mb-4"
          />

          <TextField
            label="Instructor Name"
            placeholder="e.g., Dr. Juan Dela Cruz"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            fullWidth
            className="mb-4"
          />

          <TextField
            label="Course Description"
            placeholder="Provide a comprehensive description of the course..."
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
        </Paper>

        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold text-gray-700">
            Weekly Course Plan
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Plus />}
            onClick={addWeek}
            sx={{ textTransform: 'none' }}
          >
            Add Week
          </Button>
        </div>

        {weeklyPlans.map((plan, index) => (
          <WeeklyPlanEditor
            key={index}
            weekPlan={plan}
            onUpdate={(updated) => updateWeekPlan(index, updated)}
          />
        ))}
      </div>
    </div>
  );
}
