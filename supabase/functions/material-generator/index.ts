import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const typeInstructions: Record<string, string> = {
  summary: 'Write a clear, readable summary in plain paragraphs. Use numbered sections like "1.", "2." instead of any special formatting. Do not use any symbols like #, *, **, or markdown. Write naturally as a human would explain it to a student.',
  notes: 'Convert the content into student-friendly bullet notes. Use dashes (-) for bullet points. Use numbered labels like "Section 1:" for sections. Do not use any markdown symbols like #, *, **, or code blocks. Write in a clear, natural human tone.',
  flashcards: 'Create Q&A flashcards from the content. Format each as:\n\nQ: [question]\nA: [answer]\n\nKeep answers concise and clear. Do not use any markdown formatting like #, *, **, or code blocks.',
  qa: 'Extract important questions and answers from the content. Format as numbered pairs:\n\n1. Question: [question]\n   Answer: [answer]\n\nDo not use any markdown formatting like #, *, **, or code blocks. Write in a clear, natural tone.',
};

const systemPrompt = 'You are an expert educational content creator. Write in plain text only. Do not use any markdown formatting whatsoever - no hash symbols (#), no asterisks (*), no bold (**), no code blocks (```), no underscores for emphasis. Use natural language with clear paragraph breaks, dashes for bullets, and numbered lists. Write as a friendly, knowledgeable human tutor would.';

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

serve(async (req) => {
  console.log('Material generator function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const body = await req.json();
    const { type } = body;
    const instruction = typeInstructions[type as string] || typeInstructions.summary;

    let messages: any[];

    if (body.fileBase64) {
      // New path: file uploaded as base64
      const { fileBase64, fileName, mimeType } = body;
      console.log('Processing file:', fileName, 'MIME:', mimeType, 'Base64 length:', fileBase64?.length);

      if (mimeType === 'text/plain') {
        // Plain text: decode and use directly
        const text = atob(fileBase64);
        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${instruction}\n\nHere is the text:\n\n${text}` }
        ];
      } else {
        // PDF or Word: use OpenAI's file input capability
        // Two-step: first extract text, then generate material
        const extractResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'file',
                    file: {
                      filename: fileName,
                      file_data: `data:${mimeType};base64,${fileBase64}`,
                    }
                  },
                  {
                    type: 'text',
                    text: 'Extract ALL text content from this document. Return the complete text exactly as it appears, preserving structure. Do not summarize or skip anything.',
                  }
                ]
              }
            ],
            max_tokens: 16000,
            temperature: 0,
          }),
        });

        if (!extractResponse.ok) {
          const errBody = await extractResponse.text();
          console.error('OpenAI extract error:', extractResponse.status, errBody);
          throw new Error(`Failed to extract text from document: ${extractResponse.status}`);
        }

        const extractData = await extractResponse.json();
        const extractedText = extractData.choices[0].message.content;
        console.log('Extracted text length:', extractedText.length);

        messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${instruction}\n\nHere is the text extracted from the document "${fileName}":\n\n${extractedText}` }
        ];
      }
    } else if (body.text) {
      // Legacy path: text sent directly
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${instruction}\n\n${body.text}` }
      ];
    } else {
      throw new Error('No file or text content provided');
    }

    // Generate the material
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('OpenAI generation error:', response.status, errBody);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const cleanContent = stripMarkdown(rawContent);

    return new Response(JSON.stringify({ content: cleanContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in material-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
