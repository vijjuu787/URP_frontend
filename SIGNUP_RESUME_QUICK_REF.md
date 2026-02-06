# Signup Resume Integration - Quick Reference

## What Changed

The `SignupPage` component now:

1. **Extracts resume data** when a file is uploaded
2. **Parses the text** to get structured information
3. **Auto-fills form fields** (name field especially)
4. **Saves to database** via `/api/profile` endpoint after signup

## New State

```typescript
const [resumeData, setResumeData] = useState<any>(null); // Parsed resume data
const [isProcessingResume, setIsProcessingResume] = useState(false); // Loading state
```

## New Functions

### handleResumeUpload

```typescript
// Triggered when user selects a file
// - Validates file type (PDF/DOC/DOCX)
// - Extracts text from resume
// - Parses text to get structured data
// - Auto-fills name field if available
// - Stores resumeData for later use
```

### extractResumeContent

```typescript
// Extracts text content from resume file
// Currently returns simulated data
// TODO: Integrate pdf.js for actual parsing
```

## Data Flow

### On File Upload

```
User selects file
    ↓
handleResumeUpload()
    ↓
extractResumeContent() → text
    ↓
parseResumeText() → structured data
    ↓
setResumeData() → store for signup
    ↓
Auto-fill name field
    ↓
Show "Data extracted" message
```

### On Account Creation

```
User clicks "Create Account"
    ↓
handleSubmit()
    ↓
Create user account
    ↓
If resumeData exists:
    ├─ Format as profile payload
    ├─ POST to /api/profile
    └─ Save extracted data to database
    ↓
Success or error (non-blocking)
```

## API Call

**Endpoint**: `POST http://localhost:5100/api/profile`

**Payload**:

```json
{
  "headline": "Senior Full Stack Developer",
  "summary": "...",
  "location": "...",
  "phone": "...",
  "experiences": [...],
  "educations": [...],
  "skills": {"frontend": [], "backend": [], "tools": []}
}
```

**Response**:

```json
{
  "message": "Profile created/updated successfully",
  "data": {
    "id": "...",
    "headline": "...",
    "experiences": [...],
    ...
  }
}
```

## UI Changes

**Resume Upload Section**:

- Shows upload area with dashed border
- Shows "Click to upload or drag and drop"
- Shows "Processing resume..." while extracting
- Shows "Data extracted" message when complete
- Displays file info (name and size)
- Allow to remove file and re-upload

**Form Auto-Fill**:

- Name field auto-fills from headline if available
- Other fields remain empty for manual entry
- User can override any auto-filled data

**Error Handling**:

- Invalid file type: "Please upload a PDF or DOC file"
- Processing error: Shows error message
- Profile save error: Logs but doesn't fail signup

## Code Locations

**Main Component**: `src/app/components/signup-page.tsx`

- Lines: 1-524
- Key functions: handleResumeUpload, extractResumeContent, handleSubmit

**Resume Parser**: `src/app/utils/resume-parser.ts`

- Imported and used in signup
- Parses extracted text to structured data

**API Utility**: `src/app/utils/api.ts`

- Used to call `/api/profile` endpoint
- Handles authentication automatically

## Key States

```typescript
// Existing
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [resume, setResume] = useState<File | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// New
const [resumeData, setResumeData] = useState<any>(null);
const [isProcessingResume, setIsProcessingResume] = useState(false);
```

## UI Feedback States

1. **Empty State**: "Click to upload or drag and drop"
2. **Processing**: "Processing resume..." (faded, disabled)
3. **Success**: Shows file info + "Data extracted" message
4. **Error**: Shows error message in red box

## Extracted Data Structure

```typescript
{
  headline?: string,           // e.g., "Senior Developer"
  summary?: string,            // Professional summary
  location?: string,           // e.g., "San Francisco, CA"
  phone?: string,              // e.g., "+1 (555) 123-4567"
  email?: string,              // e.g., "user@example.com"
  experiences: [
    {
      company: string,
      role: string,
      location?: string,
      startDate?: string,
      endDate?: string,
      description?: string
    }
  ],
  educations: [
    {
      degree: string,
      institution: string,
      location?: string,
      graduationYear?: string
    }
  ],
  skills: {
    frontend: string[],
    backend: string[],
    tools: string[]
  }
}
```

## Error Scenarios

### File Type Error

```typescript
if (!validTypes.includes(file.type)) {
  setError("Please upload a PDF or DOC file");
}
```

### Processing Error

```typescript
try {
  const parsed = parseResumeText(resumeText);
  setResumeData(parsed);
} catch (err) {
  setError("Failed to process resume");
  setResume(null);
}
```

### Profile Save Error

```typescript
try {
  await apiCall('/api/profile', { ... });
} catch (profileErr) {
  console.error("Failed to save profile");
  // Don't fail signup
}
```

## Testing

### Manual Testing Steps

1. **Test File Upload**
   - Upload valid PDF → Should process
   - Upload DOC → Should process
   - Upload TXT → Should error
   - Upload large file → Should error (>5MB)

2. **Test Data Extraction**
   - Check console for parsed data
   - Verify name field auto-fills
   - Check resumeData state

3. **Test Signup**
   - Create account with resume
   - Check `/api/profile` call in Network tab
   - Verify profile saved in database

4. **Test Without Resume**
   - Skip resume upload
   - Fill fields manually
   - Create account
   - Verify account created

### Console Logging

Enable in browser console:

```javascript
// Check parsed data
console.log(resumeData);

// Check what's being sent
// Enable Network tab to see POST request to /api/profile
```

## Known Limitations

1. **PDF Parsing**: Currently simulated
   - TODO: Implement pdf.js for real parsing
   - `npm install pdfjs-dist`

2. **DOCX Support**: Currently simulated
   - TODO: Add docx parser library

3. **Auto-Fill**: Only name field
   - Other fields available in profile edit page
   - Can manually fill during signup

4. **Profile Save**: Non-blocking
   - If profile save fails, signup still succeeds
   - User can update profile later

## Future Enhancements

- [ ] Real PDF text extraction with pdf.js
- [ ] DOCX file support
- [ ] Auto-fill more form fields
- [ ] Confidence scores for extracted data
- [ ] Resume validation
- [ ] Skill suggestions
- [ ] Resume quality feedback

## Related Documentation

- **RESUME_UPLOAD_FEATURE.md** - Profile edit resume feature
- **DEVELOPER_GUIDE.md** - Developer reference
- **SIGNUP_RESUME_INTEGRATION.md** - Full integration guide (this file)

## Quick Debug Checklist

- [ ] Resume file selected successfully
- [ ] No file type error
- [ ] Processing status shows while extracting
- [ ] resumeData state populated
- [ ] Name field auto-fills
- [ ] Signup completes successfully
- [ ] Network tab shows POST to /api/profile
- [ ] Backend receives profile data
- [ ] Profile saved to database

## Support

For issues:

1. Check browser console for errors
2. Check Network tab for API calls
3. Verify `/api/profile` endpoint is running
4. Check backend logs for errors
5. Verify resume file is valid PDF/DOC
6. Test with sample resume if needed
