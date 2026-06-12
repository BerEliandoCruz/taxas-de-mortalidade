import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const rankings = await db.quizScore.findMany({
      take: 20,
      orderBy: [
        { score: 'desc' },
        { timeTaken: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const formatted = rankings.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      name: entry.user.name,
      avatar: entry.user.avatar,
      score: entry.score,
      total: entry.total,
      timeTaken: entry.timeTaken,
      percentage: Math.round((entry.score / entry.total) * 100),
      createdAt: entry.createdAt,
    }));

    return NextResponse.json({ rankings: formatted });
  } catch (error) {
    console.error('Quiz ranking error:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar ranking' },
      { status: 500 }
    );
  }
}
