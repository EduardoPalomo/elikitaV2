// app/api/ai-analysis/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { patientData } = await request.json();

    const azureTextAnalyticsKey = process.env.NEXT_PUBLIC_AZURE_TEXT_ANALYTICS_KEY;
    const azureTextAnalyticsEndpoint = process.env.NEXT_PUBLIC_AZURE_TEXT_ANALYTICS_ENDPOINT;

    if (!azureTextAnalyticsKey || !azureTextAnalyticsEndpoint) {
      return NextResponse.json(
        { error: 'Azure Text Analytics credentials are not configured.' },
        { status: 500 }
      );
    }

    // Prepare data to send to Azure Text Analytics
    const documents = [
      {
        id: '1',
        language: 'en',
        text: Object.values(patientData.currentConsultation).join(' '),
      },
    ];

    // Call Azure Text Analytics API
    const analyticsResponse = await axios.post(
      `${azureTextAnalyticsEndpoint}/text/analytics/v3.1/analyze`,
      {
        documents,
      },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': azureTextAnalyticsKey,
          'Content-Type': 'application/json',
        },
      }
    );

    // Assume we get the extracted medical information and FHIR JSON from Azure
    const extractedInfo = analyticsResponse.data; // Adjust based on actual response format

    // Now, use OpenAI GPT-4 to format and structure the final report
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `Using the following patient information and extracted medical data, generate a comprehensive report:

Patient Information:
Name: ${patientData.name}
Age: ${patientData.age}
Gender: ${patientData.gender}
Allergies: ${patientData.allergies.join(', ')}
Medications: ${patientData.medications.join(', ')}

Medical History:
${patientData.medicalHistory.map((item: { date: string; diagnosis: string; treatment: string }) => `${item.date}: ${item.diagnosis} - ${item.treatment}`).join('\n')}

Current Consultation:
Chief Complaint: ${patientData.currentConsultation.chiefcomplaint}
Symptoms: ${patientData.currentConsultation.symptoms}
Examination: ${patientData.currentConsultation.examination}
Diagnosis: ${patientData.currentConsultation.diagnosis}
Treatment Plan: ${patientData.currentConsultation.treatmentplan}
Drug Interaction Check: ${patientData.currentConsultation.druginteractioncheck}

Extracted Medical Information from Azure Text Analytics:
${JSON.stringify(extractedInfo, null, 2)}

Please generate a structured report including all the above information in a clear and professional manner.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const analysisReport = completion.choices[0]?.message?.content?.trim() ?? '';

    return NextResponse.json({ analysisReport });

  } catch (error: any) {
    console.error('Error in ai-analysis:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred.' },
      { status: 500 }
    );
  }
}
