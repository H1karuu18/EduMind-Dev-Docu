import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
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
  return error instanceof Error ? error.message : "An unexpected authentication error occurred.";
}

export default function App() {
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
          throw new Error("The OAuth provider did not return an email address. Enable email access for this provider.");
        }

        const metadataName = user.user_metadata?.full_name
          || user.user_metadata?.name
          || user.user_metadata?.fullName;
        const fullName = typeof metadataName === "string" && metadataName.trim()
          ? metadataName.trim()
          : user.email?.split("@")[0] || "Educator";
        const avatarMetadata = user.user_metadata?.avatar_url
          || user.user_metadata?.picture
          || null;
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
  }, []);

  const handleSignIn = async (provider: "google" | "azure") => {
    if (!hasSupabaseConfig()) {
      setAuthError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.");
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
      setAuthError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.");
      setAuthLoading(false);
      return;
    }

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    if (!hasSupabaseConfig()) {
      setAuthError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to continue.");
      setAuthLoading(false);
      return;
    }

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);
    try {
      const { data, error } = await getSupabaseClient().auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      if (data.user && !data.session) {
        setAuthMessage("Account created. Check your inbox to confirm your email address before signing in.");
        setAuthLoading(false);
      }
    } catch (error) {
      setAuthError(getErrorMessage(error));
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
  };

  const handleLogout = async () => {
    setAuthError("");
    if (demoProfile) {
      setDemoProfile(null);
      setProfile(null);
      setCurrentPage("dashboard");
      return;
    }
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) throw error;
    } catch (error) {
      setAuthError(getErrorMessage(error));
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
  if ((!session && !demoProfile) || !activeProfile) {
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
      />
    );
  }

  const userName = activeProfile.full_name;
  const enterpriseRole: EnterpriseRole = activeProfile.role === "Admin"
    ? "admin"
    : activeProfile.role === "Reviewer"
      ? "executive_director"
      : "faculty";
  const handleNavigate = (page: string) => setCurrentPage(page);

  const renderEnterprisePage = () => {
    if (enterpriseRole === "admin") return <AdminPanel />;

    if (enterpriseRole === "executive_director") {
      switch (currentPage) {
        case "pending-approvals":
          return <EDDashboard userName={userName} onNavigate={handleNavigate} />;
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
          return <EDDashboard userName={userName} onNavigate={handleNavigate} />;
      }
    }

    switch (currentPage) {
      case "my-workspace":
        return (
          <IndividualDashboard
            userName={userName}
            plan={individualPlan}
            onNavigate={handleNavigate}
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
        return <EnterpriseFacultyDashboard userName={userName} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="size-full flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={enterpriseRole}
        userName={userName}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-hidden">{renderEnterprisePage()}</div>
    </div>
  );
}
