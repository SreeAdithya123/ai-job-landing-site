

# Hide UPSC/Friendly Interviews + Fix Material Generator for PDF/Word

## Overview
Three changes: (1) Hide UPSC and Friendly Interviewer routes, (2) Fix the Material Generator's "corrupted file" error for PDF/Word uploads, and (3) Ensure clean human-tone output.

---

## Part 1: Hide UPSC and Friendly Interviews

The sidebar already has no links to these pages, but routes still exist in `App.tsx`. We will remove them.

**`src/App.tsx`**
- Remove imports for `FriendlyInterviewer` and `UPSCInterviewer`
- Remove their `<Route>` entries (`/friendly-interviewer` and `/upsc-interviewer`)

---

## Part 2: Fix Material Generator -- PDF/Word "Corrupted File" Error

### Root Cause

The `extractTextFromFile` function in `UploadModal.tsx` uses `FileReader.readAsText(file)` for ALL file types. PDFs and Word documents (.docx) are **binary files** -- reading them as text produces garbled characters or very short strings, triggering the "File content is too short to process" or "corrupted file" errors.

### Solution

Instead of trying to extract text client-side, we will:
1. Convert the file to **base64** in the browser
2. Send the base64 data + file name + MIME type to the edge function
3. In the edge function, use **OpenAI's GPT-4o vision/file capabilities** to process the document directly

For PDFs specifically, OpenAI GPT-4o can process PDF content when sent as a base64-encoded file in the API request. For Word documents, we will extract text server-side using a simple approach.

### Changes

**`src/components/UploadModal.tsx`**
- Replace `extractTextFromFile` with `fileToBase64` that converts any file to base64
- Update `handleGenerate` to send `{ fileBase64, fileName, mimeType, type }` instead of `{ text, type }`
- Keep the same UI and flow

**`supabase/functions/material-generator/index.ts`**
- Accept both the old `{ text, type }` format (backward compatible) and new `{ fileBase64, fileName, mimeType, type }` format
- For text files (.txt): decode base64 and use directly as text
- For PDFs: send to OpenAI as a base64-encoded file using the messages API with document content type
- For Word documents (.doc, .docx): decode base64, extract text from the XML structure (docx is a zip of XML files), or use OpenAI to process it
- The simplest reliable approach: convert all uploaded file content to a data URL and send it to GPT-4o as an image/file attachment, letting OpenAI handle the parsing

### Technical Approach for the Edge Function

```text
Client uploads file
       |
       v
Convert to base64 in browser
       |
       v
Send { fileBase64, fileName, mimeType, type } to edge function
       |
       v
Edge function checks mimeType:
  - text/plain --> decode base64, use as text directly
  - application/pdf --> send as file to OpenAI GPT-4o with document processing
  - application/vnd.openxmlformats* (docx) --> send as file to OpenAI GPT-4o
       |
       v
OpenAI processes + generates material (summary/notes/flashcards/qa)
       |
       v
Return clean human-tone output
```

For PDFs and Word docs, we will use OpenAI's multi-modal input: send the document as a base64-encoded file in the `messages` array using the `file` content type (or extract text from it first using PDF parsing). The most reliable approach is to use a two-step process:
1. First message: "Extract all text from this document" with the file attached
2. Second message: Use the extracted text to generate the requested material type

---

## Part 3: Human-Tone Output (Already Partially Fixed)

The prompts in the edge function already instruct "no markdown." We will strengthen this by:
- Adding a post-processing step in the edge function to strip any residual markdown
- The `cleanOutput` function already exists in `OutputDisplay.tsx`

---

## File Change Summary

| File | Changes |
|------|---------|
| `src/App.tsx` | Remove UPSC and Friendly Interviewer imports and routes |
| `src/components/UploadModal.tsx` | Replace `readAsText` with base64 conversion, send file data to edge function |
| `supabase/functions/material-generator/index.ts` | Accept base64 file data, use OpenAI to process PDFs/Word docs, generate material with human-tone prompts |

