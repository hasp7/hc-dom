/* Definições das escalas — fonte única, partilhada pelo formulário de avaliação
   (eval-hc-patient) e pelas ferramentas isoladas (barthel/, morse/, braden/).
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

/* Escala de Braden — adulto (Bergstrom, Braden et al., 1987). Redação da versão portuguesa de 2001
   (Margato, Miguéns, Ferreira, Gouveia, Furtado; GAIF/CEISUC), transcrita do Anexo I da Orientação
   DGS n.º 017/2011, só com a ortografia atualizada (AO90). Opções pela ordem do original, de 1 a 4. */
var BRADEN_ITENS = [
  ["br_percecao", "Perceção sensorial (capacidade de reação significativa ao desconforto)", [
    ["1", "Completamente limitada", "Não reage a estímulos dolorosos (não geme, não se retrai nem se agarra a nada) devido a um nível reduzido de consciência ou à sedação, OU capacidade limitada de sentir a dor na maior parte do seu corpo."],
    ["2", "Muito limitada", "Reage unicamente a estímulos dolorosos. Não consegue comunicar o desconforto, exceto através de gemidos ou inquietação, OU tem uma limitação sensorial que lhe reduz a capacidade de sentir dor ou desconforto em mais de metade do corpo."],
    ["3", "Ligeiramente limitada", "Obedece a instruções verbais, mas nem sempre consegue comunicar o desconforto ou a necessidade de ser mudado de posição, OU tem alguma limitação sensorial que lhe reduz a capacidade de sentir dor ou desconforto em 1 ou 2 extremidades."],
    ["4", "Nenhuma limitação", "Obedece a instruções verbais. Não apresenta défice sensorial que possa limitar a capacidade de sentir ou exprimir dor ou desconforto."]]],
  ["br_humidade", "Humidade (nível de exposição da pele à humidade)", [
    ["1", "Pele constantemente húmida", "A pele mantém-se sempre húmida devido a sudorese, urina, etc. É detetada humidade sempre que o doente é deslocado ou virado."],
    ["2", "Pele muito húmida", "A pele está frequentemente, mas nem sempre, húmida. Os lençóis têm de ser mudados pelo menos uma vez por turno."],
    ["3", "Pele ocasionalmente húmida", "A pele está por vezes húmida, exigindo uma muda adicional de lençóis aproximadamente uma vez por dia."],
    ["4", "Pele raramente húmida", "A pele está geralmente seca; os lençóis só têm de ser mudados nos intervalos habituais."]]],
  ["br_atividade", "Atividade (nível de atividade física)", [
    ["1", "Acamado", "O doente está confinado à cama."],
    ["2", "Sentado", "Capacidade de marcha gravemente limitada ou inexistente. Não pode fazer carga e/ou tem de ser ajudado a sentar-se na cadeira normal ou de rodas."],
    ["3", "Anda ocasionalmente", "Por vezes caminha durante o dia, mas apenas curtas distâncias, com ou sem ajuda. Passa a maior parte dos turnos deitado ou sentado."],
    ["4", "Anda frequentemente", "Anda fora do quarto pelo menos duas vezes por dia, e dentro do quarto pelo menos de duas em duas horas durante o período em que está acordado."]]],
  ["br_mobilidade", "Mobilidade (capacidade de alterar e controlar a posição do corpo)", [
    ["1", "Completamente imobilizado", "Não faz qualquer movimento com o corpo ou extremidades sem ajuda."],
    ["2", "Muito limitada", "Ocasionalmente muda ligeiramente a posição do corpo ou das extremidades, mas não é capaz de fazer mudanças frequentes ou significativas sozinho."],
    ["3", "Ligeiramente limitado", "Faz pequenas e frequentes alterações de posição do corpo e das extremidades sem ajuda."],
    ["4", "Nenhuma limitação", "Faz grandes ou frequentes alterações de posição do corpo sem ajuda."]]],
  ["br_nutricao", "Nutrição (alimentação habitual)", [
    ["1", "Muito pobre", "Nunca come uma refeição completa. Raramente come mais de 1/3 da comida que lhe é oferecida. Come diariamente duas refeições, ou menos, de proteínas (carne ou lacticínios). Ingere poucos líquidos. Não toma um suplemento dietético líquido, OU está em jejum e/ou a dieta líquida ou a soros durante mais de cinco dias."],
    ["2", "Provavelmente inadequada", "Raramente come uma refeição completa e geralmente come apenas cerca de 1/2 da comida que lhe é oferecida. A ingestão de proteínas consiste unicamente em três refeições diárias de carne ou lacticínios. Ocasionalmente toma um suplemento dietético, OU recebe menos do que a quantidade ideal de líquidos ou alimentos por sonda."],
    ["3", "Adequada", "Come mais de metade da maior parte das refeições. Faz quatro refeições diárias de proteínas (carne, peixe, lacticínios). Por vezes recusa uma refeição, mas toma geralmente um suplemento caso lhe seja oferecido, OU é alimentado por sonda ou num regime de nutrição parentérica total satisfazendo provavelmente a maior parte das necessidades nutricionais."],
    ["4", "Excelente", "Come a maior parte das refeições na íntegra. Nunca recusa uma refeição. Faz geralmente um total de quatro ou mais refeições (carne, peixe, lacticínios). Come ocasionalmente entre as refeições. Não requer suplementos."]]],
  ["br_friccao", "Fricção e forças de deslizamento", [
    ["1", "Problema", "Requer uma ajuda moderada a máxima para se movimentar. É impossível levantar o doente completamente sem deslizar contra os lençóis. Descai frequentemente na cama ou cadeira, exigindo um reposicionamento constante com ajuda máxima. Espasticidade, contraturas ou agitação leva a fricção quase constante."],
    ["2", "Problema potencial", "Movimenta-se com alguma dificuldade ou requer uma ajuda mínima. É provável que, durante uma movimentação, a pele deslize de alguma forma contra os lençóis, cadeira, apoios ou outros dispositivos. A maior parte do tempo, mantém uma posição relativamente boa na cama ou na cadeira, mas ocasionalmente descai."],
    ["3", "Nenhum problema", "Move-se na cama e na cadeira sem ajuda e tem força muscular suficiente para se levantar completamente durante uma mudança de posição. Mantém uma correta posição na cama ou cadeira."]]]
];
/* Corte da DGS (Orientação 017/2011, Critérios 3 e Anexo IV): ≤ 16 alto risco, ≥ 17 baixo risco. */
var BRADEN_CLASSES = [[17, "Baixo risco de úlcera de pressão"], [0, "Alto risco de úlcera de pressão"]];
var BRADEN_FAIXAS = [["6–16", "Alto risco de úlcera de pressão"], ["17–23", "Baixo risco de úlcera de pressão"]];

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

