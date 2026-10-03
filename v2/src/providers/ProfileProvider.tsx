import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import { deleteAllUserData, loadProfile, saveProfile } from '@/lib/profileRepo';
import { estimateLongevity, isValidBirthDate, type HealthProfile, type LongevityEstimate } from '@/lib/longevity';

interface ProfileState {
  profile: HealthProfile | null;
  estimate: LongevityEstimate | null;
  /** Carregando o perfil do Firestore. */
  loading: boolean;
  /** true quando o perfil veio da v1 e o usuário ainda deve revisar. */
  migratedFromLegacy: boolean;
  save: (profile: HealthProfile) => Promise<LongevityEstimate>;
  reload: () => Promise<void>;
  deleteData: () => Promise<void>;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [migrated, setMigrated] = useState(false);

  const uid = user?.uid;

  const reload = useCallback(async () => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await loadProfile(uid);
      // Perfil migrado com data inválida precisa ser refeito.
      const usable = res.profile && isValidBirthDate(res.profile.birthDate) ? res.profile : null;
      setProfile(usable);
      setMigrated(res.legacy && Boolean(usable));
    } catch (e) {
      console.warn('Falha ao carregar perfil', e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const estimate = useMemo(() => (profile ? estimateLongevity(profile) : null), [profile]);

  const save = useCallback(
    async (next: HealthProfile) => {
      if (!uid) throw new Error('Usuário não autenticado');
      const est = estimateLongevity(next);
      await saveProfile(uid, next, est);
      setProfile(next);
      setMigrated(false);
      return est;
    },
    [uid],
  );

  const deleteData = useCallback(async () => {
    if (!uid) return;
    await deleteAllUserData(uid);
    setProfile(null);
  }, [uid]);

  const value = useMemo<ProfileState>(
    () => ({ profile, estimate, loading, migratedFromLegacy: migrated, save, reload, deleteData }),
    [profile, estimate, loading, migrated, save, reload, deleteData],
  );
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile precisa estar dentro de <ProfileProvider>');
  return ctx;
}
