import type { HealthProfile, FactorGroup } from './types';

/**
 * Cada fator define:
 *  - hr(p)       Hazard ratio de mortalidade por todas as causas, em relação ao nível de MENOR
 *                risco daquele fator (ex.: nunca fumou = 1,0).
 *  - popMean     HR médio da população adulta brasileira para esse fator. Dividimos por ele
 *                para que uma pessoa "média" resulte em HR ≈ 1 (= esperança de vida média do
 *                IBGE) e quem tem hábitos melhores que a média ganhe anos, não apenas "perca
 *                menos".
 *  - improve(p)  (opcional) devolve um perfil com a meta realista recomendada para o fator.
 *
 * As estimativas são associações observacionais (podem ter confundimento) e por isso foram
 * escolhidas de forma conservadora — veja `sources.ts` para as referências.
 */

export interface Factor {
  id: string;
  label: string;
  group: FactorGroup;
  popMean: number;
  hr: (p: HealthProfile) => number;
  summary: (p: HealthProfile) => string;
  improve?: (p: HealthProfile) => HealthProfile | null;
  action?: string;
  evidence?: string;
}

/** Interpolação linear entre pontos [x, y] ordenados por x. */
export function interpolate(points: [number, number][], x: number): number {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return last[1];
}

export function computeBmi(p: Pick<HealthProfile, 'heightCm' | 'weightKg'>): number {
  const m = p.heightCm / 100;
  return m > 0 ? p.weightKg / (m * m) : 0;
}

export function effectiveActivityMinutes(p: HealthProfile): number {
  return p.activityMinutes * (p.activityIntensity === 'vigorous' ? 2 : 1);
}

export function dietScore(p: HealthProfile): number {
  const d = p.diet;
  return d.produce + d.legumes + d.meat + d.ultra;
}

/**
 * O `popMean` das condições de saúde foi estimado para toda a população adulta, mas a prevalência
 * de doenças crônicas cresce muito com a idade (aos 40 poucos têm diabetes ou doença cardíaca; aos
 * 70 muitos têm). Este fator reduz o "crédito por não ter a doença" para os mais jovens.
 */
export function conditionPrevalenceScale(age: number): number {
  return interpolate([[18, 0.1], [40, 0.4], [60, 1.0], [80, 1.3]], age);
}

const bmiCurve: [number, number][] = [
  [15, 1.9], [16, 1.6], [17, 1.4], [18.5, 1.15], [20, 1.05], [22.5, 1.0],
  [25, 1.0], [27.5, 1.1], [30, 1.25], [35, 1.7], [40, 2.3], [45, 2.8], [55, 3.5],
];

const alcoholCurve: [number, number][] = [
  [0, 1.0], [7, 1.0], [10, 1.05], [20, 1.15], [25, 1.2], [35, 1.5], [50, 1.9], [80, 2.5],
];

const activityCurve: [number, number][] = [
  [0, 1.0], [60, 0.85], [150, 0.7], [300, 0.63], [450, 0.61],
];

const sleepCurve: [number, number][] = [
  [4, 1.35], [5, 1.25], [6, 1.1], [7, 1.0], [8, 1.0], [9, 1.1], [10, 1.3], [11, 1.45],
];

const former = (years: number): number =>
  years < 5 ? 1.7 : years < 10 ? 1.45 : years < 15 ? 1.3 : years < 25 ? 1.15 : 1.05;

