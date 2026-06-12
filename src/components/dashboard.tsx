"use client";

import { useEffect, useState } from "react";
import { ChartCard } from "./chart-card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Baby, TrendingDown } from "lucide-react";

// Chart colors
const COLORS = {
  mulheres: "#10b981", // emerald
  homens: "#f59e0b",   // amber
  ambos: "#8b5cf6",    // violet
};

interface KPIData {
  lifeExpWomen: number;
  lifeExpMen: number;
  genderGap: number;
  infantMortalityBoth: number;
}

interface ChartData {
  kpis: KPIData;
  survivalCurveSampled: { age: number; mulheres: number; homens: number; ambos: number }[];
  lifeExpectancyByAgeSampled: { age: number; mulheres: number; homens: number; ambos: number }[];
  probDeathSampled: { age: number; mulheres: number; homens: number; ambos: number }[];
  genderRatioSampled: { age: number; ratio: number }[];
  infantMortality: { age: string; mulheres: number; homens: number; ambos: number }[];
  survivalKeyAgesWide: { age: string; mulheres: number; homens: number; ambos: number }[];
  deathsByAgeGroup: { ageGroup: string; mulheres: number; homens: number; ambos: number }[];
  remainingLifeExpectancy: { age: string; mulheres: number; homens: number }[];
  dangerousAges: { age: string; q: number }[];
  lifeExpGap: { age: number; gap: number }[];
  personYears: { age: number; mulheres: number; homens: number; ambos: number }[];
}

