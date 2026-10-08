/* Definições das escalas — fonte única, partilhada pelo formulário de avaliação
   (eval-hc-patient) e pelas ferramentas isoladas (barthel/, morse/).
   Opção: [valor, rótulo curto, descrição]. Editar aqui e correr build.py. */
"use strict";

/* Índice de Barthel (Mahoney & Barthel, 1965). */
var BARTHEL_ITENS = [
  ["b_alim", "Alimentação", [
    ["10", "Independente", "Capaz de usar qualquer instrumento; come num tempo razoável"],
    ["5", "Precisa de ajuda", "Para cortar, barrar manteiga, etc."],
    ["0", "Dependente", ""]]],
  ["b_banho", "Banho", [
    ["5", "Independente", "Lava-se por completo, entra e sai do banho sem ajuda nem supervisão"],
    ["0", "Dependente", ""]]],
  ["b_hig", "Higiene pessoal", [
    ["5", "Independente", "Lava a cara e as mãos, penteia-se, lava os dentes, barbeia-se"],
    ["0", "Precisa de ajuda", ""]]],
  ["b_vestir", "Vestir", [
    ["10", "Independente", "Veste-se e despe-se, aperta botões, fechos e atacadores"],
    ["5", "Precisa de ajuda", "Faz pelo menos metade das tarefas num tempo razoável"],
    ["0", "Dependente", ""]]],
  ["b_int", "Intestino", [
    ["10", "Continente", "Sem acidentes; usa supositório ou enema sozinho se precisar"],
    ["5", "Acidente ocasional", "Ou precisa de ajuda com supositório / enema"],
    ["0", "Incontinente", ""]]],
  ["b_bex", "Bexiga", [
    ["10", "Continente", "Sem acidentes; gere a sonda sozinho, se a tiver"],
    ["5", "Acidente ocasional", "Máximo um episódio em 24 h, ou precisa de ajuda com a sonda"],
    ["0", "Incontinente", "Ou algaliado sem autonomia na gestão"]]],
  ["b_sanita", "Uso da sanita", [
    ["10", "Independente", "Usa a sanita ou a arrastadeira, limpa-se e compõe a roupa sozinho"],
    ["5", "Precisa de alguma ajuda", "Para o equilíbrio, para se vestir ou para se limpar"],
    ["0", "Dependente", ""]]],
  ["b_transf", "Transferências (cadeira ↔ cama)", [
    ["15", "Independente", ""],
    ["10", "Pequena ajuda", "Ajuda física mínima ou supervisão"],
    ["5", "Grande ajuda", "Precisa de uma pessoa forte ou treinada; consegue sentar-se"],
    ["0", "Dependente", "Precisa de grua ou de duas pessoas; não se senta"]]],
  ["b_deamb", "Deambulação", [
    ["15", "Independente", "Caminha 50 m sem ajuda nem supervisão (pode usar auxiliar, exceto andarilho)"],
    ["10", "Com ajuda de uma pessoa", "Ajuda física ou supervisão para caminhar 50 m"],
    ["5", "Independente em cadeira de rodas", "Desloca-se 50 m em cadeira de rodas sem ajuda"],
    ["0", "Imóvel", ""]]],
  ["b_escadas", "Escadas", [
    ["10", "Independente", "Sobe e desce sem ajuda nem supervisão"],
    ["5", "Precisa de ajuda", "Ajuda física ou supervisão"],
    ["0", "Incapaz", ""]]]
];
/* Faixas de interpretação do total (0–100), de Shah et al. (1989). */
var BARTHEL_CLASSES = [[100, "Independente"], [91, "Dependência ligeira"], [61, "Dependência moderada"],
  [21, "Dependência grave"], [0, "Dependência total"]];
var BARTHEL_FAIXAS = [["100", "Independente"], ["91–99", "Dependência ligeira"], ["61–90", "Dependência moderada"],
  ["21–60", "Dependência grave"], ["0–20", "Dependência total"]];

/* Escala de Quedas de Morse (Morse, Morse & Tylko, 1989). Redação da versão portuguesa validada:
   Costa-Dias, Ferreira & Oliveira (2014), Tabela 1. */
