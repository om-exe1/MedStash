export interface Medicine {
  id: string;
  name: string;
  generic: string;
  form: "Tablet" | "Capsule" | "Gel" | "Syrup" | "Inhaler" | "Injection";
  strength: string;
  category: "Pain relief" | "Antibiotic" | "Allergy" | "Cold & flu" | "Digestive" | "Cardiac" | "Rare & Orphan" | "Oncology" | "Immunology" | "Diabetes" | "Endocrine" | "Neurology" | "Respiratory" | "Nutritional";
  prescriptionRequired: boolean;
  basePrice: number;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  storage: string;
  popular?: boolean;
}

export interface PharmacyStock {
  status: "Available" | "Low stock" | "Out of stock";
  quantity: number;
  price: number;
  lastUpdated: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  area: string;
  distance: number;
  distanceText: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  openStatus: "Open 24 Hours" | "Open until 11:00 PM" | "Open until 10:00 PM" | "Closed";
  phone: string;
  coordinates: { x: number; y: number };
  lat?: number;
  lng?: number;
  inventory: Record<string, PharmacyStock>;
}

export const medicines: Medicine[] = [
  {
    "id": "soliris",
    "name": "Soliris",
    "generic": "Eculizumab",
    "form": "Injection",
    "strength": "300 mg / 30 mL",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 42000.0,
    "description": "Ultra-rare complement inhibitor humanized monoclonal antibody used to treat Paroxysmal Nocturnal Hemoglobinuria (PNH) and Atypical Hemolytic Uremic Syndrome (aHUS).",
    "uses": [
      "Paroxysmal Nocturnal Hemoglobinuria (PNH)",
      "Atypical Hemolytic Uremic Syndrome (aHUS)",
      "Refractory Generalized Myasthenia Gravis",
      "Neuromyelitis Optica Spectrum Disorder"
    ],
    "dosage": "Administered strictly via specialized intravenous infusion by a trained clinical hematologist/neurologist under REMS protocol.",
    "sideEffects": [
      "Risk of serious meningococcal infections (vaccination required)",
      "Infusion reactions",
      "Headache"
    ],
    "storage": "Store refrigerated between 2\u00b0C and 8\u00b0C in original carton. Protect from light. Do not freeze.",
    "popular": true
  },
  {
    "id": "spinraza",
    "name": "Spinraza",
    "generic": "Nusinersen",
    "form": "Injection",
    "strength": "12 mg / 5 mL",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 85000.0,
    "description": "Antisense oligonucleotide (ASO) directed to treat 5q Spinal Muscular Atrophy (SMA) by altering SMN2 gene splicing to produce functional SMN protein.",
    "uses": [
      "Spinal Muscular Atrophy (SMA Type 1, 2, and 3)",
      "Pediatric and adult motor neuron loss prevention"
    ],
    "dosage": "Administered intrathecally directly into the cerebrospinal fluid by a specialist physician using lumbar puncture.",
    "sideEffects": [
      "Post-lumbar puncture headache",
      "Back pain",
      "Thrombocytopenia risk"
    ],
    "storage": "Refrigerate at 2\u00b0C to 8\u00b0C. Store in original vial away from sunlight.",
    "popular": true
  },
  {
    "id": "trientine",
    "name": "Syprine",
    "generic": "Trientine Hydrochloride",
    "form": "Capsule",
    "strength": "250 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 2850.0,
    "description": "Oral copper-chelating agent indicated in patients with Wilson's disease who are intolerant of or unresponsive to penicillamine.",
    "uses": [
      "Wilson's Disease (Hepatolenticular degeneration)",
      "Severe systemic copper overload"
    ],
    "dosage": "Adults: 750 mg to 1250 mg daily divided into 2 to 4 doses taken on an empty stomach at least 1 hour before meals.",
    "sideEffects": [
      "Iron deficiency anemia",
      "Skin rash",
      "Abdominal discomfort"
    ],
    "storage": "Store refrigerated between 2\u00b0C and 8\u00b0C in tightly sealed moisture-proof container.",
    "popular": true
  },
  {
    "id": "artamin-250",
    "name": "Artamin",
    "generic": "D-Penicillamine",
    "form": "Capsule",
    "strength": "250 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 380.0,
    "description": "Heavy-metal chelating agent that promotes urinary excretion of excess copper in Wilson's disease and reduces cystine excretion in cystinuria.",
    "uses": [
      "Wilson's Disease copper overload",
      "Cystinuria & cystine kidney stones",
      "Severe active rheumatoid arthritis"
    ],
    "dosage": "Take on an empty stomach 1 hour before or 2 hours after meals with water. Dosage titrated by serum free copper levels.",
    "sideEffects": [
      "Bone marrow suppression (regular CBC required)",
      "Proteinuria",
      "Taste impairment"
    ],
    "storage": "Store in a dry cool place below 25\u00b0C.",
    "popular": false
  },
  {
    "id": "fabrazyme",
    "name": "Fabrazyme",
    "generic": "Agalsidase Beta",
    "form": "Injection",
    "strength": "35 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 38000.0,
    "description": "Recombinant human enzyme replacement therapy designed to clear globotriaosylceramide (GL-3) lipid deposits in patients with Fabry Disease.",
    "uses": [
      "Fabry Disease enzyme replacement",
      "Prevention of renal failure and cardiac hypertrophy in Fabry syndrome"
    ],
    "dosage": "1 mg/kg body weight administered every two weeks as an intravenous infusion.",
    "sideEffects": [
      "Infusion-associated chills/fever",
      "Paresthesia",
      "Hypertension"
    ],
    "storage": "Store refrigerated at 2\u00b0C to 8\u00b0C. Do not freeze or shake.",
    "popular": false
  },
  {
    "id": "cerezyme",
    "name": "Cerezyme",
    "generic": "Imiglucerase",
    "form": "Injection",
    "strength": "400 Units",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 45000.0,
    "description": "Enzyme replacement therapy for long-term clinical treatment of pediatric and adult patients with Type 1 Gaucher Disease.",
    "uses": [
      "Type 1 Gaucher Disease",
      "Reversal of splenomegaly, hepatomegaly, anemia, and thrombocytopenia"
    ],
    "dosage": "Individualized dose (typically 60 Units/kg every 2 weeks) given by IV infusion over 1 to 2 hours.",
    "sideEffects": [
      "Flushing",
      "Transient pruritus",
      "Hypersensitivity"
    ],
    "storage": "Keep refrigerated at 2\u00b0C to 8\u00b0C.",
    "popular": false
  },
  {
    "id": "orfadin",
    "name": "Orfadin",
    "generic": "Nitisinone",
    "form": "Capsule",
    "strength": "10 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 9500.0,
    "description": "Inhibitor of 4-hydroxyphenylpyruvate dioxygenase, used alongside dietary restriction of tyrosine and phenylalanine in Hereditary Tyrosinemia Type 1 (HT-1).",
    "uses": [
      "Hereditary Tyrosinemia Type 1 (HT-1)",
      "Prevention of fatal pediatric liver and kidney failure"
    ],
    "dosage": "Initial dose 1 mg/kg/day divided into 2 daily doses taken 1 hour before a meal.",
    "sideEffects": [
      "Elevated tyrosine levels",
      "Corneal opacities",
      "Photophobia"
    ],
    "storage": "Refrigerate at 2\u00b0C to 8\u00b0C. Can be kept up to 45 days at room temperature.",
    "popular": false
  },
  {
    "id": "trikafta",
    "name": "Trikafta",
    "generic": "Elexacaftor, Tezacaftor and Ivacaftor",
    "form": "Tablet",
    "strength": "100 mg / 50 mg / 75 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 62000.0,
    "description": "Breakthrough triple-combination CFTR modulator targeting the underlying F508del genetic mutation in Cystic Fibrosis patients.",
    "uses": [
      "Cystic Fibrosis in patients aged 2 years and older with at least one F508del mutation"
    ],
    "dosage": "Two morning tablets (Elexacaftor/Tezacaftor/Ivacaftor) and one evening tablet (Ivacaftor) taken with fat-containing meals.",
    "sideEffects": [
      "Upper respiratory infection",
      "Elevated ALT/AST liver enzymes",
      "Rash"
    ],
    "storage": "Store at 20\u00b0C to 25\u00b0C in original blister pack.",
    "popular": true
  },
  {
    "id": "rilutek",
    "name": "Rilutek",
    "generic": "Riluzole",
    "form": "Tablet",
    "strength": "50 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 1450.0,
    "description": "Glutamate neurotransmission inhibitor proven to extend survival and delay mechanical ventilation in Amyotrophic Lateral Sclerosis (ALS).",
    "uses": [
      "Amyotrophic Lateral Sclerosis (ALS / Motor Neuron Disease)"
    ],
    "dosage": "Take 1 tablet every 12 hours on an empty stomach (1 hour before or 2 hours after meals).",
    "sideEffects": [
      "Nausea",
      "Fatigue",
      "Elevated serum transaminases"
    ],
    "storage": "Protect from direct light and store below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "cinryze",
    "name": "Cinryze",
    "generic": "C1 Esterase Inhibitor (Human)",
    "form": "Injection",
    "strength": "500 Units",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 31000.0,
    "description": "Highly purified plasma-derived C1 esterase inhibitor used for routine prophylaxis against painful and life-threatening Hereditary Angioedema (HAE) attacks.",
    "uses": [
      "Hereditary Angioedema (HAE) attack prevention",
      "Prophylaxis of laryngeal asphyxiation episodes"
    ],
    "dosage": "1000 Units intravenously every 3 or 4 days as prescribed by an immunologist.",
    "sideEffects": [
      "Hypersensitivity reactions",
      "Headache",
      "Venous thrombosis (rare)"
    ],
    "storage": "Store refrigerated between 2\u00b0C and 8\u00b0C. Do not freeze.",
    "popular": false
  },
  {
    "id": "firazyr",
    "name": "Firazyr",
    "generic": "Icatibant Acetate",
    "form": "Injection",
    "strength": "30 mg / 3 mL",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 28000.0,
    "description": "Selective competitive bradykinin B2 receptor antagonist for emergency subcutaneous rescue treatment of acute attacks of Hereditary Angioedema (HAE).",
    "uses": [
      "Emergency treatment of acute HAE swelling attacks (abdominal, facial, or laryngeal)"
    ],
    "dosage": "Inject 30 mg subcutaneously slowly into the abdominal area at the onset of an acute attack.",
    "sideEffects": [
      "Injection site reactions (erythema, swelling, burning)"
    ],
    "storage": "Store between 2\u00b0C and 25\u00b0C. Do not freeze.",
    "popular": false
  },
  {
    "id": "cystagon",
    "name": "Cystagon",
    "generic": "Cysteamine Bitartrate",
    "form": "Capsule",
    "strength": "150 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 4200.0,
    "description": "Cystine-depleting agent prescribed for the clinical management of nephropathic cystinosis, preventing kidney failure and organ crystal deposits.",
    "uses": [
      "Nephropathic Cystinosis",
      "Delaying renal transplant requirement"
    ],
    "dosage": "Administered every 6 hours around the clock with strict dosage titration based on leukocyte cystine levels.",
    "sideEffects": [
      "Unusual breath odor",
      "Nausea",
      "Lethargy"
    ],
    "storage": "Store below 25\u00b0C. Keep bottle tightly closed.",
    "popular": false
  },
  {
    "id": "kuvan",
    "name": "Kuvan",
    "generic": "Sapropterin Dihydrochloride",
    "form": "Tablet",
    "strength": "100 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 5400.0,
    "description": "Synthetic form of tetrahydrobiopterin (BH4) that activates phenylalanine hydroxylase to reduce blood phenylalanine in Phenylketonuria (PKU).",
    "uses": [
      "Phenylketonuria (PKU) in BH4-responsive patients",
      "Hyperphenylalaninemia (HPA)"
    ],
    "dosage": "10 to 20 mg/kg taken once daily with a meal, dissolved in water or apple juice.",
    "sideEffects": [
      "Headache",
      "Rhinorrhea",
      "Mild pharyngeal pain"
    ],
    "storage": "Keep bottle tightly closed with desiccant at 20\u00b0C to 25\u00b0C.",
    "popular": false
  },
  {
    "id": "ambisome",
    "name": "AmBisome",
    "generic": "Amphotericin B Liposomal",
    "form": "Injection",
    "strength": "50 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 6800.0,
    "description": "Liposomal lipid-bilayer formulation of amphotericin B providing powerful fungicidal action against severe systemic fungal infections and Mucormycosis (Black Fungus).",
    "uses": [
      "Mucormycosis (Rhino-orbital-cerebral fungal infection)",
      "Invasive Aspergillosis & Candidiasis",
      "Visceral Leishmaniasis (Kala-azar)"
    ],
    "dosage": "3 to 5 mg/kg IV infusion daily administered through dedicated line with in-line filter.",
    "sideEffects": [
      "Hypokalemia",
      "Serum creatinine elevation",
      "Fever and chills during infusion"
    ],
    "storage": "Store intact vials below 25\u00b0C. Protect from moisture.",
    "popular": true
  },
  {
    "id": "colistin-2m",
    "name": "Colistimethate Sodium",
    "generic": "Colistin",
    "form": "Injection",
    "strength": "2 Million IU",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 1850.0,
    "description": "Last-resort polymyxin antibiotic used for serious hospital-acquired infections caused by extreme drug-resistant (XDR) Gram-negative bacilli.",
    "uses": [
      "Carbapenem-resistant Klebsiella and Pseudomonas infections",
      "Hospital-acquired ventilator pneumonia",
      "Complicated sepsis"
    ],
    "dosage": "Weight-based IV infusion or nebulization divided into 2 to 3 daily doses under intensive kidney monitoring.",
    "sideEffects": [
      "Nephrotoxicity",
      "Neurotoxicity (dizziness, neuromuscular blockade)"
    ],
    "storage": "Store below 25\u00b0C. Reconstituted solution must be used promptly.",
    "popular": false
  },
  {
    "id": "dantrium",
    "name": "Dantrium",
    "generic": "Dantrolene Sodium",
    "form": "Injection",
    "strength": "20 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 7500.0,
    "description": "Post-synaptic muscle relaxant and life-saving antidote for acute Malignant Hyperthermia triggered during general anesthesia.",
    "uses": [
      "Emergency treatment of Malignant Hyperthermia crisis",
      "Neuroleptic Malignant Syndrome (NMS)"
    ],
    "dosage": "Continuous rapid IV push starting at 1 mg/kg up to 10 mg/kg until body temperature and tachycardia normalize.",
    "sideEffects": [
      "Muscle weakness",
      "Drowsiness",
      "Thrombophlebitis"
    ],
    "storage": "Store at 15\u00b0C to 30\u00b0C. Protect from light.",
    "popular": false
  },
  {
    "id": "pam-injection",
    "name": "Pam Injection",
    "generic": "Pralidoxime Iodide (2-PAM)",
    "form": "Injection",
    "strength": "1000 mg",
    "category": "Rare & Orphan",
    "prescriptionRequired": true,
    "basePrice": 450.0,
    "description": "Cholinesterase reactivator used as an emergency antidote for organophosphate pesticide poisoning and chemical nerve agents.",
    "uses": [
      "Organophosphate insecticide poisoning antidote",
      "Reversal of respiratory paralysis alongside atropine"
    ],
    "dosage": "1 to 2 g IV infusion in saline over 30 minutes, repeated every 4 to 6 hours as indicated by muscle twitching.",
    "sideEffects": [
      "Transient tachycardia",
      "Blurred vision",
      "Hypertension"
    ],
    "storage": "Store below 25\u00b0C. Keep protected from moisture.",
    "popular": false
  },
  {
    "id": "glivec-400",
    "name": "Glivec",
    "generic": "Imatinib Mesylate",
    "form": "Tablet",
    "strength": "400 mg",
    "category": "Oncology",
    "prescriptionRequired": true,
    "basePrice": 2600.0,
    "description": "Pioneering tyrosine kinase inhibitor that specifically blocks the BCR-ABL oncoprotein in Philadelphia chromosome-positive Chronic Myeloid Leukemia.",
    "uses": [
      "Chronic Myeloid Leukemia (CML)",
      "Gastrointestinal Stromal Tumors (GIST)",
      "Hypereosinophilic Syndrome"
    ],
    "dosage": "Take 1 tablet daily with a large glass of water during a substantial meal to avoid gastric irritation.",
    "sideEffects": [
      "Periorbital edema & fluid retention",
      "Muscle cramps",
      "Mild nausea"
    ],
    "storage": "Store below 30\u00b0C in original moisture-tight packaging.",
    "popular": true
  },
  {
    "id": "keytruda",
    "name": "Keytruda",
    "generic": "Pembrolizumab",
    "form": "Injection",
    "strength": "100 mg / 4 mL",
    "category": "Oncology",
    "prescriptionRequired": true,
    "basePrice": 95000.0,
    "description": "Humanized anti-PD-1 checkpoint inhibitor immunotherapy that unmasks cancer cells, enabling the patient's immune system to destroy tumors.",
    "uses": [
      "Advanced Melanoma",
      "Non-Small Cell Lung Cancer (NSCLC)",
      "Head and Neck Squamous Cell Carcinoma",
      "MSI-H Solid Tumors"
    ],
    "dosage": "200 mg every 3 weeks or 400 mg every 6 weeks as an IV infusion over 30 minutes in an oncology day-care center.",
    "sideEffects": [
      "Immune-mediated pneumonitis, colitis, or thyroiditis",
      "Fatigue",
      "Pruritus"
    ],
    "storage": "Refrigerate at 2\u00b0C to 8\u00b0C. Protect from light. Do not freeze.",
    "popular": true
  },
  {
    "id": "prograf-1",
    "name": "Prograf",
    "generic": "Tacrolimus",
    "form": "Capsule",
    "strength": "1 mg",
    "category": "Immunology",
    "prescriptionRequired": true,
    "basePrice": 540.0,
    "description": "Potent macrolide calcineurin inhibitor crucial for preventing organ allograft rejection following renal, hepatic, or cardiac transplantation.",
    "uses": [
      "Kidney & liver transplant anti-rejection prophylaxis",
      "Severe refractory atopic dermatitis & nephrotic syndrome"
    ],
    "dosage": "Take twice daily exactly 12 hours apart on an empty stomach with water. Trough blood levels monitored regularly.",
    "sideEffects": [
      "Tremor",
      "Nephrotoxicity",
      "Hyperglycemia & hypertension"
    ],
    "storage": "Store at 25\u00b0C in blister pack.",
    "popular": true
  },
  {
    "id": "cellcept-500",
    "name": "CellCept",
    "generic": "Mycophenolate Mofetil",
    "form": "Tablet",
    "strength": "500 mg",
    "category": "Immunology",
    "prescriptionRequired": true,
    "basePrice": 720.0,
    "description": "Inosine monophosphate dehydrogenase (IMPDH) inhibitor that suppresses lymphocyte proliferation to prevent allogeneic transplant rejection.",
    "uses": [
      "Organ transplant rejection prophylaxis (kidney, heart, liver)",
      "Lupus Nephritis",
      "Refractory vasculitis"
    ],
    "dosage": "Take 1 g (two 500 mg tablets) twice daily on an empty stomach. Do not crush or break.",
    "sideEffects": [
      "Diarrhea",
      "Leukopenia",
      "Increased risk of opportunistic infections"
    ],
    "storage": "Store at room temperature between 15\u00b0C and 30\u00b0C.",
    "popular": true
  },
  {
    "id": "pirfenex-200",
    "name": "Pirfenex",
    "generic": "Pirfenidone",
    "form": "Tablet",
    "strength": "200 mg",
    "category": "Respiratory",
    "prescriptionRequired": true,
    "basePrice": 480.0,
    "description": "Antifibrotic and anti-inflammatory agent proven to slow the decline of lung function in Idiopathic Pulmonary Fibrosis (IPF).",
    "uses": [
      "Idiopathic Pulmonary Fibrosis (IPF)"
    ],
    "dosage": "Titrated from 200 mg thrice daily up to maintenance 600-800 mg thrice daily taken with food.",
    "sideEffects": [
      "Photosensitivity rash (sunscreen required)",
      "Nausea",
      "Weight loss"
    ],
    "storage": "Store below 25\u00b0C in a dry location.",
    "popular": false
  },
  {
    "id": "ozempic-1mg",
    "name": "Ozempic Pen",
    "generic": "Semaglutide",
    "form": "Injection",
    "strength": "1 mg (2 mg / 1.5 mL pen)",
    "category": "Diabetes",
    "prescriptionRequired": true,
    "basePrice": 4200.0,
    "description": "Once-weekly GLP-1 receptor agonist that stimulates insulin secretion, suppresses glucagon, slows gastric emptying, and protects cardiovascular health.",
    "uses": [
      "Type 2 Diabetes Mellitus glycemic control",
      "Major adverse cardiovascular event (MACE) risk reduction"
    ],
    "dosage": "Inject subcutaneously once weekly on the same day each week in abdomen, thigh, or upper arm.",
    "sideEffects": [
      "Nausea",
      "Vomiting or constipation",
      "Decreased appetite"
    ],
    "storage": "Refrigerate unused pens at 2\u00b0C to 8\u00b0C. In-use pens last 56 days at room temperature below 30\u00b0C.",
    "popular": true
  },
  {
    "id": "mounjaro-5mg",
    "name": "Mounjaro Pen",
    "generic": "Tirzepatide",
    "form": "Injection",
    "strength": "5 mg / 0.5 mL",
    "category": "Diabetes",
    "prescriptionRequired": true,
    "basePrice": 5800.0,
    "description": "First-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist delivering superior HbA1c reduction.",
    "uses": [
      "Type 2 Diabetes Mellitus advanced management",
      "Glycemic control and metabolic weight management"
    ],
    "dosage": "Inject subcutaneously once weekly without regard to meals.",
    "sideEffects": [
      "Nausea",
      "Diarrhea",
      "Dyspepsia"
    ],
    "storage": "Store in refrigerator between 2\u00b0C and 8\u00b0C. Protect from light.",
    "popular": true
  },
  {
    "id": "jardiance-25",
    "name": "Jardiance",
    "generic": "Empagliflozin",
    "form": "Tablet",
    "strength": "25 mg",
    "category": "Diabetes",
    "prescriptionRequired": true,
    "basePrice": 680.0,
    "description": "SGLT2 inhibitor that prevents kidney glucose reabsorption, promoting urinary glucose excretion while protecting heart and kidney function.",
    "uses": [
      "Type 2 Diabetes",
      "Heart Failure with reduced or preserved ejection fraction",
      "Chronic Kidney Disease"
    ],
    "dosage": "Take 1 tablet once daily in the morning with or without food.",
    "sideEffects": [
      "Genital mycotic infections",
      "Urinary tract infections",
      "Mild volume depletion"
    ],
    "storage": "Store below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "entresto-100",
    "name": "Entresto",
    "generic": "Sacubitril and Valsartan",
    "form": "Tablet",
    "strength": "49 mg / 51 mg (100 mg)",
    "category": "Cardiac",
    "prescriptionRequired": true,
    "basePrice": 980.0,
    "description": "First-in-class Angiotensin Receptor-Neprilysin Inhibitor (ARNI) that substantially reduces cardiovascular death and hospitalization in heart failure.",
    "uses": [
      "Chronic Heart Failure with reduced ejection fraction (HFrEF)",
      "Heart Failure with preserved ejection fraction"
    ],
    "dosage": "Take 1 tablet twice daily with water as prescribed by a cardiologist. Monitor serum potassium.",
    "sideEffects": [
      "Hypotension",
      "Hyperkalemia",
      "Mild cough"
    ],
    "storage": "Store in original moisture-tight package below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "eliquis-5",
    "name": "Eliquis",
    "generic": "Apixaban",
    "form": "Tablet",
    "strength": "5 mg",
    "category": "Cardiac",
    "prescriptionRequired": true,
    "basePrice": 740.0,
    "description": "Direct oral anticoagulant (DOAC) that selectively blocks Factor Xa to prevent stroke in non-valvular atrial fibrillation and treat DVT/PE.",
    "uses": [
      "Stroke prevention in Atrial Fibrillation",
      "Deep Vein Thrombosis (DVT) & Pulmonary Embolism (PE) treatment and prophylaxis"
    ],
    "dosage": "Take 1 tablet twice daily with or without food. Do not skip doses.",
    "sideEffects": [
      "Bleeding risk (bruising, nosebleeds)",
      "Mild anemia"
    ],
    "storage": "Store at 20\u00b0C to 25\u00b0C.",
    "popular": true
  },
  {
    "id": "telma-40",
    "name": "Telma 40",
    "generic": "Telmisartan",
    "form": "Tablet",
    "strength": "40 mg",
    "category": "Cardiac",
    "prescriptionRequired": true,
    "basePrice": 128.0,
    "description": "Long-acting angiotensin II receptor blocker (ARB) providing smooth 24-hour blood pressure control with end-organ kidney and cardiovascular protection.",
    "uses": [
      "Essential hypertension (High Blood Pressure)",
      "Cardiovascular risk reduction in diabetic hypertensive patients"
    ],
    "dosage": "Take 1 tablet once daily at the same time each morning with water.",
    "sideEffects": [
      "Mild dizziness on standing",
      "Sinusitis",
      "Back pain"
    ],
    "storage": "Store in blister pack below 30\u00b0C away from moisture.",
    "popular": true
  },
  {
    "id": "eltroxin-100",
    "name": "Eltroxin",
    "generic": "Levothyroxine Sodium",
    "form": "Tablet",
    "strength": "100 mcg",
    "category": "Endocrine",
    "prescriptionRequired": true,
    "basePrice": 165.0,
    "description": "Pure synthetic crystalline levorotatory isomer of thyroxine (T4) used for thyroid hormone replacement therapy in primary and secondary hypothyroidism.",
    "uses": [
      "Hypothyroidism (underactive thyroid)",
      "TSH suppression therapy in thyroid goiter and carcinoma"
    ],
    "dosage": "Take 1 tablet once daily in the morning on an empty stomach with plain water at least 30 to 45 minutes before breakfast.",
    "sideEffects": [
      "Palpitations or sweating if dose is excessive",
      "Weight changes"
    ],
    "storage": "Protect from direct heat and light. Keep bottle tightly closed.",
    "popular": true
  },
  {
    "id": "lantus-solostar",
    "name": "Lantus Solostar",
    "generic": "Insulin Glargine",
    "form": "Injection",
    "strength": "100 IU / mL (3 mL pen)",
    "category": "Diabetes",
    "prescriptionRequired": true,
    "basePrice": 680.0,
    "description": "Peakless, long-acting 24-hour basal human insulin analogue providing smooth background glucose stabilization with low nocturnal hypoglycemia risk.",
    "uses": [
      "Type 1 and Type 2 Diabetes Mellitus 24-hour basal insulin control"
    ],
    "dosage": "Inject subcutaneously once daily at the same time each evening or bedtime.",
    "sideEffects": [
      "Hypoglycemia if meal missed",
      "Lipodystrophy at injection site"
    ],
    "storage": "Unopened pens stored in refrigerator (2\u00b0C to 8\u00b0C). In-use pens kept below 30\u00b0C for up to 28 days.",
    "popular": true
  },
  {
    "id": "keppra-500",
    "name": "Keppra",
    "generic": "Levetiracetam",
    "form": "Tablet",
    "strength": "500 mg",
    "category": "Neurology",
    "prescriptionRequired": true,
    "basePrice": 380.0,
    "description": "Antiepileptic agent that binds to synaptic vesicle protein SV2A, inhibiting presynaptic calcium channels to halt seizure spread.",
    "uses": [
      "Partial onset seizures",
      "Myoclonic seizures in juvenile myoclonic epilepsy",
      "Primary generalized tonic-clonic seizures"
    ],
    "dosage": "Take 1 tablet twice daily with water as prescribed. Do not stop abruptly.",
    "sideEffects": [
      "Somnolence",
      "Dizziness",
      "Mild mood irritability"
    ],
    "storage": "Store below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "foracort-200",
    "name": "Foracort Inhaler",
    "generic": "Budesonide and Formoterol Fumarate",
    "form": "Inhaler",
    "strength": "200 mcg / 6 mcg",
    "category": "Respiratory",
    "prescriptionRequired": true,
    "basePrice": 420.0,
    "description": "Synergistic combination of an inhaled corticosteroid (budesonide) and long-acting beta2-agonist (formoterol) for daily asthma maintenance and COPD.",
    "uses": [
      "Bronchial asthma maintenance",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Airway inflammation control"
    ],
    "dosage": "1 to 2 puffs inhaled twice daily using standard technique. Rinse mouth with water after use.",
    "sideEffects": [
      "Oral candidiasis (preventable by mouth rinsing)",
      "Mild throat irritation",
      "Hoarseness"
    ],
    "storage": "Store below 25\u00b0C. Do not puncture or expose canister to fire.",
    "popular": true
  },
  {
    "id": "duolin-respules",
    "name": "Duolin Respules",
    "generic": "Levosalbutamol and Ipratropium Bromide",
    "form": "Syrup",
    "strength": "1.25 mg / 500 mcg per 2.5 mL",
    "category": "Respiratory",
    "prescriptionRequired": true,
    "basePrice": 28.0,
    "description": "Bronchodilator inhalation solution combining an anticholinergic and a selective beta2-agonist for rapid relief of acute wheezing and severe bronchospasm.",
    "uses": [
      "Acute severe asthma flare-ups",
      "COPD exacerbation with wheezing",
      "Emergency bronchospasm nebulization"
    ],
    "dosage": "Inhale 1 respule via jet nebulizer machine over 10 to 15 minutes as needed during acute breathlessness.",
    "sideEffects": [
      "Tremor",
      "Dry mouth",
      "Mild tachycardia"
    ],
    "storage": "Store in foil pouch below 25\u00b0C. Protect from direct heat.",
    "popular": true
  },
  {
    "id": "dolo-650",
    "name": "Dolo 650",
    "generic": "Paracetamol",
    "form": "Tablet",
    "strength": "650 mg",
    "category": "Pain relief",
    "prescriptionRequired": false,
    "basePrice": 35.0,
    "description": "Antipyretic and analgesic medication used widely for fast relief from high fever, body ache, headache, and mild to moderate pain.",
    "uses": [
      "Fever reduction",
      "Headache & migraine relief",
      "Muscle & joint aches",
      "Post-vaccination body pain"
    ],
    "dosage": "Take 1 tablet every 6 to 8 hours with water as needed. Do not exceed 4 tablets in 24 hours.",
    "sideEffects": [
      "Mild nausea (rare)",
      "Stomach discomfort if taken on empty stomach"
    ],
    "storage": "Store below 25\u00b0C in a dry place away from direct sunlight.",
    "popular": true
  },
  {
    "id": "azithral-500",
    "name": "Azithral 500",
    "generic": "Azithromycin",
    "form": "Tablet",
    "strength": "500 mg",
    "category": "Antibiotic",
    "prescriptionRequired": true,
    "basePrice": 118.0,
    "description": "Broad-spectrum macrolide antibiotic used to treat bacterial infections of the respiratory tract, sinuses, throat, lungs, and skin.",
    "uses": [
      "Chest & throat infections",
      "Tonsillitis & Sinusitis",
      "Bronchitis",
      "Skin bacterial infections"
    ],
    "dosage": "Usually taken once daily 1 hour before or 2 hours after food for 3 to 5 consecutive days.",
    "sideEffects": [
      "Mild diarrhea",
      "Nausea or abdominal cramps",
      "Temporary dizziness"
    ],
    "storage": "Store in original strip in a cool, moisture-free location.",
    "popular": true
  },
  {
    "id": "cetirizine-10",
    "name": "Cetirizine 10",
    "generic": "Cetirizine Hydrochloride",
    "form": "Tablet",
    "strength": "10 mg",
    "category": "Allergy",
    "prescriptionRequired": false,
    "basePrice": 22.0,
    "description": "Second-generation antihistamine that relieves allergy symptoms like runny nose, sneezing, itchy eyes, hives, and seasonal hay fever.",
    "uses": [
      "Allergic rhinitis (hay fever)",
      "Itchy watery eyes & sneezing",
      "Urticaria & skin hives",
      "Dust and pollen allergies"
    ],
    "dosage": "Take 1 tablet once daily in the evening or night with or without food.",
    "sideEffects": [
      "Mild drowsiness",
      "Dry mouth",
      "Fatigue"
    ],
    "storage": "Store at room temperature between 15\u00b0C and 30\u00b0C.",
    "popular": true
  },
  {
    "id": "volini-gel",
    "name": "Volini Pain Relief Gel",
    "generic": "Diclofenac Diethylamine, Methyl Salicylate & Menthol",
    "form": "Gel",
    "strength": "30 g",
    "category": "Pain relief",
    "prescriptionRequired": false,
    "basePrice": 145.0,
    "description": "Fast-absorbing topical pain relief gel with micro-particles that penetrate deep to soothe backache, neck pain, joint stiffness, and sprains.",
    "uses": [
      "Sprains and muscle strains",
      "Lower back pain & stiff neck",
      "Arthritic joint pain",
      "Sports injury soreness"
    ],
    "dosage": "Apply 3 to 4 times daily gently onto the affected area. Do not massage vigorously.",
    "sideEffects": [
      "Mild skin redness or tingling sensation at application site"
    ],
    "storage": "Keep tube tightly closed. Protect from freezing and direct heat.",
    "popular": true
  },
  {
    "id": "pan-40",
    "name": "Pan 40",
    "generic": "Pantoprazole Gastro-resistant",
    "form": "Tablet",
    "strength": "40 mg",
    "category": "Digestive",
    "prescriptionRequired": true,
    "basePrice": 155.0,
    "description": "Proton pump inhibitor (PPI) that reduces stomach acid production, treating acid reflux, GERD, gastritis, and peptic ulcers.",
    "uses": [
      "Acid reflux & heartburn",
      "Gastric and duodenal ulcers",
      "Erosive esophagitis",
      "NSAID-induced stomach protection"
    ],
    "dosage": "Take 1 tablet in the morning 30 minutes before breakfast with a full glass of water.",
    "sideEffects": [
      "Headache",
      "Mild flatulence or stomach ache",
      "Dry throat"
    ],
    "storage": "Store in moisture-proof pack below 25\u00b0C.",
    "popular": false
  },
  {
    "id": "augmentin-625",
    "name": "Augmentin 625 Duo",
    "generic": "Amoxicillin and Potassium Clavulanate",
    "form": "Tablet",
    "strength": "625 mg",
    "category": "Antibiotic",
    "prescriptionRequired": true,
    "basePrice": 210.0,
    "description": "Potent penicillin-class antibiotic combined with clavulanate to overcome bacterial resistance, treating ear, dental, respiratory, and urinary infections.",
    "uses": [
      "Dental abscesses",
      "Severe bronchitis & pneumonia",
      "Ear and sinus infections",
      "Urinary tract infections (UTI)"
    ],
    "dosage": "Take 1 tablet twice daily at the start of a meal to minimize gastrointestinal discomfort.",
    "sideEffects": [
      "Mild diarrhea",
      "Nausea",
      "Mild skin rash"
    ],
    "storage": "Keep in a cool dry place away from moisture.",
    "popular": false
  },
  {
    "id": "allegra-120",
    "name": "Allegra 120",
    "generic": "Fexofenadine Hydrochloride",
    "form": "Tablet",
    "strength": "120 mg",
    "category": "Allergy",
    "prescriptionRequired": false,
    "basePrice": 198.0,
    "description": "Non-sedating antihistamine providing 24-hour relief from seasonal allergies, allergic skin itching, and rhinitis without causing sleepiness.",
    "uses": [
      "Seasonal hay fever",
      "Allergic skin wheals",
      "Sneezing & watery nose",
      "Allergy flare-ups during work/study"
    ],
    "dosage": "Take 1 tablet once daily with water. Avoid fruit juices.",
    "sideEffects": [
      "Mild headache",
      "Dizziness (infrequent)"
    ],
    "storage": "Store between 20\u00b0C and 25\u00b0C.",
    "popular": true
  },
  {
    "id": "combiflam",
    "name": "Combiflam",
    "generic": "Ibuprofen & Paracetamol",
    "form": "Tablet",
    "strength": "400 mg / 325 mg",
    "category": "Pain relief",
    "prescriptionRequired": false,
    "basePrice": 42.0,
    "description": "Dual-action pain and fever remedy combining an anti-inflammatory (ibuprofen) with an analgesic (paracetamol) for acute pain episodes.",
    "uses": [
      "Toothache & dental discomfort",
      "Fever with severe body chills",
      "Post-surgical pain",
      "Period cramps & severe headaches"
    ],
    "dosage": "Take 1 tablet after meals with milk or water. Do not take on an empty stomach.",
    "sideEffects": [
      "Mild heartburn",
      "Stomach upset"
    ],
    "storage": "Protect from light and moisture.",
    "popular": true
  },
  {
    "id": "meftal-spas",
    "name": "Meftal-Spas",
    "generic": "Mefenamic Acid and Dicyclomine",
    "form": "Tablet",
    "strength": "250 mg / 10 mg",
    "category": "Pain relief",
    "prescriptionRequired": true,
    "basePrice": 54.0,
    "description": "Antispasmodic and NSAID pain reliever formulated specifically to relieve severe intestinal, biliary, ureteric, and primary dysmenorrhea cramps.",
    "uses": [
      "Menstrual cramps & dysmenorrhea",
      "Spasmodic abdominal colic pain",
      "Biliary & renal colic"
    ],
    "dosage": "Take 1 tablet after food as needed for cramping. Max 3 tablets daily.",
    "sideEffects": [
      "Dry mouth",
      "Mild dizziness",
      "Nausea"
    ],
    "storage": "Store below 25\u00b0C in a dry place.",
    "popular": true
  },
  {
    "id": "ondem-4",
    "name": "Ondem 4",
    "generic": "Ondansetron Hydrochloride",
    "form": "Tablet",
    "strength": "4 mg",
    "category": "Digestive",
    "prescriptionRequired": true,
    "basePrice": 58.0,
    "description": "Selective 5-HT3 receptor antagonist that stops intense nausea and vomiting caused by chemotherapy, radiation, surgery, or acute gastroenteritis.",
    "uses": [
      "Prevention and relief of nausea and vomiting",
      "Acute gastroenteritis emesis control",
      "Post-operative emesis"
    ],
    "dosage": "Take 1 tablet 30 minutes before meal or chemotherapy as prescribed.",
    "sideEffects": [
      "Mild headache",
      "Constipation",
      "Flushing"
    ],
    "storage": "Store at 20\u00b0C to 25\u00b0C away from light.",
    "popular": true
  },
  {
    "id": "electral-powder",
    "name": "Electral Powder",
    "generic": "Oral Rehydration Salts (WHO Formula)",
    "form": "Syrup",
    "strength": "21.8 g sachet",
    "category": "Digestive",
    "prescriptionRequired": false,
    "basePrice": 22.0,
    "description": "WHO-recommended oral rehydration salts (ORS) containing vital sodium chloride, potassium chloride, sodium citrate, and anhydrous dextrose.",
    "uses": [
      "Dehydration recovery from acute diarrhea or vomiting",
      "Heat exhaustion & heavy sweating rehydration"
    ],
    "dosage": "Dissolve the entire 21.8 g sachet in exactly 1 liter of clean drinking water. Drink throughout the day.",
    "sideEffects": [
      "None when reconstituted with correct water volume"
    ],
    "storage": "Store in a dry location. Use reconstituted solution within 24 hours.",
    "popular": true
  },
  {
    "id": "shelcal-500",
    "name": "Shelcal 500",
    "generic": "Calcium with Vitamin D3",
    "form": "Tablet",
    "strength": "500 mg / 250 IU",
    "category": "Nutritional",
    "prescriptionRequired": false,
    "basePrice": 132.0,
    "description": "Bioavailable calcium supplement fortified with cholecalciferol (Vitamin D3) to maintain bone mineral density and treat osteoporosis.",
    "uses": [
      "Osteoporosis and osteopenia management",
      "Pregnancy & lactation calcium supplementation",
      "Bone fracture healing support"
    ],
    "dosage": "Take 1 tablet daily after lunch or dinner with water.",
    "sideEffects": [
      "Mild constipation",
      "Flatulence"
    ],
    "storage": "Store in a cool dry place below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "neurobion-forte",
    "name": "Neurobion Forte",
    "generic": "Vitamin B-Complex with B12",
    "form": "Tablet",
    "strength": "Therapeutic B-Complex",
    "category": "Neurology",
    "prescriptionRequired": false,
    "basePrice": 42.0,
    "description": "Synergistic neurotropic B-vitamin formulation (B1, B2, B3, B5, B6, and B12) that restores nerve conduction, relieves tingling and numbness.",
    "uses": [
      "Diabetic peripheral neuropathy",
      "Tingling, burning, and numbness in feet and hands",
      "Nutritional vitamin B deficiency"
    ],
    "dosage": "Take 1 tablet daily with food.",
    "sideEffects": [
      "Mild stomach discomfort (rare)"
    ],
    "storage": "Store in cool dry place below 25\u00b0C.",
    "popular": true
  },
  {
    "id": "ecosprin-75",
    "name": "Ecosprin 75",
    "generic": "Aspirin (Gastro-resistant)",
    "form": "Tablet",
    "strength": "75 mg",
    "category": "Cardiac",
    "prescriptionRequired": true,
    "basePrice": 9.5,
    "description": "Low-dose enteric-coated cardioprotective antiplatelet medicine that prevents blood platelets from clumping together to form arterial clots.",
    "uses": [
      "Prevention of myocardial infarction (heart attack)",
      "Secondary stroke prevention",
      "Post-coronary bypass/stent prophylaxis"
    ],
    "dosage": "Take 1 tablet daily with a glass of water after food. Swallow whole without crushing.",
    "sideEffects": [
      "Mild gastric irritation",
      "Increased bleeding time"
    ],
    "storage": "Store in cool dry place away from sunlight.",
    "popular": true
  }
];

