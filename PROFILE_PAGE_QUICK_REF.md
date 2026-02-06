# ProfilePage API Integration - Quick Reference

## ✅ What Changed

The ProfilePage component now fetches **real data from the backend** instead of showing hardcoded dummy data.

## 📡 API Endpoint

```
GET http://localhost:5100/api/profile
```

**Authorization**: Bearer token (from localStorage)

## 🔄 Data Flow

```
Component Mount
    ↓
Fetch /api/profile with Bearer token
    ↓
Response received
    ↓
Parse JSON
    ↓
Store in profileData state
    ↓
Calculate completion percentage
    ↓
Render with real data
```

## 📊 State Variables

```typescript
// Profile data from API
const [profileData, setProfileData] = useState<ProfileData | null>(null);

// Loading state
const [isLoading, setIsLoading] = useState(true);

// Error message
const [error, setError] = useState<string | null>(null);

// Completion percentage (0-100)
const [profileCompletion, setProfileCompletion] = useState(85);
```

## 🎨 UI States

### Loading State

Shows spinner + "Loading profile..." message

### Error State

Shows "Unable to Load Profile" + error message

### Success State

Shows all profile data from API

## 📋 Data Structure

```typescript
ProfileData {
  id: string
  userId: string
  headline?: string              // Professional headline
  summary?: string               // Professional summary
  location?: string              // Location
  phone?: string                 // Phone number
  experiences: Experience[]      // Array of work experiences
  educations: Education[]        // Array of education
  skills?: ProfileSkills         // Skills object
  user?: {                        // User info
    id: string
    fullName: string
    email: string
    role: string
  }
}

Experience {
  id: string
  company: string               // Company name
  role: string                  // Job title
  location?: string             // Work location
  startDate?: string            // Start date
  endDate?: string              // End date
  description?: string          // Job description
}

Education {
  id: string
  degree: string                // Degree name
  institution: string           // University/College
  location?: string             // Location
  graduationYear?: string       // Graduation year
}

ProfileSkills {
  id: string
  frontend: string[]            // Frontend technologies
  backend: string[]             // Backend technologies
  tools: string[]               // Tools and platforms
}
```

## 🔌 Integration Points

| Section         | Data Source                     | Empty State                    |
| --------------- | ------------------------------- | ------------------------------ |
| Header Name     | `profileData.user.fullName`     | "Loading..."                   |
| Headline        | `profileData.headline`          | "Professional"                 |
| Location        | `profileData.location`          | Not shown                      |
| Summary         | `profileData.summary`           | "No summary added yet..."      |
| Email           | `profileData.user.email`        | Displayed                      |
| Phone           | `profileData.phone`             | "No phone number added"        |
| Frontend Skills | `profileData.skills.frontend[]` | Empty array                    |
| Backend Skills  | `profileData.skills.backend[]`  | Empty array                    |
| Tools           | `profileData.skills.tools[]`    | Empty array                    |
| Experiences     | `profileData.experiences[]`     | "No work experience added yet" |
| Educations      | `profileData.educations[]`      | "No education added yet"       |

## 🎯 Key Features

✅ Real data from backend database
✅ Loading spinner while fetching
✅ Error handling with user messages
✅ Empty state messages for missing data
✅ Dynamic profile completion calculation
✅ Type-safe TypeScript interface
✅ Bearer token authentication
✅ Graceful fallbacks

## 📝 Profile Completion Calculation

```typescript
Completion Score = (Filled Fields / Total Fields) * 100

Fields Checked:
1. Full name
2. Headline
3. Summary
4. Location
5. Phone number
6. At least one experience
7. At least one education
```

## 🧪 Testing Checklist

- [ ] Backend API running at localhost:5100
- [ ] User is authenticated (token in localStorage)
- [ ] Profile loads without errors
- [ ] All data displays correctly
- [ ] Loading spinner appears while fetching
- [ ] Error message shows if API fails
- [ ] Empty states display for missing data
- [ ] Profile completion percentage is correct

## 🐛 Troubleshooting

**Problem**: Profile not loading

- Solution: Verify backend server is running

**Problem**: Shows "Unable to Load Profile"

- Solution: Check authentication token in localStorage

**Problem**: All fields empty

- Solution: User profile not created in database

**Problem**: Loading spinner never goes away

- Solution: Check browser console for API errors

## 💡 Code Examples

### Access Profile Name

```typescript
const userName = profileData?.user?.fullName || "Loading...";
```

### Check if Profile Exists

```typescript
if (!profileData) {
  // Show empty profile state
}
```

### Get Total Experiences

```typescript
const experienceCount = profileData?.experiences?.length || 0;
```

### Get All Skills

```typescript
const allSkills = {
  frontend: profileData?.skills?.frontend || [],
  backend: profileData?.skills?.backend || [],
  tools: profileData?.skills?.tools || [],
};
```

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "lucide-react": "latest"
}
```

## 🚀 Deployment Checklist

- [ ] Backend API endpoint is live
- [ ] API returns correct data structure
- [ ] Bearer token authentication works
- [ ] Database has user profiles
- [ ] Error handling is tested
- [ ] Loading states work correctly
- [ ] Empty states display properly
- [ ] All TypeScript types are correct

## 📞 Support

For issues with:

- **API Connection**: Check backend logs
- **Data Format**: Verify Prisma schema matches
- **Authentication**: Check localStorage token
- **UI Display**: Check browser console errors

## 🔗 Related Files

- Backend API: `/api/profile` endpoint
- Prisma Schema: `prisma/schema.prisma`
- API Utility: `src/app/utils/api.ts`
- Component: `src/app/components/profile-page.tsx`

## ✨ What's Next

Recommended next steps:

1. Test with real backend server
2. Verify all data displays correctly
3. Add edit/update functionality
4. Implement profile refresh button
5. Add caching with React Query
