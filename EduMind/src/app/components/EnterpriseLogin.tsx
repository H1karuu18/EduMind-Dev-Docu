import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { BookOpen, Building2 } from 'lucide-react';

type Role = 'faculty' | 'executive_director' | 'admin';

interface EnterpriseLoginProps {
  onLogin: (role: Role, name: string) => void;
  onNavigate: (page: string) => void;
}

const DEMO_ACCOUNTS = [
  { email: 'faculty@apc.edu.ph', password: 'password', role: 'faculty' as Role, name: 'Dr. Juan Dela Cruz' },
  { email: 'ed@apc.edu.ph', password: 'password', role: 'executive_director' as Role, name: 'Dr. Maria Santos' },
  { email: 'admin@apc.edu.ph', password: 'password', role: 'admin' as Role, name: 'Admin User' },
];

export default function EnterpriseLogin({ onLogin, onNavigate }: EnterpriseLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      onLogin(account.role, account.name);
    } else {
      setError('Invalid credentials. Use faculty@apc.edu.ph / ed@apc.edu.ph / admin@apc.edu.ph (password: password)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#1a3357] to-[#0f2040]">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1 }}>EduMind APC</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Asia Pacific College</Typography>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#1E3A5F] px-8 py-6">
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
              EduMind APC — Smart-Assisted Knowledge Management
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Sign in with your APC institutional account
            </Typography>
          </div>

          <Box className="p-8">
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}

            <TextField
              fullWidth label="Institutional Email"
              placeholder="user@apc.edu.ph"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth variant="contained" size="large" onClick={handleLogin}
              sx={{ bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px', minHeight: 44, fontWeight: 600, mb: 2, '&:hover': { bgcolor: '#cc2f3b' } }}
            >
              Sign In
            </Button>
            <Button
              fullWidth variant="outlined" size="large"
              startIcon={<Building2 className="w-4 h-4" />}
              sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, borderColor: '#E2E8F0', color: '#1A202C' }}
            >
              Sign in with SSO
            </Button>

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#718096', mt: 3 }}>
              This portal is exclusively for Asia Pacific College faculty and administrators.{' '}
              <button className="text-[#1E3A5F] hover:underline" onClick={() => onNavigate('login')}>
                For personal use, visit edumind.com
              </button>
            </Typography>

            <Box className="mt-4 p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]">
              <Typography variant="caption" sx={{ color: '#718096', display: 'block', fontWeight: 600, mb: 0.5 }}>
                Demo accounts (password: password)
              </Typography>
              <Typography variant="caption" sx={{ color: '#718096' }}>
                faculty@apc.edu.ph · ed@apc.edu.ph · admin@apc.edu.ph
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}
