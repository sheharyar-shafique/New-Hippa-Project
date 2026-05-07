export type SoapNote = {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  sex: 'M' | 'F';
  visitType: string;
  visitTypeEs: string;
  chiefComplaint: string;
  chiefComplaintEs: string;
  status: 'draft' | 'finalized' | 'signed';
  createdAt: string;
  durationSec: number;
  subjective: string;
  subjectiveEs: string;
  objective: string;
  objectiveEs: string;
  assessment: string;
  assessmentEs: string;
  plan: string;
  planEs: string;
  icd10: { code: string; label: string; labelEs: string }[];
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  mrn: string;
  lastVisit: string;
  conditions: string[];
};

export const PATIENTS: Patient[] = [
  {
    id: 'p_1001',
    name: 'Margaret Chen',
    age: 64,
    sex: 'F',
    mrn: 'MRN-449218',
    lastVisit: '2026-05-04T10:15:00Z',
    conditions: ['HTN', 'DM2', 'Hyperlipidemia'],
  },
  {
    id: 'p_1002',
    name: 'David Okafor',
    age: 52,
    sex: 'M',
    mrn: 'MRN-771320',
    lastVisit: '2026-05-02T14:30:00Z',
    conditions: ['CAD', 'GERD'],
  },
  {
    id: 'p_1003',
    name: 'Sofia Hernandez',
    age: 41,
    sex: 'F',
    mrn: 'MRN-302988',
    lastVisit: '2026-04-29T09:00:00Z',
    conditions: ['Hypothyroidism', 'Migraine'],
  },
  {
    id: 'p_1004',
    name: 'James Whitfield',
    age: 70,
    sex: 'M',
    mrn: 'MRN-558003',
    lastVisit: '2026-04-26T11:45:00Z',
    conditions: ['CKD stage 3', 'HTN', 'BPH'],
  },
  {
    id: 'p_1005',
    name: 'Aisha Patel',
    age: 33,
    sex: 'F',
    mrn: 'MRN-660421',
    lastVisit: '2026-04-22T16:10:00Z',
    conditions: ['Asthma', 'Iron deficiency anemia'],
  },
];

