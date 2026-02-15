 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const formData = await req.json();
     const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
 
     if (!OPENAI_API_KEY) {
       throw new Error("OPENAI_API_KEY is not configured");
     }
 
     const systemPrompt = `You are an expert resume writer and career coach. Your task is to enhance and professionalize resume content while maintaining authenticity.
 
 Guidelines:
 1. Write a compelling professional summary (2-3 sentences) based on the career info provided
 2. Enhance project descriptions with action verbs and quantifiable results
 3. Rewrite work experience responsibilities as impactful bullet points
 4. Naturally integrate ATS-friendly terminology like:
    - "Cross-functional collaboration"
    - "Scalable system design"  
    - "Data-driven decision making"
    - "Performance optimization"
    - "Agile development lifecycle"
    - "Stakeholder management"
    - "Process improvement"
 5. Keep content authentic - don't invent accomplishments
 6. Use strong action verbs: Led, Developed, Implemented, Optimized, Architected, Streamlined
 7. Format consistently with proper grammar
 
 Return a JSON object with the enhanced resume data.`;
 
     const userPrompt = `Enhance this resume data for maximum recruiter and ATS impact:
 
 Personal Info: ${JSON.stringify(formData.personalInfo)}
 Career Goals: ${JSON.stringify(formData.careerInfo)}
 Education: ${JSON.stringify(formData.education)}
 Skills: ${JSON.stringify(formData.skills)}
 Projects: ${JSON.stringify(formData.projects)}
 Experience: ${JSON.stringify(formData.experience)}
 Certifications: ${JSON.stringify(formData.certifications)}
 Achievements: ${JSON.stringify(formData.achievements)}
 
 Return enhanced data as JSON with this exact structure:
 {
   "personalInfo": { original personal info },
   "careerInfo": { original career info },
   "careerSummary": "Professional 2-3 sentence summary",
   "education": [ enhanced education array ],
   "skills": { categorized skills object },
   "projects": [ enhanced projects with action verbs ],
   "experience": [ enhanced experience with impactful bullets ],
   "certifications": [ certifications array ],
   "achievements": [ achievements array ]
 }`;
 
     const response = await fetch("https://api.openai.com/v1/chat/completions", {
       method: "POST",
       headers: {
         "Authorization": `Bearer ${OPENAI_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "gpt-4o-mini",
         messages: [
           { role: "system", content: systemPrompt },
           { role: "user", content: userPrompt }
         ],
         temperature: 0.7,
         max_tokens: 4000,
         response_format: { type: "json_object" }
       }),
     });
 
     if (!response.ok) {
       const errorText = await response.text();
       console.error("OpenAI error:", response.status, errorText);
       
       // Fallback: return original data with basic summary
       const fallbackSummary = `${formData.careerInfo?.targetRole || 'Professional'} with ${formData.careerInfo?.yearsOfExperience || 'experience'} seeking to leverage expertise in ${formData.careerInfo?.keyStrengths?.join(', ') || 'various skills'} to drive organizational success.`;
       
       return new Response(JSON.stringify({
         success: true,
         data: {
           personalInfo: formData.personalInfo,
           careerInfo: formData.careerInfo,
           careerSummary: fallbackSummary,
           education: formData.education,
           skills: formData.skills,
           projects: formData.projects,
           experience: formData.experience,
           certifications: formData.certifications,
           achievements: formData.achievements
         }
       }), {
         headers: { ...corsHeaders, "Content-Type": "application/json" }
       });
     }
 
     const aiResponse = await response.json();
     const content = aiResponse.choices?.[0]?.message?.content;
 
     if (!content) {
       throw new Error("No content in AI response");
     }
 
     let enhancedData;
     try {
       enhancedData = JSON.parse(content);
     } catch {
       const jsonMatch = content.match(/\{[\s\S]*\}/);
       if (jsonMatch) {
         enhancedData = JSON.parse(jsonMatch[0]);
       } else {
         throw new Error("Failed to parse AI response as JSON");
       }
     }
 
     return new Response(JSON.stringify({
       success: true,
       data: enhancedData
     }), {
       headers: { ...corsHeaders, "Content-Type": "application/json" }
     });
 
   } catch (error) {
     console.error("Resume generation error:", error);
     return new Response(JSON.stringify({
       success: false,
       error: error instanceof Error ? error.message : "Unknown error"
     }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" }
     });
   }
 });
