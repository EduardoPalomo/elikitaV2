// app/api/get-ai-suggestions/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { patientData } = await request.json();

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not set in environment variables' },
      { status: 500 }
    );
  }

  const steps = [
    { key: 'chiefcomplaint', label: 'Chief Complaint' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'examination', label: 'Examination' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'treatmentplan', label: 'Treatment Plan' },
    { key: 'druginteractioncheck', label: 'Drug Interaction Check' },
  ];

  const prompts: Record<string, string> = {
    chiefcomplaint: "Provide a brief chief complaint based on the patient's data.",
    symptoms: "List the patient's symptoms.",
    examination: 'Describe the examination findings.',
    diagnosis: 'Provide possible diagnoses.',
    treatmentplan: 'Suggest a treatment plan.',
    druginteractioncheck: 'Check for any drug interactions based on current medications.',
  };

  const fullPrompt = `Based on the patient's information, please provide suggestions for the following sections. For each section, output the suggestion in JSON format with the key being the section name.

Sections:
${steps
  .map((step) => {
    const prompt = prompts[step.key];
    const userInput = patientData.currentConsultation[step.key] || '';
    return `- ${step.label} (${step.key}): ${prompt}\nPatient's input: ${userInput}`;
  })
  .join('\n\n')}

Please output the suggestions in JSON format, like this:
{
  "chiefcomplaint": "Suggestion for chief complaint",
  "symptoms": "Suggestion for symptoms",
  "examination": "Suggestion for examination",
  "diagnosis": "Suggestion for diagnosis",
  "treatmentplan": "Suggestion for treatment plan",
  "druginteractioncheck": "Suggestion for drug interaction check"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4', // or 'gpt-3.5-turbo' if gpt-4 is not available
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant.' },
        { role: 'user', content: fullPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `OpenAI API error: ${response.statusText}`, details: error },
      { status: 500 }
    );
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    const suggestions = JSON.parse(aiResponse);
    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error parsing AI response:', error);
    return NextResponse.json(
      { error: 'Failed to parse AI response', details: error.message },
      { status: 500 }
    );
  }
}