export const NOTES: SoapNote[] = [
  {
    id: 'n_5001',
    patientName: 'Margaret Chen',
    patientId: 'p_1001',
    age: 64,
    sex: 'F',
    visitType: 'Follow-up · Internal Medicine',
    visitTypeEs: 'Seguimiento · Medicina Interna',
    chiefComplaint: 'Routine diabetes follow-up, fatigue x 2 weeks',
    chiefComplaintEs: 'Seguimiento de diabetes, fatiga de 2 semanas',
    status: 'finalized',
    createdAt: '2026-05-04T10:15:00Z',
    durationSec: 728,
    subjective:
      '64-year-old female with PMH of type 2 diabetes mellitus, hypertension, and hyperlipidemia presents for routine follow-up. Reports two weeks of fatigue, mild polyuria, and occasional blurred vision. Denies chest pain, dyspnea, or lower-extremity edema. Adherent to metformin 1000 mg BID and lisinopril 20 mg daily. Home glucose readings 160–210 mg/dL fasting. No recent infections or steroid use.',
    subjectiveEs:
      'Mujer de 64 años con antecedentes de diabetes mellitus tipo 2, hipertensión e hiperlipidemia, acude para seguimiento de rutina. Refiere fatiga de 2 semanas, poliuria leve y visión borrosa ocasional. Niega dolor torácico, disnea o edema en miembros inferiores. Buena adherencia a metformina 1000 mg BID y lisinopril 20 mg al día. Glucemias en ayunas en casa 160–210 mg/dL. Sin infecciones recientes ni uso de esteroides.',
    objective:
      'Vitals: BP 142/86, HR 78, T 98.4°F, SpO2 98%, BMI 31.2. General: alert, well-appearing. CV: RRR, no m/r/g. Lungs: CTA bilaterally. Abdomen: soft, non-tender. Extremities: no edema; monofilament intact. Labs (this visit): A1c 8.4% (prior 7.6%), eGFR 64, LDL 118, urine ACR 38 mg/g.',
    objectiveEs:
      'Signos vitales: PA 142/86, FC 78, T 36.9°C, SpO2 98%, IMC 31.2. General: alerta, buen aspecto. CV: rítmico, sin soplos. Pulmones: MV conservado bilateral. Abdomen: blando, no doloroso. Extremidades: sin edema; monofilamento conservado. Labs (esta visita): A1c 8.4% (previo 7.6%), TFG 64, LDL 118, ACR urinaria 38 mg/g.',
    assessment:
      '1) Type 2 DM, uncontrolled — A1c trending up; likely dietary drift plus weight gain. 2) HTN — above goal at 142/86. 3) Microalbuminuria — early diabetic nephropathy. 4) Mixed hyperlipidemia.',
    assessmentEs:
      '1) DM tipo 2 descontrolada — A1c en aumento; probable desviación dietética y ganancia de peso. 2) HTA — fuera de meta a 142/86. 3) Microalbuminuria — nefropatía diabética temprana. 4) Hiperlipidemia mixta.',
    plan:
      '1) Increase metformin to 1000 mg BID (already at max) — add empagliflozin 10 mg daily for A1c and renal benefit; review precautions. 2) Increase lisinopril 20 → 40 mg daily; recheck BP/BMP in 2 weeks. 3) Reinforce DASH diet, 30 min walking 5x/week; refer to diabetes educator. 4) Continue atorvastatin 40 mg; recheck lipid panel in 3 months. 5) Annual diabetic eye exam ordered. Follow-up 4 weeks.',
    planEs:
      '1) Metformina ya en dosis máxima 1000 mg BID — agregar empagliflozina 10 mg al día por beneficio renal y de A1c; revisar precauciones. 2) Subir lisinopril 20 → 40 mg al día; control de PA y QS en 2 semanas. 3) Reforzar dieta DASH, caminar 30 min 5 días/sem; referir a educador en diabetes. 4) Continuar atorvastatina 40 mg; perfil lipídico en 3 meses. 5) Examen oftalmológico anual ordenado. Seguimiento en 4 semanas.',
    icd10: [
      { code: 'E11.65', label: 'Type 2 DM with hyperglycemia', labelEs: 'DM tipo 2 con hiperglucemia' },
      { code: 'I10', label: 'Essential hypertension', labelEs: 'Hipertensión esencial' },
      { code: 'E78.2', label: 'Mixed hyperlipidemia', labelEs: 'Hiperlipidemia mixta' },
      { code: 'N18.81', label: 'Microalbuminuria', labelEs: 'Microalbuminuria' },
    ],
  },
  {
    id: 'n_5002',
    patientName: 'David Okafor',
    patientId: 'p_1002',
    age: 52,
    sex: 'M',
    visitType: 'Acute visit · Internal Medicine',
    visitTypeEs: 'Consulta aguda · Medicina Interna',
    chiefComplaint: 'Epigastric burning, worse after meals',
    chiefComplaintEs: 'Ardor epigástrico, peor tras las comidas',
    status: 'draft',
    createdAt: '2026-05-06T15:02:00Z',
    durationSec: 612,
    subjective:
      '52-year-old male with PMH CAD (s/p PCI 2022) and GERD presents with three weeks of epigastric burning, worse postprandially and at night. Denies dysphagia, melena, hematemesis, or weight loss. Currently on omeprazole 20 mg daily, ASA 81 mg, atorvastatin 40 mg, metoprolol succinate 50 mg.',
    subjectiveEs:
      'Hombre de 52 años con antecedentes de EAC (s/p ICP 2022) y ERGE, presenta 3 semanas de ardor epigástrico, peor postprandial y nocturno. Niega disfagia, melena, hematemesis o pérdida de peso. Toma omeprazol 20 mg al día, AAS 81 mg, atorvastatina 40 mg, metoprolol succinato 50 mg.',
    objective:
      'Vitals: BP 128/80, HR 72, afebrile. Abdomen: soft, mild epigastric tenderness, no rebound or guarding. CV: RRR. No pallor. CBC and BMP unremarkable; H. pylori stool antigen pending.',
    objectiveEs:
      'Signos vitales: PA 128/80, FC 72, afebril. Abdomen: blando, leve dolor epigástrico, sin rebote ni defensa. CV: rítmico. Sin palidez. BH y QS sin alteraciones; antígeno fecal de H. pylori pendiente.',
    assessment:
      '1) GERD with breakthrough symptoms — possible inadequate PPI dose vs. H. pylori. 2) Stable CAD — no anginal symptoms.',
    assessmentEs:
      '1) ERGE con síntomas a pesar del tratamiento — posible dosis insuficiente de IBP vs. H. pylori. 2) EAC estable — sin síntomas anginosos.',
    plan:
      '1) Increase omeprazole 20 → 40 mg daily before breakfast x 8 weeks. 2) Await H. pylori results; treat if positive. 3) Lifestyle: avoid late meals, elevate head of bed, weight loss. 4) If no improvement in 4 weeks or any alarm features, refer to GI for EGD. 5) Continue cardiac regimen.',
    planEs:
      '1) Subir omeprazol 20 → 40 mg al día antes del desayuno x 8 semanas. 2) Esperar resultados de H. pylori; tratar si positivo. 3) Estilo de vida: evitar comidas tardías, elevar cabecera, pérdida de peso. 4) Si no hay mejoría en 4 sem o aparecen datos de alarma, referir a GI para endoscopia. 5) Continuar régimen cardíaco.',
    icd10: [
      { code: 'K21.9', label: 'GERD without esophagitis', labelEs: 'ERGE sin esofagitis' },
      { code: 'I25.10', label: 'ASCVD without angina', labelEs: 'ECVA sin angina' },
    ],
  },
  {
    id: 'n_5003',
    patientName: 'Sofia Hernandez',
    patientId: 'p_1003',
    age: 41,
    sex: 'F',
    visitType: 'Telehealth · Internal Medicine',
    visitTypeEs: 'Telesalud · Medicina Interna',
    chiefComplaint: 'Fatigue, cold intolerance — TSH review',
    chiefComplaintEs: 'Fatiga, intolerancia al frío — revisión de TSH',
    status: 'signed',
    createdAt: '2026-04-29T09:00:00Z',
    durationSec: 481,
    subjective:
      '41-year-old female with hypothyroidism on levothyroxine 75 mcg, presenting for TSH review. Endorses fatigue, cold intolerance, mild constipation. Adherent and takes on empty stomach.',
    subjectiveEs:
      'Mujer de 41 años con hipotiroidismo en tratamiento con levotiroxina 75 mcg, acude para revisión de TSH. Refiere fatiga, intolerancia al frío y estreñimiento leve. Adherente y la toma en ayunas.',
    objective:
      'Vitals stable. Skin slightly dry. No goiter. TSH 6.8 (prior 4.1), free T4 0.9.',
    objectiveEs:
      'Signos vitales estables. Piel ligeramente seca. Sin bocio. TSH 6.8 (previo 4.1), T4 libre 0.9.',
    assessment: '1) Hypothyroidism, undertreated.',
    assessmentEs: '1) Hipotiroidismo, tratamiento insuficiente.',
    plan:
      '1) Increase levothyroxine 75 → 88 mcg daily. 2) Recheck TSH in 6–8 weeks. 3) Counseled on consistent administration.',
    planEs:
      '1) Subir levotiroxina 75 → 88 mcg al día. 2) Recontrol de TSH en 6–8 semanas. 3) Educada sobre administración consistente.',
    icd10: [
      { code: 'E03.9', label: 'Hypothyroidism, unspecified', labelEs: 'Hipotiroidismo no especificado' },
    ],
  },
];

