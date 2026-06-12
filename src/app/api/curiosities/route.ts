import { NextResponse } from 'next/server';

interface Curiosity {
  id: number;
  title: string;
  fact: string;
  icon: string;
  category: 'longevidade' | 'mortalidade' | 'comparacao' | 'dados';
}

const curiosities: Curiosity[] = [
  {
    id: 1,
    title: 'Vantagem Feminina',
    fact: 'Mulheres brasileiras vivem em média 6,56 anos a mais que homens — 79,87 anos contra 73,31 anos.',
    icon: '♀️',
    category: 'longevidade',
  },
  {
    id: 2,
    title: 'Primeiro Ano Crítico',
    fact: 'A probabilidade de morte no primeiro ano de vida é a mais alta entre todas as idades infantis: 11,2 por mil para meninas e 13,2 por mil para meninos.',
    icon: '👶',
    category: 'mortalidade',
  },
  {
    id: 3,
    title: 'Sobrevivência até os 65',
    fact: 'Cerca de 86,6% das mulheres sobrevivem até os 65 anos, contra apenas 75,6% dos homens — uma diferença de 11 pontos percentuais.',
    icon: '🎂',
    category: 'comparacao',
  },
  {
    id: 4,
    title: 'Raridade dos 90+',
    fact: 'Apenas 26,2% das mulheres e 15,5% dos homens chegam aos 90 anos de idade no Brasil.',
    icon: '🧓',
    category: 'longevidade',
  },
  {
    id: 5,
    title: 'Pico na Juventude Masculina',
    fact: 'Aos 20 anos, a mortalidade masculina é 4,24 vezes maior que a feminina — o maior disparidade de gênero em qualquer idade.',
    icon: '⚡',
    category: 'comparacao',
  },
  {
    id: 6,
    title: 'Concentração de Óbitos',
    fact: '47,4% de todas as mortes femininas ocorrem entre 75 e 89 anos, enquanto entre homens essa taxa é de 42,1% — os homens morrem mais cedo.',
    icon: '📊',
    category: 'dados',
  },
  {
    id: 7,
    title: 'Expectativa aos 65',
    fact: 'Uma mulher de 65 anos ainda tem em média 20,3 anos de vida pela frente, enquanto um homem da mesma idade tem 16,8 anos.',
    icon: '🌅',
    category: 'longevidade',
  },
  {
    id: 8,
    title: 'Mortalidade Infantil por Sexo',
    fact: 'A mortalidade infantil masculina (13,2 por mil) é 18% maior que a feminina (11,2 por mil) — um fenômeno observado mundialmente.',
    icon: '🍼',
    category: 'mortalidade',
  },
  {
    id: 9,
    title: 'De 65 aos 90',
    fact: '30,3% das mulheres que chegam aos 65 sobrevivem até os 90, mas entre homens essa taxa cai para apenas 20,5%.',
    icon: '📈',
    category: 'longevidade',
  },
  {
    id: 10,
    title: 'Idade Mais Perigosa',
    fact: 'Após a infância, a idade mais perigosa para mulheres é 89 anos (q=122,4 por mil) e para homens também 89 anos (q=141,5 por mil).',
    icon: '⚠️',
    category: 'mortalidade',
  },
  {
    id: 11,
    title: 'Jovens em Risco',
    fact: 'Entre 15 e 29 anos, os homens representam 2,9% do total de óbitos masculinos, enquanto mulheres na mesma faixa representam apenas 0,8% — taxa 3,6 vezes maior.',
    icon: '🔥',
    category: 'comparacao',
  },
  {
    id: 12,
    title: 'Quase Todos Sobrevivem',
    fact: '98,1% da população brasileira sobrevive até os 18 anos — 98,3% das mulheres e 97,9% dos homens.',
    icon: '🎓',
    category: 'dados',
  },
  {
    id: 13,
    title: 'Meia-Idade Divergente',
    fact: 'Aos 50 anos, 94,5% das mulheres ainda estão vivas contra 88,9% dos homens — uma diferença que só aumenta com a idade.',
    icon: '⚖️',
    category: 'comparacao',
  },
  {
    id: 14,
    title: 'Expectativa Média Brasileira',
    fact: 'A expectativa de vida ao nascer considerando ambos os sexos no Brasil é de 76,6 anos — acima da média global de 73,3 anos (OMS 2024).',
    icon: '🇧🇷',
    category: 'dados',
  },
  {
    id: 15,
    title: 'Declínio na Terceira Idade',
    fact: 'Aos 80 anos, 62% das mulheres ainda estão vivas, contra apenas 44,9% dos homens — quase 17 pontos percentuais de diferença.',
    icon: '👵',
    category: 'comparacao',
  },
  {
    id: 16,
    title: 'Pico de Mortalidade Juvenil',
    fact: 'A mortalidade masculina atinge um pico local aos 28 anos (q=2,49 por mil), refletindo causas externas como acidentes e violência.',
    icon: '🚨',
    category: 'mortalidade',
  },
  {
    id: 17,
    title: 'Mais de 70 na Velhice',
    fact: 'A expectativa de vida aos 70 anos é de 14,5 anos para mulheres e 12,4 anos para homens — uma diferença de 2,1 anos mesmo na velhice.',
    icon: '🎯',
    category: 'longevidade',
  },
  {
    id: 18,
    title: 'Morte na Meia-Idade',
    fact: 'Na faixa de 45-59 anos, os homens têm 9,5% de todos os óbitos masculinos, enquanto mulheres têm apenas 5,5% — risco quase 2 vezes maior.',
    icon: '💊',
    category: 'comparacao',
  },
];

export async function GET() {
  try {
    return NextResponse.json(curiosities);
  } catch (error) {
    console.error('Curiosities error:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar curiosidades' },
      { status: 500 }
    );
  }
}
