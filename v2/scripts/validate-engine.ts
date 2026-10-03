/**
 * Validação do motor contra números publicados.
 * Execute: npm run validate
 */
import assert from 'node:assert/strict';
import { calibrate, project } from '../src/lib/longevity/lifeTable';
import { estimateLongevity } from '../src/lib/longevity/engine';
import { defaultProfile } from '../src/lib/longevity/defaults';
import type { HealthProfile } from '../src/lib/longevity/types';

const NOW = new Date('2026-10-03T12:00:00');
const birth = (age: number) => `${2026 - age}-06-15`;

function profile(over: Partial<HealthProfile> = {}): HealthProfile {
  return { ...defaultProfile(), birthDate: birth(40), ...over };
}

const near = (actual: number, expected: number, tol: number, label: string) => {
  console.log(`${label.padEnd(58)} ${actual.toFixed(2).padStart(7)}  (alvo ${expected} ±${tol})`);
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: ${actual} fora de ${expected}±${tol}`);
};

// 1) Calibração com o IBGE 2023
for (const sex of ['male', 'female'] as const) {
  const p = calibrate(sex);
  console.log(`\n[${sex}] b=${p.b.toFixed(4)} A=${p.A.toExponential(3)} c=${p.c}`);
}
near(project('male', 'BR', 60, 1).remainingYears, 20.7, 0.05, 'e60 homens (IBGE 2023)');
near(project('female', 'BR', 60, 1).remainingYears, 24.0, 0.05, 'e60 mulheres (IBGE 2023)');
console.log('e65 (referência IBGE ≈ H 17,3 | M 20,4):',
  project('male', 'BR', 65, 1).remainingYears.toFixed(2),
  project('female', 'BR', 65, 1).remainingYears.toFixed(2));
console.log('e30 H/M:', project('male', 'BR', 30, 1).remainingYears.toFixed(2), project('female', 'BR', 30, 1).remainingYears.toFixed(2));

// 2) Pessoa "média" ≈ expectativa populacional
const avg = estimateLongevity(
  profile({ heightCm: 172, weightKg: 78, activityMinutes: 100, drinksPerWeek: 3, sleepHours: 7 }), NOW);
console.log('\nPerfil mediano, 40 anos H SP: restante', avg.remainingYears.toFixed(1), 'baseline', avg.baselineRemainingYears.toFixed(1));

// 3) Fumante: ~10 anos perdidos (Jha 2013) — vs nunca fumou, mesmos demais hábitos
const never = estimateLongevity(profile({ smoking: 'never' }), NOW).remainingYears;
const smoker = estimateLongevity(profile({ smoking: 'current', cigarettesPerDay: 20 }), NOW).remainingYears;
near(never - smoker, 10, 2.5, 'Perda de anos: fumante 20 cig/dia aos 40');

// 4) Parar de fumar aos 40 recupera ~9 anos (Jha) — modelo: 10–15 anos depois
const quit40 = estimateLongevity(profile({ smoking: 'former', yearsSinceQuit: 15 }), NOW).remainingYears;
near(quit40 - smoker, 8, 2.5, 'Ganho: ex-fumante (≥15 anos) vs fumante aos 40');

// 5) Diabetes aos 50: ~6 anos (ERFC 2023)
const d50 = estimateLongevity(profile({ birthDate: birth(50), conditions: { ...defaultProfile().conditions, diabetes: true } }), NOW).remainingYears;
const nd50 = estimateLongevity(profile({ birthDate: birth(50) }), NOW).remainingYears;
near(nd50 - d50, 6, 2, 'Perda de anos: diabetes aos 50');

// 6) Obesidade grau III (IMC ~42) aos 40: 8–10 anos (PSC 2009)
const obese = estimateLongevity(profile({ heightCm: 170, weightKg: 121 }), NOW).remainingYears;
const normal = estimateLongevity(profile({ heightCm: 170, weightKg: 68 }), NOW).remainingYears;
near(normal - obese, 9, 3, 'Perda de anos: IMC ≈ 42 vs normal aos 40');

// 7) 150 min/semana de atividade ≈ +3,4 anos (Moore 2012), aos 40
const act = estimateLongevity(profile({ activityMinutes: 150 }), NOW).remainingYears;
const sed = estimateLongevity(profile({ activityMinutes: 0 }), NOW).remainingYears;
near(act - sed, 3.4, 1.2, 'Ganho: 150 min/sem vs sedentário aos 40');

// 8) Perfil ideal vs "nenhum dos 5 fatores" aos 50 anos.
// Li et al. (Circulation 2018, coorte de profissionais de saúde): +14,0 anos (mulheres).
// Nossa população-alvo é mais geral (HRs de tabagismo e IMC maiores), então aceitamos até ~+22.
const none = estimateLongevity(profile({
  birthDate: birth(50), sex: 'female', smoking: 'current', cigarettesPerDay: 15,
  heightCm: 165, weightKg: 75, activityMinutes: 0, drinksPerWeek: 0,
  diet: { produce: 0, legumes: 0, meat: 0, ultra: 0 },
}), NOW).remainingYears;
const all5 = estimateLongevity(profile({
  birthDate: birth(50), sex: 'female', smoking: 'never',
  heightCm: 165, weightKg: 62, activityMinutes: 300, drinksPerWeek: 5,
  diet: { produce: 2, legumes: 2, meat: 2, ultra: 2 },
}), NOW).remainingYears;
near(all5 - none, 17, 5, 'Ideal vs nenhum dos 5 fatores (mulher, 50 anos)');

// 9) Sanidade extrema
const worst = estimateLongevity(profile({
  birthDate: birth(30), smoking: 'current', cigarettesPerDay: 40, drinksPerWeek: 80, alcoholDependence: true,
  drugs: 'dependence', heightCm: 165, weightKg: 150, activityMinutes: 0,
  diet: { produce: 0, legumes: 0, meat: 0, ultra: 0 }, sleepHours: 4, social: 'isolated',
  conditions: { ...defaultProfile().conditions, diabetes: true, cardiovascular: true, hypertension: 'uncontrolled', kidney: true },
}), NOW);
console.log('\nPior caso (30 anos): restante', worst.remainingYears.toFixed(1), 'HR', worst.hazardRatio.toFixed(2));
assert.ok(worst.remainingYears > 8 && worst.remainingYears < 35);

const best = estimateLongevity(profile({
  birthDate: birth(30), heightCm: 175, weightKg: 70, activityMinutes: 400, drinksPerWeek: 0,
  diet: { produce: 2, legumes: 2, meat: 2, ultra: 2 }, sleepHours: 7.5, social: 'strong', family: 'longevity',
}), NOW);
console.log('Melhor caso (30 anos, H): restante', best.remainingYears.toFixed(1), '→ morre aos', best.expectedAgeAtDeath.toFixed(1), 'HR', best.hazardRatio.toFixed(2));
assert.ok(best.expectedAgeAtDeath < 105);
assert.ok(best.chanceTo[100] < 0.3);

// 10) Estados: SC > média > AL
const sc = estimateLongevity(profile({ state: 'SC' }), NOW).remainingYears;
const br = estimateLongevity(profile({ state: 'BR' }), NOW).remainingYears;
const al = estimateLongevity(profile({ state: 'AL' }), NOW).remainingYears;
console.log(`\nEstados (40 anos): SC ${sc.toFixed(1)} | BR ${br.toFixed(1)} | AL ${al.toFixed(1)}`);
assert.ok(sc > br && br > al);

console.log('\n✅ Validação concluída.');
