import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: authHeader ? { Authorization: authHeader } : {} } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { code, language, problem, mode } = await req.json();

    console.log('🧠 Mode:', mode, '| Problem:', problem.title, '| Language:', language);

    if (mode === 'run') {
      // Quick AI trace: analyze code against test cases
      const runPrompt = `You are an expert code evaluator. Mentally trace through this code and determine what it would output when run against the given test cases.

Problem: ${problem.title}
Description: ${problem.description}

Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Test Cases:
${(problem.testCases || []).map((tc: any, i: number) => `Test ${i + 1}: Input: ${tc.input} | Expected Output: ${tc.output}`).join('\n')}

Trace through the code logic step by step for each test case. Determine:
1. What the code would actually output for each test case
2. Whether each test case passes or fails
3. Overall correctness

Return JSON:
{
  "output": "A human-readable summary of execution results for each test case",
  "testResults": [{"input": "...", "expected": "...", "actual": "...", "passed": true/false}],
  "isCorrect": true/false,
  "analysis": "Brief explanation of code behavior"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a precise code evaluator. Always return valid JSON.' },
            { role: 'user', content: runPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API failed: ${response.status}`);
      }

      const aiData = await response.json();
      const result = JSON.parse(aiData.choices[0].message.content);

      console.log('✅ Run complete. Correct:', result.isCorrect);

      return new Response(
        JSON.stringify({
          success: true,
          output: result.output,
          isCorrect: result.isCorrect,
          testResults: result.testResults,
          analysis: result.analysis,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // mode === 'evaluate' (full evaluation + save to DB)
    const evaluationPrompt = `You are an expert coding interviewer evaluating a candidate's solution with 100% accuracy.

Problem: ${problem.title}
Difficulty: ${problem.difficulty}
Language: ${language}

Problem Description:
${problem.description}

Test Cases:
${(problem.testCases || []).map((tc: any, i: number) => `Test ${i + 1}: Input: ${tc.input} | Expected Output: ${tc.output}`).join('\n')}

Candidate's Code:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: Do NOT rely on any client-provided correctness. You must independently trace through the code against ALL test cases to determine correctness.

Provide a comprehensive evaluation as JSON:
{
  "feedback": "detailed feedback text covering correctness, logic, edge cases",
  "timeComplexity": "O(n) with explanation",
  "spaceComplexity": "O(1) with explanation",
  "score": 8,
  "isCorrect": true,
  "strengths": ["point 1", "point 2"],
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert coding interviewer. Return valid JSON only.' },
          { role: 'user', content: evaluationPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const aiData = await response.json();
    const evaluation = JSON.parse(aiData.choices[0].message.content);

    console.log('✅ Evaluation complete. Score:', evaluation.score);

    // Save to database
    const { data: savedResult, error: saveError } = await supabaseClient
      .from('coding_interview_results')
      .insert({
        user_id: user.id,
        problem_id: problem.id,
        problem_title: problem.title,
        problem_description: problem.description,
        difficulty: problem.difficulty,
        language,
        user_code: code,
        code_output: evaluation.feedback,
        is_correct: evaluation.isCorrect,
        ai_feedback: evaluation.feedback,
        score: evaluation.score,
        time_complexity: evaluation.timeComplexity,
        space_complexity: evaluation.spaceComplexity,
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving result:', saveError);
      throw saveError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        evaluation: {
          ...evaluation,
          resultId: savedResult.id
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in coding evaluation:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to evaluate code'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
