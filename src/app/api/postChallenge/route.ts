import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      groupId,
      questionId,
      questionAnswer,
      questionlenguage,
      timeSpent 
    } = body;

    const response = await fetch(`${process.env.API_URL}/Challenge/postChallenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          challengeId: 1,
          groupId:Number(groupId),
          questionId,
          questionAnswer,
          questionlenguage,
          timeSpent
      }),
    });

    if (!response.ok) {
      throw new Error('Erro na resposta da API externa');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
