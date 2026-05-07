export type SoapNote = {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  sex: 'M' | 'F';
  visitType: string;
  chiefComplaint: string;
  status: 'draft' | 'finalized' | 'signed';
  createdAt: string;
  durationSec: number;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10: { code: string; label: string }[];
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
    conditions: ['HTN', 'Type 2 DM', 'Hyperlipidemia'],
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
    chiefComplaint: 'Routine diabetes follow-up, fatigue x 2 weeks',
    status: 'finalized',
    createdAt: '2026-05-04T10:15:00Z',
    durationSec: 728,
    subjective:
      '64-year-old female with PMH of type 2 diabetes mellitus, hypertension, and hyperlipidemia presents for routine follow-up. Reports two weeks of fatigue, mild polyuria, and occasional blurred vision. Denies chest pain, dyspnea, or lower-extremity edema. Adherent to metformin 1000 mg BID and lisinopril 20 mg daily. Home glucose readings 160–210 mg/dL fasting. No recent infections or steroid use.',
    objective:
      'Vitals: BP 142/86, HR 78, T 98.4°F, SpO2 98%, BMI 31.2. General: alert, well-appearing. CV: RRR, no m/r/g. Lungs: CTA bilaterally. Abdomen: soft, non-tender. Extremities: no edema; monofilament intact. Labs (this visit): A1c 8.4% (prior 7.6%), eGFR 64, LDL 118, urine ACR 38 mg/g.',
    assessment:
      '1) Type 2 DM, uncontrolled — A1c trending up; likely dietary drift plus weight gain. 2) HTN — above goal at 142/86. 3) Microalbuminuria — early diabetic nephropathy. 4) Mixed hyperlipidemia.',
    plan:
      '1) Increase metformin to 1000 mg BID (already at max) — add empagliflozin 10 mg daily for A1c and renal benefit; review precautions. 2) Increase lisinopril 20 → 40 mg daily; recheck BP/BMP in 2 weeks. 3) Reinforce DASH diet, 30 min walking 5x/week; refer to diabetes educator. 4) Continue atorvastatin 40 mg; recheck lipid panel in 3 months. 5) Annual diabetic eye exam ordered. Follow-up 4 weeks.',
    icd10: [
      { code: 'E11.65', label: 'Type 2 DM with hyperglycemia' },
      { code: 'I10', label: 'Essential hypertension' },
      { code: 'E78.2', label: 'Mixed hyperlipidemia' },
      { code: 'N18.81', label: 'Microalbuminuria' },
    ],
  },
  {
    id: 'n_5002',
    patientName: 'David Okafor',
    patientId: 'p_1002',
    age: 52,
    sex: 'M',
    visitType: 'Acute visit · Internal Medicine',
    chiefComplaint: 'Epigastric burning, worse after meals',
    status: 'draft',
    createdAt: '2026-05-06T15:02:00Z',
    durationSec: 612,
    subjective:
      '52-year-old male with PMH CAD (s/p PCI 2022) and GERD presents with three weeks of epigastric burning, worse postprandially and at night. Denies dysphagia, melena, hematemesis, or weight loss. Currently on omeprazole 20 mg daily, ASA 81 mg, atorvastatin 40 mg, metoprolol succinate 50 mg.',
    objective:
      'Vitals: BP 128/80, HR 72, afebrile. Abdomen: soft, mild epigastric tenderness, no rebound or guarding. CV: RRR. No pallor. CBC and BMP unremarkable; H. pylori stool antigen pending.',
    assessment:
      '1) GERD with breakthrough symptoms — possible inadequate PPI dose vs. H. pylori. 2) Stable CAD — no anginal symptoms.',
    plan:
      '1) Increase omeprazole 20 → 40 mg daily before breakfast x 8 weeks. 2) Await H. pylori results; treat if positive. 3) Lifestyle: avoid late meals, elevate head of bed, weight loss. 4) If no improvement in 4 weeks or any alarm features, refer to GI for EGD. 5) Continue cardiac regimen.',
    icd10: [
      { code: 'K21.9', label: 'GERD without esophagitis' },
      { code: 'I25.10', label: 'ASCVD without angina' },
    ],
  },
  {
    id: 'n_5003',
    patientName: 'Sofia Hernandez',
    patientId: 'p_1003',
    age: 41,
    sex: 'F',
    visitType: 'Telehealth · Internal Medicine',
    chiefComplaint: 'Fatigue, cold intolerance — TSH review',
    status: 'signed',
    createdAt: '2026-04-29T09:00:00Z',
    durationSec: 481,
    subjective:
      '41-year-old female with hypothyroidism on levothyroxine 75 mcg, presenting for TSH review. Endorses fatigue, cold intolerance, mild constipation. Adherent and takes on empty stomach.',
    objective:
      'Vitals stable. Skin slightly dry. No goiter. TSH 6.8 (prior 4.1), free T4 0.9.',
    assessment:
      '1) Hypothyroidism, undertreated.',
    plan:
      '1) Increase levothyroxine 75 → 88 mcg daily. 2) Recheck TSH in 6–8 weeks. 3) Counseled on consistent administration.',
    icd10: [{ code: 'E03.9', label: 'Hypothyroidism, unspecified' }],
  },
];

