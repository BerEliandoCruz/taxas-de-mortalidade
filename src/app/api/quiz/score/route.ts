import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { score, total, timeTaken } = body;

    if (score === undefined || total === undefined || timeTaken === undefined) {
      return NextResponse.json(
        { error: 'Score, total e timeTaken são obrigatórios' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || typeof total !== 'number' || typeof timeTaken !== 'number') {
      return NextResponse.json(
        { error: 'Score, total e timeTaken devem ser números' },
        { status: 400 }
      );
    }

    const quizScore = await db.quizScore.create({
      data: {
        userId,
        score,
        total,
        timeTaken,
      },
    });

    return NextResponse.json({ quizScore }, { status: 201 });
  } catch (error) {
    console.error('Save quiz score error:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar pontuação' },
      { status: 500 }
    );
  }
}
