import { Alert, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { BookOpen, Chrome, Building2, Mail } from 'lucide-react';

type OAuthProvider = 'google' | 'azure';
type DemoRole = 'Educator' | 'Reviewer' | 'Admin';

const DEMO_ROLES: { label: string; role: DemoRole }[] = [
  { label: 'Educator / Faculty', role: 'Educator' },
  { label: 'Reviewer / Executive Director', role: 'Reviewer' },
  { label: 'Admin', role: 'Admin' },
];

interface PublicLoginProps {
  onSignIn: (provider: OAuthProvider) => void;
  onDemoSignIn?: (role: DemoRole) => void;
  onSignOut?: () => void;
  onPasswordSignIn?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string) => void;
  supabaseConfigured?: boolean;
  error: string;
  message?: string;
  loading: boolean;
}

export default function PublicLogin({
  onSignIn,
  onDemoSignIn,
  onSignOut,
  onPasswordSignIn,
  onRegister,
  supabaseConfigured = true,
  error,
  message,
  loading,
}: PublicLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = () => {
    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (!onRegister) {
        setFormError('Email registration is not available right now.');
        return;
      }
      setFormError('');
      onRegister(email.trim(), password);
      return;
    }

    if (!onPasswordSignIn) {
      setFormError('Email sign-in is not available right now.');
      return;
    }
    setFormError('');
    onPasswordSignIn(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#1a3357] to-[#0f2040]">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>EduMind</Typography>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
              Welcome to EduMind
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', textAlign: 'center', mb: 3 }}>
              Sign in securely with your Google, Microsoft, or email account.
            </Typography>

            {!supabaseConfigured && !onDemoSignIn && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                Supabase is not configured for this build. Set VITE_SUPABASE_URL and
                VITE_SUPABASE_PUBLISHABLE_KEY in your deployment settings, then redeploy.
                SUPABASE_URL and a public anon/publishable SUPABASE_KEY are also supported.
                Never use a service-role or secret key here.
              </Alert>
            )}
            {(error || formError) && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                {error || formError}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
                {message}
              </Alert>
            )}
            {onSignOut && (
              <Button
                fullWidth
                variant="text"
                onClick={onSignOut}
                sx={{ textTransform: 'none', mb: 1, color: '#1E3A5F' }}
              >
                Sign out of the current session
              </Button>
            )}

            <div className="space-y-2">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Chrome className="w-4 h-4" />}
                onClick={() => onSignIn('google')}
                disabled={loading || !supabaseConfigured}
                sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, color: '#1A202C', borderColor: '#E2E8F0' }}
              >
                Continue with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Building2 className="w-4 h-4" />}
                onClick={() => onSignIn('azure')}
                disabled={loading || !supabaseConfigured}
                sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, color: '#1A202C', borderColor: '#E2E8F0' }}
              >
                Continue with Microsoft
              </Button>
            </div>

            {onDemoSignIn && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                  <Typography variant="caption" sx={{ color: '#718096' }}>local presentation demo</Typography>
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                </div>
                <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
                  Demo mode is local to this development server and does not sign in to Supabase.
                </Alert>
                <div className="flex flex-col gap-2">
                  {DEMO_ROLES.map((demo) => (
                    <Button
                      key={demo.role}
                      fullWidth
                      variant="outlined"
                      disabled={loading}
                      onClick={() => onDemoSignIn(demo.role)}
                      sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 44 }}
                    >
                      Open {demo.label} demo
                    </Button>
                  ))}
                </div>
              </>
            )}

            {(onPasswordSignIn || onRegister) && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                  <Typography variant="caption" sx={{ color: '#718096' }}>or</Typography>
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                </div>

                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formError) setFormError('');
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (formError) setFormError('');
                  }}
                  sx={{ mb: 2 }}
                />
                {isRegisterMode && (
                  <TextField
                    fullWidth
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (formError) setFormError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !loading) {
                        handleSubmit();
                      }
                    }}
                    sx={{ mb: 2 }}
                  />
                )}

                <div className="flex gap-2 mb-2">
                  <Button
                    fullWidth
                    variant={isRegisterMode ? 'contained' : 'outlined'}
                    onClick={() => setIsRegisterMode(false)}
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 40 }}
                  >
                    Sign in
                  </Button>
                  <Button
                    fullWidth
                    variant={isRegisterMode ? 'outlined' : 'contained'}
                    onClick={() => setIsRegisterMode(true)}
                    sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 40 }}
                  >
                    Register
                  </Button>
                </div>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Mail className="w-4 h-4" />}
                  onClick={handleSubmit}
                  disabled={loading || !supabaseConfigured || !email || !password || (isRegisterMode && !confirmPassword)}
                  sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, bgcolor: '#1E3A5F' }}
                >
                  {isRegisterMode ? 'Create account with email' : 'Sign in with email'}
                </Button>
              </>
            )}

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#718096', mt: 3, lineHeight: 1.5 }}>
              Your first successful sign-in creates an Educator profile. Use Google, Microsoft, or email password registration to continue.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
