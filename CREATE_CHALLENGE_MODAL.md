# Create Challenge Modal - Implementation Guide

## Overview

A modal form has been created that opens when clicking the "Create Challenge" button in the Admin Challenges page. The form allows admins to create new challenges with all required information.

## Files Created/Modified

### 1. **New File: `create-challenge-modal.tsx`**

- Reusable modal component for creating challenges
- Handles all form inputs and validations
- Supports dynamic addition of skills/tags, requirements, and responsibilities

### 2. **Modified: `admin-challenges.tsx`**

- Imported `CreateChallengeModal` component
- Added `showCreateModal` state to control modal visibility
- Added `isCreating` state for loading during submission
- Added `handleCreateChallenge` function to process form submission
- Updated "Create Challenge" button to open the modal

## Form Fields

The modal collects the following information:

### Basic Information

- **Job Title** - e.g., "Backend Engineer"
- **Company Name** - e.g., "DataStream Analytics"
- **Company Logo** - 2-letter abbreviation (e.g., "DS")
- **Location** - e.g., "Seattle, WA"

### Job Details

- **Work Type** - Remote, Hybrid, On-site
- **Job Type** - Full-time, Contract, Internship
- **Salary Range** - e.g., "$110k - $150k"
- **Experience Level** - e.g., "3-5 years"

### Descriptions & Lists

- **Job Description** - Detailed job description
- **Skills/Tags** - Dynamically added list (e.g., Python, AWS, Docker)
- **Requirements** - Dynamically added list
- **Responsibilities** - Dynamically added list

## How to Use

### For Users

1. Go to Admin Dashboard → Challenge Management
2. Click the "Create Challenge" button (green button with + icon)
3. Fill in all required fields (marked with \*)
4. For lists (Skills, Requirements, Responsibilities):
   - Type the item in the input field
   - Press Enter or click the + button
   - Remove items by clicking the X button
5. Click "Create Challenge" to submit

### For Developers

The form data structure matches the job listing format:

```typescript
interface ChallengeData {
  title: string;
  company: string;
  logo: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  jobType: "Full-time" | "Contract" | "Internship";
  salary: string;
  experience: string;
  tags: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
}
```

## Integration with Backend API

The `handleCreateChallenge` function is ready to be connected to a backend API. Currently, it logs the data and closes the modal.

To connect it to your API:

```typescript
const handleCreateChallenge = async (data: ChallengeData) => {
  setIsCreating(true);
  try {
    const result = await apiCall("http://localhost:5100/api/challenges", {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("Challenge created:", result);
    setShowCreateModal(false);
    // Refresh challenges list here
  } catch (error) {
    console.error("Error creating challenge:", error);
    // Handle error
  } finally {
    setIsCreating(false);
  }
};
```

## Features

✅ All fields with input validation
✅ Dynamic list management (skills, requirements, responsibilities)
✅ Loading state during submission
✅ Error handling and display
✅ Responsive design (works on mobile and desktop)
✅ Uses existing design system (CSS variables)
✅ Keyboard support (Enter to add items)
✅ Modal overlay with backdrop

## Validation

The form validates that:

- All required fields are filled
- At least one skill/tag is added
- At least one requirement is added
- At least one responsibility is added
- Display error message if validation fails

## Future Enhancements

- [ ] Connect to backend API endpoint
- [ ] Add success notification after creation
- [ ] Add loading spinner during submission
- [ ] Add image upload for company logo instead of 2-letter code
- [ ] Add difficulty level selector
- [ ] Add category selector
- [ ] Add time limit field
- [ ] Add points/scoring field
- [ ] Add template selection
- [ ] Add bulk import from CSV
