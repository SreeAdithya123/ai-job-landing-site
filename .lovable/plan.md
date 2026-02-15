

# Add Resume Upload Feature to Scanner

## What Changes

Add a drag-and-drop file upload area to the Resume Scanner page so users can upload a resume file (.txt, .pdf, .docx) instead of manually pasting text. The uploaded file's text content will populate the existing textarea, then the user clicks "Scan Resume" as before.

## UI Layout Change

The input section will be reorganized:
- Add a file upload drop zone above the textarea with drag-and-drop support and a "Choose File" button
- When a file is selected, its name and size are shown, and the text content is extracted into the textarea
- Users can still manually paste text if they prefer
- The `Upload` icon from lucide-react will be added

## Technical Details

### File: `src/pages/ResumeScanner.tsx`

1. Add state for file handling: `selectedFile`, `dragActive`
2. Add a `useRef` for the hidden file input
3. Add drag-and-drop handlers (`onDragEnter`, `onDragLeave`, `onDragOver`, `onDrop`)
4. Add `handleFileSelect` that reads the file using `FileReader.readAsText()` and sets the textarea content
5. Add the upload zone UI above the textarea inside the input card -- styled consistently with the existing `UploadModal` component pattern (dashed border, icon, drag state highlight)
6. Accept `.pdf`, `.doc`, `.docx`, `.txt` files
7. Show the selected file name with a remove button so users can clear and re-upload

Note: `FileReader.readAsText()` works well for `.txt` files. For PDF/DOCX files, the extracted text may be limited since these are binary formats -- a note will be shown suggesting users paste text directly for best results if a non-text file is detected.

### Single file change
- `src/pages/ResumeScanner.tsx`

