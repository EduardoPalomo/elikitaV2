// app/api/get-ai-suggestions/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { section, patientData } = await request.json();

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI();

    let prompt = '';

    // Generate prompts based on the section and patient data
    if (section === 'examination') {
      prompt = `Based on the patient's symptoms: "${patientData.currentConsultation.symptoms}", generate an extensive list of examination points to check, similar to the following example, but specific to the symptoms provided:

1. General appearance:
2. Obvious congenital abnormalities e.g (mongolism, spina bifida, microcephaly, harelip)
3. Crying, active, limp, floppy.
...
[continue the list as per the example]`;
    } else if (section === 'diagnosis') {
      prompt = `Based on the patient's complaint: "${patientData.currentConsultation.chiefcomplaint}" and symptoms: "${patientData.currentConsultation.symptoms}", generate a list of suggested questions to improve the diagnosis, similar to the following example, but adapted to the patient's inputs:

1. What is the matter with the baby's eyes?
2. How long has the baby had the problem?
...
[continue the list as per the example]`;
    } else if (section === 'treatmentplan') {
      prompt = `Based on the diagnosis: "${patientData.currentConsultation.diagnosis}", generate a treatment plan including specific information and medication doses, similar to the following example:

1. Wash hands with soap and water before and after treatment.
2. Gently clean eyes with cotton wool soaked in cooled boiled water 6-8 times a day
...
[continue the list as per the example]`;
    } else {
      prompt = `Provide AI suggestions for the "${section}" section based on the patient's inputs.`;
    }

    if (prompt) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });

      const suggestion = completion.choices[0]?.message?.content?.trim() ?? '';

      return NextResponse.json({ suggestion });
    } else {
      return NextResponse.json(
        { error: 'No prompt generated for this section.' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in get-ai-suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred.' },
      { status: 500 }
    );
  }
}
