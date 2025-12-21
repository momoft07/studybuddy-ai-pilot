import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseName, examDate, weeklyHours, studyStyle, topics, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const today = new Date().toISOString().split('T')[0];
    const daysUntilExam = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const systemPrompt = `You are an expert study planner AI. Generate a detailed, personalized study plan based on the user's inputs.

IMPORTANT: You MUST respond with ONLY a valid JSON object. No markdown, no explanations, no code blocks. Just pure JSON.

The JSON must follow this exact structure:
{
  "title": "Study Plan for [Course Name]",
  "description": "Brief description of the plan",
  "totalDays": number,
  "hoursPerWeek": number,
  "dailySchedule": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "topics": ["Topic 1", "Topic 2"],
      "duration": 90,
      "sessionType": "intensive|balanced|light",
      "tasks": [
        {
          "id": "unique-id",
          "title": "Task description",
          "duration": 30,
          "completed": false
        }
      ]
    }
  ],
  "tips": ["Study tip 1", "Study tip 2"]
}

Guidelines:
- Create a realistic schedule spanning from today until the exam date
- Distribute weekly hours based on the study style preference
- If topics are provided, prioritize them in the schedule
- Include 2-4 tasks per day
- Duration is in minutes
- Generate at most 14 days of detailed schedule (first 2 weeks)`;

    const userPrompt = `Create a study plan with these details:
- Course: ${courseName}
- Exam Date: ${examDate} (${daysUntilExam} days from today: ${today})
- Weekly Hours Available: ${weeklyHours}
- Study Style: ${studyStyle}
${topics ? `- Priority Topics: ${topics}` : '- No specific topics specified'}

Generate a comprehensive study plan in JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate study plan" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    let studyPlan;
    try {
      // Try to extract JSON from the response (in case there's any wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        studyPlan = JSON.parse(jsonMatch[0]);
      } else {
        studyPlan = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse study plan from AI");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      studyPlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        daysUntilExam,
        userId
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Generate study plan error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate study plan" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
