import { useState } from 'react';
import {
  TextField, Button, Typography, Box, Alert, Checkbox,
  FormControlLabel, Divider, MenuItem, Select, FormControl, InputLabel, Tabs, Tab
} from '@mui/material';
import { BookOpen, Chrome, Building2 } from 'lucide-react';

type Mode = 'individual' | 'enterprise';
type Role = 'individual' | 'faculty' | 'executive_director' | 'admin';
type Plan = 'free' | 'pro' | 'pro_plus';

interface PublicLoginProps {
  onLogin: (mode: Mode, role: Role, name: string, plan?: Plan) => void;
  onNavigate: (page: string) => void;
}

const DEMO_ACCOUNTS = [
  { email: 'free@edumind.com', password: 'password', mode: 'individual' as Mode, role: 'individual' as Role, name: 'Alex Rivera', plan: 'free' as Plan },
  { email: 'pro@edumind.com', password: 'password', mode: 'individual' as Mode, role: 'individual' as Role, name: 'Sam Chen', plan: 'pro' as Plan },
  { email: 'faculty@apc.edu.ph', password: 'password', mode: 'enterprise' as Mode, role: 'faculty' as Role, name: 'Dr. Juan Dela Cruz', plan: undefined },
  { email: 'ed@apc.edu.ph', password: 'password', mode: 'enterprise' as Mode, role: 'executive_director' as Role, name: 'Dr. Maria Santos', plan: undefined },
  { email: 'admin@apc.edu.ph', password: 'password', mode: 'enterprise' as Mode, role: 'admin' as Role, name: 'Admin User', plan: undefined },
];

export default function PublicLogin({ onLogin, onNavigate }: PublicLoginProps) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Lecturer');
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      setError('');
      onLogin(account.mode, account.role, account.name, account.plan);
    } else {
      setError('Invalid credentials. See demo accounts below.');
    }
  };

  const handleSignup = () => {
    if (!fullName || !signupEmail || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    onLogin('individual', 'individual', fullName, 'free');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#1a3357] to-[#0f2040]">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>EduMind</Typography>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            sx={{
              borderBottom: '1px solid #E2E8F0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, flex: 1 },
              '& .Mui-selected': { color: '#E63946' },
              '& .MuiTabs-indicator': { backgroundColor: '#E63946' }
            }}
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box className="p-8">
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>
            )}

            {tab === 0 ? (
              <>
                <TextField
                  fullWidth label="Institutional Email or Username"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth label="Password" type="password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  sx={{ mb: 1 }}
                />
                <div className="flex items-center justify-between mb-4">
                  <FormControlLabel
                    control={<Checkbox size="small" checked={remember} onChange={e => setRemember(e.target.checked)} />}
                    label={<Typography variant="caption">Remember me</Typography>}
                  />
                  <button className="text-xs text-[#1E3A5F] hover:underline">Forgot password?</button>
                </div>
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleLogin}
                  sx={{ bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px', minHeight: 44, fontWeight: 600, mb: 3, '&:hover': { bgcolor: '#cc2f3b' } }}
                >
                  Log In
                </Button>
                <Divider sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#718096' }}>or</Typography>
                </Divider>
                <div className="space-y-2">
                  <Button
                    fullWidth variant="outlined" startIcon={<Chrome className="w-4 h-4" />}
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, color: '#1A202C', borderColor: '#E2E8F0' }}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    fullWidth variant="outlined" startIcon={<Building2 className="w-4 h-4" />}
                    onClick={() => onNavigate('enterprise-login')}
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44, color: '#1A202C', borderColor: '#E2E8F0' }}
                  >
                    Continue with SSO
                  </Button>
                </div>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#718096', mt: 3, lineHeight: 1.5 }}>
                  Enterprise users: your login domain determines your workspace — user@apc.edu.ph will be routed to EduMind APC
                </Typography>
              </>
            ) : (
              <>
                <TextField fullWidth label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="Password" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} sx={{ mb: 2 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>I am a...</InputLabel>
                  <Select value={role} onChange={e => setRole(e.target.value)} label="I am a...">
                    {['Lecturer', 'Teacher', 'Academic Practitioner', 'Other'].map(r => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox size="small" checked={agreed} onChange={e => setAgreed(e.target.checked)} />}
                  label={<Typography variant="caption">I agree to the Terms and Privacy Policy</Typography>}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleSignup}
                  disabled={!agreed}
                  sx={{ bgcolor: '#E63946', textTransform: 'none', borderRadius: '8px', minHeight: 44, fontWeight: 600, '&:hover': { bgcolor: '#cc2f3b' } }}
                >
                  Create Free Account
                </Button>
              </>
            )}

            {tab === 0 && (
              <Box className="mt-4 p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]">
                <Typography variant="caption" sx={{ color: '#718096', display: 'block', fontWeight: 600, mb: 0.5 }}>
                  Demo accounts (password: password)
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                  free@edumind.com · pro@edumind.com · faculty@apc.edu.ph · ed@apc.edu.ph · admin@apc.edu.ph
                </Typography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}
