# Resume Upload & Profile Management - Developer Guide

## Quick Start

### 1. Component Usage

**In ProfilePage, users can now:**

```tsx
// View mode (default)
<ProfilePage />

// Clicking "Edit Profile" button renders:
<ProfileEdit
  onCancel={() => setIsEditMode(false)}
  onSave={() => setIsEditMode(false)}
/>
```

### 2. Resume Parsing

**Extract and parse resume text:**

```typescript
import { parseResumeText } from "../utils/resume-parser";

const resumeText = "...resume content...";
const parsed = parseResumeText(resumeText);

console.log(parsed);
// Output:
// {
//   headline: "Senior Developer",
//   summary: "Professional summary...",
//   location: "San Francisco, CA",
//   phone: "+1 (555) 123-4567",
//   email: "user@example.com",
//   experiences: [...],
//   educations: [...],
//   skills: { frontend: [...], backend: [...], tools: [...] }
// }
```

### 3. Save Profile

**The component automatically calls:**

```typescript
await apiCall("http://localhost:5100/api/profile", {
  method: "POST",
  body: JSON.stringify({
    headline,
    summary,
    location,
    phone,
    experiences,
    educations,
    skills,
  }),
});
```

## File Structure

```
src/app/
├── components/
│   ├── profile-page.tsx          # Main profile view with edit button
│   ├── profile-edit.tsx          # Profile editing form with resume upload
│   └── [other components]
├── utils/
│   ├── api.ts                    # API utility (existing)
│   └── resume-parser.ts          # New resume parsing utility
└── App.tsx                       # Main app component
```

## Component Props

### ProfileEdit

```typescript
interface ProfileEditProps {
  onSave?: (data: any) => void; // Called when profile is saved
  onCancel?: () => void; // Called when user cancels
}
```

### ProfilePage

```typescript
// No props required - manages own state
// Uses profileCompletion state internally
```

## State Interfaces

### ParsedResume (from resume-parser.ts)

```typescript
interface ParsedResume {
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
```

### Skills Type

```typescript
interface Skills {
  frontend: string[];
  backend: string[];
  tools: string[];
}
```

## Key Functions in ProfileEdit

### Resume Upload Handler

```typescript
const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // 1. Get file from input
  // 2. Set loading state
  // 3. Extract text from resume
  // 4. Parse resume text
  // 5. Auto-populate form fields
  // 6. Handle errors gracefully
};
```

### Extract Resume Content

```typescript
const extractResumeContent = async (file: File): Promise<string> => {
  // Detects file type (PDF/DOCX)
  // For PDF: uses pdf.js for extraction (placeholder in code)
  // Returns resume text content
  // Throws error for unsupported formats
};
```

### Save Profile

```typescript
const handleSave = async () => {
  // 1. Validate form data
  // 2. Prepare payload
  // 3. Call API endpoint
  // 4. Handle success/error
  // 5. Trigger onSave callback
};
```

### Experience Management

```typescript
const handleAddExperience = () => {
  // Add empty experience object to array
};

const handleUpdateExperience = (index, field, value) => {
  // Update specific field in experience
};

const handleRemoveExperience = (index) => {
  // Remove experience from array
};
```

### Education Management

```typescript
const handleAddEducation = () => {
  // Add empty education object to array
};

const handleUpdateEducation = (index, field, value) => {
  // Update specific field in education
};

const handleRemoveEducation = (index) => {
  // Remove education from array
};
```

### Skill Management

```typescript
const handleAddSkill = (category, skill) => {
  // Add skill to category array (avoid duplicates)
};

const handleRemoveSkill = (category, skill) => {
  // Remove skill from category array
};
```

## Resume Parser Functions

### parseResumeText

```typescript
export function parseResumeText(text: string): ParsedResume {
  // Main parsing function
  // Calls individual extraction functions
  // Returns complete parsed data
}
```

### Individual Extraction Functions

```typescript
function extractHeadline(text: string): string | undefined;
function extractSummary(text: string): string | undefined;
function extractLocation(text: string): string | undefined;
function extractPhone(text: string): string | undefined;
function extractEmail(text: string): string | undefined;
function extractExperiences(text: string): Experience[];
function extractEducations(text: string): Education[];
function extractSkills(text: string): {
  frontend: string[];
  backend: string[];
  tools: string[];
};
```

## Pattern Matching

### Phone Number

```regex
(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})
```

Matches: (555) 123-4567, 555-123-4567, +1 555 123 4567, etc.

### Email Address

```regex
([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)
```

Matches: user@example.com, name.surname@company.co.uk, etc.

### Year

```regex
\b(19|20)\d{2}\b
```

Matches: 1980-2099

### Date Range

```regex
(\w+\s\d{4})\s*-\s*(\w+\s\d{4}|present|current)
```

Matches: Jan 2023 - Present, January 2022 - December 2023, etc.

