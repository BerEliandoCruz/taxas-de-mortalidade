

# 📊 Taxas de Mortalidade

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-161B22?style=for-the-badge&logo=next.js&logoColor=FFFFFF" />
  <img src="https://img.shields.io/badge/React-161B22?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-161B22?style=for-the-badge&logo=typescript&logoColor=3178C6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-161B22?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4" />
  <img src="https://img.shields.io/badge/Prisma-161B22?style=for-the-badge&logo=prisma&logoColor=FFFFFF" />
  <img src="https://img.shields.io/badge/SQLite-161B22?style=for-the-badge&logo=sqlite&logoColor=003B57" />
</p>

## 📌 Sobre o projeto

**Taxas de Mortalidade** é uma aplicação web interativa desenvolvida para apresentar e explorar dados das Tabelas de Mortalidade do Brasil (IBGE 2024).

O projeto permite visualizar indicadores demográficos, analisar gráficos, consultar curiosidades sobre mortalidade e testar conhecimentos por meio de um quiz interativo.

A aplicação também possui sistema de cadastro e login, armazenamento de pontuações e ranking de usuários.

## 🚀 Funcionalidades

- 📊 Dashboard com indicadores e gráficos de mortalidade.
- 📈 Visualização de dados demográficos por faixa etária.
- 👥 Comparação de dados entre mulheres, homens e ambos os sexos.
- 💡 Seção com curiosidades sobre mortalidade.
- 🧠 Quiz interativo com perguntas e pontuação.
- 🏆 Ranking de usuários com classificação por desempenho.
- 🔐 Sistema de cadastro, login e logout.
- 🌙 Suporte ao tema escuro.
- 📱 Interface responsiva para diferentes dispositivos.

## 📉 Dados apresentados

A aplicação trabalha com informações das tabelas de mortalidade, incluindo:

| Indicador | Descrição |
|---|---|
| q | Probabilidade de morte por mil habitantes |
| d | Número de óbitos no intervalo de idade |
| l | Número de sobreviventes |
| L | Anos-pessoa vividos no intervalo |
| T | Total de anos-pessoa restantes |
| e | Expectativa de vida |

Os dados contemplam idades de 0 a 90 anos ou mais.

## 🛠️ Tecnologias utilizadas

**Frontend**

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

**Backend e banco de dados**

- Next.js API Routes
- Prisma ORM
- SQLite

**Bibliotecas e ferramentas**

- Framer Motion
- Zustand
- React Hook Form
- Zod
- Bun

## ▶️ Como executar

**1. Clone o repositório**

```bash
git clone https://github.com/BerEliandoCruz/taxas-de-mortalidade.git
```

**2. Acesse a pasta**

```bash
cd taxas-de-mortalidade
```

**3. Instale as dependências**

```bash
bun install
```

**4. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
DATABASE_URL="file:./dev.db"
```

**5. Gere o Prisma Client**

```bash
bun run db:generate
```

**6. Configure o banco de dados**

```bash
bun run db:push
```

**7. Inicie a aplicação**

```bash
bun run dev
```

Acesse a aplicação pelo navegador:

```text
http://localhost:3000
```

## 🎯 Objetivo do projeto

Desenvolver uma aplicação web para organizar e apresentar informações demográficas, colocando em prática conhecimentos de desenvolvimento frontend, backend, banco de dados, visualização de dados e criação de interfaces interativas.

## 📚 Fonte dos dados

Tabelas de Mortalidade do Brasil — IBGE 2024.

## ⚠️ Observação

Este projeto possui finalidade educacional e informativa. Os indicadores apresentados representam dados estatísticos populacionais e não devem ser interpretados como previsões individuais.

---

⭐ Obrigado por conferir o projeto!

