# Onboarding Form Skills API Integration

## Summary of Changes

I've implemented the `/api/skills` POST endpoint integration into the onboarding-form.tsx component.

## What Was Done

### 1. **Imported apiCall utility**

- Added `import { apiCall } from "../utils/api";` to use the authenticated API caller

### 2. **Added State Variables**

- `isSaving`: Tracks if the API request is in progress
- `saveError`: Stores error messages if the API call fails

### 3. **Created `handleSaveSkills` Function**

This async function:

- Validates form data
- Formats the skills array as a comma-separated string
- Calls the `/api/skills` endpoint with POST method
- Maps form data to API parameters:
  - `currentRole` → `primaryRole`
  - `preferredJobRole` → `secondaryRole`
  - `yearsExperience` → `experienceLevel`
  - `selectedSkills` → `skill` (comma-separated)
  - `workType` → `workType`
  - `jobType` → `jobType`
  - `projectDescription` → `experienceAndProject`
- Calls `onComplete()` on success to navigate to the next step
- Handles errors and displays them to the user

### 4. **Updated Button Behavior**

- Changed from calling `onComplete()` directly to calling `handleSaveSkills()`
- Button now shows "Saving..." state while API request is pending
- Button is disabled during save and if form is invalid
- Arrow icon is hidden while saving

### 5. **Added Error Display**

- Shows error messages above the action buttons if the API call fails
- Error messages are styled with red background

## Flow

```
User fills form → Clicks "Continue to Skill Evaluation" button
    ↓
handleSaveSkills() is called
    ↓
Button shows "Saving..." and becomes disabled
    ↓
API call to POST /api/skills with all form data
    ↓
If Success: onComplete() is called (navigate to next page)
If Error: Error message is displayed, button becomes enabled again
```

## API Requirements

The backend API endpoint should:

- Require Bearer token authentication (handled by `apiCall` utility)
- Accept POST requests at `/api/skills`
- Expect JSON body with:
  - `primaryRole`: string
  - `secondaryRole`: string
  - `experienceLevel`: string
  - `skill`: string (comma-separated skills)
  - `workType`: string
  - `jobType`: string
  - `experienceAndProject`: string

## Testing

1. Fill out the onboarding form with valid data
2. Click "Continue to Skill Evaluation" button
3. Check browser console for logs:
   - "Saving skills..." (start)
   - "Skills saved successfully: {result}" (success)
   - "Error saving skills: {error}" (failure)
4. Verify token is included in the request (check Network tab in DevTools)
5. On success, page should navigate to the next step
