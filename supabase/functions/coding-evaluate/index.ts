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
    console.log('🔑 Auth header present:', !!authHeader);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError);
      throw new Error('User not authenticated');
    }

    const { code, language, output, problem, executionTime, isCorrect } = await req.json();

    console.log('🧠 Evaluating code submission:', {
      language,
      problemTitle: problem.title,
      codeLength: code.length,
      isCorrect
    });

    // Call OpenRouter API for AI evaluation
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const evaluationPrompt = `You are an expert coding interviewer evaluating a candidate's solution.

Problem: ${problem.title}
Difficulty: ${problem.difficulty}
Language: ${language}

Problem Description:
${problem.description}

Candidate's Code:
\`\`\`${language}
${code}
\`\`\`

Execution Output:
${output}

Execution Time: ${executionTime || 'N/A'}
Result: ${isCorrect ? 'Correct' : 'Incorrect'}

Provide a comprehensive evaluation including:
1. Correctness assessment (is the solution correct?)
2. Code quality and readability
3. Time complexity analysis (use Big O notation)
4. Space complexity analysis (use Big O notation)
5. Specific suggestions for improvement
6. Overall score out of 10

Format your response as JSON with the following structure:
{
  "feedback": "detailed feedback text",
  "timeComplexity": "O(n) explanation",
  "spaceComplexity": "O(1) explanation",
  "score": 8,
  "strengths": ["point 1", "point 2"],
  "improvements": ["suggestion 1", "suggestion 2"]
}`;

    console.log('📡 Calling OpenRouter API for evaluation...');
    
    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('OPENROUTER_SITE_URL') || 'https://vyoman.ai',
        'X-Title': Deno.env.get('OPENROUTER_SITE_NAME') || 'Vyoman AI Interviewer',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert coding interviewer. Provide detailed, constructive feedback in JSON format.' },
          { role: 'user', content: evaluationPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ OpenRouter API error:', aiResponse.status, errorText);
      throw new Error(`AI evaluation failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('✅ AI evaluation received');

    let evaluation;
    try {
      const aiContent = aiData.choices[0].message.content;
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : aiContent;
      evaluation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      // Fallback evaluation
      evaluation = {
        feedback: aiData.choices[0].message.content,
        timeComplexity: 'Analysis pending',
        spaceComplexity: 'Analysis pending',
        score: isCorrect ? 7 : 4,
        strengths: ['Solution attempted'],
        improvements: ['See detailed feedback']
      };
    }

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
        code_output: output,
        execution_time: executionTime,
        is_correct: isCorrect,
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

    console.log('✅ Evaluation completed and saved');

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