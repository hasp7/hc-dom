/* Escala de Sobrecarga do Cuidador (ESC) — versão portuguesa da Zarit Burden Interview
   (Sequeira, 2010). Instrumento original: Zarit, Reever & Bach-Peterson (1980).

   Uso autorizado: desenvolvimento visual e testes de usabilidade, sem fins comerciais.
   ⚠️ Os textos abaixo foram transcritos sem cópia do original à vista (ortografia atualizada).
   Antes de qualquer uso clínico, confirmar palavra a palavra contra a versão de Sequeira e
   passar ESC_TEXTO_VERIFICADO a true — até lá a página mostra um aviso. */
"use strict";

var ESC_MARCADOR = "[transcrever da versão licenciada]";
var ESC_TEXTO_VERIFICADO = false;

var ESC_ITENS = [
  "Sente que o seu familiar solicita mais ajuda do que aquela que realmente necessita?",
  "Considera que, devido ao tempo que dedica ao seu familiar, já não dispõe de tempo suficiente para as suas tarefas?",
  "Sente-se tenso(a) quando tem de cuidar do seu familiar e ainda tem outras tarefas por fazer?",
  "Sente-se envergonhado(a) pelo comportamento do seu familiar?",
  "Sente-se irritado(a) quando está junto do seu familiar?",
  "Considera que a situação atual afeta de uma forma negativa a sua relação com os seus amigos e familiares?",
  "Tem receio pelo futuro destinado ao seu familiar?",
  "Considera que o seu familiar está dependente de si?",
  "Sente-se esgotado(a) quando tem de estar junto do seu familiar?",
  "Vê a sua saúde ser afetada por ter de cuidar do seu familiar?",
  "Considera que não tem uma vida privada como desejaria devido ao seu familiar?",
  "Pensa que as suas relações sociais são afetadas negativamente por ter de cuidar do seu familiar?",
  "Sente-se pouco à vontade em convidar amigos para o(a) visitarem devido ao seu familiar?",
  "Acredita que o seu familiar espera que seja você a cuidar dele, como se fosse a única pessoa com quem ele pudesse contar?",
  "Considera que não dispõe de economias suficientes para cuidar do seu familiar e para o resto das despesas que tem?",
  "Sente-se incapaz de cuidar do seu familiar por muito mais tempo?",
  "Considera que perdeu o controlo da sua vida depois de a doença do seu familiar se manifestar?",
  "Desejaria poder entregar o seu familiar aos cuidados de outra pessoa?",
  "Sente-se inseguro(a) acerca do que deve fazer com o seu familiar?",
  "Sente que poderia fazer mais pelo seu familiar?",
  "Considera que poderia cuidar melhor do seu familiar?",
  "Em geral, sente-se muito sobrecarregado(a) por ter de cuidar do seu familiar?"
];

var ESC_OPCOES = [["1", "Nunca"], ["2", "Quase nunca"], ["3", "Às vezes"], ["4", "Muitas vezes"], ["5", "Quase sempre"]];

/* Pontos de corte de Sequeira (2010): < 46 sem sobrecarga; 46–56 ligeira; > 56 intensa. Total 22–110. */
var ESC_CLASSES = [[57, "Sobrecarga intensa", "c3"], [46, "Sobrecarga ligeira", "c2"], [22, "Sem sobrecarga", "c1"]];
var ESC_FAIXAS = [["22–45", "Sem sobrecarga"], ["46–56", "Sobrecarga ligeira"], ["57–110", "Sobrecarga intensa"]];
var ESC_LIMIAR = 4; // itens com 4 ou 5 ficam assinalados para orientar a conversa

/* Subescalas (fatores) de Sequeira (2010). Dimensões, alfas e correlações com o total confirmados no
   artigo original (Tabela 1); a correspondência item → fator vem de Viegas & Rodrigues (2022), que a
   reproduzem de Sequeira — o artigo de 2010 indica só o número de itens por fator.
   Sem pontos de corte próprios: NÃO aplicar os cortes da escala global às subescalas. */
var ESC_FATORES = [
  { id: "IPC", nome: "Impacto da prestação de cuidados", itens: [1, 2, 3, 6, 9, 10, 11, 12, 13, 17, 22], alfa: "0,93", rTotal: "0,962",
    dimensao: "Saúde, tempo disponível, vida social e familiar, desgaste físico e psicológico" },
  { id: "RI", nome: "Relação interpessoal", itens: [4, 5, 16, 18, 19], alfa: "0,83", rTotal: "0,833",
    dimensao: "Dificuldades relacionais e tensão emocional na interação com a pessoa cuidada" },
  { id: "EC", nome: "Expectativas face ao cuidar", itens: [7, 8, 14, 15], alfa: "0,67", rTotal: "0,690", prudencia: true,
    dimensao: "Receios, preocupações e expectativas sobre a continuidade e as exigências do cuidar" },
  { id: "PA", nome: "Perceção de autoeficácia", itens: [20, 21], alfa: "0,80", rTotal: "0,208",
    dimensao: "Perceção do cuidador sobre a qualidade e a suficiência dos cuidados que presta" }
];

