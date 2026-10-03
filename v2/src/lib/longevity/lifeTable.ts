import { BRAZIL_ANCHORS, findState } from './brazil';
import type { Sex } from './types';

/**
 * Modelo de mortalidade: Gompertz-Makeham
 *     μ(x) = c + m · A · e^(b·x)
 *
 *  - c  : mortalidade "externa" (acidentes, violência) — independe da idade e dos hábitos
 *  - A,b: parte relacionada ao envelhecimento (doenças crônicas), calibrada por sexo para
 *         reproduzir exatamente a e(15) e a e(60) do Brasil (IBGE 2023)
 *  - m  : multiplicador de risco (hazard ratio dos hábitos × efeito do estado)
 *
 * Por que isto é melhor que "somar/subtrair anos" (como na v1)?
 *  1. Hazard ratios são o que os estudos epidemiológicos realmente medem.
 *  2. O efeito em anos de vida depende da idade: parar de fumar aos 25 rende muito mais
 *     que aos 70 — o modelo reproduz isso naturalmente.
 *  3. Fatores se combinam de forma multiplicativa, sem estimativas absurdas (a v1 podia
 *     chegar a −70 anos).
 */

const DT = 0.1; // passo de integração (anos)
const MAX_AGE = 125;

interface Params {
  A: number;
  b: number;
  c: number;
}

function survivalGrid(p: Params, fromAge: number, mult: number): Float64Array {
  const n = Math.ceil((MAX_AGE - fromAge) / DT) + 1;
  const s = new Float64Array(n);
  s[0] = 1;
  let cumHazard = 0;
  let prev = p.c + mult * p.A * Math.exp(p.b * fromAge);
  for (let i = 1; i < n; i++) {
    const age = fromAge + i * DT;
    const cur = p.c + mult * p.A * Math.exp(p.b * age);
    cumHazard += 0.5 * (prev + cur) * DT;
    s[i] = Math.exp(-cumHazard);
    prev = cur;
  }
  return s;
}

function expectancy(s: Float64Array): number {
  let sum = 0;
  for (let i = 1; i < s.length; i++) sum += 0.5 * (s[i - 1] + s[i]) * DT;
  return sum;
}

function bisect(f: (x: number) => number, lo: number, hi: number, iter = 60): number {
  // f é monotônica; encontra a raiz de f(x) = 0.
  let flo = f(lo);
  for (let i = 0; i < iter; i++) {
    const mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return 0.5 * (lo + hi);
}

const paramsCache: Partial<Record<Sex, Params>> = {};

/** Calibra A e b para o sexo informado, reproduzindo e(15) e e(60) do IBGE. */
export function calibrate(sex: Sex): Params {
  const cached = paramsCache[sex];
  if (cached) return cached;

  const { e0, e60, external } = BRAZIL_ANCHORS[sex];
  // Dado que se sobreviveu aos 15 anos, e(15) ≈ e(0) − 14,1 (mortalidade infantil já excluída).
  const e15 = e0 - 14.1;

  const solveA = (b: number): Params => {
    const logA = bisect(
      (la) => expectancy(survivalGrid({ A: Math.exp(la), b, c: external }, 60, 1)) - e60,
      -25,
      -2,
    );
    return { A: Math.exp(logA), b, c: external };
  };

  const bBest = bisect(
    (b) => expectancy(survivalGrid(solveA(b), 15, 1)) - e15,
    0.04,
    0.2,
    40,
  );
  const result = solveA(bBest);
  paramsCache[sex] = result;
  return result;
}

const stateMultCache = new Map<string, number>();

/** Multiplicador de mortalidade da UF (≈1 para a média nacional). */
export function stateMultiplier(sex: Sex, stateCode: string): number {
  const key = `${sex}:${stateCode}`;
  const hit = stateMultCache.get(key);
  if (hit !== undefined) return hit;

  const offset = findState(stateCode).e0Offset;
  let mult = 1;
  if (offset !== 0) {
    const p = calibrate(sex);
    const base = expectancy(survivalGrid(p, 15, 1));
    mult = Math.exp(
      bisect((lm) => expectancy(survivalGrid(p, 15, Math.exp(lm))) - (base + offset), -1.5, 1.5, 40),
    );
  }
  stateMultCache.set(key, mult);
  return mult;
}

export interface SurvivalResult {
  remainingYears: number;
  /** Probabilidade de estar vivo `years` anos depois da idade atual. */
  surviveYears: (years: number) => number;
  /** Anos até a sobrevivência cair para `q` (ex.: 0.5 = mediana). */
  quantileYears: (q: number) => number;
}

export function project(sex: Sex, stateCode: string, age: number, hazardRatio: number): SurvivalResult {
  const p = calibrate(sex);
  const mult = stateMultiplier(sex, stateCode) * hazardRatio;
  const s = survivalGrid(p, age, mult);
  return {
    remainingYears: expectancy(s),
    surviveYears: (years) => {
      const idx = Math.min(s.length - 1, Math.max(0, Math.round(years / DT)));
      return s[idx];
    },
    quantileYears: (q) => {
      for (let i = 0; i < s.length; i++) if (s[i] <= q) return i * DT;
      return (s.length - 1) * DT;
    },
  };
}
