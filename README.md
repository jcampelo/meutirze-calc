# MeuTirze Calc

Calculadora de dose de tirzepatida para seringa de insulina U-100. A pessoa informa a dose desejada (mg), a força do frasco (mg) e o volume de diluição (mL), e o app mostra quanto aspirar em mL e em unidades (UI), com a seringa desenhada na marca certa.

App web publicado em [meutizercalc.vercel.app](https://meutizercalc.vercel.app/), com empacotamento para Android.

> Ferramenta de apoio. Não substitui a orientação do médico ou do farmacêutico. O próprio app exibe esse aviso.

## O que faz

- Calcula concentração (mg/mL), volume (mL) e unidades (UI).
- Suporta seringas de 1 mL (100 UI) e 0,5 mL (50 UI) e avisa quando a dose passa da capacidade.
- Atalhos para as doses e frascos mais comuns (2,5 a 15 mg).
- Valida as entradas com Zod e mostra o erro no campo certo.
- Guarda a última configuração no navegador (`localStorage`).
- Visualização do frasco e da seringa, guia de locais de aplicação e aviso médico.

## Stack

React 19 · TypeScript · Vite · Zod · Vitest · Capacitor (Android) · TWA (Trusted Web Activity) · Vercel

## Estrutura

```
src/domain/dose.ts         regra de cálculo e validação (sem dependência de interface)
src/domain/dose.test.ts    testes unitários do cálculo (Vitest)
src/components/            seletores, resultado, seringa e frasco desenhados, modais
src/hooks/                 estado persistente no navegador
android/, app/             projetos Android (Capacitor e TWA)
scripts/                   geração de ícones e build para a Play Store
```

A regra de cálculo fica separada da interface, em `src/domain/`, e é coberta por testes.

## Rodando localmente

```bash
npm install
npm test          # testes do cálculo
npm run dev       # http://127.0.0.1:5173
npm run build
```

## Build Android

`scripts/build-playstore.ps1` gera o pacote para a Play Store. A keystore e as senhas não ficam no repositório: o script pede as senhas na hora.
