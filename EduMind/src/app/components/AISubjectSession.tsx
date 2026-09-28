import { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, IconButton, Chip, Divider } from '@mui/material';
import { Send, Upload, X, FileText, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'ai',
    text: 'Hello! I\'m the EduMind AI assistant for CS301 — Database Management Systems. I can answer questions about the course materials you\'ve uploaded. How can I help you today?',
    time: '10:00 AM',
  },
  {
    id: 2,
    role: 'user',
    text: 'What are the key normalization concepts covered in the uploaded syllabus?',
    time: '10:01 AM',
  },
  {
    id: 3,
    role: 'ai',
    text: 'Based on the uploaded syllabus, the normalization concepts covered include: First Normal Form (1NF) — eliminating repeating groups, Second Normal Form (2NF) — removing partial dependencies, and Third Normal Form (3NF) — removing transitive dependencies. These are discussed in Weeks 5–7 of the course outline.',
    time: '10:01 AM',
  },
];

const UPLOADED_MATERIALS = [
  { id: '1', name: 'CS301_Syllabus_v1.1.pdf', type: 'PDF' },
  { id: '2', name: 'Week3_ERD_Lecture.pptx', type: 'PPTX' },
  { id: '3', name: 'DB_Normalization_Guide.docx', type: 'DOCX' },
];

export default function AISubjectSession() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [materials, setMaterials] = useState(UPLOADED_MATERIALS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1,
      role: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const aiMsg: Message = {
      id: messages.length + 2,
      role: 'ai',
      text: 'Based on the course materials uploaded to this session, I can provide guidance on that topic. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Please refer to the specific uploaded document for more detailed information.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left — Session Info Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <Box className="p-5 border-b border-gray-100">
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            AI Subject Session
          </Typography>
          <Typography variant="body2" className="text-gray-600 mb-3">
            CS301 — Database Management Systems
          </Typography>

          <div className="space-y-1 mb-2">
            <div className="flex gap-2">
              <Typography variant="caption" className="text-gray-400 w-16">Term:</Typography>
              <Typography variant="caption" className="text-gray-600">1st Sem 2025-2026</Typography>
            </div>
            <div className="flex gap-2">
              <Typography variant="caption" className="text-gray-400 w-16">Section:</Typography>
              <Typography variant="caption" className="text-gray-600">Section A</Typography>
            </div>
          </div>
        </Box>

        <Box className="p-5 flex-1 overflow-y-auto">
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Uploaded Materials
          </Typography>

          <div className="space-y-2">
            {materials.map(material => (
              <div
                key={material.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Typography variant="caption" className="block truncate text-gray-700">
                    {material.name}
                  </Typography>
                  <Chip label={material.type} size="small" sx={{ height: 16, fontSize: '0.6rem', mt: 0.5 }} />
                </div>
                <IconButton
                  size="small"
                  onClick={() => removeMaterial(material.id)}
                  sx={{ p: 0.5 }}
                >
                  <X className="w-3 h-3 text-gray-400" />
                </IconButton>
              </div>
            ))}
          </div>
        </Box>

        <Box className="p-5 border-t border-gray-100">
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Upload className="w-4 h-4" />}
            sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
          >
            Add Materials to Session
          </Button>
        </Box>
      </div>

      {/* Right — Chat Interface */}
      <div className="flex-1 flex flex-col">
        <Box className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              IknowVate AI — CS301 Session
            </Typography>
          </div>
        </Box>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'ai' ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                {msg.role === 'ai'
                  ? <Bot className="w-4 h-4 text-blue-600" />
                  : <User className="w-4 h-4 text-gray-600" />
                }
              </div>
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: msg.role === 'ai' ? 'white' : '#3b82f6',
                    border: msg.role === 'ai' ? '1px solid #e5e7eb' : 'none',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: msg.role === 'user' ? 'white' : 'text.primary' }}
                  >
                    {msg.text}
                  </Typography>
                </Paper>
                <Typography variant="caption" className="text-gray-400 mt-1 px-1">
                  {msg.time}
                </Typography>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <Box className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3 mb-2">
            <TextField
              fullWidth
              placeholder="Ask a question about your course materials..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              multiline
              maxRows={3}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!inputText.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '8px',
                width: 44,
                height: 44,
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'grey.200' },
              }}
            >
              <Send className="w-4 h-4" />
            </IconButton>
          </div>
          <Typography variant="caption" className="text-gray-400 block text-center">
            Responses are generated from uploaded session materials only. No external sources are used.
          </Typography>
        </Box>
      </div>
    </div>
  );
}
