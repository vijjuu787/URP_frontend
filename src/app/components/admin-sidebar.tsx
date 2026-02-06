import {
  LayoutDashboard,
  Users,
  FileText,
  Trophy,
  Settings,
  LogOut,
  BarChart3,
  Shield,
  X,
} from "lucide-react";

type AdminPage = "dashboard" | "challenges" | "users" | "submissions" | "analytics" | "settings";

interface AdminSidebarProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ currentPage, onNavigate, onLogout, isOpen = true, onClose }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard" as const, icon: LayoutDashboard, label: "Dashboard" },
    { id: "challenges" as const, icon: Trophy, label: "Challenges" },
    { id: "users" as const, icon: Users, label: "Users" },
    { id: "submissions" as const, icon: FileText, label: "Submissions" },
    { id: "analytics" as const, icon: BarChart3, label: "Analytics" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ];

  const handleNavigate = (page: AdminPage) => {
    onNavigate(page);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 h-screen flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRight: "1px solid var(--border-primary)",
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "var(--border-primary)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--success-600)" }}
            >
              <Shield className="w-6 h-6" style={{ color: "var(--fg-white)" }} />
            </div>
            <div>
              <h1 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Admin Portal
              </h1>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Cypherock Security
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              style={{ color: "var(--text-quaternary)" }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? "var(--success-50)" : "transparent",
                  color: isActive ? "var(--success-700)" : "var(--text-secondary)",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-red-50"
            style={{ color: "var(--text-secondary)" }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}