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
/* Classificação portuguesa: cortes de Martins (2004), usados na validação de Araújo et al. (2007)
   na versão 0–20 (Wade & Collin: cada nível 0/5/10/15 corresponde a 0/1/2/3).
   Os valores guardam-se sempre em 0–100; a apresentação em 0–20 divide por BARTHEL_DIVISOR.
   Limiares abaixo em 0–100: 0–40 total, 45–60 grave, 65–95 moderada, 100 independência total. */
var BARTHEL_DIVISOR = 5;
var BARTHEL_CLASSES = [[100, "Independência total"], [65, "Dependência moderada"], [45, "Dependência grave"],
  [0, "Dependência total"]];
/* [faixa 0–20, faixa 0–100, classificação] */
var BARTHEL_FAIXAS = [["20", "100", "Independência total"], ["13–19", "65–95", "Dependência moderada"],
  ["9–12", "45–60", "Dependência grave"], ["0–8", "0–40", "Dependência total"]];

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
  descricao: "O Índice de Barthel (Mahoney & Barthel, 1965) mede o nível de independência em dez atividades básicas de vida diária: alimentação, banho, higiene pessoal, vestir, controlo intestinal, controlo vesical, uso da sanita, transferências, deambulação e escadas. Esta página usa a pontuação de 0 a 20 (Wade & Collin, 1988), a da validação portuguesa, em que cada nível vale 0, 1, 2 ou 3; o interruptor mostra a mesma avaliação na escala original de 0 a 100 (multiplicar por 5). 0 corresponde à dependência máxima e o máximo à independência nas atividades avaliadas.",
  leitura: "Classificação usada na validação portuguesa (Araújo et al., 2007, com os cortes de Martins, 2004): 0–8 dependência total, 9–12 grave, 13–19 moderada e 20 independência total (em 0–100: 0–40, 45–60, 65–95 e 100). Não há faixa de dependência ligeira: qualquer dependência abaixo do máximo conta como moderada ou pior. Os cortes foram propostos num estudo com doentes com AVC e adotados no estudo português para comparação; a validação portuguesa demonstrou a fiabilidade da escala (alfa de Cronbach 0,96), não derivou novos cortes. O valor 60 em 0–100 (12 em 0–20) é apontado como ponto de viragem entre independência e dependência (Granger, citado por Araújo et al., 2007). Mais do que o total, contam as pontuações parciais: duas pessoas com o mesmo total podem precisar de cuidados diferentes.",
  uso: "Avaliação inicial e reavaliação periódica da dependência funcional, planeamento de cuidados e monitorização da evolução (a diferença entre duas avaliações indica melhoria ou agravamento). Regista o que a pessoa faz, não o que poderia fazer. É rápido de aplicar e pode ser respondido pela própria pessoa ou pelo cuidador principal; em Portugal foi validado em idosos a viver no domicílio, na versão de 0 a 20 (Araújo et al., 2007).",
  fontes: [
    "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Maryland State Medical Journal. 1965;14:61–65.",
    "Wade DT, Collin C. The Barthel ADL Index: a standard measure of physical disability? International Disability Studies. 1988;10(2):64–67.",
    "Araújo F, Ribeiro JLP, Oliveira A, Pinto C. Validação do Índice de Barthel numa amostra de idosos não institucionalizados. Revista Portuguesa de Saúde Pública. 2007;25(2):59–66. hdl:10216/15740",
    "Martins AT. Dependência funcional, qualidade de vida pós AVC e sobrecarga física, emocional e social do cuidador informal. Tese de doutoramento, Faculdade de Psicologia, Porto; 2004. (Origem dos pontos de corte, citada por Araújo et al., 2007; não consultada diretamente.)"
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
