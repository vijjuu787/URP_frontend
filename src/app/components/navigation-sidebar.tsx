import {
  Shield,
  Target,
  FileText,
  User,
  LogOut,
  Briefcase,
} from "lucide-react";

interface NavigationSidebarProps {
  currentPage: "challenges" | "submissions" | "profile" | "jobs";
  onNavigate: (page: "challenges" | "submissions" | "profile" | "jobs") => void;
  onLogout: () => void;
}

export function NavigationSidebar({
  currentPage,
  onNavigate,
  onLogout,
}: NavigationSidebarProps) {
  const navItems = [
    { id: "jobs" as const, label: "Job Recommendations", icon: Briefcase },
    { id: "submissions" as const, label: "My Submissions", icon: FileText },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  // Assume you have access to userId from userProfile or authentication context
  const userId = "";

  const handleNavigate = async (
    page: "challenges" | "submissions" | "profile" | "jobs",
  ) => {
    if (page === "profile") {
      // Fetch candidate profile data from /api/candidate/:id
      const token = localStorage.getItem("token");
      const id = userId;
      const url = `http://localhost:5100/api/candidate/${id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Pass candidate profile data to ProfilePage or context
          // Example: onNavigate(page, { profileData: data.data || data });
          onNavigate(page);
        } else {
          // Handle error (optional)
          onNavigate(page);
        }
      } catch (err) {
        // Handle fetch error (optional)
        onNavigate(page);
      }
    } else {
      onNavigate(page);
    }
  };

  return (
    <div
      className="w-64 h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderRight: "1px solid var(--border-primary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Logo */}
      <div
        className="p-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--border-secondary)" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--primary-600)" }}
        >
          <Shield className="w-6 h-6" style={{ color: "var(--fg-white)" }} />
        </div>
        <div>
          <h2
            className="font-semibold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            ProofSkill
          </h2>
          <p className="text-xs" style={{ color: "var(--text-quaternary)" }}>
            v2.0
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all"
              style={{
                backgroundColor: isActive ? "var(--primary-50)" : "transparent",
                color: isActive
                  ? "var(--fg-brand-primary)"
                  : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid var(--border-secondary)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2"
          style={{ backgroundColor: "var(--gray-50)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--primary-600)" }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--fg-white)" }}
            >
              JD
            </span>
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              John Doe
            </p>
            <p className="text-xs" style={{ color: "var(--text-quaternary)" }}>
              Level 3
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-gray-50"
          style={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
