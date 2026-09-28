import { useState, useRef, useEffect } from 'react';
import {
  Typography, Button, TextField, IconButton, Chip, LinearProgress, Box
} from '@mui/material';
import { Send, Upload, X, FileText, Bot, User, Users, UserPlus, ArrowRight } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
  source?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: 'ai',
    text: "Hello! I'm EduMind AI for MNTSDEV T1. I can answer questions based on the course materials you've uploaded to this session. No external sources are used.",
    time: '10:00 AM',
  },
  {
    id: 2, role: 'user',
    text: 'What topics have I covered up to Week 4 based on my roadmap?',
    time: '10:02 AM',
  },
  {
    id: 3, role: 'ai',
    text: 'Based on your uploaded roadmap and syllabus, you have covered: Week 1 — Introduction to Systems Analysis, Week 2 — Requirements Gathering, Week 3 — Use Case Modeling, Week 4 — Activity Diagrams.',
    time: '10:02 AM',
    source: 'MNTSDEV_Syllabus_v1.2.pdf',
  },
];

const MATERIALS = [
  { id: '1', name: 'MNTSDEV_Syllabus_v1.2.pdf', status: 'indexed' },
  { id: '2', name: 'Week1_Lecture.pptx', status: 'indexed' },
  { id: '3', name: 'Week2_Activity_Guide.docx', status: 'indexing' },
  { id: '4', name: 'Week3_UML_Reference.pdf', status: 'pending' },
  { id: '5', name: 'Week4_Lab_Instructions.docx', status: 'pending' },
];

const COLLABORATORS = [
  { name: 'J. Lopez', role: 'Viewer' },
  { name: 'M. Cruz', role: 'Editor' },
];

export default function AIKnowledgeSession() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [materials, setMaterials] = useState(MATERIALS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1, role: 'user', text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const aiMsg: Message = {
      id: messages.length + 2, role: 'ai',
      text: 'Based on the uploaded session materials, here is the relevant information for your query. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'MNTSDEV_Syllabus_v1.2.pdf',
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText('');
  };

  const indexedCount = materials.filter(m => m.status === 'indexed').length;

  return (
    <div className="h-full flex bg-[#F8F9FA]">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E2E8F0]">
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', mb: 0.5 }}>
            AI Knowledge Session
          </Typography>
          <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
            MNTSDEV — Systems Analysis
          </Typography>
          <Chip
            label="Scoped to MNTSDEV T1 — No external sources"
            size="small"
            sx={{ bgcolor: '#F0FFF4', color: '#276749', border: '1px solid #9AE6B4', fontSize: '0.65rem' }}
          />
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A202C' }}>
              Session Materials
            </Typography>
            <Typography variant="caption" sx={{ color: '#718096' }}>
              {indexedCount} of {materials.length} indexed
            </Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={(indexedCount / materials.length) * 100}
            sx={{ height: 4, borderRadius: 2, bgcolor: '#EBF0F8', mb: 3, '& .MuiLinearProgress-bar': { bgcolor: '#38A169' } }}
          />
          <div className="space-y-2 mb-4">
            {materials.map(m => (
              <div key={m.id} className="flex items-center gap-2 p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]">
                <FileText className="w-4 h-4 text-[#1E3A5F] shrink-0" />
                <div className="flex-1 min-w-0">
                  <Typography variant="caption" className="block truncate text-[#1A202C]">{m.name}</Typography>
                  <span className={`text-xs font-medium ${
                    m.status === 'indexed' ? 'text-[#38A169]' :
                    m.status === 'indexing' ? 'text-[#D69E2E]' : 'text-[#718096]'
                  }`}>
                    {m.status === 'indexed' ? '✅ Indexed' : m.status === 'indexing' ? '⏳ Indexing...' : '○ Pending'}
                  </span>
                </div>
                <IconButton size="small" onClick={() => setMaterials(p => p.filter(x => x.id !== m.id))} sx={{ p: 0.25 }}>
                  <X className="w-3 h-3 text-[#718096]" />
                </IconButton>
              </div>
            ))}
          </div>
          <Button
            fullWidth variant="outlined" size="small"
            startIcon={<Upload className="w-3.5 h-3.5" />}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, borderColor: '#E2E8F0', color: '#1E3A5F' }}
          >
            Upload Materials
          </Button>

          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#718096]" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A202C' }}>Collaborators</Typography>
            </div>
            <div className="space-y-2 mb-2">
              {COLLABORATORS.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E3A5F] flex items-center justify-center shrink-0">
                    <Typography variant="caption" sx={{ color: 'white', fontSize: '0.55rem', fontWeight: 700 }}>
                      {c.name[0]}
                    </Typography>
                  </div>
                  <Typography variant="caption" sx={{ flex: 1, color: '#4A5568' }}>{c.name}</Typography>
                  <Chip label={c.role} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                </div>
              ))}
            </div>
            <Button size="small" startIcon={<UserPlus className="w-3 h-3" />} sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#1E3A5F' }}>
              Invite Collaborator
            </Button>
          </div>
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#1E3A5F]" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A202C', flex: 1 }}>
            EduMind AI — MNTSDEV T1 Session
          </Typography>
          <Chip label="RAG" size="small" sx={{ bgcolor: '#EBF0F8', color: '#1E3A5F', fontWeight: 700, fontSize: '0.65rem' }} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-[#EBF0F8]' : 'bg-[#1E3A5F]'}`}>
                {msg.role === 'ai'
                  ? <Bot className="w-4 h-4 text-[#1E3A5F]" />
                  : <User className="w-4 h-4 text-white" />
                }
              </div>
              <div className={`max-w-[70%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: msg.role === 'user' ? '#1E3A5F' : 'white',
                    color: msg.role === 'user' ? 'white' : '#1A202C',
                    border: msg.role === 'ai' ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  {msg.text}
                </div>
                {msg.source && (
                  <div className="flex items-center gap-1 mt-1">
                    <FileText className="w-3 h-3 text-[#718096]" />
                    <Typography variant="caption" sx={{ color: '#718096', fontSize: '0.65rem' }}>
                      📄 {msg.source}
                    </Typography>
                  </div>
                )}
                <Typography variant="caption" sx={{ color: '#718096', mt: 0.5, fontSize: '0.65rem' }}>
                  {msg.time}
                </Typography>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-[#E2E8F0] p-4">
          <div className="flex gap-2 mb-2">
            <TextField
              fullWidth
              placeholder="Ask a question about your course materials..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              multiline maxRows={3} size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputText.trim()}
              sx={{
                bgcolor: '#E63946', color: 'white', borderRadius: '8px', width: 44, height: 44,
                '&:hover': { bgcolor: '#cc2f3b' },
                '&:disabled': { bgcolor: '#E2E8F0' }
              }}
            >
              <Send className="w-4 h-4" />
            </IconButton>
          </div>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#718096', fontSize: '0.65rem' }}>
            Responses are generated only from materials uploaded to this session. No external internet access.
          </Typography>
        </div>
      </div>
    </div>
  );
}