var MORSE_ITENS = [
  ["mo_hist", "Historial de quedas (neste internamento/urgência ou nos últimos três meses)", [
    ["0", "Não", ""],
    ["25", "Sim", ""]]],
  ["mo_diag", "Diagnóstico(s) secundário(s)", [
    ["0", "Não", ""],
    ["15", "Sim", "Mais do que um diagnóstico médico"]]],
  ["mo_apoio", "Ajuda para caminhar", [
    ["0", "Nenhuma / ajuda de enfermeiro / acamado / cadeira de rodas", ""],
    ["15", "Muletas / canadianas / bengala / andarilho", ""],
    ["30", "Apoia-se no mobiliário para andar", ""]]],
  ["mo_ev", "Terapia intravenosa", [
    ["0", "Não", ""],
    ["20", "Sim", ""]]],
  ["mo_marcha", "Postura no andar e na transferência", [
    ["0", "Normal / acamado / imóvel", ""],
    ["10", "Debilitado", "Passos curtos, pode arrastar os pés; mantém a cabeça erguida"],
    ["20", "Dependente de ajuda", "Dificuldade em levantar-se; cabeça baixa; apoia-se no mobiliário ou em pessoas"]]],
  ["mo_mental", "Estado mental", [
    ["0", "Consciente das suas capacidades", ""],
    ["15", "Esquece-se das suas limitações", ""]]]
];
var MORSE_CLASSES = [[51, "Alto risco de queda"], [25, "Baixo risco de queda"], [0, "Sem risco de queda"]];
var MORSE_FAIXAS = [["0–24", "Sem risco de queda"], ["25–50", "Baixo risco de queda"], ["≥ 51", "Alto risco de queda"]];

/* Descrição / Uso — texto de apoio por escala, a partir das fontes indicadas (verificadas em 2026-10-08). */
var BARTHEL_INFO = {
  descricao: "O Índice de Barthel (Mahoney & Barthel, 1965) mede o nível de independência em dez atividades básicas de vida diária: alimentação, banho, higiene pessoal, vestir, controlo intestinal, controlo vesical, uso da sanita, transferências, deambulação e escadas. Nesta versão (a original) a pontuação vai de 0 a 100, em intervalos de 5: 0 corresponde à dependência máxima e 100 à independência nas atividades avaliadas.",
  leitura: "O total distribui-se habitualmente em cinco faixas (Shah, Vanclay & Cooper, 1989, propostas para o índice modificado e usadas com frequência na versão original): 100 independente, 91–99 dependência ligeira, 61–90 moderada, 21–60 grave e 0–20 total. O valor 60 é apontado como ponto de viragem entre independência e dependência (Granger, citado por Araújo et al., 2007). Mais do que o total, contam as pontuações parciais: duas pessoas com o mesmo total podem precisar de cuidados diferentes, consoante as atividades em que estão dependentes.",
  uso: "Avaliação inicial e reavaliação periódica da dependência funcional, planeamento de cuidados e monitorização da evolução (a diferença entre duas avaliações indica melhoria ou agravamento). Regista o que a pessoa faz, não o que poderia fazer. É rápido de aplicar e pode ser respondido pela própria pessoa ou pelo cuidador principal; em Portugal foi validado em idosos a viver no domicílio, na versão de 0 a 20 (Araújo et al., 2007).",
  fontes: [
    "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Maryland State Medical Journal. 1965;14:61–65.",
    "Shah S, Vanclay F, Cooper B. Improving the sensitivity of the Barthel Index for stroke rehabilitation. J Clin Epidemiol. 1989;42(8):703–709. doi:10.1016/0895-4356(89)90065-6",
    "Araújo F, Ribeiro JLP, Oliveira A, Pinto C. Validação do Índice de Barthel numa amostra de idosos não institucionalizados. Revista Portuguesa de Saúde Pública. 2007;25(2):59–66. hdl:10216/15740"
  ]
};

var MORSE_INFO = {
  descricao: "A Escala de Quedas de Morse (Morse, Morse & Tylko, 1989) avalia o risco de queda a partir de seis itens: historial de quedas, diagnóstico secundário, ajuda para caminhar, terapia intravenosa, postura no andar e na transferência e estado mental. A pontuação vai de 0 a 125. Foi desenhada para ser aplicada por enfermeiros e tem versão portuguesa validada (Costa-Dias, Ferreira & Oliveira, 2014).",
  leitura: "Na versão portuguesa: sem risco 0–24, baixo risco 25–50, alto risco a partir de 51. No estudo original, a escala classificou corretamente 80,5% dos doentes (sensibilidade 78%, especificidade 83%). Os pontos de corte podem precisar de ajuste ao contexto em que a escala é usada.",
  uso: "Triagem rápida do risco de queda, para orientar medidas de prevenção. Aplica-se na avaliação inicial e repete-se quando o estado clínico muda, depois de uma queda e periodicamente. Foi desenvolvida e validada em internamento hospitalar: no domicílio, o item da terapia intravenosa raramente se aplica e os cortes não foram validados para este contexto, pelo que o resultado apoia, mas não substitui, o juízo clínico.",
  fontes: [
    "Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the fall-prone patient. Canadian Journal on Aging. 1989;8(4):366–377. doi:10.1017/S0714980800008576",
    "Costa-Dias MJM, Ferreira PL, Oliveira AS. Adaptação cultural e linguística e validação da Escala de Quedas de Morse. Revista de Enfermagem Referência. 2014;IV(2):7–17. doi:10.12707/RIII1382"
  ]
};
