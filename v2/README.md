# Death Date v2 — Calculadora Científica de Expectativa de Vida

Uma versão moderna, reformulada e baseada em evidências científicas do **Death Date**, desenvolvida em **React Native**, **Expo (SDK 57)** e **Firebase (v12)**.

---

## 🔬 O que mudou em relação à v1?

| Aspecto | Versão 1 | Versão 2 (Atualizada) |
| :--- | :--- | :--- |
| **Framework** | Expo SDK 46 (React Native 0.69, React 18) | **Expo SDK 57 (React Native 0.86, React 19, Expo Router)** |
| **Linguagem & Tipagem** | JavaScript misturado / types parciais | **TypeScript estrito (100% tipado)** |
| **Modelo Matemático** | Subtrações/adições lineares simples (ex: `smoke - 10`) | **Tábua de Vida Gompertz-Makeham calibrada com dados do IBGE 2023** |
| **Metodologia Científica** | Regras arbitrárias (podiam gerar números negativos) | **Hazard Ratios (HR) de coortes de Harvard (Circulation), The Lancet, JAMA e NEJM** |
| **Pesquisa Demográfica** | Dados defasados de estados | **Âncoras oficiais do IBGE 2023** (e₀: 73,1 H / 79,7 M; e₆₀: 20,7 H / 24,0 M) |
| **Novos Fatores** | Apenas fumo, álcool e exercícios básicos | **Sono (Li et al.), Dieta (Fadnes et al.), Apoio social (Holt-Lunstad), IMC/Obesidade (PSC) e controle da pressão (SPRINT)** |
| **Simulador Interativo** | Inexistente | **Simulador "E se...?" em tempo real** |
| **Design & UX** | Estilo básico com botões laranja | **Aparência moderna, Dark Mode, Aurora Glassmorphism, animações táteis (Haptics) e fontes Outfit & Inter** |
| **Privacidade & Ética** | Sem suporte a remoção ou avisos | **Aviso com apoio emocional (CVV 188) e exclusão total de dados (LGPD)** |

---

## 📊 Fontes Científicas Utilizadas no Modelo

1. **IBGE (2024)**: *Tábuas Completas de Mortalidade 2023* — Base de calibração demográfica nacional.
2. **Li et al. (Circulation, 2018)**: *Impact of Healthy Lifestyle Factors on Life Expectancies in the US Population* — Impacto combinado de 5 fatores saudáveis (+12 a +14 anos).
3. **Jha et al. (NEJM, 2013)**: *21st-Century Hazards of Smoking and Benefits of Cessation* — Perda de ≥10 anos por tabagismo e recuperação de até 9 anos ao cessar antes dos 40.
4. **Ding et al. (The Lancet Public Health, 2025)**: *Daily steps and all-cause mortality dose-response* — Benefícios de 7.000 passos e redução de até 47% no risco relativo.
5. **Fadnes et al. (PLoS Medicine, 2022)**: *Estimating impact of food choices on life expectancy* — Ganho sustentado com leguminosas, grãos integrais e redução de carnes processadas.
6. **Zhao et al. (JAMA Network Open, 2023) & Wood et al. (The Lancet, 2018)**: *Alcohol consumption and mortality* — Ausência de efeito protetor e redução significativa da vida com consumo >100g/semana.
7. **Prospective Studies Collaboration (The Lancet, 2009)**: *Body-mass index and cause-specific mortality in 900,000 adults*.
8. **Li et al. (European Heart Journal, 2022)**: *Healthy sleep patterns and life expectancy*.
9. **Holt-Lunstad et al. (PLoS Medicine, 2010)**: *Social relationships and mortality risk*.
10. **Franco et al. (Hypertension, 2005) & SPRINT (NEJM, 2015)**: *Hypertension and life expectancy*.

---

## 🚀 Como Executar o Projeto

### 1. Entrar na pasta `v2`
```bash
cd v2
```

### 2. Configurar o Firebase (Opcional para teste local)
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```
Preencha suas chaves do Firebase:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=seu-app-id
```
*(Nota: O aplicativo conta com modo convidado e funcionamento offline/local caso as credenciais não estejam configuradas de imediato).*

### 3. Iniciar o App
```bash
npx expo start
```
Você pode abrir no:
- **Expo Go** (escaneando o QR Code no seu smartphone Android ou iOS)
- **Emulador Android**: pressione `a`
- **Simulador iOS**: pressione `i`
- **Navegador Web**: pressione `w`

### 4. Validação Científica do Motor
Para rodar a suíte de testes comparativos com os estudos de Harvard, IBGE e Lancet:
```bash
npm run validate
# ou: npx tsx scripts/validate-engine.ts
```

---

## 🛡️ Segurança e LGPD
As regras de segurança do Firestore estão prontas em [`firestore.rules`](file:///c:/Users/john/Documents/Projetos/deathDate/v2/firestore.rules), garantindo que cada usuário acesse apenas seus próprios dados. O usuário pode excluir todos os registros a qualquer momento pela tela de **Perfil**.
