

# Rename CareerBot and Talk to Recruiters + Fix Response Tone

## What Changes

1. **Rename "AI Career Coach" to "CareerBot"** across all pages (sidebar, header, pricing, payments, chatbot title/messages).

2. **Rename "Speak with Recruiters" to "Talk to Recruiters"** across all pages (sidebar, page header, chatbot title/messages). Also rename "Recruiter Bot" references in pricing/payments to "YourDream Bot".

3. **Fix markdown formatting in responses** -- the AI currently returns responses with `#`, `*`, and other markdown symbols. The system prompts in the edge function will be updated to instruct the model to reply in plain, conversational text without any markdown formatting.

4. **Enable streaming (real-time) responses** -- currently the chatbot waits for the full AI response before displaying it. This will be changed to stream tokens as they arrive, so the user sees text appear in real time.

## Files to Change

### 1. `src/components/Sidebar.tsx`
- Line 48: "AI Career Coach" -> "CareerBot"
- Line 49: "Speak with Recruiters" -> "Talk to Recruiters"

### 2. `src/pages/CareerCoach.tsx`
- Line 59: Header title "AI Career Coach" -> "CareerBot"
- Line 112: ChatBot title "Your Personal Career Coach" -> "CareerBot"
- Line 114: Initial message updated to use "CareerBot" name

### 3. `src/pages/Recruiters.tsx`
- Line 47: Page heading "Speak with Recruiters" -> "Talk to Recruiters"
- Line 97: Sub-heading updated
- Line 101: ChatBot title "Recruiter Connection Assistant" -> "YourDream Bot"
- Line 103: Initial message updated with new name

### 4. `src/components/Pricing.tsx`
- Lines 30, 50, 71: "AI Career Coach" -> "CareerBot"
- Line 51: "Recruiter Bot" -> "YourDream Bot"

### 5. `src/pages/Payments.tsx`
- Lines 41, 62, 84, 110: "AI Career Coach" -> "CareerBot"
- Lines 63, 85, 111: "Recruiter Bot" -> "YourDream Bot"

### 6. `supabase/functions/unified-ai-api/index.ts` (fix tone + streaming)
- Line 129: Career coach system prompt -- add instruction: "Reply in plain conversational English. Do not use markdown, hashtags, asterisks, bullet points, or any special formatting. Write as if you're talking to a friend."
- Line 151: Recruiter chat system prompt -- same plain-text instruction added.

### 7. `src/components/ChatBot.tsx` (enable real-time streaming)
- Replace the current non-streaming `askCareerCoach` / `chatWithRecruiter` calls with a streaming fetch to the `unified-ai-api` edge function.
- Parse SSE tokens line-by-line and update the assistant message progressively as tokens arrive.
- Show text appearing in real time instead of waiting for the full response.

### 8. `supabase/functions/unified-ai-api/index.ts` (enable streaming)
- For `career-coach` and `recruiter-chat` types, set `stream: true` in the OpenRouter request.
- Return the response body stream directly to the client with `Content-Type: text/event-stream`.
- Keep non-streaming behavior for `interview-analysis` and `material-generator` (which need full JSON parsing).

