# Resume Upload and Profile Management Feature

## Overview

This feature enables candidates to upload their resume and auto-populate their profile information. The system extracts key data from the resume and pre-fills form fields, allowing candidates to review and edit before saving.

## Components

### 1. ProfilePage (`src/app/components/profile-page.tsx`)

- **Purpose**: Display candidate profile with view and edit modes
- **Features**:
  - View-only mode showing profile summary
  - "Edit Profile" button to enter edit mode
  - Toggles between ProfilePage and ProfileEdit component
  - Shows profile completion percentage

### 2. ProfileEdit (`src/app/components/profile-edit.tsx`)

- **Purpose**: Edit and manage candidate profile with resume upload
- **Features**:
  - Resume file upload (PDF format)
  - Auto-population of profile fields from resume
  - Manual editing of all profile fields
  - Dynamic addition/removal of work experience entries
  - Dynamic addition/removal of education entries
  - Skill management with categorization (frontend, backend, tools)
  - Save profile to backend via `POST /api/profile`
  - Cancel button to discard changes

### 3. Resume Parser (`src/app/utils/resume-parser.ts`)

- **Purpose**: Extract structured data from resume text
- **Features**:
  - Extract headline/job title
  - Extract professional summary
  - Extract location and phone number
  - Extract email address
  - Parse work experiences (company, role, dates, description)
  - Parse education (degree, institution, graduation year)
  - Identify skills from text (categorized as frontend, backend, tools)

## How to Use

### For Candidates

1. **View Profile**
   - Navigate to the Profile page
   - View your current profile information

2. **Edit Profile with Resume**
   - Click "Edit Profile" button
   - Upload your PDF resume using the file input
   - System automatically extracts data and pre-fills form fields
   - Review extracted information
   - Manually edit any fields as needed
   - Click "Save Profile" to submit

3. **Manual Profile Editing**
   - Click "Edit Profile" without uploading resume
   - Manually fill in profile fields
   - Add work experiences
   - Add education history
   - Add skills
   - Click "Save Profile"

### For Developers

#### Resume File Upload

```tsx
<input type="file" accept=".pdf" onChange={handleResumeUpload} />
```

#### Resume Parsing

```typescript
import { parseResumeText } from "../utils/resume-parser";

const parsed = parseResumeText(resumeText);
// Returns: {
//   headline: string
//   summary: string
//   location: string
//   phone: string
//   email: string
//   experiences: Experience[]
//   educations: Education[]
//   skills: { frontend, backend, tools }
// }
```

#### Saving Profile

```typescript
const profileData = {
  headline,
  summary,
  location,
  phone,
  experiences,
  educations,
  skills,
};

const result = await apiCall("http://localhost:5100/api/profile", {
  method: "POST",
  body: JSON.stringify(profileData),
});
```

## Backend API Endpoint

**Endpoint**: `POST http://localhost:5100/api/profile`

**Request Body**:

```json
{
  "headline": "Senior Full Stack Developer",
  "summary": "Professional summary text...",
  "location": "San Francisco, CA",
  "phone": "+1 (555) 123-4567",
  "experiences": [
    {
      "company": "TechCorp Solutions",
      "role": "Senior Full Stack Developer",
      "location": "San Francisco, CA",
      "startDate": "Jan 2023",
      "endDate": "Present",
      "description": "Led development of cloud-based microservices"
    }
  ],
  "educations": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "UC Berkeley",
      "location": "Berkeley, CA",
      "graduationYear": "2016"
    }
  ],
  "skills": {
    "frontend": ["React", "TypeScript", "Tailwind CSS"],
    "backend": ["Node.js", "Python", "PostgreSQL"],
    "tools": ["Docker", "AWS", "Git"]
  }
}
```

## PDF Parsing Integration

Currently, the resume parser extracts text from simulated PDF content. To integrate actual PDF parsing:

### Option 1: Client-Side PDF Parsing (pdf.js)

1. **Install pdf.js**:

   ```bash
   npm install pdfjs-dist
   ```

2. **Update resume-parser.ts**:

   ```typescript
   import * as pdfjsLib from "pdfjs-dist";

   pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

   export async function extractTextFromPDF(file: File): Promise<string> {
     const pdfData = await file.arrayBuffer();
     const pdf = await pdfjsLib.getDocument(pdfData).promise;
     let text = "";

     for (let i = 1; i <= pdf.numPages; i++) {
       const page = await pdf.getPage(i);
       const content = await page.getTextContent();
       text += content.items.map((item: any) => item.str).join(" ");
     }

     return text;
   }
   ```