## Known Skill Lists

### Frontend Skills

React, Vue, Angular, TypeScript, JavaScript, CSS, HTML, Next.js, Svelte, Tailwind, Bootstrap, Responsive Design

### Backend Skills

Node.js, Python, Java, C#, Ruby, PHP, Go, Rust, Express, Django, Flask, Spring, FastAPI, GraphQL

### Tools

Git, Docker, Kubernetes, AWS, Azure, GCP, Jenkins, CircleCI, Jira, Slack, MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch

## Styling Notes

All components use CSS custom properties from the theme:

- Colors: `--primary-600`, `--bg-primary`, `--text-primary`, etc.
- Shadows: `--shadow-xs`, `--shadow-md`
- Font: `--font-inter`

Components use Tailwind CSS classes combined with inline styles.

## Error Handling

### Common Errors

**Unsupported file format**

- Catch: File type is not PDF
- Message: "Unsupported file format. Please upload a PDF or DOCX file."

**Resume parsing failure**

- Catch: Text extraction fails
- Message: From try-catch block

**API submission failure**

- Catch: Network or server error
- Message: Error from API response

## Browser Compatibility

- Modern browsers with ES6+ support
- File API support (HTML5)
- Fetch API support
- FileReader API support

## Performance Optimization Tips

1. **Lazy load PDF.js worker**:

   ```typescript
   pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
   ```

2. **Memoize parsed data**:

   ```typescript
   const memoizedParsed = useMemo(() => parseResumeText(text), [text]);
   ```

3. **Debounce field updates** for large forms

4. **Lazy load resume parser** only when needed

## Testing

### Unit Tests for Parser

```typescript
import { parseResumeText } from "../utils/resume-parser";

describe("Resume Parser", () => {
  it("should extract headline", () => {
    const text = "Senior Full Stack Developer\nExperience...";
    const result = parseResumeText(text);
    expect(result.headline).toBeDefined();
  });

  it("should extract email", () => {
    const text = "Email: john@example.com";
    const result = parseResumeText(text);
    expect(result.email).toBe("john@example.com");
  });

  it("should extract phone", () => {
    const text = "Phone: (555) 123-4567";
    const result = parseResumeText(text);
    expect(result.phone).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe("ProfileEdit Component", () => {
  it("should render resume upload section", () => {
    // Test render
  });

  it("should save profile on submit", async () => {
    // Test API call
  });

  it("should handle file upload", () => {
    // Test file input
  });
});
```

## Debugging Tips

### Enable Logging

Add console logs to trace execution:

```typescript
console.log("[PROFILE_EDIT] Resume file received:", file.name);
console.log("[PROFILE_EDIT] Parsed resume data:", parsed);
console.log("[PROFILE_EDIT] Saving profile:", profileData);
```

### Check Parsed Data

In browser console:

```javascript
// After upload, check what was extracted
console.log(parsed);
```

### Monitor Network Requests

Use browser DevTools to check:

- POST /api/profile request
- Request payload
- Response status
- Response data

## Migration Notes

If migrating from old profile system:

1. Update ProfilePage imports
2. Remove old profile editing logic
3. Ensure backend `/api/profile` endpoint exists
4. Test resume parsing with sample resumes
5. Update any profile-related tests

## API Contract

### Request

```
POST /api/profile
Content-Type: application/json
Authorization: Bearer <token>

{
  "headline": "string",
  "summary": "string",
  "location": "string",
  "phone": "string",
  "experiences": [{...}],
  "educations": [{...}],
  "skills": {"frontend": [], "backend": [], "tools": []}
}
```

### Response (Success)

```
HTTP 200 OK
{
  "id": "user-id",
  "headline": "...",
  "summary": "...",
  ...
}
```

### Response (Error)

```
HTTP 400/500
{
  "error": "Error message",
  "details": "..."
}
```

## Maintenance

### When to Update

- Update skills list if new techs become popular
- Update patterns if resume format detection fails
- Update backend endpoint if API changes
- Update styling if theme changes

### Monitoring

- Track parsing success rate
- Monitor API errors
- Check file upload failures
- Review user feedback on auto-population accuracy

## Support & Troubleshooting

### Issue: Resume not being parsed

- Check file is valid PDF
- Check console for errors
- Try manual entry
- Verify resume has standard sections

### Issue: Fields not auto-populating

- Resume may not contain expected keywords
- Check console logs
- Try different resume format
- Fill fields manually

### Issue: API call fails

- Check network connection
- Verify backend is running
- Check CORS settings
- Review API response in DevTools

## Next Steps

1. Install optional PDF.js: `npm install pdfjs-dist`
2. Configure PDF.js worker URL in production
3. Test with real resumes
4. Customize skills lists for your domain
5. Add resume validation/feedback
6. Monitor parsing accuracy
7. Gather user feedback
8. Iterate on UX improvements
