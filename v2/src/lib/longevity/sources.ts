export interface Source {
  id: string;
  title: string;
  citation: string;
  finding: string;
  url?: string;
}

export const DISCLAIMER =
  'O Death Date é uma ferramenta educativa e de reflexão. Ele estima uma média estatística para pessoas com perfil semelhante ao seu — não é um diagnóstico nem uma previsão individual. A vida real depende de genética, acaso, acesso à saúde e de decisões que você ainda vai tomar. Em caso de dúvida sobre sua saúde, converse com um profissional. Se estiver passando por sofrimento emocional, ligue para o CVV: 188 (24 h, gratuito).';

export const SOURCES: Source[] = [
  {
    id: 'ibge',
    title: 'IBGE — Tábuas Completas de Mortalidade 2023',
    citation: 'IBGE, 2024',
    finding: 'Esperança de vida ao nascer no Brasil: 76,4 anos (homens 73,1; mulheres 79,7). Aos 60 anos: 20,7 (H) e 24,0 (M). Base de calibração do modelo.',
    url: 'https://www.ibge.gov.br/estatisticas/sociais/populacao/9126-tabuas-completas-de-mortalidade.html',
  },
  {
    id: 'li2018',
    title: 'Impacto de 5 hábitos saudáveis na expectativa de vida',
    citation: 'Li Y. et al., Circulation, 2018',
    finding: 'Não fumar, IMC saudável, atividade física, álcool moderado e dieta de qualidade aos 50 anos: +14,0 anos (mulheres) e +12,2 anos (homens). HR de mortalidade 0,26.',
  },
  {
    id: 'jha2013',
    title: 'Riscos do tabagismo no século XXI e benefícios de parar',
    citation: 'Jha P. et al., New England Journal of Medicine, 2013',
    finding: 'Fumantes perdem ≥10 anos de vida. Parar aos 25–34 recupera ~10 anos; aos 35–44, ~9; aos 45–54, ~6; aos 55–64, ~4.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMsa1211128',
  },
  {
    id: 'wood2018',
    title: 'Risco de mortalidade e consumo de álcool (600 mil pessoas)',
    citation: 'Wood A. et al., The Lancet, 2018',
    finding: 'Limite de menor risco ≈ 100 g/semana. Aos 40 anos, 100–200 g/sem reduz ~6 meses; 200–350 g, 1–2 anos; >350 g, 4–5 anos de vida.',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30134-X/fulltext',
  },
  {
    id: 'zhao2023',
    title: 'Consumo de álcool e mortalidade por todas as causas — metanálise',
    citation: 'Zhao J. et al., JAMA Network Open, 2023',
    finding: 'Após corrigir vieses, consumo de baixo volume não é protetor frente a quem nunca bebeu. Risco aumenta a partir de ≥25 g/dia (mulheres) e ≥45 g/dia (homens).',
    url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2806564',
  },
  {
    id: 'moore2012',
    title: 'Atividade física no tempo livre e expectativa de vida',
    citation: 'Moore S. et al., PLoS Medicine, 2012; Arem H. et al., JAMA Internal Medicine, 2015',
    finding: '150 min/semana de atividade moderada ≈ +3,4 anos; ≥450 min ≈ +4,5 anos. Atingir o mínimo recomendado reduz ~31% a mortalidade.',
    url: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1001335',
  },
  {
    id: 'ding2025',
    title: 'Passos diários e saúde — metanálise dose-resposta',
    citation: 'Ding D. et al., The Lancet Public Health, 2025',
    finding: '7.000 passos/dia associam-se a ~47% menos mortalidade por todas as causas que 2.000 passos/dia (HR 0,53); ganhos começam já em 3–4 mil passos.',
  },
  {
    id: 'psc2009',
    title: 'IMC e mortalidade (57 estudos, 900 mil pessoas)',
    citation: 'Prospective Studies Collaboration, The Lancet, 2009; Global BMI Mortality Collaboration, The Lancet, 2016',
    finding: 'Menor mortalidade com IMC 22,5–25. IMC 30–35 reduz 2–4 anos; IMC 40–50, 8–10 anos (como fumar a vida toda).',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(09)60318-4/fulltext',
  },
  {
    id: 'fadnes2022',
    title: 'Dieta ótima e expectativa de vida',
    citation: 'Fadnes L. T. et al., PLoS Medicine, 2022',
    finding: 'Trocar uma dieta ocidental típica por uma ótima (mais leguminosas, integrais, castanhas; menos carne vermelha/processada) aos 20 anos: +10,7 (M) / +13 (H) anos; aos 60: ~+8 anos. Usamos fração conservadora.',
    url: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1003889',
  },
  {
    id: 'sleep2022',
    title: 'Padrão de sono saudável e expectativa de vida',
    citation: 'Li X. et al., European Heart Journal, 2022; Cappuccio F. et al., Sleep, 2010',
    finding: 'Sono saudável (7–8 h, sem insônia/sonolência) associa-se a +4,7 anos (homens) e +2,4 (mulheres). Dormir <6 h ou >9 h eleva mortalidade em 12–30%.',
  },
  {
    id: 'social',
    title: 'Relações sociais, isolamento e mortalidade',
    citation: 'Holt-Lunstad J. et al., PLoS Medicine, 2010 e Perspectives on Psychological Science, 2015',
    finding: 'Isolamento social e solidão elevam a mortalidade em ~26–30%, efeito comparável a outros fatores de risco clássicos.',
    url: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316',
  },
  {
    id: 'diabetes',
    title: 'Diabetes e perda de expectativa de vida',
    citation: 'Emerging Risk Factors Collaboration, JAMA 2011; Lancet Diabetes & Endocrinology, 2023',
    finding: 'HR ≈ 1,8 para mortalidade total; diabetes diagnosticado aos 50 anos reduz ~6 anos (mais se diagnosticado mais cedo).',
  },
  {
    id: 'htn',
    title: 'Hipertensão e expectativa de vida',
    citation: 'Franco O. et al., Hypertension, 2005; SPRINT Research Group, NEJM, 2015',
    finding: 'Hipertensos de 50 anos vivem ~5 anos menos; controle intensivo da pressão reduziu a mortalidade em 27%.',
  },
  {
    id: 'mental',
    title: 'Transtornos mentais e mortalidade',
    citation: 'Walker E. et al., JAMA Psychiatry, 2015; Cuijpers P. et al., World Psychiatry, 2014',
    finding: 'Depressão eleva a mortalidade em ~50–70% (tratamento e suporte reduzem risco).',
  },
];
