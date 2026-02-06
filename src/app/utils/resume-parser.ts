/**
 * Resume Parser Utility
 * Extracts structured data from resume text content
 */

export interface ParsedResume {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string;
  experiences: Array<{
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationYear?: string;
  }>;
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
}

/**
 * Extract text from PDF file
 * Note: This is a placeholder - in production, use a library like pdf.js or pdfparse
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // For now, return a placeholder message
  // In a real implementation, you would:
  // 1. Use pdf.js (pdfjs-dist) for client-side parsing, or
  // 2. Send to backend service for server-side parsing
  console.log("[RESUME_PARSER] PDF file received:", file.name);

  // This would normally use pdfjs-dist:
  // const pdf = await pdfjsLib.getDocument(file).promise;
  // let text = '';
  // for (let i = 1; i <= pdf.numPages; i++) {
  //   const page = await pdf.getPage(i);
  //   const content = await page.getTextContent();
  //   text += content.items.map(item => item.str).join('');
  // }
  // return text;

  return "Resume content extracted from PDF";
}

/**
 * Parse resume text and extract structured data
 */
export function parseResumeText(text: string): ParsedResume {
  const parsed: ParsedResume = {
    headline: extractHeadline(text),
    summary: extractSummary(text),
    location: extractLocation(text),
    phone: extractPhone(text),
    email: extractEmail(text),
    experiences: extractExperiences(text),
    educations: extractEducations(text),
    skills: extractSkills(text),
  };

  return parsed;
}

/**
 * Extract headline/job title from resume
 */
function extractHeadline(text: string): string | undefined {
  // Look for common job title patterns in the first few lines
  const lines = text.split("\n").slice(0, 10);

  const jobTitleKeywords = [
    "developer",
    "engineer",
    "manager",
    "analyst",
    "architect",
    "lead",
    "senior",
    "junior",
    "full stack",
    "frontend",
    "backend",
    "designer",
    "product",
    "consultant",
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (jobTitleKeywords.some((keyword) => lowerLine.includes(keyword))) {
      return line.trim();
    }
  }

  return undefined;
}

/**
 * Extract professional summary
 */
function extractSummary(text: string): string | undefined {
  const summaryKeywords = [
    "summary",
    "about",
    "profile",
    "professional overview",
  ];
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (summaryKeywords.some((keyword) => line.includes(keyword))) {
      // Get the next few lines as summary
      const summaryLines: string[] = [];
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const trimmed = lines[j].trim();
        if (trimmed && !trimmed.match(/^[A-Z\s]+$/) && trimmed.length > 10) {
          summaryLines.push(trimmed);
        }
      }
      if (summaryLines.length > 0) {
        return summaryLines.join(" ");
      }
    }
  }

  return undefined;
}

/**
 * Extract location/city from resume
 */
function extractLocation(text: string): string | undefined {
  // Look for common location patterns (City, State/Country)
  const locationPattern = /([A-Z][a-z]+),\s*([A-Z]{2}|[A-Z][a-z\s]+)/g;
  const matches = text.match(locationPattern);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  return undefined;
}

/**
 * Extract phone number from resume
 */
function extractPhone(text: string): string | undefined {
  // Look for phone number patterns
  const phonePattern =
    /(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/;
  const match = text.match(phonePattern);

  if (match) {
    return match[0];
  }

  return undefined;
}

/**
 * Extract email from resume
 */
function extractEmail(text: string): string | undefined {
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailPattern);

  if (match) {
    return match[0];
  }

  return undefined;
}

/**
 * Extract work experiences
 */
