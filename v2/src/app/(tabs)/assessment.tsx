import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card, H2, H3, Body, Caps, Pill } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ChoiceGroup, OptionCards, ToggleRow } from '@/components/ui/Choice';
import { useProfile } from '@/providers/ProfileProvider';
import {
  STATES,
  computeBmi,
  defaultProfile,
  isValidBirthDate,
  type HealthProfile,
  type Level3,
  type Sex,
  type SmokingStatus,
  type ActivityIntensity,
  type SocialSupport,
  type DrugUse,
  type FamilyHistory,
  type HypertensionStatus,
  type CancerStatus,
} from '@/lib/longevity';
import { colors, fonts, space, type as t } from '@/theme';

type TabSection = 'basic' | 'habits' | 'diet_sleep' | 'health';

function parseDateInput(raw: string): string {
  // format dd/mm/yyyy to yyyy-mm-dd
  const cleaned = raw.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length < 8) return '';
  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

export default function AssessmentScreen() {
  const router = useRouter();
  const { profile, save } = useProfile();

  const [form, setForm] = useState<HealthProfile>(() => profile ?? defaultProfile());
  const [activeTab, setActiveTab] = useState<TabSection>('basic');
  const [dateText, setDateText] = useState(() =>
    form.birthDate ? formatDateDisplay(form.birthDate) : ''
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bmi = computeBmi(form);

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    setDateText(formatted);

    if (cleaned.length === 8) {
      const iso = parseDateInput(formatted);
      if (isValidBirthDate(iso)) {
        setForm((prev) => ({ ...prev, birthDate: iso }));
        setErrors((err) => ({ ...err, birthDate: '' }));
      } else {
        setErrors((err) => ({ ...err, birthDate: 'Data inválida ou idade menor que 18 anos.' }));
      }
    }
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.birthDate || !isValidBirthDate(form.birthDate)) {
      newErrors.birthDate = 'Informe uma data de nascimento válida (idade entre 18 e 110 anos).';
      setActiveTab('basic');
    }
    if (form.heightCm < 100 || form.heightCm > 240) {
      newErrors.height = 'Altura deve estar entre 100 e 240 cm.';
      setActiveTab('basic');
    }
    if (form.weightKg < 30 || form.weightKg > 300) {
      newErrors.weight = 'Peso deve estar entre 30 e 300 kg.';
      setActiveTab('basic');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await save(form);
      Alert.alert(
        'Dados Salvos!',
        'Sua estimativa de vida foi recalculada com base nos estudos científicos mais recentes.',
        [{ text: 'Ver Resultados', onPress: () => router.push('/(tabs)') }]
      );
    } catch (err: any) {
      Alert.alert('Erro ao salvar', err?.message ?? 'Não foi possível salvar os dados.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Caps>Avaliação de Longevidade</Caps>
        <H2 style={{ marginTop: 2 }}>Questionário de Saúde</H2>
        <Body style={{ marginTop: 4 }}>
          Preencha com sinceridade para obter o cálculo atuarial mais preciso.
        </Body>
      </View>

      {/* Category selector */}
      <View style={styles.tabSelector}>
        <ChoiceGroup
          options={[
            { value: 'basic', label: '1. Básico' },
            { value: 'habits', label: '2. Hábitos' },
            { value: 'diet_sleep', label: '3. Dieta/Sono' },
            { value: 'health', label: '4. Saúde' },
          ]}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab as TabSection)}
        />
      </View>

      {/* Tab 1: Dados Básicos */}
      {activeTab === 'basic' && (
        <Card style={styles.sectionCard}>
          <H3>Dados Demográficos & Corporais</H3>

          <TextField
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={dateText}
            onChangeText={handleDateChange}
            error={errors.birthDate}
            hint="Ex: 15/05/1990"
            icon="calendar-outline"
          />

          <ChoiceGroup<Sex>
            label="Sexo biológico atribuído ao nascer"
            options={[
              { value: 'male', label: 'Masculino (IBGE e0: 73,1a)' },
              { value: 'female', label: 'Feminino (IBGE e0: 79,7a)' },
            ]}
            value={form.sex}
            onChange={(sex) => setForm((p) => ({ ...p, sex }))}
            hint="Importante para a calibração da mortalidade específica do IBGE."
          />

          <View>
            <Text style={t.label}>Estado onde você vive (UF)</Text>
            <View style={styles.statesWrap}>
              {STATES.map((s) => {
                const active = s.code === form.state;
                return (
                  <Button
                    key={s.code}
                    title={`${s.code}`}
                    variant={active ? 'primary' : 'secondary'}
                    onPress={() => setForm((p) => ({ ...p, state: s.code }))}
                    style={styles.stateChip}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Altura"
                suffix="cm"
                placeholder="175"
                keyboardType="numeric"
                value={form.heightCm ? String(form.heightCm) : ''}
                onChangeText={(val) =>
                  setForm((p) => ({ ...p, heightCm: Number(val.replace(/\D/g, '')) || 0 }))
                }
                error={errors.height}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="Peso"
                suffix="kg"
                placeholder="70"
                keyboardType="numeric"
                value={form.weightKg ? String(form.weightKg) : ''}
                onChangeText={(val) =>
                  setForm((p) => ({ ...p, weightKg: Number(val.replace(/\D/g, '')) || 0 }))
                }
                error={errors.weight}
              />
            </View>
          </View>

          {/* BMI Live Indicator */}
          {bmi > 0 && (
            <View style={styles.bmiBox}>
              <Text style={t.small}>
                Índice de Massa Corporal (IMC):{' '}
                <Text style={{ fontFamily: fonts.bodySemi, color: colors.text }}>
                  {bmi.toFixed(1)} kg/m²
                </Text>
              </Text>
              <Pill
                label={
                  bmi < 18.5
                    ? 'Abaixo do peso'
                    : bmi < 25
                    ? 'Peso saudável'
                    : bmi < 30
                    ? 'Sobrepeso'
                    : bmi < 35
                    ? 'Obesidade grau I'
                    : 'Obesidade grau II/III'
                }
                color={bmi >= 18.5 && bmi < 25 ? colors.teal : colors.rose}
              />
            </View>
          )}

          <Button
            title="Próxima etapa: Hábitos →"
            variant="secondary"
            onPress={() => setActiveTab('habits')}
          />
        </Card>
      )}

      {/* Tab 2: Hábitos */}
      {activeTab === 'habits' && (
        <Card style={styles.sectionCard}>
          <H3>Estilo de Vida & Hábitos</H3>

          <ChoiceGroup<SmokingStatus>
            label="Consumo de Tabaco"
            options={[
              { value: 'never', label: 'Nunca fumei' },
              { value: 'former', label: 'Ex-fumante' },
              { value: 'vape', label: 'Cigarro eletrônico (vape)' },
              { value: 'current', label: 'Fumante ativo' },
            ]}
            value={form.smoking}
            onChange={(smoking) => setForm((p) => ({ ...p, smoking }))}
          />

          {form.smoking === 'current' && (
            <TextField
              label="Quantos cigarros por dia em média?"
              placeholder="10"
              keyboardType="numeric"
              value={String(form.cigarettesPerDay)}
              onChangeText={(val) =>
                setForm((p) => ({ ...p, cigarettesPerDay: Number(val.replace(/\D/g, '')) || 0 }))
              }
              suffix="cigarros/dia"
            />
          )}

          {form.smoking === 'former' && (
            <TextField
              label="Há quantos anos você parou de fumar?"
              placeholder="5"
              keyboardType="numeric"
              value={String(form.yearsSinceQuit)}
              onChangeText={(val) =>
                setForm((p) => ({ ...p, yearsSinceQuit: Number(val.replace(/\D/g, '')) || 0 }))
              }
              suffix="anos sem fumar"
            />
          )}

          <View style={{ marginTop: space.sm }}>
            <TextField
              label="Consumo de Álcool (doses por semana)"
              hint="1 dose = 1 lata de cerveja (350ml), 1 taça de vinho (150ml) ou 1 dose de destilado (45ml)"
              placeholder="0"
              keyboardType="numeric"
              value={String(form.drinksPerWeek)}
              onChangeText={(val) =>
                setForm((p) => ({ ...p, drinksPerWeek: Number(val.replace(/\D/g, '')) || 0 }))
              }
              suffix="doses/semana"
            />
            <ToggleRow
              label="Histórico de dependência de álcool"
              description="Dificuldade crônica em cessar ou controlar o consumo"
              value={form.alcoholDependence}
              onChange={(val) => setForm((p) => ({ ...p, alcoholDependence: val }))}
            />
          </View>

          <View style={{ marginTop: space.sm }}>
            <TextField
              label="Atividade física aeróbica por semana"
              hint="Caminhada rápida, corrida, natação, futebol, ciclismo, musculação"
              placeholder="150"
              keyboardType="numeric"
              value={String(form.activityMinutes)}
              onChangeText={(val) =>
                setForm((p) => ({ ...p, activityMinutes: Number(val.replace(/\D/g, '')) || 0 }))
              }
              suffix="minutos/semana"
            />
            <ChoiceGroup<ActivityIntensity>
              label="Intensidade predominante"
              options={[
                { value: 'moderate', label: 'Moderada (respiração acelerada)' },
                { value: 'vigorous', label: 'Vigorosa (suor intenso/ofegante)' },
              ]}
              value={form.activityIntensity}
              onChange={(intensity) => setForm((p) => ({ ...p, activityIntensity: intensity }))}
            />
          </View>

          <ChoiceGroup<DrugUse>
            label="Uso de outras substâncias ilícitas"
            options={[
              { value: 'none', label: 'Nenhum' },
              { value: 'occasional', label: 'Esporádico' },
              { value: 'frequent', label: 'Frequente' },
              { value: 'dependence', label: 'Dependência' },
            ]}
            value={form.drugs}
            onChange={(drugs) => setForm((p) => ({ ...p, drugs }))}
          />

          <Button
            title="Próxima etapa: Dieta & Sono →"
            variant="secondary"
            onPress={() => setActiveTab('diet_sleep')}
          />
        </Card>
      )}

      {/* Tab 3: Dieta & Sono */}
      {activeTab === 'diet_sleep' && (
        <Card style={styles.sectionCard}>
          <H3>Alimentação, Sono & Convivência</H3>

          <TextField
            label="Horas de sono por noite em média"
            placeholder="7.5"
            keyboardType="numeric"
            value={String(form.sleepHours)}
            onChangeText={(val) =>
              setForm((p) => ({ ...p, sleepHours: Number(val.replace(',', '.')) || 0 }))
            }
            suffix="horas/noite"
            hint="Estudos apontam 7 a 8 horas como a faixa com menor risco cardiovascular."
          />

          <ChoiceGroup<Level3>
            label="Consumo de vegetais e frutas frescas"
            options={[
              { value: 0, label: 'Raramente' },
              { value: 1, label: 'Alguns dias' },
              { value: 2, label: 'Diário (≥400g)' },
            ]}
            value={form.diet.produce}
            onChange={(val) =>
              setForm((p) => ({ ...p, diet: { ...p.diet, produce: val } }))
            }
          />

          <ChoiceGroup<Level3>
            label="Feijão, leguminosas e grãos integrais"
            options={[
              { value: 0, label: 'Pouco ou quase nada' },
              { value: 1, label: 'Moderado' },
              { value: 2, label: 'Frequente (arroz integral, feijão, aveia)' },
            ]}
            value={form.diet.legumes}
            onChange={(val) =>
              setForm((p) => ({ ...p, diet: { ...p.diet, legumes: val } }))
            }
          />

          <ChoiceGroup<Level3>
            label="Carnes vermelhas e processadas (bacon, embutidos)"
            options={[
              { value: 0, label: 'Diário / frequente' },
              { value: 1, label: '1 a 3 vezes por semana' },
              { value: 2, label: 'Raramente ou nunca' },
            ]}
            value={form.diet.meat}
            onChange={(val) =>
              setForm((p) => ({ ...p, diet: { ...p.diet, meat: val } }))
            }
          />

          <ChoiceGroup<Level3>
            label="Alimentos ultraprocessados (refrigerantes, salgadinhos, biscoitos recheados)"
            options={[
              { value: 0, label: 'Base da alimentação' },
              { value: 1, label: 'Consumo moderado' },
              { value: 2, label: 'Consumo raro ou nulo' },
            ]}
            value={form.diet.ultra}
            onChange={(val) =>
              setForm((p) => ({ ...p, diet: { ...p.diet, ultra: val } }))
            }
          />

          <ChoiceGroup<SocialSupport>
            label="Vínculos sociais e rede de apoio emocional"
            options={[
              { value: 'strong', label: 'Forte (amigos e família próximos)' },
              { value: 'average', label: 'Médio (relações sociais normais)' },
              { value: 'isolated', label: 'Isolamento social frequente' },
            ]}
            value={form.social}
            onChange={(social) => setForm((p) => ({ ...p, social }))}
            hint="Metanálises apontam que solidão e isolamento aumentam o risco de mortalidade em ~26%."
          />

          <Button
            title="Próxima etapa: Histórico de Saúde →"
            variant="secondary"
            onPress={() => setActiveTab('health')}
          />
        </Card>
      )}

      {/* Tab 4: Saúde e Condições */}
      {activeTab === 'health' && (
        <Card style={styles.sectionCard}>
          <H3>Histórico Clínico & Condições</H3>

          <ChoiceGroup<FamilyHistory>
            label="Histórico familiar direto (pais e avós)"
            options={[
              { value: 'longevity', label: 'Familiares viveram além dos 85 anos' },
              { value: 'unknown', label: 'Média comum ou não sei' },
              { value: 'early', label: 'Mortes precoces por doenças cardiovasculares (<55a)' },
            ]}
            value={form.family}
            onChange={(family) => setForm((p) => ({ ...p, family }))}
          />

          <Text style={[t.label, { marginTop: space.sm }]}>Condições e Diagnósticos Médicos</Text>

          <View style={{ gap: 8 }}>
            <ToggleRow
              label="Diabetes (Tipo 1 ou Tipo 2)"
              description="Reduz em média 6 anos aos 50 anos se não controlado"
              value={form.conditions.diabetes}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, diabetes: val } }))
              }
            />

            <ChoiceGroup<HypertensionStatus>
              label="Pressão Arterial"
              options={[
                { value: 'none', label: 'Normal (<120/80)' },
                { value: 'controlled', label: 'Hipertensão Controlada' },
                { value: 'uncontrolled', label: 'Hipertensão Sem Controle' },
              ]}
              value={form.conditions.hypertension}
              onChange={(val) =>
                setForm((p) => ({
                  ...p,
                  conditions: { ...p.conditions, hypertension: val },
                }))
              }
            />

            <ToggleRow
              label="Doença Cardiovascular prévia"
              description="Infarto, AVC, insuficiência cardíaca, angina ou cirurgia cardíaca"
              value={form.conditions.cardiovascular}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, cardiovascular: val } }))
              }
            />

            <ChoiceGroup<CancerStatus>
              label="Histórico de Câncer"
              options={[
                { value: 'none', label: 'Nenhum' },
                { value: 'past', label: 'Tratado há >5 anos (em remissão)' },
                { value: 'recent', label: 'Diagnóstico ativo ou recente' },
              ]}
              value={form.conditions.cancer}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, cancer: val } }))
              }
            />

            <ToggleRow
              label="Doença Pulmonar Crônica (DPOC / Enfisema)"
              value={form.conditions.copd}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, copd: val } }))
              }
            />

            <ToggleRow
              label="Doença Hepática Crônica (Cirrose / Hepatite crônica)"
              value={form.conditions.chronicLiver}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, chronicLiver: val } }))
              }
            />

            <ToggleRow
              label="Doença Renal Crônica"
              value={form.conditions.kidney}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, kidney: val } }))
              }
            />

            <ToggleRow
              label="Depressão Clínica Diagnosticada"
              description="O acompanhamento e tratamento reduzem significativamente o risco"
              value={form.conditions.depression}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, depression: val } }))
              }
            />

            <ToggleRow
              label="Transtorno de Ansiedade Generalizada"
              value={form.conditions.anxiety}
              onChange={(val) =>
                setForm((p) => ({ ...p, conditions: { ...p.conditions, anxiety: val } }))
              }
            />
          </View>
        </Card>
      )}

      {/* Submit Button */}
      <View style={styles.actionContainer}>
        <Button
          title="Salvar e Recalcular Tempo"
          onPress={handleSave}
          loading={saving}
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.md,
  },
  tabSelector: {
    marginBottom: space.md,
  },
  sectionCard: {
    padding: space.lg,
    gap: space.lg,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  stateChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bmiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionContainer: {
    marginVertical: space.xl,
  },
});