export const TEMPLATES = [
  { id: 't1', name: 'Internal Medicine — Follow-up', specialty: 'Internal Medicine' },
  { id: 't2', name: 'Internal Medicine — New Patient', specialty: 'Internal Medicine' },
  { id: 't3', name: 'Diabetes Management', specialty: 'Internal Medicine' },
  { id: 't4', name: 'Hypertension Follow-up', specialty: 'Internal Medicine' },
  { id: 't5', name: 'Acute Visit (Adult)', specialty: 'Internal Medicine' },
];

// Mocked AI response for the lab image analysis page
export const MOCK_LAB_ANALYSIS = {
  panel: 'Comprehensive Metabolic Panel (CMP) + Lipid Panel',
  ocrConfidence: 0.97,
  results: [
    { name: 'Glucose, fasting', value: '168', unit: 'mg/dL', range: '70–99', flag: 'High' },
    { name: 'Hemoglobin A1c', value: '8.4', unit: '%', range: '< 5.7', flag: 'High' },
    { name: 'Creatinine', value: '1.10', unit: 'mg/dL', range: '0.6–1.2', flag: 'Normal' },
    { name: 'eGFR', value: '64', unit: 'mL/min/1.73m²', range: '> 60', flag: 'Borderline' },
    { name: 'Sodium', value: '139', unit: 'mmol/L', range: '136–145', flag: 'Normal' },
    { name: 'Potassium', value: '4.1', unit: 'mmol/L', range: '3.5–5.1', flag: 'Normal' },
    { name: 'LDL cholesterol', value: '146', unit: 'mg/dL', range: '< 100', flag: 'High' },
    { name: 'HDL cholesterol', value: '38', unit: 'mg/dL', range: '> 40 (M) / > 50 (F)', flag: 'Low' },
    { name: 'Triglycerides', value: '212', unit: 'mg/dL', range: '< 150', flag: 'High' },
    { name: 'TSH', value: '2.6', unit: 'mIU/L', range: '0.4–4.0', flag: 'Normal' },
  ],
  interpretation:
    'Findings are most consistent with poorly controlled type 2 diabetes mellitus with mixed dyslipidemia. The fasting glucose of 168 mg/dL together with an A1c of 8.4% confirms hyperglycemia well above target (most adults: A1c < 7%). LDL 146 mg/dL with HDL 38 mg/dL and triglycerides 212 mg/dL indicates atherogenic dyslipidemia, increasing 10-year ASCVD risk. eGFR 64 mL/min/1.73m² is borderline and should be trended; consider checking urine albumin-to-creatinine ratio to screen for early diabetic nephropathy.',
  differentials: [
    {
      label: 'Type 2 diabetes mellitus, uncontrolled',
      likelihood: 'High',
      reasoning: 'A1c 8.4% with fasting glucose 168 mg/dL.',
    },
    {
      label: 'Mixed dyslipidemia (atherogenic pattern)',
      likelihood: 'High',
      reasoning: 'Elevated LDL and triglycerides with low HDL — typical for metabolic syndrome.',
    },
    {
      label: 'Early diabetic nephropathy',
      likelihood: 'Moderate',
      reasoning: 'eGFR borderline at 64; recommend urine ACR.',
    },
    {
      label: 'Metabolic syndrome',
      likelihood: 'Moderate',
      reasoning: 'Pattern of hyperglycemia, dyslipidemia — assess BP and waist circumference.',
    },
  ],
  suggestedNextSteps: [
    'Intensify glycemic therapy (consider GLP-1 RA or SGLT2 inhibitor given cardio-renal benefit).',
    'Start or up-titrate high-intensity statin (e.g., atorvastatin 40–80 mg).',
    'Order urine albumin/creatinine ratio and repeat BMP in 2–4 weeks.',
    'Reinforce lifestyle — DASH/Mediterranean diet, 150 min/week aerobic activity.',
    'Consider ASCVD risk calculator and discuss aspirin only if appropriate.',
  ],
  disclaimer:
    'Clinical decision support — not a diagnosis. Final interpretation and management remain the responsibility of the treating clinician.',
};
