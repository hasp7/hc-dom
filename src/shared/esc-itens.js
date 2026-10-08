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
