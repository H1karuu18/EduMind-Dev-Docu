import { useState } from 'react';
import { TextField, Paper, Typography, IconButton, Chip, Box } from '@mui/material';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

interface WeekPlan {
  week: number;
  topic: string;
  learningOutcomes: string[];
  activities: string[];
  assessments: string[];
}

interface Props {
  weekPlan: WeekPlan;
  onUpdate: (plan: WeekPlan) => void;
}

export default function WeeklyPlanEditor({ weekPlan, onUpdate }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateTopic = (topic: string) => {
    onUpdate({ ...weekPlan, topic });
  };

  const addItem = (field: 'learningOutcomes' | 'activities' | 'assessments') => {
    onUpdate({
      ...weekPlan,
      [field]: [...weekPlan[field], '']
    });
  };

  const updateItem = (field: 'learningOutcomes' | 'activities' | 'assessments', index: number, value: string) => {
    const newItems = [...weekPlan[field]];
    newItems[index] = value;
    onUpdate({
      ...weekPlan,
      [field]: newItems
    });
  };

  const removeItem = (field: 'learningOutcomes' | 'activities' | 'assessments', index: number) => {
    if (weekPlan[field].length > 1) {
      const newItems = weekPlan[field].filter((_, i) => i !== index);
      onUpdate({
        ...weekPlan,
        [field]: newItems
      });
    }
  };

  return (
    <Paper elevation={1} className="mb-4">
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Chip label={`Week ${weekPlan.week}`} color="primary" />
          <Typography variant="subtitle1" className="font-medium">
            {weekPlan.topic || 'Untitled Topic'}
          </Typography>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <TextField
            label="Week Topic"
            placeholder="e.g., Variables and Data Types"
            value={weekPlan.topic}
            onChange={(e) => updateTopic(e.target.value)}
            fullWidth
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle2" className="font-medium text-gray-700">
                Learning Outcomes
              </Typography>
              <IconButton
                size="small"
                onClick={() => addItem('learningOutcomes')}
                color="primary"
              >
                <Plus className="w-4 h-4" />
              </IconButton>
            </div>
            {weekPlan.learningOutcomes.map((outcome, index) => (
              <Box key={index} className="flex items-start gap-2 mb-2">
                <TextField
                  placeholder="e.g., Students will be able to define and declare variables..."
                  value={outcome}
                  onChange={(e) => updateItem('learningOutcomes', index, e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                />
                <IconButton
                  size="small"
                  onClick={() => removeItem('learningOutcomes', index)}
                  disabled={weekPlan.learningOutcomes.length === 1}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </Box>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle2" className="font-medium text-gray-700">
                Learning Activities
              </Typography>
              <IconButton
                size="small"
                onClick={() => addItem('activities')}
                color="primary"
              >
                <Plus className="w-4 h-4" />
              </IconButton>
            </div>
            {weekPlan.activities.map((activity, index) => (
              <Box key={index} className="flex items-start gap-2 mb-2">
                <TextField
                  placeholder="e.g., Hands-on coding exercise on variable declaration..."
                  value={activity}
                  onChange={(e) => updateItem('activities', index, e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                />
                <IconButton
                  size="small"
                  onClick={() => removeItem('activities', index)}
                  disabled={weekPlan.activities.length === 1}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </Box>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle2" className="font-medium text-gray-700">
                Assessments
              </Typography>
              <IconButton
                size="small"
                onClick={() => addItem('assessments')}
                color="primary"
              >
                <Plus className="w-4 h-4" />
              </IconButton>
            </div>
            {weekPlan.assessments.map((assessment, index) => (
              <Box key={index} className="flex items-start gap-2 mb-2">
                <TextField
                  placeholder="e.g., Quiz on variable types and scope..."
                  value={assessment}
                  onChange={(e) => updateItem('assessments', index, e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                />
                <IconButton
                  size="small"
                  onClick={() => removeItem('assessments', index)}
                  disabled={weekPlan.assessments.length === 1}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              </Box>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
}
