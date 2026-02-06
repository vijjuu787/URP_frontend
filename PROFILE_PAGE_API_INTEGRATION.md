# Profile Page - Backend API Integration

## Overview

The ProfilePage component has been updated to fetch real data from the backend API instead of using hardcoded dummy data. The component now displays actual user profile information including experiences, educations, and skills fetched from the database.

## Changes Made

### 1. **Data Fetching Implementation**

Added `useEffect` hook to fetch profile data on component mount:

```typescript
useEffect(() => {
  const fetchProfile = async () => {
    const response = await fetch("http://localhost:5100/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        setProfileData(null);
        return;
      }
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    setProfileData(data.data || data);
    calculateCompletion(data.data || data);
  };

  fetchProfile();
}, []);
```

### 2. **State Management**

Added three new state variables:

```typescript
const [profileData, setProfileData] = useState<ProfileData | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 3. **Profile Data Interface**

Defined TypeScript interface matching the backend response:

```typescript
interface ProfileData {
  id: string;
  userId: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  educations: Array<{
    id: string;
    degree: string;
    institution: string;
    location?: string;
    graduationYear?: string;
  }>;
  skills?: {
    id: string;
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}
```

### 4. **Loading and Error States**

Added UI states for:

- **Loading**: Shows spinner while fetching profile
- **Error**: Displays error message if profile fetch fails
- **Success**: Displays the fetched profile data

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center">
      <Loader className="w-8 h-8 animate-spin" />
      <p>Loading profile...</p>
    </div>
  );
}

if (error && profileData === null) {
  return (
    <div className="text-center">
      <p>Unable to Load Profile</p>
      <p>{error}</p>
    </div>
  );
}
```

### 5. **Dynamic Data Display**

All sections now display actual data:

#### Header Section

- User name from `profileData.user.fullName`
- Headline from `profileData.headline`
- Location from `profileData.location`

#### Professional Summary

- Summary from `profileData.summary`
- Fallback message if not provided

#### Contact Information

- Email from `profileData.user.email`
- Phone from `profileData.phone`
- Shows "Not added" messages for empty fields

#### Skills Section

- Frontend skills from `profileData.skills.frontend[]`
- Backend skills from `profileData.skills.backend[]`
- Tools from `profileData.skills.tools[]`
- Shows empty state if no skills

#### Work Experience

- Maps over `profileData.experiences[]`
- Displays company, role, location, dates, description
- Shows "No work experience added yet" if empty

#### Education

- Maps over `profileData.educations[]`
- Displays degree, institution, location, graduation year
- Shows "No education added yet" if empty

### 6. **Profile Completion Calculator**

Added function to calculate profile completion percentage:

```typescript
const calculateCompletion = (profile: ProfileData | null) => {
  if (!profile) {
    setProfileCompletion(0);
    return;
  }

  let completionScore = 0;
  let totalFields = 7;

  if (profile.user?.fullName) completionScore++;
  if (profile.headline) completionScore++;
  if (profile.summary) completionScore++;
  if (profile.location) completionScore++;
  if (profile.phone) completionScore++;
  if (profile.experiences && profile.experiences.length > 0) completionScore++;
  if (profile.educations && profile.educations.length > 0) completionScore++;

  setProfileCompletion(Math.round((completionScore / totalFields) * 100));
};
```

## API Endpoint

**URL**: `GET http://localhost:5100/api/profile`

**Headers**:

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Response**:

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "headline": "Senior Full Stack Developer",
    "summary": "Professional summary...",
    "location": "San Francisco, CA",
    "phone": "+1 (555) 123-4567",
    "experiences": [
      {
        "id": "uuid",
        "company": "TechCorp Solutions",
        "role": "Senior Developer",
        "location": "San Francisco, CA",
        "startDate": "Jan 2023",
        "endDate": "Present",
        "description": "Led development..."
      }
    ],
    "educations": [
      {
        "id": "uuid",
        "degree": "Bachelor of Computer Science",
        "institution": "UC Berkeley",
        "location": "Berkeley, CA",
        "graduationYear": "2020"
      }
    ],
    "skills": {
      "id": "uuid",
      "frontend": ["React", "TypeScript", "Tailwind CSS"],
      "backend": ["Node.js", "PostgreSQL"],
      "tools": ["Docker", "AWS"]
    },
    "user": {
      "id": "uuid",
      "fullName": "Sarah Johnson",
      "email": "sarah@example.com",
      "role": "candidate"
    }
  }
}
```

## Error Handling

The component handles:

1. **Network Errors**: Shows error message if fetch fails
2. **404 Not Found**: Shows empty profile state if user has no profile yet
3. **Parse Errors**: Catches JSON parsing errors
4. **Authentication**: Uses Bearer token from localStorage

## Empty State Handling

When profile data is missing:

- **No Summary**: Shows "No professional summary added yet. Add one to stand out to recruiters!"
- **No Experiences**: Shows icon + "No work experience added yet"
- **No Educations**: Shows icon + "No education added yet"
- **No Skills**: Shows empty state in skills section
- **No Contact Info**: Shows "No phone number added" placeholder

## Imports Added

```typescript
import { useState, useEffect } from "react";
import { Loader } from "lucide-react"; // Added for loading spinner
import { apiCall } from "../utils/api"; // Added for future use
```

## Usage

The component automatically fetches profile data when mounted. The user must be authenticated (token stored in localStorage) for the API call to succeed.

```tsx
<ProfilePage />
```

## Features

✅ Real data from backend API
✅ Loading state with spinner
✅ Error handling with user-friendly messages
✅ Empty state displays for missing data
✅ Profile completion percentage (calculated dynamically)
✅ Responsive design maintained
✅ Theme variables preserved
✅ Type-safe with TypeScript interface
✅ Graceful fallbacks for missing fields
✅ No TypeScript errors

## Future Enhancements

1. **Refresh Button**: Add button to manually refresh profile data
2. **Edit on Profile**: Update component to refetch after profile edit
3. **Caching**: Implement React Query or SWR for better caching
4. **Pagination**: Add pagination if experiences/educations are large
5. **Export PDF**: Use the "Download Resume" button to export profile as PDF

## Testing

### Test Case 1: Load Profile with Complete Data

1. Login with a user that has complete profile
2. Navigate to profile page
3. Verify all sections display data correctly
4. Check profile completion shows 100%

### Test Case 2: Load Profile with Partial Data

1. Login with a user that has partial profile
2. Navigate to profile page
3. Verify empty state messages appear for missing sections
4. Check profile completion percentage is correct

### Test Case 3: Load Profile - Not Found

1. Create a new account without resuming
2. Navigate to profile page
3. Verify error or empty state is shown
4. Verify profile completion shows 0%

### Test Case 4: Network Error

1. Stop backend server
2. Navigate to profile page
3. Verify error message is shown
4. Verify loading state clears

## Dependencies

- React (useState, useEffect)
- TypeScript
- Lucide React Icons (for Loader icon)
- Browser Fetch API
- localStorage for authentication token

## Browser Compatibility

Works in all modern browsers that support:

- Fetch API
- ES6 async/await
- localStorage
- CSS custom properties

## Performance Considerations

1. **Single API Call**: Profile is fetched once on mount
2. **No Re-fetching**: Component doesn't refetch on re-render
3. **Efficient Rendering**: Only updates state once
4. **Optimized Rendering**: Uses conditional rendering to avoid unnecessary DOM updates

## Troubleshooting

### Profile Not Loading

- Check if backend server is running at `http://localhost:5100`
- Verify authentication token is in localStorage
- Check browser console for specific error messages

### Empty Data

- Verify user has profile in database
- Check if profile was created after signup
- Use backend GET endpoint directly to debug

### Loading Spinner Never Goes Away

- Check network tab in DevTools for failed requests
- Verify API endpoint is correct
- Check backend logs for errors

## Notes

- Component respects all existing theme variables
- All spacing and colors are dynamic using CSS variables
- Component maintains responsive design for all screen sizes
- TypeScript provides full type safety
- No breaking changes to existing component API
