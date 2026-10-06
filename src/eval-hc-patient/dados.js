/* Dados fixos do formulário de avaliação inicial HC.
   Tudo aqui é hardcoded e revisto à mão — não há chamadas externas nem IA.
   Editar este ficheiro e correr build.py para regenerar index.html. */
"use strict";

/* Princípios ativos (DCI) frequentes em ambulatório / domicílio sénior.
   Lista de apoio ao preenchimento: o campo aceita qualquer texto. */
var FARMACOS = [
  // Respiratório
  "Acetilcisteína", "Beclometasona", "Brometo de aclidínio", "Brometo de glicopirrónio", "Brometo de ipratrópio",
  "Brometo de tiotrópio", "Brometo de umeclidínio", "Budesonida", "Budesonida + formoterol", "Carbocisteína",
  "Fluticasona", "Fluticasona + salmeterol", "Fluticasona + umeclidínio + vilanterol", "Fluticasona + vilanterol",
  "Formoterol", "Indacaterol", "Indacaterol + glicopirrónio", "Montelucaste", "Nintedanib", "Olodaterol",
  "Oxigénio", "Pirfenidona", "Salbutamol", "Salmeterol", "Teofilina", "Tiotrópio + olodaterol", "Umeclidínio + vilanterol",
  // Corticoides
  "Deflazacorte", "Dexametasona", "Hidrocortisona", "Metilprednisolona", "Prednisolona", "Prednisona",
  // Cardiovascular
  "Acenocumarol", "Ácido acetilsalicílico", "Amiodarona", "Amlodipina", "Apixabano", "Atenolol", "Atorvastatina",
  "Bisoprolol", "Candesartan", "Captopril", "Carvedilol", "Clopidogrel", "Clorotalidona", "Dabigatrano",
  "Dapagliflozina", "Digoxina", "Diltiazem", "Dinitrato de isossorbida", "Doxazosina", "Edoxabano", "Empagliflozina",
  "Enalapril", "Enoxaparina", "Eplerenona", "Espironolactona", "Ezetimiba", "Fenofibrato", "Furosemida",
  "Hidroclorotiazida", "Indapamida", "Irbesartan", "Ivabradina", "Lercanidipina", "Lisinopril", "Losartan",
  "Metoprolol", "Mononitrato de isossorbida", "Nebivolol", "Nifedipina", "Nitroglicerina", "Olmesartan",
  "Perindopril", "Pravastatina", "Propranolol", "Ramipril", "Ranolazina", "Rivaroxabano", "Rosuvastatina",
  "Sacubitril + valsartan", "Sinvastatina", "Telmisartan", "Ticagrelor", "Torasemida", "Trimetazidina",
  "Valsartan", "Varfarina", "Verapamil",
  // Diabetes
  "Dulaglutido", "Gliclazida", "Glimepirida", "Insulina asparte", "Insulina degludec", "Insulina detemir",
  "Insulina glargina", "Insulina glulisina", "Insulina humana isofânica (NPH)", "Insulina humana regular",
  "Insulina lispro", "Linagliptina", "Liraglutido", "Metformina", "Metformina + sitagliptina",
  "Metformina + vildagliptina", "Pioglitazona", "Saxagliptina", "Semaglutido", "Sitagliptina", "Vildagliptina",
  // Dor
  "Buprenorfina", "Celecoxib", "Codeína", "Diclofenac", "Etoricoxib", "Fentanilo", "Hidromorfona", "Ibuprofeno",
  "Metadona", "Metamizol", "Morfina", "Naproxeno", "Oxicodona", "Oxicodona + naloxona", "Paracetamol",
  "Paracetamol + tramadol", "Tapentadol", "Tramadol",
  // Neurologia / psiquiatria
  "Alprazolam", "Amitriptilina", "Betaistina", "Bromazepam", "Bupropiom", "Carbamazepina", "Citalopram",
  "Clonazepam", "Diazepam", "Donepezilo", "Duloxetina", "Escitalopram", "Fluoxetina", "Gabapentina",
  "Galantamina", "Haloperidol", "Lamotrigina", "Levetiracetam", "Levodopa + benserazida", "Levodopa + carbidopa",
  "Levomepromazina", "Lorazepam", "Memantina", "Midazolam", "Mirtazapina", "Olanzapina", "Oxazepam",
  "Paroxetina", "Pramipexol", "Pregabalina", "Quetiapina", "Rasagilina", "Risperidona", "Rivastigmina",
  "Ropinirol", "Sertralina", "Tiaprida", "Trazodona", "Valproato de sódio", "Venlafaxina", "Vortioxetina", "Zolpidem",
  // Gastrointestinal
  "Bisacodilo", "Butilescopolamina", "Domperidona", "Esomeprazol", "Lactulose", "Lansoprazol", "Loperamida",
  "Macrogol", "Mesalazina", "Metoclopramida", "Omeprazol", "Ondansetrom", "Pantoprazol", "Picossulfato de sódio",
  "Senósidos", "Simeticona",
  // Urologia
  "Alfuzosina", "Dutasterida", "Finasterida", "Mirabegrom", "Oxibutinina", "Silodosina", "Solifenacina",
  "Tansulosina", "Tróspio",
  // Endócrino, osso, sangue, outros
  "Ácido alendrónico", "Ácido fólico", "Ácido risedrónico", "Alopurinol", "Calcifediol", "Carbonato de cálcio",
  "Carbonato de cálcio + colecalciferol", "Cianocobalamina", "Cloreto de potássio", "Colecalciferol", "Colquicina",
  "Denosumab", "Febuxostate", "Levotiroxina", "Magnésio", "Sulfato ferroso", "Tiamazol",
  // Anti-infeciosos
  "Amoxicilina", "Amoxicilina + ácido clavulânico", "Azitromicina", "Cefuroxima", "Ciprofloxacina",
  "Claritromicina", "Doxiciclina", "Fosfomicina", "Levofloxacina", "Nitrofurantoína",
  "Sulfametoxazol + trimetoprim",
  // Anti-histamínicos e oftálmicos
  "Cetirizina", "Desloratadina", "Hidroxizina", "Latanoprost (colírio)", "Timolol (colírio)"
];

