import { useState, useRef, useEffect } from 'react';
import { TextField, Paper, Typography, IconButton, Avatar, Box, Chip } from '@mui/material';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SAMPLE_SUGGESTIONS = [
  'Help me write learning outcomes for Week 1',
  'Suggest activities for teaching algorithms',
  'What assessments work well for programming courses?',
  'Generate a course description for Data Structures'
];

const AI_RESPONSES: Record<string, string> = {
  'learning outcomes': `Here are some effective learning outcomes for your week:

• Students will be able to explain and apply fundamental concepts
• Students will demonstrate proficiency in practical implementation
• Students will analyze and evaluate different approaches to problem-solving
• Students will design solutions using appropriate methodologies

Would you like me to customize these for your specific topic?`,

  'activities': `Here are engaging learning activities:

**Hands-on Activities:**
• Interactive coding exercises with real-world examples
• Collaborative problem-solving in small groups
• Live coding demonstrations with student participation

**Assessment Activities:**
• Formative quizzes to check understanding
• Peer code review sessions
• Mini-projects applying weekly concepts

Which would work best for your course?`,

  'assessments': `Recommended assessment strategies:

**Formative Assessments:**
• Weekly coding exercises (10-15 minutes)
• Concept check quizzes (multiple choice + short answer)
• Peer review activities

**Summative Assessments:**
• Programming assignments (weighted 20-30%)
• Midterm project (25%)
• Final project with documentation (30%)

These align with Bloom's Taxonomy and SOCIT's assessment guidelines.`,

  'course description': `I can help you write a comprehensive course description. Here's a template:

**[Course Title]** provides students with foundational knowledge in [key concepts]. Through hands-on exercises and project-based learning, students will develop proficiency in [skills].

The course covers:
• [Major topic 1]
• [Major topic 2]
• [Major topic 3]

Prerequisites: [List prerequisites]
Learning Mode: [Lecture/Lab/Blended]

Would you like me to customize this for your specific course?`
};

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for syllabus creation. I can help you with learning outcomes, activities, assessments, and course planning. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(AI_RESPONSES)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return `I understand you're asking about "${userMessage}". Here are some suggestions:

• Consider aligning this with your course learning objectives
• Refer to SOCIT's curriculum guidelines for best practices
• Think about how this fits into your overall course structure

Would you like specific recommendations for learning outcomes, activities, or assessments?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <Typography variant="h6" className="font-bold text-white">
              AI Assistant
            </Typography>
            <Typography variant="caption" className="text-blue-100">
              Syllabus Planning Support
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <Avatar
              sx={{
                bgcolor: message.role === 'user' ? '#2563eb' : '#10b981',
                width: 36,
                height: 36
              }}
            >
              {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </Avatar>
            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <Paper
                elevation={1}
                className={`p-3 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Typography variant="body2" className="whitespace-pre-wrap">
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  className={`block mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Paper>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Avatar sx={{ bgcolor: '#10b981', width: 36, height: 36 }}>
              <Bot className="w-5 h-5" />
            </Avatar>
            <Paper elevation={1} className="p-3 bg-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </Paper>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <Typography variant="caption" className="text-gray-600 font-medium">
              Try asking:
            </Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SUGGESTIONS.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-blue-100"
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Box className="flex gap-2">
          <TextField
            fullWidth
            size="small"
            placeholder="Ask me anything about your syllabus..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' }
            }}
          >
            <Send className="w-5 h-5" />
          </IconButton>
        </Box>
      </div>
    </div>
  );
}
