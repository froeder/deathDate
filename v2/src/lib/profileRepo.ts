import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { defaultProfile, type HealthProfile, type LongevityEstimate } from './longevity';

const SCHEMA_VERSION = 2;

export interface HistoryEntry {
  id: string;
  createdAt: Date;
  remainingYears: number;
  expectedAgeAtDeath: number;
  hazardRatio: number;
  age: number;
}

/** Converte "dd/mm/aaaa" (formato da v1) para ISO "aaaa-mm-dd". */
function legacyDateToIso(value: unknown): string {
  if (typeof value !== 'string') return '';
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

/**
 * A v1 salvava campos soltos em `users/{uid}` (dateOfBirth, isSmoker, ...). Convertemos de forma
 * aproximada para o novo perfil, assim quem já usava o app não começa do zero.
 */
export function migrateLegacy(data: Record<string, any>): HealthProfile | null {
  if (!data.dateOfBirth) return null;
  const base = defaultProfile();
  const exercises = Number(data.exercises) || 0;
  return {
    ...base,
    birthDate: legacyDateToIso(data.dateOfBirth),
    sex: data.gender === 'feminino' ? 'female' : 'male',
    heightCm: Number(data.height) || base.heightCm,
    weightKg: Number(data.weight) || base.weightKg,
    smoking: data.isSmoker ? 'current' : 'never',
    cigarettesPerDay: 10,
    drinksPerWeek: data.isAlcoholic ? 30 : 0,
    alcoholDependence: Boolean(data.isAlcoholic),
    activityMinutes: exercises,
    drugs: data.usesDrugs ? 'frequent' : 'none',
    conditions: {
      ...base.conditions,
      diabetes: Boolean(data.isDiabethic),
      hypertension: data.hasHypertension ? 'controlled' : 'none',
      cardiovascular: Boolean(data.hasHeartDisease),
      cancer: data.hasCancer ? 'recent' : 'none',
      chronicLiver: Boolean(data.hasHepatitis),
      depression: Boolean(data.hasDepression),
      anxiety: Boolean(data.isAnxious),
    },
  };
}

/** Completa campos ausentes (perfis salvos por versões anteriores). */
function normalize(raw: Partial<HealthProfile>): HealthProfile {
  const base = defaultProfile();
  return {
    ...base,
    ...raw,
    diet: { ...base.diet, ...(raw.diet ?? {}) },
    conditions: { ...base.conditions, ...(raw.conditions ?? {}) },
  };
}

export async function loadProfile(uid: string): Promise<{ profile: HealthProfile | null; legacy: boolean }> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return { profile: null, legacy: false };
  const data = snap.data();
  if (data.profile) return { profile: normalize(data.profile as Partial<HealthProfile>), legacy: false };
  const migrated = migrateLegacy(data);
  return { profile: migrated, legacy: Boolean(migrated) };
}

export async function saveProfile(uid: string, profile: HealthProfile, estimate: LongevityEstimate): Promise<void> {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);
  // setDoc sem merge: substitui documentos legados da v1 pelo formato novo.
  await setDoc(ref, {
    profile,
    schemaVersion: SCHEMA_VERSION,
    createdAt: existing.exists() && existing.data().createdAt ? existing.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await addDoc(collection(ref, 'history'), {
    createdAt: serverTimestamp(),
    remainingYears: round(estimate.remainingYears),
    expectedAgeAtDeath: round(estimate.expectedAgeAtDeath),
    hazardRatio: round(estimate.hazardRatio, 3),
    age: round(estimate.age),
  });
}

export async function loadHistory(uid: string, max = 12): Promise<HistoryEntry[]> {
  const q = query(collection(db, 'users', uid, 'history'), orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const x = d.data();
      const ts = x.createdAt as Timestamp | null;
      return {
        id: d.id,
        createdAt: ts?.toDate() ?? new Date(),
        remainingYears: x.remainingYears,
        expectedAgeAtDeath: x.expectedAgeAtDeath,
        hazardRatio: x.hazardRatio,
        age: x.age,
      } as HistoryEntry;
    })
    .reverse();
}

/** Remove todos os dados de saúde do usuário (LGPD — direito de exclusão). */
export async function deleteAllUserData(uid: string): Promise<void> {
  const hist = await getDocs(collection(db, 'users', uid, 'history'));
  await Promise.all(hist.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, 'users', uid));
}

function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}