function extractExperiences(text: string): ParsedResume["experiences"] {
  const experiences: ParsedResume["experiences"] = [];
  const lines = text.split("\n");

  const experienceKeywords = ["experience", "work history", "employment"];
  const educationKeywords = [
    "education",
    "degree",
    "bachelor",
    "master",
    "diploma",
  ];

  let startIdx = -1;
  let endIdx = lines.length;

  // Find experience section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (experienceKeywords.some((keyword) => line.includes(keyword))) {
      startIdx = i + 1;
    }
    if (
      educationKeywords.some((keyword) => line.includes(keyword)) &&
      startIdx !== -1
    ) {
      endIdx = i;
      break;
    }
  }

  if (startIdx === -1) return [];

  // Parse experience entries
  for (let i = startIdx; i < endIdx; i++) {
    const line = lines[i].trim();

    // Look for company/role patterns
    if (line && !line.match(/^\s*$/) && line.length > 5) {
      // Simple heuristic: if line has capital letters at start, might be company name
      if (line.match(/^[A-Z]/) && !line.endsWith(":")) {
        const experience: ParsedResume["experiences"][0] = {
          company: "",
          role: "",
        };

        // Try to extract company and role
        if (line.includes("|")) {
          const [company, role] = line.split("|");
          experience.company = company.trim();
          experience.role = role.trim();
        } else if (line.includes(" - ")) {
          const [company, role] = line.split(" - ");
          experience.company = company.trim();
          experience.role = role.trim();
        } else {
          experience.company = line;
        }

        // Extract dates from next line
        if (i + 1 < endIdx) {
          const nextLine = lines[i + 1].trim();
          const datePattern =
            /(\w+\s\d{4})\s*-\s*(\w+\s\d{4}|present|current)/i;
          const dateMatch = nextLine.match(datePattern);
          if (dateMatch) {
            experience.startDate = dateMatch[1];
            experience.endDate = dateMatch[2];
          }
        }

        // Extract description
        const descLines: string[] = [];
        for (let j = i + 1; j < Math.min(i + 5, endIdx); j++) {
          const descLine = lines[j].trim();
          if (descLine.startsWith("•") || descLine.startsWith("-")) {
            descLines.push(descLine.substring(1).trim());
          }
        }
        if (descLines.length > 0) {
          experience.description = descLines.slice(0, 2).join(". ");
        }

        if (experience.company) {
          experiences.push(experience);
        }
      }
    }
  }

  return experiences;
}

/**
 * Extract education
 */
function extractEducations(text: string): ParsedResume["educations"] {
  const educations: ParsedResume["educations"] = [];
  const lines = text.split("\n");

  const educationKeywords = [
    "education",
    "degree",
    "bachelor",
    "master",
    "diploma",
    "university",
    "college",
  ];

  let startIdx = -1;

  // Find education section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (educationKeywords.some((keyword) => line.includes(keyword))) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) return [];

  // Parse education entries
  for (let i = startIdx; i < Math.min(startIdx + 20, lines.length); i++) {
    const line = lines[i].trim();

    if (
      line &&
      line.match(/^[A-Z]/) &&
      (line.toLowerCase().includes("bachelor") ||
        line.toLowerCase().includes("master") ||
        line.toLowerCase().includes("degree") ||
        line.toLowerCase().includes("diploma"))
    ) {
      const education: ParsedResume["educations"][0] = {
        degree: "",
        institution: "",
      };

      // Extract degree and institution
      if (line.includes(" in ")) {
        const [degree, institution] = line.split(" in ");
        education.degree = degree.trim();
        education.institution = institution.trim();
      } else if (line.includes(" from ")) {
        const [degree, institution] = line.split(" from ");
        education.degree = degree.trim();
        education.institution = institution.trim();
      } else {
        education.degree = line;
      }

      // Extract year
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const yearMatch = nextLine.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          education.graduationYear = yearMatch[0];
        }
      }

      educations.push(education);
    }
  }

  return educations;
}

/**
 * Extract skills
 */
function extractSkills(text: string): ParsedResume["skills"] {
  const commonSkills = {
    frontend: [
      "react",
      "vue",
      "angular",
      "typescript",
      "javascript",
      "css",
      "html",
      "next.js",
      "svelte",
      "tailwind",
      "bootstrap",
      "responsive design",
    ],
    backend: [
      "node.js",
      "python",
      "java",
      "c#",
      "ruby",
      "php",
      "golang",
      "rust",
      "express",
      "django",
      "flask",
      "spring",
      "fastapi",
      "graphql",
    ],
    tools: [
      "git",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "jenkins",
      "circleci",
      "jira",
      "slack",
      "mongodb",
      "postgresql",
      "mysql",
      "redis",
      "elasticsearch",
    ],
  };

  const skills: ParsedResume["skills"] = {
    frontend: [],
    backend: [],
    tools: [],
  };

  const textLower = text.toLowerCase();

  // Search for each skill
  for (const [category, skillList] of Object.entries(commonSkills)) {
    for (const skill of skillList) {
      if (textLower.includes(skill.toLowerCase())) {
        const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
        if (
          !skills[category as keyof typeof skills].includes(capitalizedSkill)
        ) {
          skills[category as keyof typeof skills].push(capitalizedSkill);
        }
      }
    }
  }

  return skills;
}