/* Fontes verificadas em 2026-10-21: PDF oficial da Orientação DGS 017/2011, ficha RIMAS/CEISUC, DOIs na Crossref. */
var BRADEN_INFO = {
  descricao: "A Escala de Braden (Bergstrom, Braden et al., 1987) avalia o risco de desenvolver úlceras de pressão a partir de seis subescalas: perceção sensorial, humidade, atividade, mobilidade, nutrição e fricção e forças de deslizamento. Cada subescala vale de 1 a 4 (a fricção, de 1 a 3) e o valor mais baixo corresponde ao maior risco; o total vai de 6 a 23. Esta é a versão para adultos, na tradução portuguesa de 2001 adotada pela Direção-Geral da Saúde (Orientação n.º 017/2011), que a indica, com o instrumento de avaliação da pele, como os instrumentos validados em Portugal para avaliar o risco no adulto.",
  leitura: "Corte da DGS: alto risco com total ≤ 16, baixo risco com total ≥ 17. No estudo original, com o corte de 16, a sensibilidade foi de 100% e a especificidade de 64% a 90%; num estudo multicêntrico posterior, em hospitais e lares, o corte com melhor previsão foi 18 (Bergstrom et al., 1998), por isso um total de 17 ou 18 não é motivo para tranquilizar. A DGS recomenda analisar cada subescala individualmente e planear uma intervenção para cada uma que esteja baixa, e lembra que baixo risco não significa ausência de risco. Na validação portuguesa, a concordância entre observadores foi mais fraca na nutrição e mais forte na mobilidade.",
  uso: "Segundo a DGS, a avaliação do risco faz-se em todos os contextos de cuidados; no domicílio, na primeira visita domiciliária, com reavaliação semanal nos cuidados domiciliários e sempre que o estado clínico muda. Aplica-se a maiores de 18 anos (abaixo dessa idade usa-se a Braden Q). Deve ser acompanhada do instrumento de avaliação da pele, de preferência durante a higiene ou os cuidados à pele, e o resultado regista-se no processo clínico. A avaliação clínica complementa-a obrigatoriamente. A DGS exclui da aplicação as situações de ambulatório sem permanência prevista de 24 h ou mais (salvo mudança do estado clínico), os portadores de doença mental e as situações com risco de automutilação.",
  fontes: [
    "Direção-Geral da Saúde. Orientação n.º 017/2011, de 19/05/2011 — Escala de Braden: versão adulto e pediátrica (Braden Q). Lisboa: DGS; 2011. Anexo I: versão portuguesa de 2001 (Margato C, Miguéns C, Ferreira P, Gouveia J, Furtado K; GAIF e CEISUC).",
    "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for predicting pressure sore risk. Nursing Research. 1987;36(4):205–210. doi:10.1097/00006199-198707000-00002",
    "Bergstrom N, Braden B, Kemp M, Champagne M, Ruby E. Predicting pressure ulcer risk: a multisite study of the predictive validity of the Braden Scale. Nursing Research. 1998;47(5):261–269. doi:10.1097/00006199-199809000-00005",
    "Ferreira PL, Miguéns C, Gouveia J, Furtado K. Risco de desenvolvimento de úlceras de pressão: implementação nacional da Escala de Braden. Loures: Lusodidacta; 2007. (Validação portuguesa; não consultada diretamente — dados citados pela DGS e pela ficha do instrumento no RIMAS/CEISUC, Universidade de Coimbra.)"
  ]
};
