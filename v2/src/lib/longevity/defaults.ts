import type { HealthProfile } from './types';

export function defaultProfile(): HealthProfile {
  return {
    birthDate: '',
    sex: 'male',
    state: 'SP',
    heightCm: 170,
    weightKg: 70,
    smoking: 'never',
    cigarettesPerDay: 10,
    yearsSinceQuit: 5,
    drinksPerWeek: 0,
    alcoholDependence: false,
    activityMinutes: 0,
    activityIntensity: 'moderate',
    diet: { produce: 1, legumes: 1, meat: 1, ultra: 1 },
    sleepHours: 7,
    social: 'average',
    drugs: 'none',
    family: 'unknown',
    conditions: {
      diabetes: false,
      hypertension: 'none',
      cardiovascular: false,
      cancer: 'none',
      chronicLiver: false,
      copd: false,
      kidney: false,
      depression: false,
      anxiety: false,
    },
  };
}
