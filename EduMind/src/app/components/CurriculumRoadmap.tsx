import { useState } from 'react';
import { Typography, Tabs, Tab, Chip, Button, Box } from '@mui/material';
import { ArrowRight, Plus, BookOpen, FlaskConical, ClipboardCheck } from 'lucide-react';

type TopicType = 'lecture' | 'lab' | 'assessment';

interface WeekTopic {
  type: TopicType;
  title: string;
  hasAssessment?: boolean;
}

const TYPE_COLORS: Record<TopicType, string> = {
  lecture: '#EBF0F8',
  lab: '#FFF5E6',
  assessment: '#FFF0F0',
};

const TYPE_TEXT: Record<TopicType, string> = {
  lecture: '#1E3A5F',
  lab: '#C05621',
  assessment: '#C53030',
};

const TYPE_ICONS: Record<TopicType, React.ElementType> = {
  lecture: BookOpen,
  lab: FlaskConical,
  assessment: ClipboardCheck,
};

const WEEKS: { week: number; topics: WeekTopic[] }[] = [
  { week: 1, topics: [{ type: 'lecture', title: 'Intro to Systems Analysis' }] },
  { week: 2, topics: [{ type: 'lecture', title: 'Requirements Gathering' }, { type: 'lab', title: 'Interview Sim Lab' }] },
  { week: 3, topics: [{ type: 'lecture', title: 'Use Case Modeling' }, { type: 'assessment', title: 'Quiz 1', hasAssessment: true }] },
  { week: 4, topics: [{ type: 'lab', title: 'UML Lab' }] },
  { week: 5, topics: [{ type: 'lecture', title: 'Activity Diagrams' }] },
  { week: 6, topics: [{ type: 'lecture', title: 'Sequence Diagrams' }, { type: 'lab', title: 'Modeling Lab' }] },
  { week: 7, topics: [{ type: 'assessment', title: 'Midterm Exam', hasAssessment: true }] },
  { week: 8, topics: [{ type: 'lecture', title: 'Agile Overview' }] },
];

const KANBAN_WEEKS = [
  { week: 1, topic: 'Intro to Systems Analysis', section: 'A', status: 'covered', onTime: true },
  { week: 2, topic: 'Requirements Gathering', section: 'A', status: 'covered', onTime: true },
  { week: 3, topic: 'Use Case Modeling', section: 'A', status: 'covered', onTime: false },
  { week: 4, topic: 'Activity Diagrams', section: 'A', status: 'in-progress', onTime: true },
  { week: 5, topic: 'Activity Diagrams (cont.)', section: 'A', status: 'not-started', onTime: false },
  { week: 6, topic: 'Sequence Diagrams', section: 'A', status: 'not-started', onTime: false },
];

const KANBAN_COLS = [
  { id: 'not-started', label: 'Not Started', color: '#718096' },
  { id: 'in-progress', label: 'In Progress', color: '#D69E2E' },
  { id: 'covered', label: 'Covered', color: '#38A169' },
  { id: 'skipped', label: 'Skipped', color: '#E53E3E' },
];

export default function CurriculumRoadmap() {
  const [view, setView] = useState(0);

  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <div className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
          <span>Dashboard</span><ArrowRight className="w-3 h-3" /><span>Curriculum Roadmap</span>
          <ArrowRight className="w-3 h-3" /><span className="text-[#1A202C] font-medium">MNTSDEV T1</span>
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>Curriculum Roadmap — MNTSDEV</Typography>
          <Tabs
            value={view} onChange={(_, v) => setView(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 36, py: 0 },
              '& .Mui-selected': { color: '#1E3A5F' },
              '& .MuiTabs-indicator': { backgroundColor: '#1E3A5F' }
            }}
          >
            <Tab label="Timeline View" />
            <Tab label="Kanban View" />
          </Tabs>
        </div>
      </div>

      <div className="px-8 py-6">
        {view === 0 ? (
          <div className="flex gap-0 overflow-x-auto pb-4">
            {/* Timeline */}
            {WEEKS.map(week => (
              <div key={week.week} className="min-w-[160px] border-r border-[#E2E8F0] last:border-r-0 px-3">
                <div className="bg-[#1E3A5F] text-white text-xs font-bold text-center py-1.5 rounded-lg mb-3">
                  Week {week.week}
                </div>
                <div className="space-y-2">
                  {week.topics.map((topic, i) => {
                    const Icon = TYPE_ICONS[topic.type];
                    return (
                      <div
                        key={i}
                        className="rounded-lg p-2.5 border text-xs cursor-pointer hover:shadow-sm transition-shadow"
                        style={{ backgroundColor: TYPE_COLORS[topic.type], borderColor: `${TYPE_TEXT[topic.type]}22` }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3 h-3" style={{ color: TYPE_TEXT[topic.type] }} />
                          <span className="font-semibold capitalize" style={{ color: TYPE_TEXT[topic.type] }}>
                            {topic.type}
                          </span>
                        </div>
                        <p className="text-[#1A202C] leading-tight">{topic.title}</p>
                        {topic.hasAssessment && (
                          <Chip label="Assessed" size="small" sx={{ mt: 0.5, height: 16, fontSize: '0.6rem', bgcolor: '#FFF0F0', color: '#C53030' }} />
                        )}
                      </div>
                    );
                  })}
                  <button className="w-full text-center text-xs text-[#718096] hover:text-[#1E3A5F] py-1.5 border border-dashed border-[#E2E8F0] rounded-lg hover:border-[#1E3A5F] transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Add Topic
                  </button>
                </div>
              </div>
            ))}

            {/* Summary Sidebar */}
            <div className="min-w-[160px] px-3">
              <div className="bg-[#EBF0F8] rounded-xl p-4">
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E3A5F', mb: 2 }}>Term Summary</Typography>
                {[
                  { label: 'Total Topics', value: 8 },
                  { label: 'Total Assessments', value: 2 },
                  { label: 'Total Activities', value: 3 },
                  { label: 'Coverage', value: '50%' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between mb-1.5">
                    <Typography variant="caption" sx={{ color: '#718096' }}>{s.label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E3A5F' }}>{s.value}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {KANBAN_COLS.map(col => {
              const colWeeks = KANBAN_WEEKS.filter(w => w.status === col.id);
              return (
                <div key={col.id} className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A202C' }}>{col.label}</Typography>
                    <span className="ml-auto text-xs text-[#718096]">{colWeeks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colWeeks.map(w => (
                      <div
                        key={w.week}
                        className="p-3 border rounded-lg text-xs cursor-grab"
                        style={{ borderColor: `${col.color}44`, backgroundColor: `${col.color}0D` }}
                      >
                        <div className="font-bold text-[#1E3A5F] mb-0.5">Week {w.week}</div>
                        <div className="text-[#4A5568] mb-1">{w.topic}</div>
                        <div className="flex items-center gap-1.5">
                          <Chip label={w.section} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                          {w.status === 'covered' && !w.onTime && (
                            <span className="text-[#D69E2E] text-xs">⚠ Late</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {colWeeks.length === 0 && (
                      <div className="text-center py-4 text-xs text-[#718096]">—</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