export const pharmacies: Pharmacy[] = [
  {
    id: "xyz-pharmacy",
    name: "XYZ Neighborhood Pharmacy",
    address: "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
    area: "Indiranagar",
    distance: 0.8,
    distanceText: "0.8 km away",
    rating: 4.8,
    reviewsCount: 312,
    verified: true,
    openStatus: "Open until 11:00 PM",
    phone: "+91 98450 12384",
    coordinates: { x: 54, y: 38 },
    lat: 12.9735,
    lng: 77.6420,
    inventory: {
      "dolo-650": { status: "Available", quantity: 45, price: 34, lastUpdated: "5 mins ago" },
      "azithral-500": { status: "Available", quantity: 18, price: 115, lastUpdated: "12 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 60, price: 20, lastUpdated: "8 mins ago" },
      "volini-gel": { status: "Low stock", quantity: 3, price: 140, lastUpdated: "20 mins ago" },
      "pan-40": { status: "Available", quantity: 24, price: 150, lastUpdated: "15 mins ago" },
      "augmentin-625": { status: "Available", quantity: 12, price: 205, lastUpdated: "10 mins ago" },
      "allegra-120": { status: "Available", quantity: 30, price: 192, lastUpdated: "18 mins ago" },
      "combiflam": { status: "Available", quantity: 50, price: 40, lastUpdated: "5 mins ago" }
    }
  },
  {
    id: "apollo-pharmacy",
    name: "Apollo Pharmacy 24x7",
    address: "Plot 88, 100 Feet Road, HAL 2nd Stage",
    area: "100 Feet Road",
    distance: 1.2,
    distanceText: "1.2 km away",
    rating: 4.7,
    reviewsCount: 840,
    verified: true,
    openStatus: "Open 24 Hours",
    phone: "+91 80 2520 4400",
    coordinates: { x: 32, y: 52 },
    lat: 12.9698,
    lng: 77.6385,
    inventory: {
      "dolo-650": { status: "Available", quantity: 120, price: 35, lastUpdated: "2 mins ago" },
      "azithral-500": { status: "Available", quantity: 35, price: 118, lastUpdated: "15 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 90, price: 22, lastUpdated: "4 mins ago" },
      "volini-gel": { status: "Available", quantity: 28, price: 145, lastUpdated: "6 mins ago" },
      "pan-40": { status: "Available", quantity: 40, price: 155, lastUpdated: "3 mins ago" },
      "augmentin-625": { status: "Available", quantity: 25, price: 210, lastUpdated: "5 mins ago" },
      "allegra-120": { status: "Available", quantity: 45, price: 198, lastUpdated: "10 mins ago" },
      "combiflam": { status: "Available", quantity: 110, price: 42, lastUpdated: "2 mins ago" }
    }
  },
  {
    id: "wellness-forever",
    name: "Wellness Forever Chemist",
    address: "Ground Floor, Metro Pillar 42, CMH Road",
    area: "CMH Road",
    distance: 1.5,
    distanceText: "1.5 km away",
    rating: 4.6,
    reviewsCount: 420,
    verified: true,
    openStatus: "Open 24 Hours",
    phone: "+91 80 4112 8990",
    coordinates: { x: 74, y: 64 },
    lat: 12.9780,
    lng: 77.6440,
    inventory: {
      "dolo-650": { status: "Available", quantity: 80, price: 35, lastUpdated: "7 mins ago" },
      "azithral-500": { status: "Low stock", quantity: 4, price: 116, lastUpdated: "18 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 45, price: 21, lastUpdated: "12 mins ago" },
      "volini-gel": { status: "Available", quantity: 14, price: 142, lastUpdated: "9 mins ago" },
      "pan-40": { status: "Low stock", quantity: 2, price: 152, lastUpdated: "25 mins ago" },
      "augmentin-625": { status: "Low stock", quantity: 3, price: 208, lastUpdated: "14 mins ago" },
      "allegra-120": { status: "Available", quantity: 22, price: 195, lastUpdated: "16 mins ago" },
      "combiflam": { status: "Available", quantity: 65, price: 41, lastUpdated: "8 mins ago" }
    }
  },
  {
    id: "medplus-chemist",
    name: "MedPlus Superstore",
    address: "24, Double Road, Defence Colony",
    area: "Defence Colony",
    distance: 2.1,
    distanceText: "2.1 km away",
    rating: 4.5,
    reviewsCount: 195,
    verified: true,
    openStatus: "Open until 10:00 PM",
    phone: "+91 80 2341 5566",
    coordinates: { x: 42, y: 78 },
    lat: 12.9660,
    lng: 77.6350,
    inventory: {
      "dolo-650": { status: "Available", quantity: 60, price: 33, lastUpdated: "14 mins ago" },
      "azithral-500": { status: "Available", quantity: 15, price: 114, lastUpdated: "30 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 50, price: 19, lastUpdated: "20 mins ago" },
      "volini-gel": { status: "Available", quantity: 18, price: 138, lastUpdated: "15 mins ago" },
      "pan-40": { status: "Available", quantity: 20, price: 148, lastUpdated: "10 mins ago" },
      "augmentin-625": { status: "Out of stock", quantity: 0, price: 204, lastUpdated: "1 hour ago" },
      "allegra-120": { status: "Available", quantity: 19, price: 190, lastUpdated: "40 mins ago" },
      "combiflam": { status: "Available", quantity: 70, price: 39, lastUpdated: "12 mins ago" }
    }
  },
  {
    id: "lifecare-meds",
    name: "LifeCare Pharma & Surgicals",
    address: "Shop 12, Krishna Temple Road, Domlur",
    area: "Domlur",
    distance: 2.8,
    distanceText: "2.8 km away",
    rating: 4.4,
    reviewsCount: 88,
    verified: false,
    openStatus: "Open until 10:00 PM",
    phone: "+91 98860 77123",
    coordinates: { x: 82, y: 32 },
    lat: 12.9610,
    lng: 77.6470,
    inventory: {
      "dolo-650": { status: "Available", quantity: 30, price: 36, lastUpdated: "45 mins ago" },
      "azithral-500": { status: "Low stock", quantity: 2, price: 120, lastUpdated: "50 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 25, price: 22, lastUpdated: "35 mins ago" },
      "volini-gel": { status: "Out of stock", quantity: 0, price: 145, lastUpdated: "2 hours ago" },
      "pan-40": { status: "Available", quantity: 10, price: 155, lastUpdated: "30 mins ago" },
      "augmentin-625": { status: "Available", quantity: 8, price: 215, lastUpdated: "25 mins ago" },
      "allegra-120": { status: "Available", quantity: 12, price: 200, lastUpdated: "40 mins ago" },
      "combiflam": { status: "Available", quantity: 40, price: 42, lastUpdated: "30 mins ago" }
    }
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    title: "Stock Alert: Azithral 500",
    message: "Apollo Pharmacy 24x7 received 35 fresh units.",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Price Drop on Pain Relief",
    message: "MedPlus Superstore has discounted Dolo 650 to ₹33.",
    time: "1 hour ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Reservation Reminder",
    message: "Reservations are held for 24 hours at neighborhood stores.",
    time: "Yesterday",
    read: true
  }
];
