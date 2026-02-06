import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { ChallengeCard, Challenge } from "./challenge-card";
import { useState } from "react";

interface ChallengeHubProps {
  onStartChallenge: (id: string, challenge: Challenge) => void;
}

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Buffer Overflow Analysis",
    topic: "Memory Management",
    difficulty: "Expert",
    points: 500,
    solvers: 23,
    description:
      "Identify and exploit a buffer overflow vulnerability in a C application.",
    status: "available",
    technologies: ["C/C++", "GDB", "Assembly"],
    estimatedTime: "2-3 hours",
    successRate: 34,
    isNew: true,
    author: "Dr. Chen",
  },
  {
    id: "2",
    title: "Kernel Module Reverse Engineering",
    topic: "Linux Kernel",
    difficulty: "Expert",
    points: 450,
    solvers: 15,
    description:
      "Reverse engineer a custom kernel module to find the hidden flag.",
    status: "solved",
    technologies: ["Linux", "IDA Pro", "C"],
    estimatedTime: "3-4 hours",
    successRate: 28,
    isTrending: true,
    author: "K3rn3l_M4st3r",
  },
  {
    id: "3",
    title: "Race Condition Exploit",
    topic: "Concurrency",
    difficulty: "Hard",
    points: 350,
    solvers: 67,
    description: "Exploit a race condition in a multi-threaded application.",
    status: "available",
    technologies: ["Python", "Threading", "Linux"],
    estimatedTime: "1-2 hours",
    successRate: 52,
    author: "ThreadMaster",
  },
  {
    id: "4",
    title: "Cryptographic Hash Collision",
    topic: "Cryptography",
    difficulty: "Expert",
    points: 500,
    solvers: 8,
    description: "Find a collision in a custom hash function implementation.",
    status: "locked",
    technologies: ["Python", "Cryptography", "Math"],
    estimatedTime: "4-6 hours",
    successRate: 18,
    author: "CryptoWizard",
  },
  {
    id: "5",
    title: "SQL Injection Defense",
    topic: "Web Security",
    difficulty: "Medium",
    points: 250,
    solvers: 134,
    description:
      "Identify and patch SQL injection vulnerabilities in a web application.",
    status: "available",
    technologies: ["SQL", "PHP", "SQLMap"],
    estimatedTime: "45-90 min",
    successRate: 78,
    isNew: true,
    isTrending: true,
    author: "WebSecPro",
  },
  {
    id: "6",
    title: "ARM Assembly Optimization",
    topic: "Assembly",
    difficulty: "Hard",
    points: 400,
    solvers: 42,
    description: "Optimize ARM assembly code to meet performance requirements.",
    status: "available",
    technologies: ["ARM", "Assembly", "Optimization"],
    estimatedTime: "2-3 hours",
    successRate: 45,
    author: "ARM_Guru",
  },
];

export function ChallengeHub({ onStartChallenge }: ChallengeHubProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChallenges = mockChallenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="flex-1 min-h-screen overflow-y-auto"
      style={{
        backgroundColor: "var(--bg-secondary)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Header */}
      <div
        className="px-8 py-6"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-secondary)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Challenge Hub
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Master cybersecurity & systems engineering through hands-on
              challenges
            </p>
          </div>
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-lg"
            style={{
              backgroundColor: "var(--success-50)",
              border: "1px solid var(--success-200)",
            }}
          >
            <TrendingUp
              className="w-6 h-6"
              style={{ color: "var(--success-600)" }}
            />
            <div>
              <p
                className="text-sm font-medium mb-0.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                Total Points
              </p>
              <p
                className="text-2xl font-semibold"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-code)",
                }}
              >
                1,250
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-quaternary)" }}
            />
            <Input
              type="text"
              placeholder="Search challenges..."
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
          <button
            className="h-11 px-4 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all hover:bg-gray-100"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-secondary)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onStart={onStartChallenge}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: "var(--text-secondary)" }}>
              No challenges found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
