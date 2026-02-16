

# Settings Page -- Edit Personal Details

## What We're Building

A new Settings page where users can view and update their personal information (full name, email display). The Settings buttons across the app (in the sidebar, interview header, career coach header) will navigate to this page.

## Current State

- The `profiles` table already exists with columns: `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`
- RLS policies already allow users to update their own profile
- A `handle_new_user` trigger auto-creates profiles on signup
- The Settings buttons in InterviewHeader, Sidebar ("Manage Account"), and CareerCoach currently do nothing

## Changes

### 1. Create Settings Page (`src/pages/Settings.tsx`)

A new page with a form allowing users to edit:
- Full Name (editable, saved to `profiles.full_name`)
- Email (display only -- changing email requires auth flow)
- Account status display
- Save button that updates the `profiles` table via Supabase

The page will:
- Fetch current profile data from `profiles` table on load
- Allow editing `full_name`
- Show a success toast on save
- Use the existing Layout component with sidebar
- Follow the claymorphism design system

### 2. Add Route in App.tsx

- Add `/settings` route pointing to the new Settings page

### 3. Wire Up Settings Buttons

- **Sidebar.tsx**: Change `handleManageAccount` to navigate to `/settings`
- **InterviewHeader.tsx**: Add `onClick` to the Settings button to navigate to `/settings`
- **CareerCoach.tsx**: Wire the Settings button to navigate to `/settings`

## Technical Details

### Settings Page Structure

```
Settings Page
  |-- Back button
  |-- Page header (Settings icon + title)
  |-- Personal Information Card
  |     |-- Full Name input (editable)
  |     |-- Email (read-only display)
  |     |-- Account Status
  |     |-- Save Changes button
  |-- Account Info Card
        |-- User ID
        |-- Member Since date
```

### Database Interaction

```typescript
// Fetch profile
const { data } = await supabase
  .from('profiles')
  .select('full_name, email, avatar_url, created_at')
  .eq('id', user.id)
  .single();

// Update profile
await supabase
  .from('profiles')
  .update({ full_name: newName })
  .eq('id', user.id);
```

No database migrations needed -- the `profiles` table and RLS policies already support this.

## File Summary

| File | Change |
|------|--------|
| `src/pages/Settings.tsx` | New file -- settings page with profile editing form |
| `src/App.tsx` | Add `/settings` route |
| `src/components/Sidebar.tsx` | Navigate to `/settings` on "Manage Account" click |
| `src/components/interview/InterviewHeader.tsx` | Wire Settings button to `/settings` |
| `src/pages/CareerCoach.tsx` | Wire Settings button to `/settings` |