export const FACTORS: Factor[] = [
  {
    id: 'smoking',
    label: 'Tabagismo',
    group: 'habit',
    popMean: 1.25,
    hr: (p) => {
      switch (p.smoking) {
        case 'never': return 1.0;
        case 'former': return former(p.yearsSinceQuit);
        case 'vape': return 1.3;
        case 'current':
          return Math.min(3.2, Math.max(2.0, 1.8 + 0.06 * p.cigarettesPerDay));
      }
    },
    summary: (p) =>
      p.smoking === 'never' ? 'Nunca fumou'
      : p.smoking === 'former' ? `Parou há ${p.yearsSinceQuit} ano(s)`
      : p.smoking === 'vape' ? 'Usa cigarro eletrônico'
      : `Fuma ${p.cigarettesPerDay} cigarros/dia`,
    improve: (p) => {
      if (p.smoking === 'current') return { ...p, smoking: 'former', yearsSinceQuit: 15 };
      if (p.smoking === 'vape') return { ...p, smoking: 'never' };
      if (p.smoking === 'former' && p.yearsSinceQuit < 15) return { ...p, yearsSinceQuit: 15 };
      return null;
    },
    action: 'Parar de fumar (ganho completo após ~10–15 anos sem fumar; os primeiros benefícios aparecem em meses).',
    evidence: 'Jha et al., NEJM 2013: fumantes perdem ≥10 anos; parar antes dos 40 recupera ~9.',
  },
  {
    id: 'alcohol',
    label: 'Álcool',
    group: 'habit',
    popMean: 1.04,
    hr: (p) => {
      const base = interpolate(alcoholCurve, p.drinksPerWeek);
      return p.alcoholDependence ? Math.max(base, 3.0) : base;
    },
    summary: (p) =>
      p.alcoholDependence ? 'Dependência alcoólica'
      : p.drinksPerWeek <= 0 ? 'Não bebe'
      : `${p.drinksPerWeek} dose(s)/semana`,
    improve: (p) =>
      p.alcoholDependence || p.drinksPerWeek > 7
        ? { ...p, alcoholDependence: false, drinksPerWeek: Math.min(p.drinksPerWeek, 7) }
        : null,
    action: 'Reduzir para até 7 doses por semana (menos é melhor). Em caso de dependência, procure ajuda profissional (CAPS-AD, AA).',
    evidence: 'Wood et al., Lancet 2018 e Zhao et al., JAMA Netw Open 2023: sem benefício do consumo "moderado"; >100 g/semana reduz a expectativa de vida.',
  },
  {
    id: 'activity',
    label: 'Atividade física',
    group: 'habit',
    popMean: 0.83,
    hr: (p) => interpolate(activityCurve, effectiveActivityMinutes(p)),
    summary: (p) =>
      p.activityMinutes <= 0 ? 'Sedentário'
      : `${p.activityMinutes} min/semana (${p.activityIntensity === 'vigorous' ? 'vigorosa' : 'moderada'})`,
    improve: (p) =>
      effectiveActivityMinutes(p) < 300
        ? { ...p, activityMinutes: 300, activityIntensity: 'moderate' }
        : null,
    action: 'Chegar a 150–300 min/semana de atividade moderada (caminhada rápida, bicicleta) ou 75–150 min vigorosa.',
    evidence: 'Arem et al., JAMA Intern Med 2015; Moore et al., PLoS Med 2012; Ding et al., Lancet Public Health 2025 (7 mil passos/dia ≈ −47% de mortalidade vs. 2 mil).',
  },
  {
    id: 'bmi',
    label: 'Peso corporal (IMC)',
    group: 'body',
    popMean: 1.15,
    hr: (p) => interpolate(bmiCurve, computeBmi(p)),
    summary: (p) => `IMC ${computeBmi(p).toFixed(1)}`,
    improve: (p) => {
      const bmi = computeBmi(p);
      const h = p.heightCm / 100;
      if (bmi > 25) return { ...p, weightKg: 24 * h * h };
      if (bmi < 18.5) return { ...p, weightKg: 20 * h * h };
      return null;
    },
    action: 'Buscar IMC entre 20 e 25 de forma gradual (perder 5–10% do peso já traz benefício metabólico).',
    evidence: 'Prospective Studies Collaboration, Lancet 2009 e Global BMI Mortality Collaboration, Lancet 2016: obesidade grau II–III reduz 8–10 anos.',
  },
  {
    id: 'diet',
    label: 'Alimentação',
    group: 'habit',
    popMean: 1.0,
    // HR = exp(−0,064·(score − 4,5)): score 0 → ~1,33 | 4,5 → 1,0 | 8 → ~0,80 (efeito conservador)
    hr: (p) => Math.exp(-0.064 * (dietScore(p) - 4.5)),
    summary: (p) => `Qualidade ${dietScore(p)}/8`,
    improve: (p) => {
      const up = (v: number) => Math.min(2, v + 1) as 0 | 1 | 2;
      const next = { produce: up(p.diet.produce), legumes: up(p.diet.legumes), meat: up(p.diet.meat), ultra: up(p.diet.ultra) };
      return dietScore(p) >= 8 ? null : { ...p, diet: next };
    },
    action: 'Mais feijão/leguminosas, grãos integrais, frutas, verduras e castanhas; menos carne processada e ultraprocessados.',
    evidence: 'Fadnes et al., PLoS Med 2022 (+8 a +13 anos com dieta ótima; usamos fração conservadora) e Guia Alimentar para a População Brasileira.',
  },
  {
    id: 'sleep',
    label: 'Sono',
    group: 'habit',
    popMean: 1.04,
    hr: (p) => interpolate(sleepCurve, p.sleepHours),
    summary: (p) => `${p.sleepHours} h por noite`,
    improve: (p) => (p.sleepHours < 7 || p.sleepHours > 8.5 ? { ...p, sleepHours: 7.5 } : null),
    action: 'Manter 7–8 horas de sono regular por noite.',
    evidence: 'Li et al., Eur Heart J 2022 (padrão de sono saudável: +4,7 anos homens / +2,4 mulheres aos 30); Cappuccio et al., Sleep 2010.',
  },
  {
    id: 'social',
    label: 'Vínculos sociais',
    group: 'context',
    popMean: 1.03,
    hr: (p) => (p.social === 'strong' ? 0.93 : p.social === 'average' ? 1.0 : 1.3),
    summary: (p) =>
      p.social === 'strong' ? 'Boa rede de apoio'
      : p.social === 'average' ? 'Rede de apoio média'
      : 'Isolamento / solidão',
    improve: (p) => (p.social === 'isolated' ? { ...p, social: 'average' } : null),
    action: 'Cultivar vínculos: encontros regulares, voluntariado, grupos de interesse.',
    evidence: 'Holt-Lunstad et al., PLoS Med 2010 e Perspect Psychol Sci 2015: isolamento social ≈ +26–30% de mortalidade.',
  },
  {
    id: 'drugs',
    label: 'Drogas ilícitas',
    group: 'habit',
    popMean: 1.05,
    hr: (p) => (p.drugs === 'none' ? 1 : p.drugs === 'occasional' ? 1.1 : p.drugs === 'frequent' ? 1.7 : 3.5),
    summary: (p) =>
      p.drugs === 'none' ? 'Não usa'
      : p.drugs === 'occasional' ? 'Uso esporádico'
      : p.drugs === 'frequent' ? 'Uso frequente'
      : 'Dependência',
    improve: (p) => (p.drugs !== 'none' ? { ...p, drugs: 'none' } : null),
    action: 'Reduzir/interromper o uso; em caso de dependência, buscar tratamento (CAPS-AD, 188 CVV para apoio emocional).',
    evidence: 'Estudos de coorte de mortalidade por uso de substâncias (opioides, estimulantes) e Global Burden of Disease.',
  },
  {
    id: 'family',
    label: 'Histórico familiar',
    group: 'context',
    popMean: 1.0,
    hr: (p) => (p.family === 'longevity' ? 0.92 : p.family === 'early' ? 1.12 : 1.0),
    summary: (p) =>
      p.family === 'longevity' ? 'Familiares longevos'
      : p.family === 'early' ? 'Mortes precoces na família'
      : 'Sem informação',
    evidence: 'Herdabilidade da longevidade: de ~7% (Ruby et al., Genetics 2018) a ~25% (estudos com gêmeos) — efeito pequeno.',
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    group: 'health',
    popMean: 1.08,
    hr: (p) => (p.conditions.diabetes ? 1.8 : 1.0),
    summary: (p) => (p.conditions.diabetes ? 'Diabetes' : 'Sem diabetes'),
    evidence: 'Emerging Risk Factors Collaboration, JAMA 2011 e Lancet Diabetes Endocrinol 2023: diabetes aos 50 reduz ~6 anos.',
  },
  {
    id: 'hypertension',
    label: 'Pressão arterial',
    group: 'health',
    popMean: 1.1,
    hr: (p) => {
      const h = p.conditions.hypertension;
      return h === 'none' ? 1.0 : h === 'controlled' ? 1.2 : 1.6;
    },
    summary: (p) =>
      p.conditions.hypertension === 'none' ? 'Normal'
      : p.conditions.hypertension === 'controlled' ? 'Hipertensão controlada'
      : 'Hipertensão sem controle',
    improve: (p) =>
      p.conditions.hypertension === 'uncontrolled'
        ? { ...p, conditions: { ...p.conditions, hypertension: 'controlled' } }
        : null,
    action: 'Medir a pressão regularmente, tratar e manter abaixo de 130/80 com acompanhamento médico.',
    evidence: 'Franco et al., Hypertension 2005 (≈5 anos aos 50) e SPRINT, NEJM 2015 (meta intensiva reduz mortalidade ~27%).',
  },
  {
    id: 'cardiovascular',
    label: 'Doença cardiovascular',
    group: 'health',
    popMean: 1.04,
    hr: (p) => (p.conditions.cardiovascular ? 2.0 : 1.0),
    summary: (p) => (p.conditions.cardiovascular ? 'Infarto/AVC/IC' : 'Sem doença cardíaca'),
    evidence: 'Emerging Risk Factors Collaboration, JAMA 2015: infarto, AVC e diabetes somam perdas de anos de vida.',
  },
  {
    id: 'cancer',
    label: 'Câncer',
    group: 'health',
    popMean: 1.02,
    hr: (p) => (p.conditions.cancer === 'none' ? 1.0 : p.conditions.cancer === 'past' ? 1.2 : 2.0),
    summary: (p) =>
      p.conditions.cancer === 'none' ? 'Sem câncer'
      : p.conditions.cancer === 'past' ? 'Tratado há mais de 5 anos'
      : 'Atual/recente',
    evidence: 'Dados de sobrevida do SEER/INCA — o efeito varia enormemente por tipo e estágio; usamos uma média.',
  },
  {
    id: 'liver',
    label: 'Doença hepática crônica',
    group: 'health',
    popMean: 1.01,
    hr: (p) => (p.conditions.chronicLiver ? 1.6 : 1.0),
    summary: (p) => (p.conditions.chronicLiver ? 'Hepatite/cirrose' : 'Sem doença hepática'),
    evidence: 'Hepatite C curada com antivirais de ação direta tem mortalidade próxima da população geral — trate se for o seu caso.',
  },
  {
    id: 'copd',
    label: 'Doença pulmonar crônica',
    group: 'health',
    popMean: 1.03,
    hr: (p) => (p.conditions.copd ? 1.8 : 1.0),
    summary: (p) => (p.conditions.copd ? 'DPOC/enfisema' : 'Sem doença pulmonar'),
    evidence: 'Coortes de DPOC (GOLD) e Global Burden of Disease.',
  },
  {
    id: 'kidney',
    label: 'Doença renal crônica',
    group: 'health',
    popMean: 1.03,
    hr: (p) => (p.conditions.kidney ? 1.7 : 1.0),
    summary: (p) => (p.conditions.kidney ? 'Doença renal crônica' : 'Sem doença renal'),
    evidence: 'Chronic Kidney Disease Prognosis Consortium, Lancet 2010.',
  },
  {
    id: 'depression',
    label: 'Depressão',
    group: 'health',
    popMean: 1.05,
    hr: (p) => (p.conditions.depression ? 1.5 : 1.0),
    summary: (p) => (p.conditions.depression ? 'Depressão' : 'Sem depressão'),
    evidence: 'Cuijpers et al., World Psychiatry 2014 e Walker et al., JAMA Psychiatry 2015. O tratamento reduz o risco; procure ajuda.',
  },
  {
    id: 'anxiety',
    label: 'Ansiedade',
    group: 'health',
    popMean: 1.03,
    hr: (p) => (p.conditions.anxiety ? 1.15 : 1.0),
    summary: (p) => (p.conditions.anxiety ? 'Ansiedade' : 'Sem ansiedade'),
    evidence: 'Meier et al., 2016 (coorte sueca): associação modesta de transtornos de ansiedade com mortalidade.',
  },
];
