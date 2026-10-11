import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LandingPage from "./components/LandingPage";
import PublicLogin from "./components/PublicLogin";
import IndividualDashboard from "./components/IndividualDashboard";
import LessonPlanBuilder from "./components/LessonPlanBuilder";
import CurriculumRoadmap from "./components/CurriculumRoadmap";
import AIKnowledgeSession from "./components/AIKnowledgeSession";
import CommitLog from "./components/CommitLog";
import CollaborationsPage from "./components/CollaborationsPage";
import Sidebar from "./components/Sidebar";
import EnterpriseFacultyDashboard from "./components/EnterpriseFacultyDashboard";
import SyllabusSubmission from "./components/SyllabusSubmission";
import PeerReviewScreen from "./components/PeerReviewScreen";
import ActivityBank from "./components/ActivityBank";
import AdminPanel from "./components/AdminPanel";
import VersionHistory from "./components/VersionHistory";
import CrossSectionMonitor from "./components/CrossSectionMonitor";
import EDDashboard from "./components/EDDashboard";
import SyllabusApprovalED from "./components/SyllabusApprovalED";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AISubjectSession from "./components/AISubjectSession";
import { getSupabaseClient, hasSupabaseConfig } from "./supabase";
import { authenticateLocalDemo } from "./demoAuth";

type EnterpriseRole = "faculty" | "executive_director" | "admin";
type IndividualPlan = "free" | "pro" | "pro_plus";
const localDemoEnabled =
  import.meta.env.DEV &&
  import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true";

interface UserProfile {
  auth_user_id: string;
  full_name: string;
  role: "Educator" | "Collaborator" | "Reviewer" | "Admin";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected authentication error occurred.";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isStrongPassword(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [demoProfile, setDemoProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [individualPlan] = useState<IndividualPlan>("free");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const currentUserId = useRef<string | null>(null);

  const isAuthenticated = Boolean(session || demoProfile);
  const intendedDestination =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (localDemoEnabled || !hasSupabaseConfig()) {
      setSession(null);
      setProfile(null);
      setDemoProfile(null);
      setLoading(false);
      setAuthError("");
      return;
    }

    let mounted = true;
    const profileLoads = new Map<string, Promise<UserProfile>>();

    const loadProfile = (user: User): Promise<UserProfile> => {
      const inProgress = profileLoads.get(user.id);
      if (inProgress) return inProgress;

      const request = (async () => {
        const client = getSupabaseClient();
        const { data: existing, error: lookupError } = await client
          .from("profiles")
          .select("auth_user_id, full_name, role")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (lookupError) throw lookupError;
        if (existing) return existing as UserProfile;
        if (!user.email) {
          throw new Error(
            "The OAuth provider did not return an email address. Enable email access for this provider.",
          );
        }

        const metadataName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.fullName;
        const fullName =
          typeof metadataName === "string" && metadataName.trim()
            ? metadataName.trim()
            : user.email?.split("@")[0] || "Educator";
        const avatarMetadata =
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
        const avatarUrl = typeof avatarMetadata === "string" ? avatarMetadata : null;

        const { error: insertError } = await client.from("profiles").upsert(
          {
            id: user.id,
            auth_user_id: user.id,
            full_name: fullName,
            email: user.email,
            avatar_url: avatarUrl,
            role: "Educator",
          },
          { onConflict: "auth_user_id", ignoreDuplicates: true },
        );
        if (insertError) throw insertError;

        const { data: created, error: createdError } = await client
          .from("profiles")
          .select("auth_user_id, full_name, role")
          .eq("auth_user_id", user.id)
          .single();
        if (createdError) throw createdError;
        return created as UserProfile;
      })().catch((error: unknown) => {
        profileLoads.delete(user.id);
        throw error;
      });

      profileLoads.set(user.id, request);
      return request;
    };

    const applySession = (nextSession: Session | null) => {
      if (!mounted) return;
      const nextUserId = nextSession?.user.id ?? null;
      currentUserId.current = nextUserId;
      setSession(nextSession);
      setDemoProfile(null);
      setAuthError("");
      setAuthMessage("");

      if (!nextSession) {
        profileLoads.clear();
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(null);
      setLoading(true);
      window.setTimeout(() => {
        void loadProfile(nextSession.user)
          .then((nextProfile) => {
            if (!mounted || currentUserId.current !== nextUserId) return;
            setProfile(nextProfile);
            setCurrentPage("dashboard");
            setLoading(false);
            if (location.pathname === "/login" || location.pathname === "/signup") {
              navigate("/dashboard", { replace: true });
            }
          })
          .catch((error: unknown) => {
            if (!mounted || currentUserId.current !== nextUserId) return;
            setAuthError(getErrorMessage(error));
            setLoading(false);
          });
      }, 0);
    };

    let unsubscribe = () => {};
    try {
      const client = getSupabaseClient();
      const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
        applySession(nextSession);
      });
      unsubscribe = () => data.subscription.unsubscribe();

