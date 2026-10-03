import React from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { Card, H2, H3, Body, Caps } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DISCLAIMER } from '@/lib/longevity';
import { colors, fonts, space, type as t } from '@/theme';

export default function DisclaimerModal() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Caps>Transparência & Ética</Caps>
          <Pressable
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.closeBtn}
            accessibilityLabel="Fechar modal"
          >
            <Ionicons name="close" size={24} color={colors.textDim} />
          </Pressable>
        </View>
        <H2 style={{ marginTop: 2 }}>Aviso Legal e Apoio Emocional</H2>
      </View>

      <Card style={styles.card} tint={colors.ember}>
        <View style={styles.warningHeader}>
          <Ionicons name="alert-circle" size={24} color={colors.ember} />
          <H3 style={{ color: colors.ember }}>Natureza Estatística e Educativa</H3>
        </View>
        <Body style={{ lineHeight: 24, marginVertical: space.sm }}>
          {DISCLAIMER}
        </Body>
      </Card>

      <Card style={[styles.card, { marginTop: space.md }]} tint={colors.teal}>
        <View style={styles.warningHeader}>
          <Ionicons name="heart" size={24} color={colors.teal} />
          <H3 style={{ color: colors.teal }}>Apoio Emocional — CVV (188)</H3>
        </View>
        <Body style={{ lineHeight: 22, marginVertical: space.sm }}>
          Refletir sobre a mortalidade pode despertar sensações de ansiedade ou vulnerabilidade em algumas pessoas. Se você estiver sentindo sofrimento emocional, angústia ou simplesmente quiser conversar, o Centro de Valorização da Vida (CVV) oferece atendimento gratuito e confidencial 24 horas por dia por telefone ou chat.
        </Body>

        <Button
          title="Ligar para o CVV (Disque 188)"
          variant="secondary"
          icon={<Ionicons name="call-outline" size={18} color={colors.text} />}
          onPress={() => Linking.openURL('tel:188')}
          style={{ marginTop: space.sm }}
        />

        <Button
          title="Acessar site cvv.org.br"
          variant="ghost"
          icon={<Ionicons name="globe-outline" size={18} color={colors.textDim} />}
          onPress={() => Linking.openURL('https://www.cvv.org.br')}
        />
      </Card>

      <Card style={[styles.card, { marginTop: space.md }]}>
        <H3>Privacidade e Seus Dados</H3>
        <Body style={{ lineHeight: 22, marginTop: space.sm }}>
          Os dados informados no questionário são armazenados estritamente para calcular sua estimativa de vida e permitir que você acompanhe seu histórico. Não vendemos nem compartilhamos seus dados de saúde com terceiros. A qualquer momento você pode apagar todos os seus registros de forma permanente na aba Perfil.
        </Body>
      </Card>

      <Button
        title="Entendi e Concordo"
        onPress={() => router.back()}
        style={{ marginVertical: space.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  card: {
    padding: space.lg,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
