import { useState } from 'react';
import {
  Typography, TextField, Button, Box, Accordion, AccordionSummary,
  AccordionDetails, LinearProgress, Tooltip
} from '@mui/material';
import { ChevronDown, CheckCircle, AlertTriangle, XCircle, Info, ArrowRight } from 'lucide-react';

const WEEKLY_TOPICS = [
  { week: 1, topic: 'Introduction to Systems Analysis', activity: 'Case Study Discussion', assessment: '' },
  { week: 2, topic: 'Requirements Gathering Techniques', activity: 'Interview Simulation', assessment: '' },
  { week: 3, topic: 'Use Case Modeling', activity: 'UML Diagram Lab', assessment: 'Quiz 1' },
  { week: 4, topic: 'Activity Diagrams', activity: 'Group Exercise', assessment: '' },
];

const COMPLIANCE_CHECKS = [
  { section: 'Course Information', status: 'ok' },
  { section: 'Learning Objectives', status: 'warn', note: '2 of 4 objectives missing time-bound criteria' },
  { section: 'Weekly Outline', status: 'ok' },
  { section: 'References', status: 'warn', note: '3 references older than 5 years detected' },
  { section: 'Assessment Weights', status: 'error', note: 'Total: 95% — must equal 100%' },
];

const WEIGHTS = [
  { label: 'Quizzes', weight: 20 },
  { label: 'Assignments', weight: 25 },
  { label: 'Midterm Exam', weight: 25 },
  { label: 'Final Exam', weight: 25 },
];

const totalWeight = WEIGHTS.reduce((s, w) => s + w.weight, 0);

function StatusIcon({ status }: { status: string }) {
  if (status === 'ok') return <CheckCircle className="w-4 h-4 text-[#38A169]" />;
  if (status === 'warn') return <AlertTriangle className="w-4 h-4 text-[#D69E2E]" />;
  return <XCircle className="w-4 h-4 text-[#E53E3E]" />;
}

const completionScore = Math.round(
  (COMPLIANCE_CHECKS.filter(c => c.status === 'ok').length / COMPLIANCE_CHECKS.length) * 100
);

