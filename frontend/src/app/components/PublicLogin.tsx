import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { BookOpen, Building2, Chrome, Eye, EyeOff, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

type OAuthProvider = 'google' | 'azure';

interface PublicLoginProps {
  onSignIn: (provider: OAuthProvider) => void;
  onDemoSignIn?: (email: string, password: string) => void;
  onSignOut?: () => void;
  onPasswordSignIn?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string) => void;
  onNavigate?: (path: string) => void;
  initialMode?: 'login' | 'register';
  supabaseConfigured?: boolean;
  localDemoMode?: boolean;
  error: string;
  message?: string;
  loading: boolean;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isStrongPassword(value: string) {
  return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}

export default function PublicLogin({
  onSignIn,
  onDemoSignIn,
  onSignOut,
  onPasswordSignIn,
  onRegister,
  onNavigate,
  initialMode = 'login',
  supabaseConfigured = true,
  localDemoMode = false,
  error,
  message,
  loading,
}: PublicLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    if (localDemoMode) {
      onDemoSignIn?.(trimmedEmail, password);
      return;
    }

    if (isRegisterMode) {
      if (!isStrongPassword(password)) {
        setFormError('Use at least 8 characters with uppercase, lowercase, and a number.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      if (!onRegister) {
        setFormError('Email registration is not available right now.');
        return;
      }
      setFormError('');
      onRegister(trimmedEmail, password);
      return;
    }

    if (!onPasswordSignIn) {
      setFormError('Email sign-in is not available right now.');
      return;
    }
    setFormError('');
    onPasswordSignIn(trimmedEmail, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A5F] via-[#1a3357] to-[#0f2040] px-4">
      <div className="w-full max-w-md">
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
              {isRegisterMode ? 'Create your account' : 'Welcome back'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', textAlign: 'center', mb: 3 }}>
              {isRegisterMode
                ? 'Set up your EduMind workspace and start organizing your course materials.'
                : 'Sign in securely with your Google, Microsoft, or email account.'}
            </Typography>

            {!localDemoMode && !supabaseConfigured && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                Supabase is not configured for this build. Set VITE_SUPABASE_URL and
                VITE_SUPABASE_PUBLISHABLE_KEY in your deployment settings, then redeploy.
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

            {!localDemoMode && (
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
            )}

            {localDemoMode && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                  <Typography variant="caption" sx={{ color: '#718096' }}>local demo sign-in</Typography>
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                </div>
                <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
                  These presentation-only credentials are local to this development server and do not use Supabase.
                </Alert>
              </>
            )}

            {(localDemoMode || onPasswordSignIn || onRegister) && (
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (formError) setFormError('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !loading) handleSubmit();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword((value) => !value)}
                          edge="end"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                {!localDemoMode && isRegisterMode && (
                  <TextField
                    fullWidth
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (formError) setFormError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !loading) handleSubmit();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword((value) => !value)}
                            edge="end"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                )}

                {!localDemoMode && (
                  <div className="flex items-center justify-end mb-2">
                    <Button
                      variant="text"
                      onClick={() => onNavigate?.('/forgot-password')}
                      sx={{ textTransform: 'none', color: '#1E3A5F', p: 0 }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                {!localDemoMode && (
                  <div className="flex gap-2 mb-2">
                    <Button
                      fullWidth
                      variant={!isRegisterMode ? 'contained' : 'outlined'}
                      onClick={() => {
                        setIsRegisterMode(false);
                        setFormError('');
                        onNavigate?.('/login');
                      }}
                      sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 40 }}
                    >
                      Sign in
                    </Button>
                    <Button
                      fullWidth
                      variant={isRegisterMode ? 'contained' : 'outlined'}
                      onClick={() => {
                        setIsRegisterMode(true);
                        setFormError('');
                        onNavigate?.('/signup');
                      }}
                      sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 40 }}
                    >
                      Register
                    </Button>
                  </div>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Mail className="w-4 h-4" />}
                  onClick={handleSubmit}
                  disabled={loading || (!localDemoMode && !supabaseConfigured) || !email || !password || (!localDemoMode && isRegisterMode && !confirmPassword)}
                  sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, bgcolor: '#1E3A5F' }}
                >
                  {localDemoMode ? 'Sign in to demo account' : isRegisterMode ? 'Create account with email' : 'Sign in with email'}
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
