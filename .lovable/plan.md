
# Coding Interview OpenAI Integration + Material Generator Output Fix

## Overview

Two fixes: (1) Make the coding interview fully functional by replacing the fake "Run Code" simulation with real AI-powered code analysis via OpenAI, and switching the evaluation endpoint from OpenRouter to OpenAI. (2) Fix the material generator output so it produces clean, human-readable text without markdown symbols like `#`, `*`, etc.

---

## Part 1: Coding Interview -- Make It Workable

### Current Problems
- **"Run Code" is fake**: `handleRunCode` in `CodingInterview.tsx` (lines 120-134) uses `setTimeout` with `Math.random()` to simulate execution. It shows "simulated execution" and randomly decides correctness. This is completely non-functional.
- **Evaluation uses OpenRouter**: `coding-evaluate/index.ts` calls OpenRouter instead of OpenAI.
- **Dark theme colors**: The entire page uses `slate-900`, `purple-900`, `white` hardcoded colors instead of the claymorphism theme.

### Changes

**`supabase/functions/coding-evaluate/index.ts`** -- Switch to OpenAI + Enhance Evaluation
- Replace `OPENROUTER_API_KEY` with `OPENAI_API_KEY`
- Replace the OpenRouter API call with a direct call to `https://api.openai.com/v1/chat/completions`
- Use `gpt-4o` model for higher accuracy evaluation
- Enhance the evaluation prompt to also **analyze correctness by tracing through the code logic against test cases** instead of relying on the `isCorrect` boolean from the client
- Add `response_format: { type: "json_object" }` for reliable JSON output (no more regex extraction needed)

**`CodingInterview.tsx`** -- Replace Fake Run with AI-Powered Analysis
- Replace `handleRunCode` to call a new logic: instead of fake simulation, it sends the code + test cases to the `coding-evaluate` function with a `mode: 'run'` parameter. The AI traces through the code mentally against the test cases and returns output/correctness.
- Alternatively (simpler, more reliable): merge "Run" and "Submit" into a single flow where clicking "Run Code" sends the code to OpenAI for analysis against the test cases, and returns both the output analysis and correctness determination.
- Update `handleRunCode` to call the `coding-evaluate` edge function with a lightweight evaluation request
- The edge function will handle both modes:
  - `mode: 'run'` -- quick check: AI traces code against test cases, returns expected output and pass/fail
  - `mode: 'evaluate'` (default, current submit) -- full evaluation with score, feedback, complexity analysis

**`CodingInterview.tsx`** -- Claymorphism Theme Update
- Replace all `bg-slate-900`, `bg-slate-800/50`, `text-white`, `text-slate-300/400`, `border-purple-500/20`, `bg-purple-900` with claymorphism semantic tokens
- Use `bg-background`, `clay-card`, `text-foreground`, `text-muted-foreground`, `border-border`
- Keep the code editor dark (it is a code editor -- dark is standard)

### Updated Edge Function Pattern

```typescript
// coding-evaluate will now support two modes
const { code, language, problem, mode } = await req.json();
// mode = 'run' | 'evaluate'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

if (mode === 'run') {
  // Quick AI trace: analyze code against test cases
  // Returns: { output: string, testResults: [{input, expected, actual, passed}], isCorrect: boolean }
} else {
  // Full evaluation (current logic but with OpenAI)
  // Returns: { feedback, score, timeComplexity, spaceComplexity, strengths, improvements }
}
```

### Updated handleRunCode

```typescript
const handleRunCode = async () => {
  setIsRunning(true);
  try {
    const { data } = await supabase.functions.invoke('coding-evaluate', {
      body: { code, language, problem, mode: 'run' }
    });
    if (data.success) {
      setOutput(data.output);
      setIsCorrect(data.isCorrect);
      setExecutionTime(data.executionTime);
    }
  } catch (error) { ... }
  finally { setIsRunning(false); }
};
```

---

## Part 2: Material Generator Output -- Human Tone Fix

### Current Problems
- The system prompt says "Generate well-structured, comprehensive study materials" -- LLMs default to markdown
- The prompts explicitly ask for "headings and bullet points" which produces `#` and `*`
- The `OutputDisplay` component renders content in a `<pre>` tag, showing raw markdown symbols

### Changes

**`supabase/functions/material-generator/index.ts`** -- Fix Prompts
- Update the system prompt to explicitly say: "Write in plain text only. Do not use any markdown formatting like #, *, **, or code blocks. Use natural language with clear paragraph breaks."
- Update individual prompts:
  - `summary`: "Write a clear, readable summary in plain paragraphs. Use numbered sections like '1.' instead of markdown headings."
  - `notes`: "Write bullet notes using dashes (-) only. No markdown, no asterisks, no hash symbols."
  - `flashcards`: Keep "Q:" and "A:" format (already clean)
  - `qa`: "Format as numbered questions and answers. No markdown formatting."

**`src/components/OutputDisplay.tsx`** -- Add Markdown Cleanup
- Add a `cleanOutput` function that strips any remaining markdown characters:
  - Remove `#` heading markers
  - Replace `**text**` and `*text*` with just `text`
  - Remove triple backtick code blocks
  - Clean up excessive whitespace
- Apply this function before rendering content

---

## File Change Summary

| File | Changes |
|------|---------|
| `supabase/functions/coding-evaluate/index.ts` | Switch from OpenRouter to OpenAI, add `mode: 'run'` support for AI-powered code tracing, use `response_format: json_object` |
| `src/pages/CodingInterview.tsx` | Replace fake `handleRunCode` with real AI call, update to claymorphism theme (remove all dark hardcoded colors) |
| `supabase/functions/material-generator/index.ts` | Update prompts to produce plain text without markdown, update system prompt for human tone |
| `src/components/OutputDisplay.tsx` | Add `cleanOutput` function to strip any residual markdown characters |
| `supabase/config.toml` | Add `[functions.material-generator]` entry if missing |
