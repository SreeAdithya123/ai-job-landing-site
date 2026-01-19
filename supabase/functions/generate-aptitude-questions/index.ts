import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionRequest {
  category: 'quantitative' | 'logical' | 'verbal';
  difficulty: 'easy' | 'medium' | 'hard';
  count?: number;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { category, difficulty, count = 20 }: QuestionRequest = await req.json();

    if (!category || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'Category and difficulty are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${count} ${difficulty} ${category} questions for user ${user.id}`);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const categoryPrompts = {
      quantitative: `Generate ${count} quantitative aptitude MCQ questions covering topics like:
        - Arithmetic (percentages, ratios, averages, profit & loss)
        - Algebra (equations, inequalities, sequences)
        - Geometry (areas, volumes, angles)
        - Data interpretation (tables, charts, graphs)
        - Number systems and divisibility`,
      logical: `Generate ${count} logical reasoning MCQ questions covering topics like:
        - Syllogisms and logical deductions
        - Blood relations and family trees
        - Coding-decoding patterns
        - Seating arrangements and puzzles
        - Analogies and pattern recognition
        - Series completion (number, letter, mixed)`,
      verbal: `Generate ${count} verbal ability MCQ questions covering topics like:
        - Reading comprehension
        - Sentence correction and grammar
        - Vocabulary (synonyms, antonyms, fill in blanks)
        - Para jumbles and sentence arrangement
        - Idioms and phrases
        - Critical reasoning`
    };

    const difficultyInstructions = {
      easy: 'Questions should be straightforward and suitable for beginners. Use simple calculations and clear logic.',
      medium: 'Questions should require moderate thinking and multi-step problem solving. Include some tricky options.',
      hard: 'Questions should be challenging with complex calculations or reasoning. Include subtle traps and require deep analysis.'
    };

    const prompt = `${categoryPrompts[category]}

Difficulty Level: ${difficulty.toUpperCase()}
${difficultyInstructions[difficulty]}

IMPORTANT INSTRUCTIONS:
1. Generate exactly ${count} unique MCQ questions
2. Each question must have exactly 4 options (A, B, C, D)
3. Only one option should be correct
4. Provide a brief explanation for the correct answer
5. Questions should be original and not copied from any source
6. Ensure questions are grammatically correct and clear

Return the response as a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A",
    "explanation": "Brief explanation of why this is correct"
  }
]

Return ONLY the JSON array, no additional text or markdown.`;

    // Try with primary model first, fallback to alternatives if rate limited
    const models = [
      'google/gemini-2.5-flash',
      'google/gemini-2.0-flash-001',
      'deepseek/deepseek-chat'
    ];

    let response: Response | null = null;
    let lastError: string = '';

    for (const model of models) {
      console.log(`Trying model: ${model}`);
      
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': Deno.env.get('OPENROUTER_SITE_URL') || 'https://ai-job-landing-site.lovable.app',
          'X-Title': Deno.env.get('OPENROUTER_SITE_NAME') || 'Vyoman Interviewer',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert aptitude test question generator. Generate high-quality, original MCQ questions. Always return valid JSON arrays only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 8000,
        }),
      });

      if (response.ok) {
        console.log(`Success with model: ${model}`);
        break;
      }

      if (response.status === 429) {
        lastError = `Rate limited on ${model}`;
        console.log(lastError + ', trying next model...');
        continue;
      }

      const errorText = await response.text();
      console.error(`${model} API error:`, errorText);
      lastError = `API error: ${response.status}`;
    }

    if (!response || !response.ok) {
      throw new Error(lastError || 'All models failed');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let questions: MCQQuestion[];
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      
      questions = JSON.parse(cleanContent.trim());
      
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions array');
      }

      // Validate and sanitize questions
      questions = questions.slice(0, count).map((q, index) => ({
        id: index + 1,
        question: String(q.question || ''),
        options: {
          A: String(q.options?.A || ''),
          B: String(q.options?.B || ''),
          C: String(q.options?.C || ''),
          D: String(q.options?.D || ''),
        },
        correctAnswer: ['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.correctAnswer : 'A',
        explanation: String(q.explanation || 'No explanation provided'),
      }));

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse questions from AI response');
    }

    console.log(`Successfully generated ${questions.length} questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions,
        category,
        difficulty,
        count: questions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate questions',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