var UNIDADES = ["mg", "g", "mcg", "mL", "UI", "gotas", "inalação(ões)", "comprimido(s)", "cápsula(s)",
  "saqueta(s)", "ampola(s)", "adesivo(s)", "aplicação(ões)", "L/min"];

var VIAS = ["Oral", "Sublingual", "Inalatória", "Nebulização", "Subcutânea", "Intramuscular", "Endovenosa",
  "Transdérmica", "Retal", "Tópica", "Oftálmica", "SNG / PEG"];

var HORARIOS = [
  ["jejum", "Jejum"], ["pa", "Pequeno-almoço"], ["almoco", "Almoço"], ["lanche", "Lanche"],
  ["jantar", "Jantar"], ["deitar", "Deitar"], ["sos", "SOS"]
];

/* CID-10 (OMS, revisão 2019). Seleção de diagnósticos frequentes em cuidados domiciliários.
   Mapeamento de apoio ao registo — não substitui a codificação clínica oficial. */
var CID10 = [
  // Respiratório
  ["J84.1", "Fibrose pulmonar (doença pulmonar intersticial com fibrose)"],
  ["J84.9", "Doença pulmonar intersticial, não especificada"],
  ["J44.9", "DPOC, não especificada"],
  ["J44.1", "DPOC com exacerbação aguda"],
  ["J45.9", "Asma, não especificada"],
  ["J47", "Bronquiectasias"],
  ["J96.1", "Insuficiência respiratória crónica"],
  ["J18.9", "Pneumonia, não especificada"],
  ["J69.0", "Pneumonia de aspiração"],
  ["G47.3", "Apneia do sono"],
  ["I27.2", "Hipertensão pulmonar secundária"],
  ["R06.0", "Dispneia"],
  ["C34.9", "Neoplasia maligna do brônquio ou pulmão"],
  // Cardiovascular
  ["I50.0", "Insuficiência cardíaca congestiva"],
  ["I50.1", "Insuficiência ventricular esquerda"],
  ["I50.9", "Insuficiência cardíaca, não especificada"],
  ["I10", "Hipertensão arterial essencial"],
  ["I11.0", "Cardiopatia hipertensiva com insuficiência cardíaca"],
  ["I48.9", "Fibrilhação / flutter auricular, não especificados"],
  ["I25.1", "Doença cardíaca aterosclerótica"],
  ["I25.2", "Enfarte do miocárdio antigo"],
  ["I20.9", "Angina de peito, não especificada"],
  ["I35.0", "Estenose aórtica"],
  ["I42.9", "Cardiomiopatia, não especificada"],
  ["Z95.0", "Portador de pacemaker cardíaco"],
  ["Z95.1", "Portador de bypass aortocoronário"],
  ["Z95.2", "Portador de prótese valvular cardíaca"],
  ["I63.9", "Enfarte cerebral (AVC isquémico), não especificado"],
  ["I61.9", "Hemorragia intracerebral, não especificada"],
  ["I64", "AVC, não especificado como hemorrágico ou isquémico"],
  ["I69.3", "Sequelas de enfarte cerebral"],
  ["G45.9", "Acidente isquémico transitório, não especificado"],
  ["I70.2", "Aterosclerose das artérias dos membros"],
  ["I73.9", "Doença vascular periférica, não especificada"],
  ["I87.2", "Insuficiência venosa crónica periférica"],
  ["I80.2", "Trombose venosa profunda dos membros inferiores"],
  ["I26.9", "Embolia pulmonar sem cor pulmonale agudo"],
  // Endócrino e metabólico
  ["E11.9", "Diabetes mellitus tipo 2 sem complicações"],
  ["E11.5", "Diabetes tipo 2 com complicações circulatórias periféricas (pé diabético)"],
  ["E11.7", "Diabetes tipo 2 com complicações múltiplas"],
  ["E10.9", "Diabetes mellitus tipo 1 sem complicações"],
  ["E78.0", "Hipercolesterolemia pura"],
  ["E78.5", "Hiperlipidemia, não especificada"],
  ["E03.9", "Hipotiroidismo, não especificado"],
  ["E05.9", "Tireotoxicose (hipertiroidismo), não especificada"],
  ["E66.9", "Obesidade, não especificada"],
  ["E46", "Desnutrição proteico-calórica, não especificada"],
  ["E86", "Desidratação (depleção de volume)"],
  ["E87.1", "Hiponatremia"],
  ["E55.9", "Défice de vitamina D, não especificado"],
  ["D64.9", "Anemia, não especificada"],
  ["D50.9", "Anemia por défice de ferro, não especificada"],
  // Renal e urológico
  ["N18.3", "Doença renal crónica, estádio 3"],
  ["N18.4", "Doença renal crónica, estádio 4"],
  ["N18.5", "Doença renal crónica, estádio 5"],
  ["N18.9", "Doença renal crónica, não especificada"],
  ["Z99.2", "Dependência de diálise renal"],
  ["N39.0", "Infeção do trato urinário, localização não especificada"],
  ["N40", "Hiperplasia da próstata"],
  ["R32", "Incontinência urinária, não especificada"],
  ["R33", "Retenção urinária"],
  ["C61", "Neoplasia maligna da próstata"],
  ["C67.9", "Neoplasia maligna da bexiga, não especificada"],
  // Neurológico e mental
  ["F03", "Demência, não especificada"],
  ["G30.9", "Doença de Alzheimer, não especificada"],
  ["F01.9", "Demência vascular, não especificada"],
  ["G20", "Doença de Parkinson"],
  ["G40.9", "Epilepsia, não especificada"],
  ["G35", "Esclerose múltipla"],
  ["G12.2", "Doença do neurónio motor (ELA)"],
  ["G81.9", "Hemiplegia, não especificada"],
  ["F05.9", "Delirium, não especificado"],
  ["F32.9", "Episódio depressivo, não especificado"],
  ["F41.9", "Perturbação de ansiedade, não especificada"],
  ["G47.0", "Insónia"],
  ["F10.2", "Dependência do álcool"],
  ["F17.2", "Dependência do tabaco"],
  // Órgãos dos sentidos
  ["H26.9", "Catarata, não especificada"],
  ["H40.9", "Glaucoma, não especificado"],
  ["H54.7", "Perda de visão, não especificada"],
  ["H91.9", "Hipoacusia, não especificada"],
  // Músculo-esquelético
  ["M81.9", "Osteoporose, não especificada"],
  ["M16.9", "Coxartrose, não especificada"],
  ["M17.9", "Gonartrose, não especificada"],
  ["M19.9", "Artrose, não especificada"],
  ["M06.9", "Artrite reumatoide, não especificada"],
  ["M10.9", "Gota, não especificada"],
  ["M54.5", "Lombalgia"],
  ["S72.0", "Fratura do colo do fémur"],
  ["Z96.6", "Portador de prótese articular ortopédica"],
  // Digestivo
  ["K21.9", "Doença de refluxo gastroesofágico sem esofagite"],
  ["K59.0", "Obstipação"],
  ["K57.3", "Doença diverticular do intestino grosso"],
  ["K74.6", "Cirrose hepática, outra e não especificada"],
  ["C16.9", "Neoplasia maligna do estômago, não especificada"],
  ["C18.9", "Neoplasia maligna do cólon, não especificada"],
  ["C25.9", "Neoplasia maligna do pâncreas, não especificada"],
  ["C50.9", "Neoplasia maligna da mama, não especificada"],
  ["C80.9", "Neoplasia maligna de localização primária não especificada"],
  // Pele
  ["L89.9", "Úlcera de pressão, não especificada"],
  ["L97", "Úlcera do membro inferior"],
  // Sintomas, estado funcional, dispositivos
  ["R13", "Disfagia"],
  ["R63.4", "Perda de peso anormal"],
  ["R15", "Incontinência fecal"],
  ["R26.8", "Alteração da marcha e da mobilidade"],
  ["R29.6", "Quedas repetidas"],
  ["R52.2", "Dor crónica"],
  ["Z74.0", "Mobilidade reduzida"],
  ["Z99.3", "Dependência de cadeira de rodas"],
  ["Z93.0", "Portador de traqueostomia"],
  ["Z93.1", "Portador de gastrostomia (PEG)"],
  ["Z51.5", "Cuidados paliativos"]
];

