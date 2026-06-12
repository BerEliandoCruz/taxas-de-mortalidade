import { NextResponse } from 'next/server';
import mortalityData from '@/lib/mortality-data.json';

interface MortalityRow {
  age: number;
  ageLabel: string;
  q: number;
  d: number;
  l: number;
  L: number;
  T: number;
  e: number;
}

interface MortalityGroup {
  label: string;
  data: MortalityRow[];
}

interface MortalityData {
  mulheres: MortalityGroup;
  homens: MortalityGroup;
  ambos: MortalityGroup;
}

function computeSummary(data: MortalityData) {
  const groups: Record<string, MortalityGroup> = {
    mulheres: data.mulheres,
    homens: data.homens,
    ambos: data.ambos,
  };

  const summary: Record<string, {
    lifeExpectancyAtBirth: number;
    infantMortalityRate: number;
    survivalTo65: number;
    mostDangerousAge: { age: number; q: number };
    probabilityOfReaching90: number;
  }> = {};

  for (const [key, group] of Object.entries(groups)) {
    const birthData = group.data[0];
    const age65 = group.data.find((d) => d.age === 65);
    const age90 = group.data.find((d) => d.age === 90);

    // Most dangerous age after 5 (excluding terminal age 90 which has q=1000)
    const after5 = group.data.filter((d) => d.age > 5 && d.age < 90);
    const mostDangerous = after5.reduce(
      (max, d) => (d.q > max.q ? d : max),
      after5[0]
    );

    summary[key] = {
      lifeExpectancyAtBirth: birthData.e,
      infantMortalityRate: birthData.q,
      survivalTo65: age65 ? (age65.l / 100000) * 100 : 0,
      mostDangerousAge: { age: mostDangerous.age, q: mostDangerous.q },
      probabilityOfReaching90: age90 ? (age90.l / 100000) * 100 : 0,
    };
  }

  // Gender gap in life expectancy
  const genderGap =
    summary.mulheres.lifeExpectancyAtBirth -
    summary.homens.lifeExpectancyAtBirth;

  return {
    groups: summary,
    genderGap: Math.round(genderGap * 100) / 100,
  };
}

export async function GET() {
  try {
    const summary = computeSummary(mortalityData as MortalityData);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Mortality summary error:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular resumo de mortalidade' },
      { status: 500 }
    );
  }
}
