import { useState, useEffect } from "react";
import { LoginPage } from "./components/login-page";
import { SignupPage } from "./components/signup-page";
import { NavigationSidebar } from "./components/navigation-sidebar";
import { ChallengeHub } from "./components/challenge-hub";
import { Workbench } from "./components/workbench";
import { SubmissionsPage } from "./components/submissions-page";
import { ProfilePage } from "./components/profile-page";
import { AdminSidebar } from "./components/admin-sidebar";
import { AdminChallenges } from "./components/admin-challenges";
import { API_BASE_URL } from "../config/api";
import { AdminUsers } from "./components/admin-users";
import { OnboardingForm } from "./components/onboarding-form";
import { JobDashboard } from "./components/job-dashboard";
import { SkillValidation } from "./components/skill-validation";
import type { Challenge } from "./components/skill-validation";
import { RoleSelector } from "./components/role-selector";
import { AdminDashboard } from "./components/admin-dashboard";
import { EngineerDashboard } from "./components/engineer-dashboard";
import { apiCall } from "./utils/api";

type AuthPage = "login" | "signup";
type AppPage = "challenges" | "submissions" | "profile" | "jobs";
type AdminPage =
  | "dashboard"
  | "challenges"
  | "users"
  | "submissions"
  | "analytics"
  | "settings";
type View =
  | AuthPage
  | AppPage
  | AdminPage
  | "workbench"
  | "onboarding"
  | "skill-validation"
  | "role-selector"
  | "review-admin"
  | "review-engineer";
