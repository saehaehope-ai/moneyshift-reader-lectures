# Highlight & Underline Feature Design

This document outlines the database structure for future highlight/underline functionality in the eBook reader.

## Database Schema

### `highlights_and_underlines` Table

```sql
create table highlights_and_underlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  page_number integer not null,
  mark_type text not null check (mark_type in ('highlight', 'underline')),
  color text default '#FFFF00',  -- hex color for highlights
  text_content text,  -- extracted text that was marked
  position_data jsonb,  -- stores coordinates/position info for precise marking
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, page_number, mark_type, position_data)
);

create index idx_highlights_user_page on highlights_and_underlines(user_id, page_number);
```

## Data Structure Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "page_number": 25,
  "mark_type": "highlight",
  "color": "#FFFF00",
  "text_content": "This is the highlighted text",
  "position_data": {
    "start_offset": 150,
    "end_offset": 180,
    "line_height": 24,
    "y_position": 450
  },
  "created_at": "2026-09-15T10:30:00Z",
  "updated_at": "2026-09-15T10:30:00Z"
}
```

## Future API Routes

### GET /api/highlights/:pageNumber
Get all highlights/underlines for a specific page.

### POST /api/highlights
Create a new highlight or underline.

### PUT /api/highlights/:id
Update an existing highlight (e.g., change color).

### DELETE /api/highlights/:id
Delete a highlight or underline.

## Frontend Implementation Considerations

1. **Canvas Overlay**: PDF.js renders to canvas, so we'll need an overlay or post-processing to display marks
2. **Text Selection**: Integrate with browser's text selection API to capture marked ranges
3. **Color Picker**: Allow users to choose different highlight colors
4. **Persistence**: Auto-save marks as they're created
5. **Sync**: Handle cross-device sync of highlights across PC and mobile

## Security

- Row Level Security (RLS) ensures users can only see their own highlights
- All API endpoints validate user_id from Supabase auth token
