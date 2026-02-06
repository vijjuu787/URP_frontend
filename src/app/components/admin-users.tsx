import { useState } from "react";
import { Search, UserPlus, MoreVertical, Mail, Shield, Eye, Ban, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AdminUsersProps {
  onMenuClick?: () => void;
}

export function AdminUsers({ onMenuClick }: AdminUsersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "Candidate",
      status: "active",
      joinedDate: "2024-01-15",
      challenges: 24,
      points: 2450,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      role: "Candidate",
      status: "active",
      joinedDate: "2024-01-10",
      challenges: 22,
      points: 2280,
      lastActive: "5 hours ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      role: "Candidate",
      status: "active",
      joinedDate: "2024-01-08",
      challenges: 21,
      points: 2150,
      lastActive: "1 day ago",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@email.com",
      role: "Candidate",
      status: "inactive",
      joinedDate: "2024-01-05",
      challenges: 20,
      points: 2050,
      lastActive: "1 week ago",
    },
    {
      id: 5,
      name: "Jessica Brown",
      email: "jessica.brown@email.com",
      role: "Candidate",
      status: "active",
      joinedDate: "2024-01-03",
      challenges: 19,
      points: 1980,
      lastActive: "3 hours ago",
    },
    {
      id: 6,
      name: "Robert Taylor",
      email: "robert.taylor@email.com",
      role: "Recruiter",
      status: "active",
      joinedDate: "2023-12-20",
      challenges: 0,
      points: 0,
      lastActive: "30 min ago",
    },
  ];

  return (
    <div
      className="flex-1 h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--gray-50)",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="lg:hidden p-2 rounded-lg hover:bg-white"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                User Management
              </h1>
            </div>
            <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
              Manage and monitor all platform users
            </p>
          </div>
          <Button
            className="px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            style={{
              backgroundColor: "var(--primary-600)",
              color: "var(--fg-white)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-xs md:text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              Total Users
            </p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              1,248
            </p>
          </div>
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-xs md:text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              Active Today
            </p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--success-600)" }}>
              342
            </p>
          </div>
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-xs md:text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              New This Week
            </p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--primary-600)" }}>
              48
            </p>
          </div>
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p className="text-xs md:text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              Inactive
            </p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-tertiary)" }}>
              156
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div
          className="rounded-xl p-4 md:p-6 mb-4 md:mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-quaternary)" }}
              />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <option>All Roles</option>
                <option>Candidate</option>
                <option>Recruiter</option>
                <option>Admin</option>
              </select>
              <select
                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border h-11"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div
          className="hidden md:block rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--gray-50)",
                    borderBottom: "1px solid var(--border-primary)",
                  }}
                >
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    User
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Challenges
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Points
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Last Active
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid var(--border-secondary)",
                    }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                          style={{
                            backgroundColor: "var(--primary-100)",
                            color: "var(--primary-700)",
                          }}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor:
                            user.role === "Recruiter"
                              ? "var(--success-50)"
                              : "var(--primary-50)",
                          color:
                            user.role === "Recruiter"
                              ? "var(--success-700)"
                              : "var(--primary-700)",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor:
                            user.status === "active"
                              ? "var(--success-50)"
                              : "var(--gray-100)",
                          color:
                            user.status === "active"
                              ? "var(--success-700)"
                              : "var(--text-tertiary)",
                        }}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {user.challenges > 0 ? user.challenges : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--primary-600)" }}
                      >
                        {user.points > 0 ? user.points.toLocaleString() : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--text-quaternary)" }}
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--text-quaternary)" }}
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          style={{ color: "var(--error-600)" }}
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl p-4"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div className="flex items-center gap-3 mb-3 pb-3 border-b" style={{ borderColor: "var(--border-secondary)" }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-700)",
                  }}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                    Role
                  </p>
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-semibold inline-block"
                    style={{
                      backgroundColor:
                        user.role === "Recruiter"
                          ? "var(--success-50)"
                          : "var(--primary-50)",
                      color:
                        user.role === "Recruiter"
                          ? "var(--success-700)"
                          : "var(--primary-700)",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                    Status
                  </p>
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-semibold inline-block"
                    style={{
                      backgroundColor:
                        user.status === "active"
                          ? "var(--success-50)"
                          : "var(--gray-100)",
                      color:
                        user.status === "active"
                          ? "var(--success-700)"
                          : "var(--text-tertiary)",
                    }}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                    Challenges
                  </p>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {user.challenges > 0 ? user.challenges : "-"}
                  </span>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                    Points
                  </p>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--primary-600)" }}
                  >
                    {user.points > 0 ? user.points.toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                  Last Active
                </p>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.lastActive}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--border-secondary)" }}>
                <button
                  className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  style={{ color: "var(--text-secondary)" }}
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View</span>
                </button>
                <button
                  className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  style={{ color: "var(--text-secondary)" }}
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  className="flex-1 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  style={{ color: "var(--error-600)" }}
                  title="Suspend User"
                >
                  <Ban className="w-4 h-4" />
                  <span className="text-sm font-medium">Suspend</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}