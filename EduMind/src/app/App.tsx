import { useState } from "react";

// Public pages
import LandingPage from "./components/LandingPage";
import PricingPage from "./components/PricingPage";
import PublicLogin from "./components/PublicLogin";
import EnterpriseLogin from "./components/EnterpriseLogin";

// Individual mode
import IndividualSidebar from "./components/IndividualSidebar";
import IndividualDashboard from "./components/IndividualDashboard";
import LessonPlanBuilder from "./components/LessonPlanBuilder";
import CurriculumRoadmap from "./components/CurriculumRoadmap";
import AIKnowledgeSession from "./components/AIKnowledgeSession";
import CommitLog from "./components/CommitLog";
import CollaborationsPage from "./components/CollaborationsPage";

// Enterprise mode
import Sidebar from "./components/Sidebar";
import EnterpriseFacultyDashboard from "./components/EnterpriseFacultyDashboard";
import SyllabusSubmission from "./components/SyllabusSubmission";
import PeerReviewScreen from "./components/PeerReviewScreen";
import EDDashboard from "./components/EDDashboard";
import SyllabusApprovalED from "./components/SyllabusApprovalED";
import ActivityBank from "./components/ActivityBank";
import AdminPanel from "./components/AdminPanel";
import VersionHistory from "./components/VersionHistory";
import CrossSectionMonitor from "./components/CrossSectionMonitor";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AISubjectSession from "./components/AISubjectSession";

type AppMode = "public" | "individual" | "enterprise";
type IndividualPlan = "free" | "pro" | "pro_plus";
type EnterpriseRole =
  "faculty" | "executive_director" | "admin";

export default function App() {
  const [mode, setMode] = useState<AppMode>("public");
  const [publicPage, setPublicPage] = useState("landing");
  const [individualPlan, setIndividualPlan] =
    useState<IndividualPlan>("free");
  const [enterpriseRole, setEnterpriseRole] =
    useState<EnterpriseRole>("faculty");
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Public navigation can trigger login/enterprise modes
  const handlePublicNavigate = (page: string) => {
    if (page === "enterprise-login") {
      setPublicPage("enterprise-login");
    } else {
      setPublicPage(page);
    }
  };

  const handlePublicLogin = (
    loginMode: "individual" | "enterprise",
    role: "individual" | EnterpriseRole,
    name: string,
    plan?: IndividualPlan,
  ) => {
    setUserName(name);
    if (loginMode === "individual") {
      setIndividualPlan(plan || "free");
      setCurrentPage("dashboard");
      setMode("individual");
    } else {
      setEnterpriseRole(role as EnterpriseRole);
      setCurrentPage(
        role === "admin" ? "manage-accounts" : "dashboard",
      );
      setMode("enterprise");
    }
  };

  const handleEnterpriseLogin = (
    role: EnterpriseRole,
    name: string,
  ) => {
    setEnterpriseRole(role);
    setUserName(name);
    setCurrentPage(
      role === "admin" ? "manage-accounts" : "dashboard",
    );
    setMode("enterprise");
  };

  const handleLogout = () => {
    setMode("public");
    setPublicPage("landing");
    setCurrentPage("dashboard");
    setUserName("");
  };

  // ── PUBLIC mode ──────────────────────────────────────────────────────────────
  if (mode === "public") {
    if (publicPage === "pricing") {
      return <PricingPage onNavigate={handlePublicNavigate} />;
    }
    if (publicPage === "login") {
      return (
        <PublicLogin
          onLogin={handlePublicLogin}
          onNavigate={handlePublicNavigate}
        />
      );
    }
    if (publicPage === "enterprise-login") {
      return (
        <EnterpriseLogin
          onLogin={handleEnterpriseLogin}
          onNavigate={handlePublicNavigate}
        />
      );
    }
    return <LandingPage onNavigate={handlePublicNavigate} />;
  }

  // ── INDIVIDUAL mode ──────────────────────────────────────────────────────────
  if (mode === "individual") {
    const renderIndividualPage = () => {
      switch (currentPage) {
        case "dashboard":
          return (
            <IndividualDashboard
              userName={userName}
              plan={individualPlan}
              onNavigate={setCurrentPage}
            />
          );
        case "lesson-plans":
          return <LessonPlanBuilder />;
        case "roadmap":
          return <CurriculumRoadmap />;
        case "ai-session":
          return <AIKnowledgeSession />;
        case "commit-log":
          return <CommitLog />;
        case "collaborations":
          return <CollaborationsPage />;
        case "activity-bank":
          return <ActivityBank />;
        default:
          return (
            <IndividualDashboard
              userName={userName}
              plan={individualPlan}
              onNavigate={setCurrentPage}
            />
          );
      }
    };
    return (
      <div className="size-full flex">
        <IndividualSidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userName={userName}
          plan={individualPlan}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-hidden">
          {renderIndividualPage()}
        </div>
      </div>
    );
  }

  // ── ENTERPRISE mode ──────────────────────────────────────────────────────────
  const renderEnterprisePage = () => {
    if (enterpriseRole === "faculty") {
      switch (currentPage) {
        case "dashboard":
          return (
            <EnterpriseFacultyDashboard
              userName={userName}
              onNavigate={setCurrentPage}
            />
          );
        case "my-syllabi":
          return <SyllabusSubmission />;
        case "submit-syllabus":
          return <SyllabusSubmission />;
        case "lesson-plans":
          return <LessonPlanBuilder />;
        case "peer-review":
          return <PeerReviewScreen />;
        case "ai-session":
          return <AIKnowledgeSession />;
        case "activity-bank":
          return <ActivityBank />;
        case "version-history":
          return <VersionHistory />;
        case "cross-section":
          return <CrossSectionMonitor />;
        case "collaborations":
        case "collaboration":
          return <CollaborationsPage />;
        default:
          return (
            <EnterpriseFacultyDashboard
              userName={userName}
              onNavigate={setCurrentPage}
            />
          );
      }
    }

    if (enterpriseRole === "executive_director") {
      switch (currentPage) {
        case "dashboard":
        case "pending-approvals":
          return (
            <EDDashboard
              userName={userName}
              onNavigate={setCurrentPage}
            />
          );
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
        default:
          return (
            <EDDashboard
              userName={userName}
              onNavigate={setCurrentPage}
            />
          );
      }
    }

    if (enterpriseRole === "admin") {
      return <AdminPanel />;
    }

    return null;
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
      <div className="flex-1 overflow-hidden">
        {renderEnterprisePage()}
      </div>
    </div>
  );
}