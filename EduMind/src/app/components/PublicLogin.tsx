import { Alert, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { BookOpen, Chrome, Building2 } from 'lucide-react';

type OAuthProvider = 'google' | 'azure';

interface PublicLoginProps {
  onSignIn: (provider: OAuthProvider) => void;
  onSignOut?: () => void;
  onPasswordSignIn?: (email: string, password: string) => void;
  error: string;
  loading: boolean;
}

export default function PublicLogin({
  onSignIn,
  onSignOut,
  onPasswordSignIn,
  error,
  loading,
}: PublicLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              Sign in securely with your Google or Microsoft account.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
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
                disabled={loading}
                sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, color: '#1A202C', borderColor: '#E2E8F0' }}
              >
                Continue with Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Building2 className="w-4 h-4" />}
                onClick={() => onSignIn('azure')}
                disabled={loading}
                sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, color: '#1A202C', borderColor: '#E2E8F0' }}
              >
                Continue with Microsoft
              </Button>
            </div>

            {onPasswordSignIn && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                  <Typography variant="caption" sx={{ color: '#718096' }}>test account</Typography>
                  <span className="h-px flex-1 bg-[#E2E8F0]" />
                </div>
                <TextField
                  fullWidth
                  label="Test account email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && email && password && !loading) {
                      onPasswordSignIn(email, password);
                    }
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onPasswordSignIn(email, password)}
                  disabled={loading || !email || !password}
                  sx={{ textTransform: 'none', borderRadius: '8px', minHeight: 48, bgcolor: '#1E3A5F' }}
                >
                  Sign in with test account
                </Button>
              </>
            )}

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#718096', mt: 3, lineHeight: 1.5 }}>
              Your first successful sign-in creates an Educator profile. Password authentication is only shown when enabled for testing.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
