import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '../../imports/Screenshot_2026-05-19_111637.png';

type Role = 'faculty' | 'executive_director' | 'admin';

interface LoginPageProps {
  onLogin: (role: Role, name: string) => void;
}

const DEMO_ACCOUNTS: { email: string; password: string; role: Role; name: string }[] = [
  { email: 'faculty@apc.edu.ph', password: 'password', role: 'faculty', name: 'Dr. Juan Dela Cruz' },
  { email: 'ed@apc.edu.ph', password: 'password', role: 'executive_director', name: 'Dr. Maria Santos' },
  { email: 'admin@apc.edu.ph', password: 'password', role: 'admin', name: 'Admin User' },
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      setError('');
      onLogin(account.role, account.name);
    } else {
      setError('Invalid credentials. Try: faculty@apc.edu.ph / password');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      <Paper
        elevation={4}
        sx={{ borderRadius: '8px', width: 420, p: 0, overflow: 'hidden' }}
      >
        <Box className="bg-white px-10 py-8 flex flex-col items-center">
          <ImageWithFallback
            src={logoImage}
            alt="IknowVate Logo"
            className="h-24 w-auto object-contain mb-4"
          />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" className="text-gray-500 text-center mb-6">
            Smart-Assisted Knowledge Management System — SOCIT, APC
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Institutional Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ textTransform: 'none', py: 1.5, mb: 2, borderRadius: '8px' }}
          >
            Log In
          </Button>

          <Button variant="text" size="small" sx={{ textTransform: 'none', color: 'gray' }}>
            Forgot password?
          </Button>
        </Box>

        <Box className="bg-gray-50 px-10 py-3 border-t border-gray-200 text-center">
          <Typography variant="caption" className="text-gray-500">
            Role is automatically assigned upon login via RBAC.
          </Typography>
          <Typography variant="caption" className="block text-gray-400 mt-1">
            Demo: faculty@apc.edu.ph · ed@apc.edu.ph · admin@apc.edu.ph (password: password)
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