/* MIF — Medida de Independência Funcional (18 itens, níveis 1–7). */
var MIF_NIVEIS = [
  ["7", "7 · Independência completa"], ["6", "6 · Independência modificada"], ["5", "5 · Supervisão"],
  ["4", "4 · Ajuda mínima (≥75%)"], ["3", "3 · Ajuda moderada (≥50%)"], ["2", "2 · Ajuda máxima (≥25%)"],
  ["1", "1 · Ajuda total (<25%)"]
];
var MIF_ITENS = [
  ["Autocuidados", [["mif_alim", "Alimentação"], ["mif_hig", "Higiene pessoal"], ["mif_banho", "Banho"],
    ["mif_vest_sup", "Vestir metade superior"], ["mif_vest_inf", "Vestir metade inferior"], ["mif_sanita", "Utilização da sanita"]]],
  ["Controlo de esfíncteres", [["mif_bexiga", "Bexiga"], ["mif_intestino", "Intestino"]]],
  ["Transferências", [["mif_tr_cama", "Cama, cadeira, cadeira de rodas"], ["mif_tr_sanita", "Sanita"], ["mif_tr_banho", "Banheira / duche"]]],
  ["Locomoção", [["mif_marcha", "Marcha / cadeira de rodas"], ["mif_escadas", "Escadas"]]],
  ["Comunicação", [["mif_compr", "Compreensão"], ["mif_expr", "Expressão"]]],
  ["Cognição social", [["mif_social", "Interação social"], ["mif_problemas", "Resolução de problemas"], ["mif_memoria", "Memória"]]]
];
var MIF_COGNITIVOS = ["mif_compr", "mif_expr", "mif_social", "mif_problemas", "mif_memoria"];
// Faixas de interpretação do total (18–126)
var MIF_CLASSES = [[104, "Independência completa / modificada"], [61, "Dependência modificada (ajuda até 25%)"],
  [19, "Dependência modificada (ajuda até 50%)"], [18, "Dependência completa"]];

