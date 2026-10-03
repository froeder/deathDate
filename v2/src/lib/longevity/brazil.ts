import type { Sex } from './types';

/**
 * Âncoras demográficas do Brasil — IBGE, Tábuas Completas de Mortalidade 2023
 * (divulgadas em 2024).
 *
 *  - Esperança de vida ao nascer: homens 73,1 | mulheres 79,7 (total 76,4)
 *  - Esperança de vida aos 60 anos: homens 20,7 | mulheres 24,0
 *
 * Essas duas âncoras por sexo calibram a curva de mortalidade base (Gompertz-Makeham)
 * em `lifeTable.ts`.
 */
export const BRAZIL_ANCHORS: Record<Sex, { e0: number; e60: number; external: number }> = {
  // `external`: componente de mortalidade independente da idade (acidentes, violência).
  // É maior entre homens no Brasil e NÃO é multiplicado pelos hábitos do usuário.
  male: { e0: 73.1, e60: 20.7, external: 0.0016 },
  female: { e0: 79.7, e60: 24.0, external: 0.0003 },
};

export interface BrazilianState {
  code: string;
  name: string;
  /**
   * Diferença aproximada (em anos) da esperança de vida ao nascer da UF em relação à
   * média nacional (média ponderada por população ≈ 0).
   *
   * ATENÇÃO: o IBGE não publica uma tábua completa anual por UF no mesmo formato da
   * nacional; estes valores são uma aproximação a partir das Projeções da População
   * (diferenças regionais históricas). Para valores oficiais, substitua por dados do
   * SIDRA/IBGE (Projeções da População – Revisão 2024).
   */
  e0Offset: number;
}

export const STATES: BrazilianState[] = [
  { code: 'AC', name: 'Acre', e0Offset: -0.7 },
  { code: 'AL', name: 'Alagoas', e0Offset: -4.8 },
  { code: 'AP', name: 'Amapá', e0Offset: -1.6 },
  { code: 'AM', name: 'Amazonas', e0Offset: -0.5 },
  { code: 'BA', name: 'Bahia', e0Offset: -2.4 },
  { code: 'CE', name: 'Ceará', e0Offset: -1.7 },
  { code: 'DF', name: 'Distrito Federal', e0Offset: 1.8 },
  { code: 'ES', name: 'Espírito Santo', e0Offset: 0.1 },
  { code: 'GO', name: 'Goiás', e0Offset: -0.7 },
  { code: 'MA', name: 'Maranhão', e0Offset: -4.1 },
  { code: 'MT', name: 'Mato Grosso', e0Offset: 0.8 },
  { code: 'MS', name: 'Mato Grosso do Sul', e0Offset: 1.5 },
  { code: 'MG', name: 'Minas Gerais', e0Offset: -0.1 },
  { code: 'PA', name: 'Pará', e0Offset: -0.2 },
  { code: 'PB', name: 'Paraíba', e0Offset: -2.9 },
  { code: 'PR', name: 'Paraná', e0Offset: 1.7 },
  { code: 'PE', name: 'Pernambuco', e0Offset: -3.5 },
  { code: 'PI', name: 'Piauí', e0Offset: -3.0 },
  { code: 'RJ', name: 'Rio de Janeiro', e0Offset: 0.8 },
  { code: 'RN', name: 'Rio Grande do Norte', e0Offset: -1.6 },
  { code: 'RS', name: 'Rio Grande do Sul', e0Offset: 2.5 },
  { code: 'RO', name: 'Rondônia', e0Offset: -0.9 },
  { code: 'RR', name: 'Roraima', e0Offset: -2.1 },
  { code: 'SC', name: 'Santa Catarina', e0Offset: 2.8 },
  { code: 'SP', name: 'São Paulo', e0Offset: 1.8 },
  { code: 'SE', name: 'Sergipe', e0Offset: -2.0 },
  { code: 'TO', name: 'Tocantins', e0Offset: -1.0 },
];

export function findState(code: string): BrazilianState {
  return STATES.find((s) => s.code === code) ?? { code: 'BR', name: 'Brasil', e0Offset: 0 };
}
