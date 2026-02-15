
# Add "Generate New Resume" Button After Scan Results

## What Changes

After a resume scan completes and results are displayed, a prominent "Generate New Resume" button will appear that takes the user to the Resume Builder (`/resume-builder`) to create an improved resume incorporating the scanner's suggestions.

## Technical Details

### File: `src/pages/ResumeScanner.tsx`
- Import `useNavigate` from `react-router-dom` and the `FileText` icon
- Add `const navigate = useNavigate()` in the component
- After the Missing Keywords card (end of results section), add a centered call-to-action card with:
  - A heading like "Ready to improve your resume?"
  - A brief message encouraging the user to build a new ATS-optimized resume
  - A "Generate New Resume" button styled with the gradient (`from-primary to-accent`) that calls `navigate('/resume-builder')`

This is a single-file change -- just adding a button + navigation at the bottom of the scan results.