type UserType =
  | "candidate"
  | "admin"
  | "review-admin"
  | "review-engineer"
  | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: "candidate" | "admin" | "review-admin" | "review-engineer";
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [pendingJobApplication, setPendingJobApplication] = useState<{
    id: number;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    workType: string;
    jobType: string;
    experienceRequired: string;
    salaryRange: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits?: string[];
    matchedSkills: string[];
    lockedChallengeId?: string;
    timerStartTime?: number;
  } | null>(null);

  // Load pending challenge from localStorage on mount and redirect if challenge exists
  useEffect(() => {
    if (currentUser) {
      const savedChallenge = localStorage.getItem(
        `challenge_${currentUser.email}`,
      );
      if (savedChallenge) {
        try {
          const parsedChallenge = JSON.parse(savedChallenge);
          setPendingJobApplication(parsedChallenge);

          // If user has an active challenge with timer started, redirect to skill validation
          if (parsedChallenge.timerStartTime) {
            setCurrentView("skill-validation");
          }
        } catch (e) {
          console.error("Failed to load saved challenge", e);
        }
      }
    }
  }, [currentUser]);

  // Save pending challenge to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && pendingJobApplication) {
      localStorage.setItem(
        `challenge_${currentUser.email}`,
        JSON.stringify(pendingJobApplication),
      );
    }
  }, [pendingJobApplication, currentUser]);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      console.log("handleLogin called with:", credentials);
      const result = await apiCall<{
        message: string;
        token: string;
        user: {
          id: string;
          email: string;
          fullName: string;
          role: "candidate" | "admin" | "review-admin" | "review-engineer";
        };
      }>(`${API_BASE_URL}/api/users/signin`, {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log("API response:", result);

      // Store token if provided
      if (result.token) {
        console.log("Storing token:", result.token);
        localStorage.setItem("authToken", result.token);
      }

      // Determine user type from the response role
      const userType = result.user.role as
        | "candidate"
        | "admin"
        | "review-admin"
        | "review-engineer";

      // Set current user with response data
      const mockUser: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.fullName,
        role: userType,
      };

      console.log("Setting user:", mockUser);
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      setUserType(userType);

      // Route based on user type
      if (userType === "candidate" && !hasCompletedOnboarding) {
        console.log("Routing to onboarding");
        setCurrentView("jobs");
      } else if (userType === "candidate") {
        console.log("Routing to jobs");
        setCurrentView("jobs");
      } else if (userType === "review-engineer") {
        console.log("Routing to engineer dashboard");
        setCurrentView("dashboard");
      } else {
        console.log("Routing to dashboard");
        setCurrentView("dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleSignup = async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: string;
    resumeUrl?: string;
  }) => {
    try {
      const result = await apiCall<{
        message: string;
        token: string;
        user: {
          id: string;
          email: string;
          fullName: string;
          role: "candidate" | "admin" | "review-admin" | "review-engineer";
        };
      }>(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role || "candidate",
          resumeUrl: data.resumeUrl || "",
        }),
      });

      // Store token if provided
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Set current user with response data
      const mockUser: User = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.fullName,
        role: result.user.role,
      };

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      setUserType("candidate");
      setCurrentView("onboarding");
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentView("jobs");
  };

  const handleOnboardingSkip = () => {
    setHasCompletedOnboarding(true);
    setCurrentView("jobs");
  };

  const handleApplyForJob = (job: any) => {
    setPendingJobApplication({
      id: job.id,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      workType: job.workType,
      jobType: job.jobType,
      experienceRequired: job.experienceRequired,
      salaryRange: job.salaryRange,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      matchedSkills: job.matchedSkills,
    });
    setCurrentView("skill-validation");
  };

  const handleCancelApplication = () => {
    // Clear from localStorage when user explicitly cancels
    if (currentUser) {
      localStorage.removeItem(`challenge_${currentUser.email}`);
    }
    setPendingJobApplication(null);
    setCurrentView("jobs");
  };

  const handleStartChallenge = async (challengeId: string, challenge: any) => {
    try {
      // Convert challenge data to the format needed by Workbench
      let challengeData: Challenge;

      // If it has the skill-validation Challenge structure, use it directly
      if (challenge.validatesSkills !== undefined) {
        challengeData = challenge;
      } else {
        // If it's a ChallengeHub Challenge, convert it to skill-validation Challenge format
        challengeData = {
          id: challenge.id || challengeId,
          title: challenge.title || "",
          description: challenge.description || "",
          difficulty: (challenge.difficulty === "Easy"
            ? "Medium"
            : challenge.difficulty === "Expert"
              ? "Expert"
              : challenge.difficulty) as "Medium" | "Hard" | "Expert",
          techStack: challenge.technologies || [],
          estimatedTime: challenge.estimatedTime || "TBD",
          category: challenge.topic || "Challenge",
          objective: challenge.description || "",
          validatesSkills: [],
        };
      }

      // Create assignment start record via API
      const assignmentStartData = {
        assignmentId: challengeId,
        candidateId: currentUser?.id,
        jobId: pendingJobApplication?.id,
      };

      console.log(
        "[HANDLE_START_CHALLENGE] Creating assignment start record:",
        assignmentStartData,
      );

      try {
        const result = await apiCall<any>(
          `${API_BASE_URL}/api/assignment/starts`,
          {
            method: "POST",
            body: JSON.stringify(assignmentStartData),
          },
        );
        console.log(
          "[HANDLE_START_CHALLENGE] Assignment start created:",
          result,
        );
      } catch (apiError) {
        console.error(
          "[HANDLE_START_CHALLENGE] Error creating assignment start:",
          apiError,
        );
        // Continue anyway - don't block the workbench from opening
      }

      // Create assignment submission record via API
      const assignmentSubmissionData = {
        candidateId: currentUser?.id,
        assignmentId: challengeId,
        jobPostingId: pendingJobApplication?.id,
        assignmentStartedAt: new Date().toISOString(),
        status: "PENDING", // Status is PENDING when challenge is started
      };

      console.log(
        "[HANDLE_START_CHALLENGE] Creating assignment submission record:",
        assignmentSubmissionData,
      );

      try {
        const submissionResult = await apiCall<any>(
          `${API_BASE_URL}/api/assignment/submissions`,
          {
            method: "POST",
            body: JSON.stringify(assignmentSubmissionData),
          },
        );
        console.log(
          "[HANDLE_START_CHALLENGE] Assignment submission created:",
          submissionResult,
        );
      } catch (apiError) {
        console.error(
          "[HANDLE_START_CHALLENGE] Error creating assignment submission:",
          apiError,
        );
        // Continue anyway - don't block the workbench from opening
      }

      // Lock the challenge and start timer if this is a job application
      if (pendingJobApplication) {
        setPendingJobApplication({
          ...pendingJobApplication,
          lockedChallengeId: challengeId,
          timerStartTime: Date.now(),
        });
      }
      setSelectedChallengeId(challengeId);
      setSelectedChallenge(challengeData);
      setCurrentView("workbench");
    } catch (error) {
      console.error("[HANDLE_START_CHALLENGE] Error:", error);
      // Still proceed to workbench even if conversion fails
      setSelectedChallengeId(challengeId);
      setSelectedChallenge(challenge);
      setCurrentView("workbench");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentView("login");
    setSelectedChallengeId(null);
    setIsMobileMenuOpen(false);
    setHasCompletedOnboarding(false);
    setPendingJobApplication(null);
  };

  const handleBackFromWorkbench = () => {
    // If workbench was opened from job application, return to skill validation
    if (pendingJobApplication) {
      setCurrentView("skill-validation");
    } else {
      setCurrentView("challenges");
    }
    setSelectedChallengeId(null);
  };

  const handleNavigate = (page: AppPage) => {
    setCurrentView(page);
    setIsMobileMenuOpen(false);
  };

  const handleAdminNavigate = (page: AdminPage) => {
    setCurrentView(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Authentication views
  if (!isAuthenticated) {
    if (currentView === "signup") {
      return (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentView("login")}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView("signup")}
      />
    );
  }

  // Onboarding view (for candidates only)
  if (currentView === "onboarding" && userType === "candidate") {
    return (
      <OnboardingForm
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // Skill Validation view (for job applications)
  if (currentView === "skill-validation" && pendingJobApplication) {
    const jobDetails = {
      id: pendingJobApplication.id,
      title: pendingJobApplication.title,
      company: pendingJobApplication.company,
      companyLogo: pendingJobApplication.companyLogo,
      location: pendingJobApplication.location,
      workType: pendingJobApplication.workType,
      jobType: pendingJobApplication.jobType,
      experienceRequired: pendingJobApplication.experienceRequired,
      salaryRange: pendingJobApplication.salaryRange,
      description: pendingJobApplication.description,
      requirements: pendingJobApplication.requirements,
      responsibilities: pendingJobApplication.responsibilities,
      benefits: pendingJobApplication.benefits,
    };

    return (
      <div className="flex h-screen overflow-hidden">
        <NavigationSidebar
          currentPage="jobs"
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <SkillValidation
          jobDetails={jobDetails}
          requiredSkills={pendingJobApplication.matchedSkills}
          lockedChallengeId={pendingJobApplication.lockedChallengeId}
          timerStartTime={pendingJobApplication.timerStartTime}
          onCancel={handleCancelApplication}
          onStartChallenge={handleStartChallenge}
        />
      </div>
    );
  }

  // Admin views
  if (userType === "admin") {
    return (
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar
          currentPage={currentView as AdminPage}
          onNavigate={handleAdminNavigate}
          onLogout={handleLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        {currentView === "dashboard" && (
          <AdminDashboard onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "challenges" && (
          <AdminChallenges onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "users" && (
          <AdminUsers onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "submissions" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Admin Submissions View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "analytics" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Analytics View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "settings" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Settings View - Coming Soon
            </p>
          </div>
        )}
      </div>
    );
  }

  // Review Admin views
  if (userType === "review-admin") {
    return (
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar
          currentPage={currentView as AdminPage}
          onNavigate={handleAdminNavigate}
          onLogout={handleLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        {currentView === "dashboard" && (
          <AdminDashboard onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "challenges" && (
          <AdminChallenges onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "users" && (
          <AdminUsers onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "submissions" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Admin Submissions View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "analytics" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Analytics View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "settings" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Settings View - Coming Soon
            </p>
          </div>
        )}
      </div>
    );
  }

  // Review Engineer views
  if (userType === "engineer") {
    return (
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar
          currentPage={currentView as AdminPage}
          onNavigate={handleAdminNavigate}
          onLogout={handleLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        {currentView === "dashboard" && (
          <EngineerDashboard onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "challenges" && (
          <AdminChallenges onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "users" && (
          <AdminUsers onMenuClick={toggleMobileMenu} />
        )}
        {currentView === "submissions" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Admin Submissions View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "analytics" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Analytics View - Coming Soon
            </p>
          </div>
        )}
        {currentView === "settings" && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "var(--gray-50)" }}
          >
            <p style={{ color: "var(--text-tertiary)" }}>
              Settings View - Coming Soon
            </p>
          </div>
        )}
      </div>
    );
  }

  // Candidate views (main application views)
  if (userType === "candidate") {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Hidden in workbench view */}
        {currentView !== "workbench" && (
          <NavigationSidebar
            currentPage={currentView as AppPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content */}
        {currentView === "jobs" && currentUser && (
          <JobDashboard
            onApplyForJob={handleApplyForJob}
            currentUser={currentUser}
          />
        )}
        {currentView === "challenges" && (
          <ChallengeHub onStartChallenge={handleStartChallenge} />
        )}
        {currentView === "submissions" && (
          <SubmissionsPage candidateId={currentUser?.id} />
        )}
        {currentView === "profile" && (
          <ProfilePage userId={currentUser?.id || ""} />
        )}
        {currentView === "workbench" &&
          selectedChallengeId &&
          selectedChallenge && (
            <Workbench
              challengeId={selectedChallengeId}
              challenge={selectedChallenge}
              candidateId={currentUser?.id}
              timerStartTime={pendingJobApplication?.timerStartTime}
              onBack={handleBackFromWorkbench}
            />
          )}
      </div>
    );
  }

  // Default fallback (should not reach here if routing is correct)
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--text-tertiary)" }}>
          Unknown user type or view
        </p>
      </div>
    </div>
  );
}