      void client.auth.getSession()
        .then(({ data: sessionData, error }) => {
          if (error) throw error;
          applySession(sessionData.session);
        })
        .catch((error: unknown) => {
          if (!mounted) return;
          setAuthError(getErrorMessage(error));
          setLoading(false);
        });
    } catch (error) {
      setAuthError(getErrorMessage(error));
      setLoading(false);
    }

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [location.pathname, navigate]);

  const handleSignIn = async (provider: "google" | "azure") => {
    if (!hasSupabaseConfig()) {
      setAuthError(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.",
      );
      setAuthLoading(false);
      return;
    }

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          ...(provider === "azure" ? { scopes: "email" } : {}),
        },
      });
      if (error) throw error;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      setAuthLoading(false);
    }
  };

  const handlePasswordSignIn = async (email: string, password: string) => {
    if (!hasSupabaseConfig()) {
      setAuthError(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.",
      );
      setAuthLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setAuthError("Please use a valid email address.");
      setAuthLoading(false);
      return;
    }

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setAuthMessage("Signed in successfully.");
      navigate(intendedDestination, { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(
        message.includes("Invalid login") || message.includes("invalid login")
          ? "The email or password is incorrect. Please try again."
          : message,
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    if (!hasSupabaseConfig()) {
      setAuthError(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.",
      );
      setAuthLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setAuthError("Please enter a valid email address.");
      setAuthLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setAuthError(
        "Use at least 8 characters with uppercase, lowercase, and a number.",
      );
      setAuthLoading(false);
      return;
    }

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;

      if (data.user && !data.session) {
        setAuthMessage(
          "Account created. Please verify your email address before signing in.",
        );
        navigate("/login", { replace: true });
        return;
      }

      setAuthMessage("Account created successfully. Redirecting to your dashboard.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(
        message.includes("User already registered") || message.includes("already registered")
          ? "An account with this email already exists. Please sign in instead."
          : message,
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoSignIn = (email: string, password: string) => {
    if (!localDemoEnabled) return;
    const account = authenticateLocalDemo(email, password);
    if (!account) {
      setAuthError("That demo email or password is incorrect.");
      return;
    }
    setAuthError("");
    setAuthMessage("");
    setProfile(null);
    setDemoProfile({
      auth_user_id: `local-demo-${account.role.toLowerCase()}`,
      full_name: account.fullName,
      role: account.role,
    });
    setCurrentPage("dashboard");
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = async () => {
    setAuthError("");
    if (demoProfile) {
      setDemoProfile(null);
      setProfile(null);
      setCurrentPage("dashboard");
      navigate("/login", { replace: true });
      return;
    }
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) throw error;
      navigate("/login", { replace: true });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  const handlePasswordResetRequest = async (email: string) => {
    if (!hasSupabaseConfig()) {
      setAuthError(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.",
      );
      return;
    }

    if (!isValidEmail(email)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setAuthMessage("A password reset link has been sent to your email.");
      navigate("/login", { replace: true });
    } catch (error) {
      setAuthError(
        getErrorMessage(error).includes("user not found")
          ? "We could not find an account for that email address."
          : getErrorMessage(error),
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordUpdate = async (password: string, confirmPassword: string) => {
    if (!password || !confirmPassword) {
      setAuthError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setAuthError(
        "Use at least 8 characters with uppercase, lowercase, and a number.",
      );
      return;
    }

    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.updateUser({ password });
      if (error) throw error;
      setAuthMessage("Your password was updated successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <span className="text-sm text-[#718096]">Loading your EduMind account…</span>
      </div>
    );
  }

  const activeProfile = demoProfile ?? profile;

  const renderAuthenticatedApp = () => {
    if (!activeProfile) {
      return (
        <PublicLogin
          onSignIn={handleSignIn}
          onDemoSignIn={localDemoEnabled ? handleDemoSignIn : undefined}
          onSignOut={session || demoProfile ? handleLogout : undefined}
          error={authError}
          message={authMessage}
          loading={authLoading}
          onPasswordSignIn={handlePasswordSignIn}
          onRegister={handleEmailSignUp}
          supabaseConfigured={hasSupabaseConfig()}
          localDemoMode={localDemoEnabled}
          onNavigate={navigate}
        />
      );
    }

    const userName = activeProfile.full_name;
    const enterpriseRole: EnterpriseRole =
      activeProfile.role === "Admin"
        ? "admin"
        : activeProfile.role === "Reviewer"
          ? "executive_director"
          : "faculty";

    const renderEnterprisePage = () => {
      if (enterpriseRole === "admin") return <AdminPanel />;

      if (enterpriseRole === "executive_director") {
        switch (currentPage) {
          case "pending-approvals":
            return <EDDashboard userName={userName} onNavigate={setCurrentPage} />;
          case "ed-approval":
            return <SyllabusApprovalED />;
          case "version-history":
            return <VersionHistory />;
          case "cross-section":
            return <CrossSectionMonitor />;
          case "analytics":
            return <AnalyticsDashboard />;
          case "repository":
            return <ActivityBank />;
          case "ai-session":
            return <AISubjectSession />;
          default:
            return <EDDashboard userName={userName} onNavigate={setCurrentPage} />;
        }
      }

      switch (currentPage) {
        case "my-workspace":
          return (
            <IndividualDashboard
              userName={userName}
              plan={individualPlan}
              onNavigate={setCurrentPage}
            />
          );
        case "my-syllabi":
        case "submit-syllabus":
          return <SyllabusSubmission />;
        case "lesson-plans":
          return <LessonPlanBuilder />;
        case "roadmap":
          return <CurriculumRoadmap />;
        case "commit-log":
          return <CommitLog />;
        case "library":
          return <ActivityBank />;
        case "peer-review":
          return <PeerReviewScreen />;
        case "ai-session":
          return <AIKnowledgeSession />;
        case "activity-bank":
        case "ppt-bank":
          return <ActivityBank />;
        case "version-history":
          return <VersionHistory />;
        case "cross-section":
          return <CrossSectionMonitor />;
        case "collaborations":
        case "collaboration":
          return <CollaborationsPage />;
        default:
          return <EnterpriseFacultyDashboard userName={userName} onNavigate={setCurrentPage} />;
      }
    };

    return (
      <div className="size-full flex">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={enterpriseRole}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-hidden">{renderEnterprisePage()}</div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigate={navigate} />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicLogin
              onSignIn={handleSignIn}
              onDemoSignIn={localDemoEnabled ? handleDemoSignIn : undefined}
              onSignOut={session || demoProfile ? handleLogout : undefined}
              error={authError}
              message={authMessage}
              loading={authLoading}
              onPasswordSignIn={handlePasswordSignIn}
              onRegister={handleEmailSignUp}
              supabaseConfigured={hasSupabaseConfig()}
              localDemoMode={localDemoEnabled}
              initialMode="login"
              onNavigate={navigate}
            />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicLogin
              onSignIn={handleSignIn}
              onDemoSignIn={localDemoEnabled ? handleDemoSignIn : undefined}
              onSignOut={session || demoProfile ? handleLogout : undefined}
              error={authError}
              message={authMessage}
              loading={authLoading}
              onPasswordSignIn={handlePasswordSignIn}
              onRegister={handleEmailSignUp}
              supabaseConfigured={hasSupabaseConfig()}
              localDemoMode={localDemoEnabled}
              initialMode="register"
              onNavigate={navigate}
            />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PasswordRecoveryPage
              error={authError}
              message={authMessage}
              loading={authLoading}
              onResetRequest={handlePasswordResetRequest}
              onNavigate={navigate}
            />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ResetPasswordPage
              error={authError}
              message={authMessage}
              loading={authLoading}
              onUpdatePassword={handlePasswordUpdate}
              onNavigate={navigate}
            />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            renderAuthenticatedApp()
          ) : (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

interface PasswordRecoveryPageProps {
  onResetRequest: (email: string) => void;
  onNavigate: (path: string) => void;
  error: string;
  message?: string;
  loading: boolean;
}

function PasswordRecoveryPage({
  onResetRequest,
  onNavigate,
  error,
  message,
  loading,
}: PasswordRecoveryPageProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700"
            aria-label="Back to sign in"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2 text-[#1E3A5F] font-semibold">
            <ShieldCheck size={18} />
            EduMind
          </div>
        </div>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Reset your password
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
          Enter the email linked to your account and we will send a reset link.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => onResetRequest(email)}
          disabled={loading || !email.trim()}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            minHeight: 48,
            bgcolor: "#1E3A5F",
            mb: 2,
          }}
        >
          Send reset link
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => onNavigate("/login")}
          sx={{ textTransform: "none", color: "#1E3A5F" }}
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );
}

interface ResetPasswordPageProps {
  onUpdatePassword: (password: string, confirmPassword: string) => void;
  onNavigate: (path: string) => void;
  error: string;
  message?: string;
  loading: boolean;
}

function ResetPasswordPage({
  onUpdatePassword,
  onNavigate,
  error,
  message,
  loading,
}: ResetPasswordPageProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/login")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700"
            aria-label="Back to sign in"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2 text-[#1E3A5F] font-semibold">
            <ShieldCheck size={18} />
            EduMind
          </div>
        </div>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Create a new password
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
          Choose a strong password to secure your account.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="New password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => onUpdatePassword(password, confirmPassword)}
          disabled={loading || !password || !confirmPassword}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            minHeight: 48,
            bgcolor: "#1E3A5F",
            mb: 2,
          }}
        >
          Update password
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={() => onNavigate("/login")}
          sx={{ textTransform: "none", color: "#1E3A5F" }}
        >
          Return to sign in
        </Button>
      </div>
    </div>
  );
}

export default App;
