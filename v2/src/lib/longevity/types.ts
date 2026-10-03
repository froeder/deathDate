export type Sex = 'male' | 'female';
export type SmokingStatus = 'never' | 'former' | 'vape' | 'current';
export type ActivityIntensity = 'moderate' | 'vigorous';
export type Level3 = 0 | 1 | 2;
export type SocialSupport = 'strong' | 'average' | 'isolated';
export type DrugUse = 'none' | 'occasional' | 'frequent' | 'dependence';
export type FamilyHistory = 'longevity' | 'unknown' | 'early';
export type HypertensionStatus = 'none' | 'controlled' | 'uncontrolled';
export type CancerStatus = 'none' | 'past' | 'recent';

export interface Conditions {
  diabetes: boolean;
  hypertension: HypertensionStatus;
  cardiovascular: boolean; // infarto, AVC, insuficiência cardíaca, angina
  cancer: CancerStatus;
  chronicLiver: boolean; // hepatite B/C crônica, cirrose
  copd: boolean; // DPOC / enfisema / bronquite crônica
  kidney: boolean; // doença renal crônica
  depression: boolean;
  anxiety: boolean;
}

/** Itens de dieta, cada um de 0 (pior) a 2 (melhor). */
export interface DietAnswers {
  produce: Level3; // frutas e vegetais
  legumes: Level3; // feijão/leguminosas e grãos integrais
  meat: Level3; // 0 = carne vermelha/processada diária ... 2 = raramente
  ultra: Level3; // 0 = ultraprocessados dominam ... 2 = raramente
}

export interface HealthProfile {
  /** ISO yyyy-mm-dd */
  birthDate: string;
  sex: Sex;
  state: string; // sigla da UF
  heightCm: number;
  weightKg: number;

  smoking: SmokingStatus;
  cigarettesPerDay: number;
  yearsSinceQuit: number;

  /** doses padrão por semana (1 dose ≈ 14 g de álcool puro) */
  drinksPerWeek: number;
  alcoholDependence: boolean;

  activityMinutes: number; // minutos por semana
  activityIntensity: ActivityIntensity;

  diet: DietAnswers;
  sleepHours: number;
  social: SocialSupport;
  drugs: DrugUse;
  family: FamilyHistory;
  conditions: Conditions;
}

export type FactorGroup = 'habit' | 'body' | 'health' | 'context';

export interface FactorContribution {
  id: string;
  label: string;
  group: FactorGroup;
  /** HR relativo à média da população brasileira (<1 protege, >1 aumenta risco). */
  relativeHazard: number;
  /** Anos a mais (+) ou a menos (−) vs. a média da população, por causa deste fator. */
  yearsVsAverage: number;
  /** Texto curto descrevendo o estado atual. */
  summary: string;
}

export interface Opportunity {
  id: string;
  label: string;
  /** Anos potencialmente ganhos ao adotar a meta sugerida. */
  yearsGain: number;
  action: string;
  evidence: string;
}

export interface LongevityEstimate {
  age: number;
  remainingYears: number;
  expectedAgeAtDeath: number;
  /** Idade em que 50% da coorte similar ainda estaria viva. */
  medianAgeAtDeath: number;
  p25AgeAtDeath: number;
  p75AgeAtDeath: number;
  /** Probabilidades de alcançar 80/90/100 anos, dado que o usuário tem a idade atual. */
  chanceTo: { 80: number; 90: number; 100: number };
  baselineRemainingYears: number;
  deltaVsBaseline: number;
  /** Hazard ratio combinado vs. média populacional (já com suavização). */
  hazardRatio: number;
  contributions: FactorContribution[];
  opportunities: Opportunity[];
  potentialGainYears: number;
  bmi: number;
  calculatedAt: string;
}