/* Escala de Morse (versão portuguesa). */
var MORSE_ITENS = [
  ["mo_hist", "Historial de quedas (últimos 3 meses)", [["0", "0 · Não"], ["25", "25 · Sim"]]],
  ["mo_diag", "Diagnóstico(s) secundário(s)", [["0", "0 · Não"], ["15", "15 · Sim"]]],
  ["mo_apoio", "Ajuda para caminhar", [["0", "0 · Nenhuma / acamado / apoio de profissional"],
    ["15", "15 · Canadianas / bengala / andarilho"], ["30", "30 · Apoia-se no mobiliário"]]],
  ["mo_ev", "Terapia endovenosa / cateter EV", [["0", "0 · Não"], ["20", "20 · Sim"]]],
  ["mo_marcha", "Postura no andar e na transferência", [["0", "0 · Normal / acamado / imóvel"],
    ["10", "10 · Debilitada"], ["20", "20 · Dependente de ajuda"]]],
  ["mo_mental", "Estado mental", [["0", "0 · Consciente das suas capacidades"],
    ["15", "15 · Esquece-se das suas limitações"]]]
];
var MORSE_CLASSES = [[51, "Alto risco de queda"], [25, "Baixo risco de queda"], [0, "Sem risco de queda"]];

/* Sinais vitais: [chave, rótulo, referência (texto), mínimo, máximo]. null = sem limite desse lado. */
var SINAIS = [
  ["ta", "Tensão arterial (mmHg)", "90–139 / 60–89", null, null],
  ["fc", "Frequência cardíaca (bpm)", "60–100", 60, 100],
  ["fr", "Frequência respiratória (cpm)", "12–20", 12, 20],
  ["spo2", "SpO₂ (%)", "≥ 94 · resp. crónica: 88–92 se prescrito", 92, null],
  ["o2", "O₂ no momento (L/min)", "conforme prescrição", null, null],
  ["temp", "Temperatura axilar (°C)", "35,5–37,5", 35.5, 37.5],
  ["dor", "Dor (0–10)", "0–3", null, 3],
  ["glic", "Glicemia capilar (mg/dL)", "70–180", 70, 180]
];
