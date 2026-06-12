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

function computeCharts(data: MortalityData) {
  const groups: Record<string, MortalityGroup> = {
    mulheres: data.mulheres,
    homens: data.homens,
    ambos: data.ambos,
  };

  const groupKeys = ['mulheres', 'homens', 'ambos'] as const;
  const groupLabels: Record<string, string> = {
    mulheres: 'Mulheres',
    homens: 'Homens',
    ambos: 'Ambos os Sexos',
  };

  // 1. Survival curves (l(x) for all 3 groups) - full data
  const survivalCurves = groupKeys.map((key) => ({
    group: key,
    label: groupLabels[key],
    data: groups[key].data.map((d) => ({
      age: d.age,
      ageLabel: d.ageLabel,
      value: d.l,
    })),
  }));

  // 2. Life expectancy curves (e(x) for all 3 groups) - full data
  const lifeExpectancyCurves = groupKeys.map((key) => ({
    group: key,
    label: groupLabels[key],
    data: groups[key].data.map((d) => ({
      age: d.age,
      ageLabel: d.ageLabel,
      value: Math.round(d.e * 100) / 100,
    })),
  }));

  // 3. Probability of death curves (q(x) for all 3 groups) - full data
  const probabilityOfDeathCurves = groupKeys.map((key) => ({
    group: key,
    label: groupLabels[key],
    data: groups[key].data.map((d) => ({
      age: d.age,
      ageLabel: d.ageLabel,
      value: Math.round(d.q * 1000) / 1000,
    })),
  }));

  // 4. Gender mortality ratio (q_men / q_women by age) - full data
  const genderMortalityRatio: { age: number; ageLabel: string; ratio: number | null }[] = [];
  for (let i = 0; i < data.mulheres.data.length; i++) {
    const fRow = data.mulheres.data[i];
    const mRow = data.homens.data[i];
    if (fRow && mRow && fRow.q > 0) {
      genderMortalityRatio.push({
        age: fRow.age,
        ageLabel: fRow.ageLabel,
        ratio: Math.round((mRow.q / fRow.q) * 100) / 100,
      });
    } else if (fRow) {
      genderMortalityRatio.push({
        age: fRow.age,
        ageLabel: fRow.ageLabel,
        ratio: null,
      });
    }
  }

  // 5. Deaths distribution by age group (0-14, 15-29, 30-44, 45-59, 60-74, 75-89, 90+)
  const ageGroupRanges = [
    { label: '0-14', min: 0, max: 14 },
    { label: '15-29', min: 15, max: 29 },
    { label: '30-44', min: 30, max: 44 },
    { label: '45-59', min: 45, max: 59 },
    { label: '60-74', min: 60, max: 74 },
    { label: '75-89', min: 75, max: 89 },
    { label: '90+', min: 90, max: 90 },
  ];

  const deathsDistribution = groupKeys.map((key) => {
    const totalD = groups[key].data.reduce((sum, d) => sum + d.d, 0);
    const distribution = ageGroupRanges.map((range) => {
      const filtered = groups[key].data.filter(
        (d) => d.age >= range.min && d.age <= range.max
      );
      const groupD = filtered.reduce((sum, d) => sum + d.d, 0);
      return {
        ageGroup: range.label,
        deaths: Math.round(groupD * 100) / 100,
        percentage: Math.round((groupD / totalD) * 1000) / 10,
      };
    });
    return {
      group: key,
      label: groupLabels[key],
      distribution,
    };
  });

  // 6. Survival probability to key ages (18, 30, 50, 65, 80, 90)
  const keyAges = [18, 30, 50, 65, 80, 90];
  const survivalToKeyAges = groupKeys.map((key) => ({
    group: key,
    label: groupLabels[key],
    data: keyAges.map((age) => {
      const row = groups[key].data.find((d) => d.age === age);
      return {
        age,
        probability: row ? Math.round((row.l / 100000) * 10000) / 100 : 0,
        survivors: row ? Math.round(row.l) : 0,
      };
    }),
  }));

  // --- Additional chart-friendly data (sampled every 5 years) for recharts ---

  // Survival curve sampled every 5 years (for recharts with wide format)
  const survivalCurveSampled = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    if (m && h && a) {
      survivalCurveSampled.push({
        age,
        mulheres: Math.round(m.l),
        homens: Math.round(h.l),
        ambos: Math.round(a.l),
      });
    }
  }

  // Life expectancy by age sampled
  const lifeExpectancyByAgeSampled = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    if (m && h && a) {
      lifeExpectancyByAgeSampled.push({
        age,
        mulheres: +m.e.toFixed(2),
        homens: +h.e.toFixed(2),
        ambos: +a.e.toFixed(2),
      });
    }
  }

  // Probability of death sampled
  const probDeathSampled = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    if (m && h && a) {
      probDeathSampled.push({
        age,
        mulheres: +m.q.toFixed(3),
        homens: +h.q.toFixed(3),
        ambos: +a.q.toFixed(3),
      });
    }
  }

  // Gender ratio sampled
  const genderRatioSampled = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    if (m && h && m.q > 0) {
      genderRatioSampled.push({
        age,
        ratio: +(h.q / m.q).toFixed(2),
      });
    }
  }

  // Deaths by age group (wide format for recharts)
  const deathsByAgeGroup = ageGroupRanges.map((range) => {
    const mDeaths = groups.mulheres.data
      .filter((d) => d.age >= range.min && d.age <= range.max)
      .reduce((sum, d) => sum + d.d, 0);
    const hDeaths = groups.homens.data
      .filter((d) => d.age >= range.min && d.age <= range.max)
      .reduce((sum, d) => sum + d.d, 0);
    const aDeaths = groups.ambos.data
      .filter((d) => d.age >= range.min && d.age <= range.max)
      .reduce((sum, d) => sum + d.d, 0);
    return {
      ageGroup: range.label,
      mulheres: Math.round(mDeaths),
      homens: Math.round(hDeaths),
      ambos: Math.round(aDeaths),
    };
  });

  // Infant mortality comparison (ages 0-4)
  const infantMortality = [];
  for (let age = 0; age <= 4; age++) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    if (m && h && a) {
      infantMortality.push({
        age: `Idade ${age}`,
        mulheres: +m.q.toFixed(2),
        homens: +h.q.toFixed(2),
        ambos: +a.q.toFixed(2),
      });
    }
  }

  // Survival to key ages (wide format)
  const survivalKeyAgesWide = keyAges.map((age) => {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    return {
      age: `${age} anos`,
      mulheres: m ? +(m.l / 1000).toFixed(1) : 0,
      homens: h ? +(h.l / 1000).toFixed(1) : 0,
      ambos: a ? +(a.l / 1000).toFixed(1) : 0,
    };
  });

  // Remaining life expectancy (for radar chart)
  const radarAges = [0, 10, 20, 30, 40, 50, 60, 70, 80];
  const remainingLifeExpectancy = radarAges.map((age) => {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    return {
      age: `${age} anos`,
      mulheres: m ? +m.e.toFixed(1) : 0,
      homens: h ? +h.e.toFixed(1) : 0,
    };
  });

  // Life expectancy gap by age
  const lifeExpGap = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    if (m && h) {
      lifeExpGap.push({
        age,
        gap: +(m.e - h.e).toFixed(2),
      });
    }
  }

  // Person-years distribution T(x)
  const personYears = [];
  for (let age = 0; age <= 90; age += 5) {
    const m = groups.mulheres.data.find((d) => d.age === age);
    const h = groups.homens.data.find((d) => d.age === age);
    const a = groups.ambos.data.find((d) => d.age === age);
    if (m && h && a) {
      personYears.push({
        age,
        mulheres: Math.round(m.T / 1000),
        homens: Math.round(h.T / 1000),
        ambos: Math.round(a.T / 1000),
      });
    }
  }

  // Top 10 most dangerous ages (men)
  const dangerousAges = [...groups.homens.data]
    .sort((a, b) => b.q - a.q)
    .slice(0, 10)
    .map((d) => ({
      age: `${d.ageLabel} anos`,
      q: +d.q.toFixed(2),
    }));

  // KPI data
  const kpis = {
    lifeExpWomen: groups.mulheres.data[0].e,
    lifeExpMen: groups.homens.data[0].e,
    genderGap: +(groups.mulheres.data[0].e - groups.homens.data[0].e).toFixed(2),
    infantMortalityBoth: +(groups.ambos.data[0].q).toFixed(2),
  };

  return {
    // Spec-required structured data
    survivalCurves,
    lifeExpectancyCurves,
    probabilityOfDeathCurves,
    genderMortalityRatio,
    deathsDistribution,
    survivalToKeyAges,

    // Additional recharts-friendly data
    kpis,
    survivalCurveSampled,
    lifeExpectancyByAgeSampled,
    probDeathSampled,
    genderRatioSampled,
    infantMortality,
    survivalKeyAgesWide,
    deathsByAgeGroup,
    remainingLifeExpectancy,
    dangerousAges,
    lifeExpGap,
    personYears,
  };
}

export async function GET() {
  try {
    const charts = computeCharts(mortalityData as MortalityData);
    return NextResponse.json(charts);
  } catch (error) {
    console.error('Mortality charts error:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular dados para gráficos' },
      { status: 500 }
    );
  }
}
