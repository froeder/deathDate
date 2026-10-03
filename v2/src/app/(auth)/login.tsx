import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { Screen } from '@/components/ui/Screen';
import { Card, H1, Body, Caps } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ChoiceGroup } from '@/components/ui/Choice';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { colors, fonts, space, type as t } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Preencha seu e-mail e senha.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      let msg = 'Ocorreu um erro ao autenticar.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Alterne para Entrar.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (isFirebaseConfigured) {
        await signInAnonymously(auth);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      // If anonymous auth is disabled or not configured in Firebase project console, allow exploring anyway
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        {/* Logo and title */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/main-skull.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <H1 style={styles.title}>Death Date</H1>
          <Body style={styles.subtitle}>
            Calcule sua estimativa de vida com base nas pesquisas epidemiológicas mais recentes.
          </Body>
        </View>

        <Card style={styles.formCard}>
          <ChoiceGroup
            options={[
              { value: 'login', label: 'Entrar na conta' },
              { value: 'signup', label: 'Criar nova conta' },
            ]}
            value={mode}
            onChange={(m) => {
              setMode(m);
              setErrorMsg('');
            }}
          />

          <View style={styles.inputs}>
            <TextField
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
            />

            <TextField
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              secure
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Button
            title={mode === 'login' ? 'Entrar' : 'Cadastrar'}
            onPress={handleAuth}
            loading={loading}
            style={{ marginTop: space.sm }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Caps style={{ color: colors.textDim }}>ou</Caps>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Experimentar sem conta (Convidado)"
            variant="secondary"
            onPress={handleGuest}
            disabled={loading}
          />
        </Card>

        <Text style={styles.footerNote}>
          O Death Date é um projeto de conscientização e saúde preventiva. Seus dados são salvos com segurança.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: space.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: space.xl,
  },
  logo: {
    width: 68,
    height: 68,
    marginBottom: space.sm,
  },
  title: {
    textAlign: 'center',
    marginBottom: space.xs,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 320,
  },
  formCard: {
    padding: space.xl,
    gap: space.md,
  },
  inputs: {
    gap: space.md,
    marginTop: space.xs,
  },
  errorText: {
    color: colors.rose,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: space.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  footerNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: space.xl,
    paddingHorizontal: space.lg,
    lineHeight: 18,
  },
});