export const TEMPLATES = [
  { id: 't1', name: 'Internal Medicine — Follow-up', nameEs: 'Medicina Interna — Seguimiento' },
  { id: 't2', name: 'Internal Medicine — New Patient', nameEs: 'Medicina Interna — Paciente nuevo' },
  { id: 't3', name: 'Diabetes Management', nameEs: 'Manejo de diabetes' },
  { id: 't4', name: 'Hypertension Follow-up', nameEs: 'Seguimiento de hipertensión' },
  { id: 't5', name: 'Acute Visit (Adult)', nameEs: 'Consulta aguda (adulto)' },
];

export const MOCK_LAB_ANALYSIS = {
  panel: 'Comprehensive Metabolic Panel (CMP) + Lipid Panel',
  panelEs: 'Química sanguínea completa + Perfil lipídico',
  ocrConfidence: 0.97,
  results: [
    { name: 'Glucose, fasting', nameEs: 'Glucosa en ayunas', value: '168', unit: 'mg/dL', range: '70–99', flag: 'High' },
    { name: 'Hemoglobin A1c', nameEs: 'Hemoglobina A1c', value: '8.4', unit: '%', range: '< 5.7', flag: 'High' },
    { name: 'Creatinine', nameEs: 'Creatinina', value: '1.10', unit: 'mg/dL', range: '0.6–1.2', flag: 'Normal' },
    { name: 'eGFR', nameEs: 'TFG estimada', value: '64', unit: 'mL/min/1.73m²', range: '> 60', flag: 'Borderline' },
    { name: 'Sodium', nameEs: 'Sodio', value: '139', unit: 'mmol/L', range: '136–145', flag: 'Normal' },
    { name: 'Potassium', nameEs: 'Potasio', value: '4.1', unit: 'mmol/L', range: '3.5–5.1', flag: 'Normal' },
    { name: 'LDL cholesterol', nameEs: 'Colesterol LDL', value: '146', unit: 'mg/dL', range: '< 100', flag: 'High' },
    { name: 'HDL cholesterol', nameEs: 'Colesterol HDL', value: '38', unit: 'mg/dL', range: '> 40 (M) / > 50 (F)', flag: 'Low' },
    { name: 'Triglycerides', nameEs: 'Triglicéridos', value: '212', unit: 'mg/dL', range: '< 150', flag: 'High' },
    { name: 'TSH', nameEs: 'TSH', value: '2.6', unit: 'mIU/L', range: '0.4–4.0', flag: 'Normal' },
  ],
  interpretation:
    'Findings are most consistent with poorly controlled type 2 diabetes mellitus with mixed dyslipidemia. The fasting glucose of 168 mg/dL together with an A1c of 8.4% confirms hyperglycemia well above target (most adults: A1c < 7%). LDL 146 mg/dL with HDL 38 mg/dL and triglycerides 212 mg/dL indicates atherogenic dyslipidemia, increasing 10-year ASCVD risk. eGFR 64 mL/min/1.73m² is borderline and should be trended; consider checking urine albumin-to-creatinine ratio to screen for early diabetic nephropathy.',
  interpretationEs:
    'Los hallazgos son más consistentes con diabetes mellitus tipo 2 mal controlada con dislipidemia mixta. La glucosa en ayunas de 168 mg/dL junto con A1c 8.4% confirma hiperglucemia muy por encima de la meta (en la mayoría de adultos: A1c < 7%). LDL 146 mg/dL con HDL 38 mg/dL y triglicéridos 212 mg/dL indica dislipidemia aterogénica, aumentando el riesgo de ECVA a 10 años. La TFG de 64 mL/min/1.73m² es limítrofe y debe seguirse; considere medir la relación albúmina/creatinina urinaria para detectar nefropatía diabética temprana.',
  differentials: [
    {
      label: 'Type 2 diabetes mellitus, uncontrolled',
      labelEs: 'Diabetes mellitus tipo 2, descontrolada',
      likelihood: 'High',
      reasoning: 'A1c 8.4% with fasting glucose 168 mg/dL.',
      reasoningEs: 'A1c 8.4% con glucosa en ayunas de 168 mg/dL.',
    },
    {
      label: 'Mixed dyslipidemia (atherogenic pattern)',
      labelEs: 'Dislipidemia mixta (patrón aterogénico)',
      likelihood: 'High',
      reasoning: 'Elevated LDL and triglycerides with low HDL — typical for metabolic syndrome.',
      reasoningEs: 'LDL y triglicéridos elevados con HDL bajo — típico del síndrome metabólico.',
    },
    {
      label: 'Early diabetic nephropathy',
      labelEs: 'Nefropatía diabética temprana',
      likelihood: 'Moderate',
      reasoning: 'eGFR borderline at 64; recommend urine ACR.',
      reasoningEs: 'TFG limítrofe en 64; se recomienda ACR urinaria.',
    },
    {
      label: 'Metabolic syndrome',
      labelEs: 'Síndrome metabólico',
      likelihood: 'Moderate',
      reasoning: 'Pattern of hyperglycemia, dyslipidemia — assess BP and waist circumference.',
      reasoningEs: 'Patrón de hiperglucemia y dislipidemia — evaluar PA y circunferencia abdominal.',
    },
  ],
  suggestedNextSteps: [
    'Intensify glycemic therapy (consider GLP-1 RA or SGLT2 inhibitor given cardio-renal benefit).',
    'Start or up-titrate high-intensity statin (e.g., atorvastatin 40–80 mg).',
    'Order urine albumin/creatinine ratio and repeat BMP in 2–4 weeks.',
    'Reinforce lifestyle — DASH/Mediterranean diet, 150 min/week aerobic activity.',
    'Consider ASCVD risk calculator and discuss aspirin only if appropriate.',
  ],
  suggestedNextStepsEs: [
    'Intensificar terapia glucémica (considerar agonista GLP-1 o iSGLT2 por beneficio cardiorrenal).',
    'Iniciar o subir estatina de alta intensidad (p. ej., atorvastatina 40–80 mg).',
    'Solicitar relación albúmina/creatinina urinaria y repetir QS en 2–4 semanas.',
    'Reforzar estilo de vida — dieta DASH/mediterránea, 150 min/semana de actividad aeróbica.',
    'Considerar calculadora de riesgo ECVA; aspirina solo si está indicada.',
  ],
};