/* Pistas para a conversa e o plano, por subescala. Orientação clínica de apoio — NÃO fazem parte da
   escala validada. Só as que o enfermeiro selecionar vão para o PDF. [id, texto] */
var ESC_PISTAS = {
  IPC: [
    ["p_ipc_descanso", "Explorar períodos de descanso do cuidador e quem o pode substituir (família, apoio domiciliário, descanso do cuidador)"],
    ["p_ipc_tarefas", "Rever a distribuição das tarefas de cuidado e o que pode ser assegurado pela equipa"],
    ["p_ipc_saude", "Perguntar pela saúde do próprio cuidador (sono, dor, consultas em atraso) e encaminhar se necessário"]
  ],
  RI: [
    ["p_ri_comport", "Explorar os comportamentos da pessoa cuidada que geram tensão e estratégias para lidar com eles"],
    ["p_ri_emocoes", "Validar emoções como irritação ou vergonha; ponderar apoio psicológico ou grupo de suporte"],
    ["p_ri_limites", "Conversar sobre limites e sobre a hipótese de partilhar ou transferir cuidados"]
  ],
  EC: [
    ["p_ec_info", "Dar informação sobre a doença, a evolução esperada e o plano de cuidados"],
    ["p_ec_social", "Encaminhar para o serviço social: apoios económicos e Estatuto do Cuidador Informal"],
    ["p_ec_futuro", "Planear com a família a continuidade dos cuidados e as alternativas"]
  ],
  PA: [
    ["p_pa_ensino", "Ensino e treino de cuidados (posicionamentos, transferências, higiene, medicação)"],
    ["p_pa_reforco", "Reconhecer e reforçar o que o cuidador já faz bem"],
    ["p_pa_reaval", "Reavaliar a perceção de autoeficácia depois do ensino"]
  ]
};

/* Âncoras da escala de resposta, para descrever a média por item em linguagem da própria escala. */
var ESC_ANCORAS = [[4.5, "quase sempre"], [3.5, "muitas vezes"], [2.5, "às vezes"], [1.5, "quase nunca"], [0, "nunca"]];

/* Descrição / Uso — a partir de Sequeira (2010), lido em texto integral, e de Zarit et al. (1980). */
var ESC_INFO = {
  descricao: "A Escala de Sobrecarga do Cuidador (ESC) é a versão portuguesa (Sequeira, 2010) da Zarit Burden Interview (Zarit, Reever & Bach-Peterson, 1980). Avalia a sobrecarga objetiva e subjetiva do cuidador informal em 22 itens sobre saúde, vida social, vida pessoal, situação financeira, situação emocional e tipo de relacionamento, cada um cotado de 1 (nunca) a 5 (quase sempre). Na validação portuguesa, com 184 cuidadores de idosos dependentes, mostrou boa consistência interna (alfa de Cronbach 0,93) e quatro fatores: impacto da prestação de cuidados (11 itens), relação interpessoal (5), expectativas face ao cuidar (4) e perceção de autoeficácia (2).",
  leitura: "O total varia entre 22 e 110 e, quanto mais alto, maior a perceção de sobrecarga. Pontos de corte: inferior a 46, sem sobrecarga; 46 a 56, sobrecarga ligeira; superior a 56, sobrecarga intensa. Os itens cotados com 4 ou 5 mostram onde a sobrecarga se concentra e ajudam a orientar a conversa e o plano. Na validação, os cuidadores de pessoas com demência apresentaram níveis de sobrecarga mais elevados. As quatro subescalas mostram de onde vem a sobrecarga e apresentam-se com a média por item (1 a 5), para comparar dimensões com números diferentes de itens; não têm pontos de corte próprios, e os da escala global não se lhes aplicam. O total depende sobretudo do impacto da prestação de cuidados (correlação 0,962) e quase nada da perceção de autoeficácia (0,208): um total baixo pode esconder um cuidador que sente que não cuida bem. A subescala das expectativas tem consistência interna mais baixa (alfa 0,67) e lê-se com prudência.",
  uso: "Cuidadores informais de pessoas dependentes, por causa física ou mental: identificar e monitorizar a sobrecarga, orientar a intervenção junto do cuidador e avaliar programas dirigidos a cuidadores. Aplica-se em entrevista, lendo cada afirmação ao cuidador. Repetida no tempo, a variação do total mostra a evolução. O autor da escala original autorizou a validação e o uso da versão portuguesa em investigação e na prática clínica.",
  fontes: [
    "Zarit SH, Reever KE, Bach-Peterson J. Relatives of the impaired elderly: correlates of feelings of burden. The Gerontologist. 1980;20(6):649–655. doi:10.1093/geront/20.6.649",
    "Sequeira CAC. Adaptação e validação da Escala de Sobrecarga do Cuidador de Zarit. Revista de Enfermagem Referência. 2010;II(12):9–16. (Sem DOI.)",
    "Viegas e Rodrigues (2022). Intervenção de enfermagem centrada no cuidador familiar em sobrecarga — correspondência entre itens e fatores reproduzida de Sequeira (fonte secundária; não consultada diretamente)."
  ]
};
