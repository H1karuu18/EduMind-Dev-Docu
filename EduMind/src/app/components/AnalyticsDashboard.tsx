import { Typography, Box, Chip } from '@mui/material';
import { TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SUBMISSION_DATA = [
  { week: 'W1', submitted: 4 }, { week: 'W2', submitted: 7 }, { week: 'W3', submitted: 12 },
  { week: 'W4', submitted: 9 }, { week: 'W5', submitted: 15 }, { week: 'W6', submitted: 11 },
  { week: 'W7', submitted: 18 }, { week: 'W8', submitted: 14 },
];

const TURNAROUND_DATA = [
  { name: 'Dr. Dela Cruz', hours: 2.1 },
  { name: 'Prof. Reyes', hours: 3.8 },
  { name: 'Dr. Santos', hours: 4.5 },
  { name: 'Prof. Cruz', hours: 2.9 },
  { name: 'Dr. Mendoza', hours: 6.1 },
];

const STATUS_DATA = [
  { name: 'Approved', value: 28, color: '#38A169' },
  { name: 'In Review', value: 8, color: '#D69E2E' },
  { name: 'Submitted', value: 5, color: '#2B6CB0' },
  { name: 'Draft', value: 4, color: '#718096' },
  { name: 'Returned', value: 3, color: '#E53E3E' },
];

const FACULTY_TABLE = [
  { name: 'Dr. Juan Dela Cruz', subjects: 3, submitted: 3, approved: 3, score: 100 },
  { name: 'Prof. Ana Reyes', subjects: 2, submitted: 2, approved: 2, score: 100 },
  { name: 'Dr. Ramon Santos', subjects: 4, submitted: 3, approved: 3, score: 75 },
  { name: 'Prof. Liza Cruz', subjects: 2, submitted: 2, approved: 1, score: 50 },
  { name: 'Dr. Jose Mendoza', subjects: 3, submitted: 1, approved: 0, score: 0 },
];

const KPI_CARDS = [
  {
    label: 'Avg. Syllabus Preparation Time',
    value: '4.2 hrs',
    baseline: 'vs. 12–30 hr baseline',
    trend: 'down',
    color: '#38A169',
  },
  {
    label: 'Avg. ED Approval Time',
    value: '3.8 hrs',
    baseline: 'vs. 8 hr baseline',
    trend: 'down',
    color: '#38A169',
  },
  {
    label: 'Untracked Revisions This Term',
    value: '0',
    baseline: 'All changes logged',
    trend: 'ok',
    color: '#38A169',
  },
  {
    label: 'Active Cross-Section Misalignments',
    value: '1',
    baseline: 'Section B — MNTSDEV',
    trend: 'warn',
    color: '#D69E2E',
  },
];

export default function AnalyticsDashboard() {
  return (
    <div className="h-full overflow-y-auto bg-[#F8F9FA]">
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-4">
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C' }}>Analytics Dashboard</Typography>
        <Typography variant="body2" sx={{ color: '#718096' }}>SOCIT — T1 AY 2026–2027</Typography>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {KPI_CARDS.map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <Typography variant="h4" sx={{ fontWeight: 800, color: card.color, mb: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 500, mb: 0.5 }}>
                {card.label}
              </Typography>
              <div className="flex items-center gap-1">
                {card.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-[#38A169]" />}
                {card.trend === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-[#D69E2E]" />}
                {card.trend === 'ok' && <CheckCircle className="w-3.5 h-3.5 text-[#38A169]" />}
                <Typography variant="caption" sx={{ color: '#718096' }}>{card.baseline}</Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Line chart */}
          <div className="col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 3 }}>
              Submission Rate Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={SUBMISSION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#718096' }} />
                <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
                <Tooltip />
                <Line type="monotone" dataKey="submitted" stroke="#1E3A5F" strokeWidth={2} dot={{ fill: '#1E3A5F', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 3 }}>
              Syllabus Status Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                  {STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {STATUS_DATA.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <Typography variant="caption" sx={{ flex: 1, color: '#718096' }}>{s.name}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A202C' }}>{s.value}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 3 }}>
            Approval Turnaround Time per Faculty (hours)
          </Typography>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TURNAROUND_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
              <Tooltip />
              <Bar dataKey="hours" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faculty Compliance Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C' }}>
              Faculty Compliance Summary
            </Typography>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
                {['Name', 'Subjects', 'Submitted', 'Approved', 'Compliance Score'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#718096] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FACULTY_TABLE.map((row, i) => (
                <tr key={row.name} className="border-b border-[#E2E8F0] hover:bg-[#F8F9FA]">
                  <td className="px-5 py-3"><Typography variant="body2" sx={{ fontWeight: 500 }}>{row.name}</Typography></td>
                  <td className="px-5 py-3"><Typography variant="body2" sx={{ color: '#718096' }}>{row.subjects}</Typography></td>
                  <td className="px-5 py-3"><Typography variant="body2" sx={{ color: '#718096' }}>{row.submitted}</Typography></td>
                  <td className="px-5 py-3"><Typography variant="body2" sx={{ color: '#718096' }}>{row.approved}</Typography></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E2E8F0] rounded-full h-1.5" style={{ maxWidth: 80 }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${row.score}%`,
                            backgroundColor: row.score === 100 ? '#38A169' : row.score >= 50 ? '#D69E2E' : '#E53E3E',
                          }}
                        />
                      </div>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A202C' }}>{row.score}%</Typography>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
