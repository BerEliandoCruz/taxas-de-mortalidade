import { NextResponse } from 'next/server';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual é a expectativa de vida ao nascer das mulheres brasileiras segundo a tábua de mortalidade de 2024?',
    options: ['73,3 anos', '76,6 anos', '79,9 anos', '82,1 anos'],
    correctIndex: 2,
    explanation: 'A expectativa de vida ao nascer das mulheres brasileiras é de 79,87 anos, arredondado para 79,9 anos.',
  },
  {
    id: 2,
    question: 'Quantos anos a mais as mulheres vivem em média comparado aos homens no Brasil?',
    options: ['3,2 anos', '4,5 anos', '6,6 anos', '8,1 anos'],
    correctIndex: 2,
    explanation: 'A diferença é de 6,56 anos: mulheres vivem 79,87 anos e homens 73,31 anos em média.',
  },
  {
    id: 3,
    question: 'Qual é a taxa de mortalidade infantil (q na idade 0) para meninos no Brasil?',
    options: ['8,5 por mil', '11,2 por mil', '13,2 por mil', '15,8 por mil'],
    correctIndex: 2,
    explanation: 'A taxa de mortalidade infantil masculina é de 13,25 por mil nascidos vivos, aproximadamente 13,2 por mil.',
  },
  {
    id: 4,
    question: 'Qual porcentagem das mulheres brasileiras sobrevive até os 65 anos?',
    options: ['68,5%', '75,6%', '81,1%', '86,6%'],
    correctIndex: 3,
    explanation: '86,6% das mulheres sobrevivem até os 65 anos (86.567 de cada 100.000).',
  },
  {
    id: 5,
    question: 'Qual porcentagem dos homens brasileiros sobrevive até os 65 anos?',
    options: ['60,2%', '68,8%', '75,6%', '82,3%'],
    correctIndex: 2,
    explanation: '75,6% dos homens sobrevivem até os 65 anos (75.628 de cada 100.000).',
  },
  {
    id: 6,
    question: 'Em qual idade a razão de mortalidade entre homens e mulheres é mais alta?',
    options: ['15 anos', '20 anos', '25 anos', '30 anos'],
    correctIndex: 1,
    explanation: 'Aos 20 anos, a mortalidade masculina é 4,24 vezes maior que a feminina — o maior disparidade de gênero.',
  },
  {
    id: 7,
    question: 'Qual é a probabilidade de uma mulher brasileira chegar aos 90 anos?',
    options: ['10,5%', '15,5%', '20,9%', '26,2%'],
    correctIndex: 3,
    explanation: '26,2% das mulheres chegam aos 90 anos (26.219 de cada 100.000).',
  },
  {
    id: 8,
    question: 'Qual é a expectativa de vida ao nascer considerando ambos os sexos no Brasil?',
    options: ['72,8 anos', '74,5 anos', '76,6 anos', '78,9 anos'],
    correctIndex: 2,
    explanation: 'A expectativa de vida ao nascer para ambos os sexos é de 76,6 anos.',
  },
  {
    id: 9,
    question: 'Qual faixa etária concentra a maior parte dos óbitos femininos no Brasil?',
    options: ['45-59 anos', '60-74 anos', '75-89 anos', '90+ anos'],
    correctIndex: 2,
    explanation: '47,4% de todas as mortes femininas ocorrem entre 75 e 89 anos.',
  },
  {
    id: 10,
    question: 'Qual é a probabilidade de um homem brasileiro chegar aos 90 anos?',
    options: ['5,3%', '10,8%', '15,5%', '20,2%'],
    correctIndex: 2,
    explanation: '15,5% dos homens chegam aos 90 anos (15.515 de cada 100.000).',
  },
  {
    id: 11,
    question: 'Quantos anos de vida ainda tem em média uma mulher de 65 anos no Brasil?',
    options: ['15,5 anos', '18,2 anos', '20,3 anos', '23,1 anos'],
    correctIndex: 2,
    explanation: 'Uma mulher de 65 anos tem em média mais 20,3 anos de vida pela frente, segundo a tábua de mortalidade.',
  },
  {
    id: 12,
    question: 'A mortalidade infantil feminina é de aproximadamente 11,2 por mil. Quanto isso representa em porcentagem?',
    options: ['0,11%', '1,12%', '11,2%', '0,00112%'],
    correctIndex: 1,
    explanation: '11,2 por mil equivale a 1,12% — ou seja, cerca de 1,1% das meninas morrem antes de completar 1 ano.',
  },
  {
    id: 13,
    question: 'Qual porcentagem da população brasileira sobrevive até os 18 anos (ambos os sexos)?',
    options: ['92,5%', '95,8%', '98,1%', '99,3%'],
    correctIndex: 2,
    explanation: '98,1% da população brasileira sobrevive até os 18 anos considerando ambos os sexos.',
  },
  {
    id: 14,
    question: 'Na faixa de 15 a 29 anos, qual grupo tem maior representação nos óbitos totais?',
    options: ['Mulheres com 0,8%', 'Homens com 1,9%', 'Homens com 2,9%', 'Mulheres com 1,5%'],
    correctIndex: 2,
    explanation: 'Entre 15 e 29 anos, os homens representam 2,9% do total de óbitos masculinos — a taxa mais alta entre os jovens.',
  },
  {
    id: 15,
    question: 'Aos 80 anos, qual é a diferença de sobrevivência entre mulheres e homens?',
    options: ['5 pontos percentuais', '10 pontos percentuais', '17 pontos percentuais', '25 pontos percentuais'],
    correctIndex: 2,
    explanation: 'Aos 80 anos, 62% das mulheres estão vivas contra 44,9% dos homens — uma diferença de quase 17 pontos percentuais.',
  },
];

export async function GET() {
  try {
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Quiz questions error:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar perguntas do quiz' },
      { status: 500 }
    );
  }
}
