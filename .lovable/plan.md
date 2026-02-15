
# Chat Memory + Hide Sidebar Pages

## Overview

Two changes: (1) give CareerBot and YourDream Bot conversation memory so the AI knows what was said earlier, and (2) hide "Interview Question Bank", "Get Started", "Our Team", and "Careers" from the sidebar.

## Changes

### 1. Chat Memory -- `src/components/ChatBot.tsx`

Currently, only the latest user message is sent to the edge function (line 84: `data: { message: currentInput }`). The fix is to build and send a `conversationHistory` array of all previous messages alongside the current message.

- Build the history from the `messages` state (excluding the initial bot greeting), mapping each message to `{ role: 'user' | 'assistant', content: string }`
- Send `{ message: currentInput, conversationHistory: [...] }` in the request body

### 2. Use Conversation History in Edge Function -- `supabase/functions/unified-ai-api/index.ts`

Currently, the edge function sends only two messages to OpenRouter: system prompt + single user message (lines 174-182). The fix:

- For `career-coach` and `recruiter-chat` types, check if `data.conversationHistory` exists
- If it does, build the messages array as: `[system prompt, ...conversationHistory, latest user message]`
- This gives the AI full context of the conversation

### 3. Hide Sidebar Items -- `src/components/Sidebar.tsx`

Remove these items from the `menuItems` array:
- "Interview Question Bank" (line 50)
- "Get Started" (line 56)
- "Our Team" (line 57)
- "Careers" (line 58)

This also removes the entire "Company" section since all its items will be gone.

## Technical Details

**ChatBot.tsx** -- in `handleSendMessage`, before the fetch call, build:
```
const conversationHistory = messages
  .filter(m => m.id !== '1') // exclude initial greeting
  .map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.content
  }));
```
Then send `{ message: currentInput, conversationHistory }` in the body.

**unified-ai-api/index.ts** -- in the `career-coach` and `recruiter-chat` cases, after setting `userMessage`, also extract `data.conversationHistory`. Then when building the OpenRouter request body, replace the hardcoded two-message array with:
```
messages: [
  { role: "system", content: systemPrompt },
  ...(conversationHistory || []),
  { role: "user", content: userMessage }
]
```

**Sidebar.tsx** -- remove "Interview Question Bank" from the Tools section and remove the entire "Company" section.

## Files Modified
- `src/components/ChatBot.tsx`
- `supabase/functions/unified-ai-api/index.ts`
- `src/components/Sidebar.tsx`