export function Dashboard() {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mortality/charts")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const kpis = data?.kpis;

  const kpiCards = [
    {
      title: "Expectativa Mulheres",
      value: kpis ? `${kpis.lifeExpWomen.toFixed(2)} anos` : "—",
      icon: <Heart className="h-5 w-5 text-emerald-500" />,
      description: "Ao nascer",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Expectativa Homens",
      value: kpis ? `${kpis.lifeExpMen.toFixed(2)} anos` : "—",
      icon: <Users className="h-5 w-5 text-amber-500" />,
      description: "Ao nascer",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Diferença por Gênero",
      value: kpis ? `${kpis.genderGap.toFixed(2)} anos` : "—",
      icon: <TrendingDown className="h-5 w-5 text-violet-500" />,
      description: "Mulheres - Homens",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      title: "Mortalidade Infantil",
      value: kpis ? `${kpis.infantMortalityBoth}‰` : "—",
      icon: <Baby className="h-5 w-5 text-rose-500" />,
      description: "Por mil nascidos vivos",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  // Life expectancy at birth data for bar chart
  const lifeExpBirthData = kpis
    ? [
        { group: "Mulheres", value: kpis.lifeExpWomen, fill: COLORS.mulheres },
        { group: "Homens", value: kpis.lifeExpMen, fill: COLORS.homens },
        { group: "Ambos", value: (kpis.lifeExpWomen + kpis.lifeExpMen) / 2, fill: COLORS.ambos },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 1. Life Expectancy at Birth */}
        <ChartCard
          title="Expectativa de Vida ao Nascer"
          description="Comparação por sexo (em anos)"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lifeExpBirthData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 85]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Survival Curve */}
        <ChartCard
          title="Curva de Sobrevivência l(x)"
          description="Sobreviventes por idade (por 100 mil)"
          fullWidth
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.survivalCurveSampled || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Idade", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mulheres" stroke={COLORS.mulheres} strokeWidth={2} dot={false} name="Mulheres" />
              <Line type="monotone" dataKey="homens" stroke={COLORS.homens} strokeWidth={2} dot={false} name="Homens" />
              <Line type="monotone" dataKey="ambos" stroke={COLORS.ambos} strokeWidth={2} dot={false} name="Ambos" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Life Expectancy by Age */}
        <ChartCard
          title="Expectativa de Vida por Idade e(x)"
          description="Anos restantes de vida por idade"
          fullWidth
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.lifeExpectancyByAgeSampled || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Idade", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mulheres" stroke={COLORS.mulheres} strokeWidth={2} dot={false} name="Mulheres" />
              <Line type="monotone" dataKey="homens" stroke={COLORS.homens} strokeWidth={2} dot={false} name="Homens" />
              <Line type="monotone" dataKey="ambos" stroke={COLORS.ambos} strokeWidth={2} dot={false} name="Ambos" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Probability of Death */}
        <ChartCard
          title="Probabilidade de Morte q(x)"
          description="Probabilidade por mil, por idade"
          fullWidth
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.probDeathSampled || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Idade", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mulheres" stroke={COLORS.mulheres} strokeWidth={2} dot={false} name="Mulheres" />
              <Line type="monotone" dataKey="homens" stroke={COLORS.homens} strokeWidth={2} dot={false} name="Homens" />
              <Line type="monotone" dataKey="ambos" stroke={COLORS.ambos} strokeWidth={2} dot={false} name="Ambos" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Gender Mortality Ratio */}
        <ChartCard
          title="Razão de Mortalidade por Gênero"
          description="q(homens) / q(mulheres) por idade"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.genderRatioSampled || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="ratio"
                stroke="#f59e0b"
                fill="#fef3c7"
                strokeWidth={2}
                name="Razão M/F"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Infant Mortality Comparison */}
        <ChartCard
          title="Mortalidade Infantil (0-4 anos)"
          description="Comparação por sexo (por mil)"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.infantMortality || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="mulheres" fill={COLORS.mulheres} radius={[4, 4, 0, 0]} name="Mulheres" />
              <Bar dataKey="homens" fill={COLORS.homens} radius={[4, 4, 0, 0]} name="Homens" />
              <Bar dataKey="ambos" fill={COLORS.ambos} radius={[4, 4, 0, 0]} name="Ambos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7. Survival to Key Ages */}
        <ChartCard
          title="Sobrevivência até Idades-Chave"
          description="Sobreviventes por mil, por idade"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.survivalKeyAgesWide || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="mulheres" fill={COLORS.mulheres} radius={[4, 4, 0, 0]} name="Mulheres" />
              <Bar dataKey="homens" fill={COLORS.homens} radius={[4, 4, 0, 0]} name="Homens" />
              <Bar dataKey="ambos" fill={COLORS.ambos} radius={[4, 4, 0, 0]} name="Ambos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 8. Deaths by Age Group */}
        <ChartCard
          title="Óbitos por Faixa Etária"
          description="Distribuição de d(x) por grupo"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.deathsByAgeGroup || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="mulheres" stackId="a" fill={COLORS.mulheres} name="Mulheres" />
              <Bar dataKey="homens" stackId="a" fill={COLORS.homens} name="Homens" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 9. Remaining Life Expectancy Radar */}
        <ChartCard
          title="Expectativa de Vida Restante"
          description="Radar comparativo por idade"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data?.remainingLifeExpectancy || []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="age" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} />
              <Radar name="Mulheres" dataKey="mulheres" stroke={COLORS.mulheres} fill={COLORS.mulheres} fillOpacity={0.2} />
              <Radar name="Homens" dataKey="homens" stroke={COLORS.homens} fill={COLORS.homens} fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 10. Top 10 Most Dangerous Ages (Men) */}
        <ChartCard
          title="Top 10 Idades Mais Perigosas"
          description="Maior q(x) para homens"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data?.dangerousAges || []}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="age" type="category" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="q" fill="#f59e0b" radius={[0, 4, 4, 0]} name="q(x) por mil" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 11. Life Expectancy Gap */}
        <ChartCard
          title="Diferença de Expectativa de Vida"
          description="e(mulheres) - e(homens) por idade"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.lifeExpGap || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="gap"
                stroke="#8b5cf6"
                fill="#ede9fe"
                strokeWidth={2}
                name="Diferença (anos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 12. Person-Years Distribution */}
        <ChartCard
          title="Distribuição de Anos-Pessoa T(x)"
          description="Em milhares, por idade"
          fullWidth
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data?.personYears || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: "Idade", position: "insideBottom", offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="mulheres" stroke={COLORS.mulheres} fill="#d1fae5" strokeWidth={2} name="Mulheres" />
              <Area type="monotone" dataKey="homens" stroke={COLORS.homens} fill="#fef3c7" strokeWidth={2} name="Homens" />
              <Area type="monotone" dataKey="ambos" stroke={COLORS.ambos} fill="#ede9fe" strokeWidth={2} name="Ambos" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