3. **Update profile-edit.tsx**:
   ```typescript
   const resumeText = await extractTextFromPDF(file);
   const parsed = parseResumeText(resumeText);
   ```

### Option 2: Backend PDF Parsing

1. **Create backend endpoint** that accepts PDF file and returns extracted text

2. **Update profile-edit.tsx**:

   ```typescript
   const formData = new FormData();
   formData.append("resume", file);

   const response = await apiCall("http://localhost:5100/api/resume/parse", {
     method: "POST",
     body: formData,
   });

   const { text } = response;
   const parsed = parseResumeText(text);
   ```

## Data Flow

```
Resume Upload
      ↓
[File Input] → handleResumeUpload()
      ↓
extractResumeContent() → Resume Text
      ↓
parseResumeText() → Parsed Resume Data
      ↓
Form Field Population
      ↓
Manual Review/Editing
      ↓
handleSave() → apiCall('/api/profile')
      ↓
Backend Profile Creation/Update
      ↓
Success Toast/Redirect
```

## State Management

```typescript
// Profile fields
const [headline, setHeadline] = useState("");
const [summary, setSummary] = useState("");
const [location, setLocation] = useState("");
const [phone, setPhone] = useState("");

// Structured data
const [experiences, setExperiences] = useState<Experience[]>([]);
const [educations, setEducations] = useState<Education[]>([]);
const [skills, setSkills] = useState<Skills>({...});

// UI state
const [resumeFile, setResumeFile] = useState<File | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## Features

### Resume Upload

- Accept PDF files
- Drag-and-drop support
- File size validation
- Visual feedback during processing
- Error handling with user-friendly messages

### Profile Form Editing

- Text inputs for basic info
- Textarea for summary
- Add/remove work experience entries
- Add/remove education entries
- Skill management with add/remove buttons
- Skills categorized by type (frontend, backend, tools)

### Data Extraction

- Automatic headline extraction from resume
- Professional summary detection
- Location and phone number parsing
- Experience parsing with dates
- Education history extraction
- Skill identification from resume text

### Form Submission

- Data validation
- API call to backend
- Loading state during submission
- Error handling and display
- Success confirmation (redirect or toast)

## Styling

All components use CSS custom properties for theming:

- `--bg-primary`, `--bg-secondary`: Background colors
- `--text-primary`, `--text-secondary`: Text colors
- `--border-primary`, `--border-secondary`: Border colors
- `--primary-600`, `--primary-100`: Primary brand colors
- `--error-600`, `--error-50`: Error colors
- `--success-400`, `--success-50`: Success colors

## Error Handling

- File upload validation (type, size)
- Resume parsing error handling
- API request error handling
- User-friendly error messages
- Graceful fallbacks for missing data

## Future Enhancements

1. **Advanced PDF Parsing**
   - Support for DOCX files
   - Better resume format detection
   - Multi-page resume handling
   - Confidence scores for extracted data

2. **Resume Validation**
   - Resume quality assessment
   - Missing field detection
   - Suggestions for improvement

3. **Profile Completion**
   - Profile strength indicator
   - Suggestions for missing sections
   - Portfolio/project links
   - Certifications support

4. **Resume Templates**
   - Resume builder
   - Template options
   - Export to PDF

## Testing

To test the resume parsing without PDF.js:

1. The component uses mock resume text for demonstration
2. Form fields will be pre-populated with extracted data
3. You can edit all fields manually
4. Clicking "Save Profile" sends data to the backend

## Troubleshooting

### Resume not being parsed

- Ensure file is in PDF format
- Check console for error messages
- Verify resume contains standard sections (Education, Experience)

### Form fields not pre-filled

- Resume may not contain expected sections
- Fill fields manually
- Try a different resume format

### Save fails

- Check network connection
- Verify backend endpoint is running
- Check browser console for API errors
- Ensure all required fields are filled

## Dependencies

- React 18+
- TypeScript
- Lucide React (icons)
- Custom UI components
- Custom API utility

## Optional Dependencies (for PDF parsing)

- `pdfjs-dist` (for client-side PDF parsing)
- Backend PDF parsing service (alternative approach)
