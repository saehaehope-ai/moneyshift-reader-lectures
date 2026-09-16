# Reading Progress Setup Guide

This document outlines how to set up and use the reading progress persistence feature for the e-book reader.

## Overview

The reading progress feature allows users to:
- Resume reading from their last page on any device
- Maintain separate reading positions for PC and mobile readers
- Automatically save progress as they navigate through the e-book

## Setup Instructions

### 1. Create Supabase Table

Execute the migration SQL in your Supabase dashboard:

**File:** `migrations/001_create_reading_progress.sql`

Steps:
1. Go to Supabase Dashboard → Your Project → SQL Editor
2. Create a new query
3. Copy and paste the entire contents of `migrations/001_create_reading_progress.sql`
4. Click "Run"

This creates:
- `reading_progress` table with user_id, page_number, device_type, timestamps
- Row Level Security (RLS) policies to ensure users can only access their own data
- Indexes for performance

### 2. Environment Variables

No additional environment variables are needed. The API uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## How It Works

### PC Reader (`single-page-reader.tsx`)

- Uses PDF.js to render PDF pages on HTML5 canvas
- Loads reading progress on component mount
- Auto-resumes from last page (with 500ms debounce)
- Saves progress when user navigates to a new page
- Tracks as `device_type: "pc"`

### Mobile Reader (`mobile-reader.tsx`)

- Currently a placeholder component
- Ready to integrate mobile-specific design from separate Claude session
- Will track as `device_type: "mobile"`

### Viewport Detection (`page.tsx`)

- Detects screen width < 768px for mobile
- Dynamically imports appropriate reader component
- Responds to resize events for responsive behavior

## API Endpoints

### GET /api/reading-progress
Fetch user's reading progress.

**Response:**
```json
{
  "page": 42,
  "device_type": "pc",
  "last_read_at": "2026-09-15T10:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 500: Server error

### POST /api/reading-progress
Save user's reading progress.

**Request Body:**
```json
{
  "page_number": 42,
  "device_type": "pc"
}
```

**Response:**
```json
{
  "success": true,
  "page": 42
}
```

**Status Codes:**
- 200: Success
- 400: Invalid page_number
- 401: Not authenticated
- 500: Server error

## Database Schema

```sql
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  page_number INTEGER NOT NULL DEFAULT 1,
  device_type TEXT NOT NULL DEFAULT 'pc' CHECK (device_type IN ('pc', 'mobile')),
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## Custom Hook: useReadingProgress

### Location
`lib/hooks/useReadingProgress.ts`

### Usage
```typescript
import { useReadingProgress } from "@/lib/hooks/useReadingProgress";

export default function Reader() {
  const { progress, loading, error, saveProgress, loadProgress } = useReadingProgress();

  // progress: { page: number, device_type: string, last_read_at?: string }
  // loading: boolean
  // error: string | null
  // saveProgress: (page: number, deviceType?: string) => Promise<void>
  // loadProgress: () => Promise<void>
}
```

### Features
- Automatic loading on mount
- Error handling with user feedback
- Debounced saves to reduce API calls
- Refresh progress manually with `loadProgress()`

## Testing Checklist

- [ ] Supabase table created and RLS policies applied
- [ ] User can log in successfully
- [ ] PC reader loads and displays PDF
- [ ] Reading progress saves when changing pages (check Network tab)
- [ ] Logout and login again - should resume from last page
- [ ] Test mobile viewport (< 768px) - shows mobile reader placeholder
- [ ] Resize browser - switches between PC and mobile readers
- [ ] Check browser console for any errors

## Future Features

### Highlight & Underline
See `docs/HIGHLIGHT_UNDERLINE_DESIGN.md` for planned schema and API design.

### Mobile Reader Integration
Once mobile-specific design is ready from the separate Claude session:
1. Replace placeholder in `mobile-reader.tsx`
2. Integrate `useReadingProgress` hook
3. Test cross-device resume functionality

## Troubleshooting

### Reading progress not saving
- Check Network tab in DevTools - API should be returning 200
- Verify Supabase RLS policies are enabled
- Check browser console for errors
- Verify user is authenticated (should have user.id)

### Pages not resuming correctly
- Check that `page_number` matches total PDF pages (240)
- Verify `last_saved_pageRef` is being updated in single-page-reader.tsx
- Check that reading progress loads before PDF renders

### Mobile/PC separation not working
- Check browser window width (should be < 768px for mobile)
- Verify `resize` event listener is attached
- Check that dynamic imports are loading without errors

## Performance Notes

- Progress saves are debounced 500ms to avoid excessive API calls
- Queries use indexes on user_id and device_type for fast lookups
- RLS policies ensure only user's own data is accessible
