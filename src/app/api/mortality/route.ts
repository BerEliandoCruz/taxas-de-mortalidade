import { NextResponse } from 'next/server';
import mortalityData from '@/lib/mortality-data.json';

export async function GET() {
  try {
    return NextResponse.json(mortalityData);
  } catch (error) {
    console.error('Mortality data error:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar dados de mortalidade' },
      { status: 500 }
    );
  }
}
