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

/* Escala de Quedas de Morse (Morse, 1989), versão portuguesa. */
var MORSE_ITENS = [
  ["mo_hist", "Historial de quedas", [
    ["0", "Não", ""],
    ["25", "Sim", "Queda nos últimos 3 meses"]]],
  ["mo_diag", "Diagnóstico(s) secundário(s)", [
    ["0", "Não", ""],
    ["15", "Sim", "Mais do que um diagnóstico médico"]]],
  ["mo_apoio", "Ajuda para caminhar", [
    ["0", "Nenhuma / acamado / apoio de profissional", ""],
    ["15", "Canadianas / bengala / andarilho", ""],
    ["30", "Apoia-se no mobiliário para andar", ""]]],
  ["mo_ev", "Terapia endovenosa / cateter EV", [
    ["0", "Não", ""],
    ["20", "Sim", ""]]],
  ["mo_marcha", "Postura no andar e na transferência", [
    ["0", "Normal / acamado / imóvel", ""],
    ["10", "Debilitada", "Passos curtos, pode arrastar os pés; mantém a cabeça erguida"],
    ["20", "Dependente de ajuda", "Dificuldade em levantar-se; cabeça baixa; apoia-se no mobiliário ou em pessoas"]]],
  ["mo_mental", "Estado mental", [
    ["0", "Consciente das suas capacidades", ""],
    ["15", "Esquece-se das suas limitações", "Sobrestima as próprias capacidades"]]]
];
var MORSE_CLASSES = [[51, "Alto risco de queda"], [25, "Baixo risco de queda"], [0, "Sem risco de queda"]];
var MORSE_FAIXAS = [["0–24", "Sem risco de queda"], ["25–50", "Baixo risco de queda"], ["≥ 51", "Alto risco de queda"]];
