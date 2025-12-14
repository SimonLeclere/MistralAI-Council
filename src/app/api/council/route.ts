import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `
      You are the organizer of the Council of Wisdom. The user asks: "${topic}".
      
      Task 1: Identify 3 distinct historical, fictional, or philosophical characters who would have interesting, contrasting, and deep views on this topic.
      Task 2: Write a conversation where they discuss the topic. Each character should speak 1 or 2 times. The conversation should be insightful, witty, and true to their personalities. Do not use markdown, only plain text.
      Task 3: Provide a final synthesis or conclusion from the perspective of the Council.

      Return ONLY a valid JSON object with this structure:
      {
        "personas": [
          { "name": "Name", "description": "Short description of who they are and their stance. 40 words approximately." }
        ],
        "dialogue": [
          { "speaker": "Name", "text": "What they say" }
        ],
        "synthesis": "The final conclusion"
      }
    `;

    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' },
    });

    const content = chatResponse.choices?.[0].message.content;

    if (!content) {
      throw new Error('No content received from Mistral');
    }

    let result;
    try {
      result = JSON.parse(content as string);
    } catch (e) {
      console.error('Failed to parse JSON:', content, e);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in council API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
