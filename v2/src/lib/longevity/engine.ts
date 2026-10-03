import { FACTORS, computeBmi, conditionPrevalenceScale } from './factors';
import type { Factor } from './factors';
import { project } from './lifeTable';
import type {
  FactorContribution,
  HealthProfile,
  LongevityEstimate,
  Opportunity,
} from './types';

export const MIN_AGE = 18;

const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

/**
 * Como os HRs de cada hábito vêm de estudos distintos (parcialmente sobrepostos) e os efeitos
 * protetores sofrem de viés de "usuário saudável", a combinação não é puramente multiplicativa:
 *  - efeitos protetores são encolhidos em 20% (PROTECTIVE_SHRINK);
 *  - acima de um "joelho" (log-HR = KNEE) os riscos somam com retornos decrescentes,
 *    saturando em ≈ 7× a mortalidade média;
 *  - o melhor caso fica em ≈ 0,27× (Li et al., Circulation 2018).
 */
const PROTECTIVE_SHRINK = 0.8;
const KNEE = 0.9;
const L_MAX_POS = 2.0; // exp(2,0) ≈ 7,4×
const L_MAX_NEG = Math.log(1 / 0.27);

export function ageFromBirthDate(birthDate: string, now = new Date()): number {
  const b = new Date(`${birthDate}T00:00:00`);
  return (now.getTime() - b.getTime()) / MS_PER_YEAR;
}

export function isValidBirthDate(birthDate: string, now = new Date()): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return false;
  const [y, mo, da] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(y, mo - 1, da);
  // rejeita datas "roladas" (ex.: 31/02)
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== da) return false;
  const age = ageFromBirthDate(birthDate, now);
  return age >= MIN_AGE && age <= 110;
}

function softCap(l: number): number {
  if (l < 0) return -L_MAX_NEG * Math.tanh((-l * PROTECTIVE_SHRINK) / L_MAX_NEG);
  if (l <= KNEE) return l;
  const room = L_MAX_POS - KNEE;
  return KNEE + room * Math.tanh((l - KNEE) / room);
}

/** HR médio efetivo do fator na população à idade informada. */
function popMeanAt(f: Factor, age: number): number {
  return f.group === 'health' ? 1 + (f.popMean - 1) * conditionPrevalenceScale(age) : f.popMean;
}

/** Hazard ratio combinado (relativo à média populacional) a partir de log-HRs somados. */
function combinedLogHr(profile: HealthProfile, age: number, skipId?: string): number {
  let l = 0;
  for (const f of FACTORS) {
    if (f.id === skipId) continue;
    l += Math.log(f.hr(profile) / popMeanAt(f, age));
  }
  return l;
}

function remaining(profile: HealthProfile, age: number, logHr: number): number {
  return project(profile.sex, profile.state, age, Math.exp(softCap(logHr))).remainingYears;
}

export function estimateLongevity(profile: HealthProfile, now = new Date()): LongevityEstimate {
  const age = ageFromBirthDate(profile.birthDate, now);
  const logHr = combinedLogHr(profile, age);
  const hr = Math.exp(softCap(logHr));

  const result = project(profile.sex, profile.state, age, hr);
  const baseline = project(profile.sex, profile.state, age, 1).remainingYears;
  const current = result.remainingYears;

  // Contribuição individual: quanto a expectativa mudaria se o fator fosse "médio" (HR relativo = 1).
  const contributions: FactorContribution[] = FACTORS.map((f) => {
    const rel = f.hr(profile) / popMeanAt(f, age);
    const without = remaining(profile, age, logHr - Math.log(rel));
    return {
      id: f.id,
      label: f.label,
      group: f.group,
      relativeHazard: rel,
      yearsVsAverage: current - without,
      summary: f.summary(profile),
    };
  }).sort((a, b) => a.yearsVsAverage - b.yearsVsAverage);

  // Oportunidades: ganho ao adotar a meta recomendada para cada fator melhorável.
  const opportunities: Opportunity[] = [];
  let improvedProfile = profile;
  for (const f of FACTORS) {
    if (!f.improve) continue;
    const better = f.improve(profile);
    if (!better) continue;
    const gain = remaining(better, age, combinedLogHr(better, age)) - current;
    if (gain >= 0.05) {
      opportunities.push({
        id: f.id,
        label: f.label,
        yearsGain: gain,
        action: f.action ?? '',
        evidence: f.evidence ?? '',
      });
    }
    const forCombined = f.improve(improvedProfile);
    if (forCombined) improvedProfile = forCombined;
  }
  opportunities.sort((a, b) => b.yearsGain - a.yearsGain);
  const potential = Math.max(0, remaining(improvedProfile, age, combinedLogHr(improvedProfile, age)) - current);

  const ageAt = (years: number) => age + years;

  return {
    age,
    remainingYears: current,
    expectedAgeAtDeath: ageAt(current),
    medianAgeAtDeath: ageAt(result.quantileYears(0.5)),
    p25AgeAtDeath: ageAt(result.quantileYears(0.75)), // 75% ainda vivos → idade "mais precoce"
    p75AgeAtDeath: ageAt(result.quantileYears(0.25)),
    chanceTo: {
      80: age >= 80 ? 1 : result.surviveYears(80 - age),
      90: age >= 90 ? 1 : result.surviveYears(90 - age),
      100: age >= 100 ? 1 : result.surviveYears(100 - age),
    },
    baselineRemainingYears: baseline,
    deltaVsBaseline: current - baseline,
    hazardRatio: hr,
    contributions,
    opportunities,
    potentialGainYears: potential,
    bmi: computeBmi(profile),
    calculatedAt: now.toISOString(),
  };
}

export function deathDateFromEstimate(estimate: LongevityEstimate, now = new Date()): Date {
  return new Date(now.getTime() + estimate.remainingYears * MS_PER_YEAR);
}
