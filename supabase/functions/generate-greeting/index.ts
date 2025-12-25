import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GreetingRequest {
  name: string;
  branch: string;
  year: string;
  rollNumber?: string;
  goal?: string;
  language: 'EN' | 'TE';
  // Optional: user's Gmail to receive the greeting and to be stored
  email?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, branch, year, rollNumber, goal, language, email }: GreetingRequest = await req.json();
    console.log('generate-greeting received:', { name, branch, year, language, email: email ?? null });
    
    console.log(`Generating greeting for: ${name}, ${branch}, Year ${year}, Language: ${language}`);
    
    // Validate required fields
    if (!name || !branch || !year || !language) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, branch, year, and language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI API key is not configured');
    }

    const yearText = ['1st', '2nd', '3rd', '4th'][parseInt(year) - 1] || year;
    
    // Construct the AI prompt
    const systemPrompt = language === 'EN' 
      ? `You are generating New Year 2026 greetings for engineering students from Ramachandra College of Engineering (RCE). 
         Create warm, motivational, and personalized messages that feel sincere and modern.
         Use the student's details to create a unique greeting that resonates with their journey.
         Keep messages positive, encouraging, and not too long (2-4 sentences for the main message).
         Avoid clichés and generic phrases - make each greeting feel special.
         RESPOND ONLY IN ENGLISH.
         Return ONLY valid JSON with these exact keys:
         {
           "greetingTitle": "A short title like 'Happy New Year 2026, [Name]! 🎉'",
           "greetingBody": "2-4 sentences personalized greeting using their details",
           "motivationalQuote": "A short, inspiring quote (1-2 sentences)"
         }`
      : `మీరు రామచంద్ర కాలేజ్ ఆఫ్ ఇంజనీరింగ్ (RCE) విద్యార్థుల కోసం నూతన సంవత్సర 2026 శుభాకాంక్షలు సృష్టిస్తున్నారు.
         వారి వివరాలను ఉపయోగించి వెచ్చని, ప్రేరణాత్మక మరియు వ్యక్తిగతీకరించిన సందేశాలను సృష్టించండి.
         సందేశాలను సానుకూలంగా, ప్రోత్సాహకరంగా ఉంచండి (ప్రధాన సందేశానికి 2-4 వాక్యాలు).
         తెలుగులో మాత్రమే స్పందించండి.
         ఈ ఖచ్చితమైన కీలతో చెల్లుబాటు అయ్యే JSON మాత్రమే తిరిగి ఇవ్వండి:
         {
           "greetingTitle": "[పేరు], నూతన సంవత్సర శుభాకాంక్షలు 2026! 🎉 వంటి చిన్న శీర్షిక",
           "greetingBody": "వారి వివరాలను ఉపయోగించి 2-4 వాక్యాల వ్యక్తిగతీకరించిన శుభాకాంక్ష",
           "motivationalQuote": "చిన్న, ప్రేరణాదాయక కోట్ (1-2 వాక్యాలు)"
         }`;

    const userPrompt = language === 'EN'
      ? `Generate a unique New Year 2026 greeting for:
         - Name: ${name}
         - Branch: ${branch} (Engineering)
         - Year: ${yearText} Year
         ${rollNumber ? `- Roll Number: ${rollNumber}` : ''}
         ${goal ? `- Their goal for 2026: ${goal}` : ''}
         
         Make it personal, warm, and motivational. Reference their branch and goals if provided.`
      : `ఈ విద్యార్థి కోసం ప్రత్యేక నూతన సంవత్సర 2026 శుభాకాంక్ష సృష్టించండి:
         - పేరు: ${name}
         - బ్రాంచ్: ${branch} (ఇంజనీరింగ్)
         - సంవత్సరం: ${yearText} సంవత్సరం
         ${rollNumber ? `- రోల్ నంబర్: ${rollNumber}` : ''}
         ${goal ? `- 2026 కోసం వారి లక్ష్యం: ${goal}` : ''}
         
         వ్యక్తిగతంగా, వెచ్చగా మరియు ప్రేరణాత్మకంగా ఉండాలి. వారి బ్రాంచ్ మరియు లక్ష్యాలను ప్రస్తావించండి.`;

    console.log('Calling Lovable AI Gateway...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI Response received:', content?.substring(0, 100));

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from AI
    let greeting;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        greeting = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      greeting = {
        greetingTitle: language === 'EN' 
          ? `Happy New Year 2026, ${name}! 🎉`
          : `${name}, నూతన సంవత్సర శుభాకాంక్షలు 2026! 🎉`,
        greetingBody: language === 'EN'
          ? `Dear ${name}, as we step into 2026, may this year bring you extraordinary success in your ${branch} journey. Your dedication and passion will surely lead you to great achievements!`
          : `ప్రియమైన ${name}, 2026 లోకి అడుగుపెడుతున్న ఈ సమయంలో, మీ ${branch} ప్రయాణంలో అసాధారణ విజయాలు సాధించాలని కోరుకుంటున్నాము!`,
        motivationalQuote: language === 'EN'
          ? '"Small steps every day can make 2026 your best year yet."'
          : '"ప్రతిరోజు చిన్న అడుగులు 2026 ను మీ అత్యుత్తమ సంవత్సరంగా మార్చగలవు."',
      };
    }

    console.log('Greeting generated successfully for:', name);

    // Save greeting to database
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const insertRes = await supabase.from('greetings').insert({
          name,
          branch,
          year: `${yearText} Year`,
          enrollment_number: rollNumber || null,
          goal: goal || null,
          // store provided email (nullable)
          email: email || null,
          greeting_title: greeting.greetingTitle,
          greeting_body: greeting.greetingBody,
          motivational_quote: greeting.motivationalQuote,
          language,
        });
        
        if (insertRes.error) {
          console.error('Failed to save greeting to database:', insertRes.error.message);
        } else {
          console.log('Greeting saved to database. Email saved:', email ?? null);
        }
      }
    } catch (dbError) {
      console.error('Failed to save greeting to database:', dbError);
      // Don't fail the request if DB save fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        greeting: {
          name,
          branch,
          year: `${yearText} Year`,
          // echo back stored email for confirmation
          email: email || null,
          ...greeting,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating greeting:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate greeting' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