export default function LessonPlanBuilder() {
  const [title, setTitle] = useState('MNTSDEV — Systems Analysis T1 AY 2026–2027');

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <div className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
          <span>Dashboard</span>
          <ArrowRight className="w-3 h-3" />
          <span>My Lesson Plans</span>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[#1A202C] font-medium">MNTSDEV T1 AY 2026–2027</span>
        </div>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>Lesson Plan Builder</Typography>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-5 gap-6">
          {/* Left — Editor (60%) */}
          <div className="col-span-3 space-y-4">
            {/* Title */}
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-[#1A202C] bg-transparent border-none outline-none border-b-2 border-transparent focus:border-[#1E3A5F] pb-1 transition-colors"
              placeholder="Lesson Plan Title"
            />

            {/* Course Information */}
            <Accordion defaultExpanded sx={{ borderRadius: '8px !important', border: '1px solid #E2E8F0', boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38A169]" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Course Information</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="grid grid-cols-2 gap-3">
                  <TextField size="small" label="Subject Code" defaultValue="MNTSDEV" fullWidth />
                  <TextField size="small" label="Section" defaultValue="A" fullWidth />
                  <TextField size="small" label="Term" defaultValue="T1 AY 2026–2027" fullWidth />
                  <TextField size="small" label="Units" defaultValue="3" fullWidth />
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Learning Objectives */}
            <Accordion sx={{ borderRadius: '8px !important', border: '1px solid #E2E8F0', boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D69E2E]" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Learning Objectives</Typography>
                  <span className="text-xs text-[#D69E2E] ml-1">(2 of 4 missing time-bound criteria)</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  {[
                    'Students will be able to analyze system requirements using structured techniques.',
                    'Students will create UML diagrams for system modeling.',
                    'Students will apply agile methodologies in project scenarios.',
                    'Students will evaluate system designs for completeness.',
                  ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-2.5 w-5 h-5 rounded-full bg-[#EBF0F8] flex items-center justify-center shrink-0">
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#1E3A5F' }}>{i + 1}</Typography>
                      </div>
                      <div className="flex-1">
                        <TextField size="small" fullWidth defaultValue={obj} multiline />
                      </div>
                      <Tooltip title="Is this Specific? Measurable? Achievable? Relevant? Time-bound?">
                        <Info className="w-4 h-4 text-[#718096] mt-2 cursor-help shrink-0" />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>

            {/* Weekly Topic Outline */}
            <Accordion defaultExpanded sx={{ borderRadius: '8px !important', border: '1px solid #E2E8F0', boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38A169]" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Weekly Topic Outline</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8F9FA] border-t border-[#E2E8F0]">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#718096] w-12">Week</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#718096]">Topic</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#718096]">Activity</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#718096] w-32">Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKLY_TOPICS.map(row => (
                      <tr key={row.week} className="border-t border-[#E2E8F0] hover:bg-[#F8F9FA]">
                        <td className="px-4 py-2 text-center text-xs font-bold text-[#1E3A5F]">{row.week}</td>
                        <td className="px-4 py-2 text-xs text-[#4A5568]">{row.topic}</td>
                        <td className="px-4 py-2 text-xs text-[#4A5568]">{row.activity}</td>
                        <td className="px-4 py-2 text-xs text-[#718096]">{row.assessment || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionDetails>
            </Accordion>

            {/* Assessment Weights */}
            <Accordion sx={{ borderRadius: '8px !important', border: '2px solid #E53E3E', boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />}>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#E53E3E]" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Assessment Plan</Typography>
                  <span className="text-xs text-[#E53E3E] ml-1">(Total: {totalWeight}% — must equal 100%)</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  {WEIGHTS.map(w => (
                    <div key={w.label} className="flex items-center gap-3">
                      <Typography variant="body2" className="w-32 text-[#4A5568]">{w.label}</Typography>
                      <TextField size="small" type="number" defaultValue={w.weight} sx={{ width: 80 }} InputProps={{ endAdornment: <span className="text-[#718096] text-sm">%</span> }} />
                    </div>
                  ))}
                  <div className={`mt-2 text-sm font-semibold ${totalWeight === 100 ? 'text-[#38A169]' : 'text-[#E53E3E]'}`}>
                    Total: {totalWeight}% {totalWeight !== 100 && '— must equal 100%'}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Right — Compliance Monitor (40%) */}
          <div className="col-span-2">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sticky top-6">
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 3 }}>
                Completion Status
              </Typography>

              {/* Circular progress (simulated) */}
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EBF0F8" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#1E3A5F" strokeWidth="3"
                      strokeDasharray={`${completionScore} ${100 - completionScore}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A5F' }}>{completionScore}%</Typography>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {COMPLIANCE_CHECKS.map(check => (
                  <div key={check.section} className="flex items-start gap-2.5">
                    <StatusIcon status={check.status} />
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A202C' }}>
                        {check.section}
                      </Typography>
                      {check.note && (
                        <Typography variant="caption" sx={{
                          color: check.status === 'warn' ? '#D69E2E' : '#E53E3E'
                        }}>
                          {check.note}
                        </Typography>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                fullWidth variant="outlined" size="small"
                sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#E63946', color: '#E63946', mb: 2, minHeight: 36 }}
              >
                Fix Issues
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[#E2E8F0]">
          <Button
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, borderColor: '#E2E8F0', color: '#718096' }}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#1E3A5F', textTransform: 'none', borderRadius: '8px', minHeight: 44, px: 3, '&:hover': { bgcolor: '#162d4a' } }}
          >
            Commit Version
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px', minHeight: 44, px: 3, '&:hover': { bgcolor: '#cc2f3b' } }}
          >
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
}
