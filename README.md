# hc-dom · HC Healthcare & Innovation

Ferramentas estáticas de cuidados domiciliários da HC, publicadas no GitHub Pages. Cada página é
um ficheiro HTML único: não recolhe, não envia e não guarda dados fora do browser de quem preenche.

| Página | Caminho |
|---|---|
| Índice | `/` → `index.html` |
| Avaliação inicial do utente | `/eval-hc-patient/` → `eval-hc-patient/index.html` |
| Avaliação inicial · centros de convívio UFMLO | `/ufmlo/` → `ufmlo/index.html` (fora do índice) |
| Índice de Barthel (isolado) | `/barthel/` → `barthel/index.html` |
| Escala de Morse (isolada) | `/morse/` → `morse/index.html` |
| Escala de Braden (isolada) | `/braden/` → `braden/index.html` |

## Estrutura

| Ficheiro | O que é |
|---|---|
| `src/index.src.html` | Índice do site |
| `src/shared/escalas.js` | **Fonte única** das escalas Barthel, Morse e Braden (itens, descrições, faixas), usada pelo formulário e pelas páginas isoladas |
| `src/escala/escala.src.html`, `src/escala/escala.js` | Modelo e motor das ferramentas de escala isolada; cada escala é uma configuração no `build.py` |
| `src/eval-hc-patient/form.src.html` | Estrutura e estilo do formulário. Marcadores `{{…}}` no lugar dos scripts, logótipo e fontes |
| `src/eval-hc-patient/dados.js` | Dados fixos: fármacos (DCI), CID-10, MIF, sinais vitais, unidades, vias, horários |
| `src/eval-hc-patient/app.js` | Lógica: identificação do utente, escalas, alertas, linhas repetíveis, regras dos focos, rascunho, impressão |
| `src/ufmlo/form.src.html`, `src/ufmlo/app.js` | Variante para os centros de convívio UFMLO. Usa o `dados.js` do formulário e as escalas partilhadas |
| `assets/` | Logótipo e fontes HC (derivados de `claude/design-md/hc/assets/` no hasp-HQ) |
| `build.py` | Gera todas as páginas (lista em `PAGINAS`) |
| `index.html`, `*/index.html` | **Gerados** — nunca editar à mão |

```
python3 build.py
```

Editar sempre em `src/`, correr o build e fazer commit dos ficheiros gerados juntamente com as fontes.

## Escalas isoladas (barthel/, morse/, braden/)

Cada escala tem uma página própria, para reavaliações rápidas sem abrir o formulário completo:
identificação curta (utente, SNS, data de nascimento com idade calculada, data, avaliador, contexto),
os itens com todas as opções descritas, o total e a classificação automáticos, a tabela de faixas
com a faixa atual destacada, observações e PDF. Em impressão, a Morse cabe numa folha A4 e a
Barthel ocupa duas.

Para acrescentar outra escala: definir os itens e as faixas em `src/shared/escalas.js` e juntar
uma entrada a `PAGINAS` no `build.py`.

## Variante UFMLO (ufmlo/)

Formulário de avaliação inicial para os três centros de convívio da União de Freguesias de
Lordelo do Ouro e Massarelos. Ao escolher o centro, a responsável e a morada preenchem-se
sozinhas (definidas em `CENTROS`, no topo de `src/ufmlo/app.js`). Tem 9 secções: identificação
da visita, antecedentes, medicação, escalas (mobilidade, Morse, Braden, pele, alimentação),
consciência/orientação/sono, sinais vitais (só TA, FC, FR, SpO₂ e temperatura), agravamento e
sinais de alerta, focos e fecho. Fica de fora o que é próprio do domicílio: seguimento clínico,
O₂/dor/glicemia na tabela de sinais, respiratório, Barthel, MIF,
cuidadores, mapa de necessidades, modelo de apoio e casa. O PDF sai como
`HC_Avaliacao-UFMLO_<data>_<iniciais>`. A página não está ligada no índice.

# Avaliação inicial do utente

## Conteúdo

Cabeçalho de identificação do utente (nome, n.º SNS, data de nascimento com idade calculada, NIF
com validação do dígito de controlo — repetido no topo de cada página impressa) e 16 secções:
identificação da visita, seguimento clínico, antecedentes e diagnósticos (CID-10), sinais vitais
(referência, habitual e na visita), respiratório e cardíaco, medicação habitual, funcionalidade e
risco (Barthel, MIF, Morse, PPS, pele, alimentação), cognição e noites, planeamento de cuidados,
cuidadores, mapa de necessidades, modelo de apoio, casa e logística, sinais de alerta, focos de
atenção de enfermagem e fecho.

O conteúdo comercial (preços, valor da consulta, condições de orçamento) fica fora de propósito:
a página é pública e o PDF pode ser visto pela família.

## Focos de atenção — regras fixas, sem IA

`src/eval-hc-patient/app.js → calcularFocos()` percorre o que foi preenchido e aplica regras escritas à mão. Por
exemplo: MIF banho ≤ 5 ou Barthel banho 0 dá "Autocuidado: tomar banho"; Morse ≥ 51 dá "Queda —
risco elevado"; 5 ou mais fármacos dá "Gestão do regime terapêutico"; código J84/J44/J96/I50 dá
"Dispneia". Cada sugestão mostra a fundamentação.

**Nada vai para o PDF sem validação do enfermeiro** (checkbox por foco). A regra só lembra; quem
decide é o enfermeiro. As articulações sugeridas (paliativos, médico assistente, medicação
parentérica, sinais fora do intervalo, equipamento em falta) seguem a mesma lógica.

Os rótulos inspiram-se na linguagem CIPE, mas não são uma implementação certificada da
classificação.

## Avisos de conteúdo clínico

- **CID-10:** a lista é da versão OMS 2019, escolhida à mão, e serve de apoio ao registo. Não
  substitui a codificação clínica oficial; a codificação hospitalar em Portugal usa a ICD-10-CM.
  Validar os códigos antes de qualquer uso administrativo.
- **MIF (FIM™):** instrumento com direitos da UDSMR. Para uso interno de avaliação clínica não há
  problema prático; antes de a incluir num produto comercial, confirmar o licenciamento.
- **Sinais vitais:** as referências são para adulto em repouso. Na doença respiratória crónica o
  alvo de SpO₂ pode ser 88–92 %, por isso o alerta abaixo de 92 % é um lembrete para confrontar com
  o alvo prescrito, não um diagnóstico.
- **Morse:** versão portuguesa, com os cortes 0–24 sem risco, 25–50 baixo e ≥ 51 alto.
- **Braden:** versão adulto da Orientação DGS n.º 017/2011 (Anexo I, tradução portuguesa de 2001),
  com o corte da DGS: ≤ 16 alto risco, ≥ 17 baixo. Só a página isolada, por agora. A DGS manda
  aplicá-la com o instrumento de avaliação da pele (Anexo II), que ainda não está feito.

## Privacidade (dados de saúde, RGPD art. 9.º)

- Sem servidor e sem envio: o formulário não submete nada e uma CSP (`default-src 'none'`,
  `form-action 'none'`) impede qualquer pedido de rede.
- O rascunho fica em `sessionStorage`. Sobrevive se a página recarregar e apaga-se quando o
  separador fecha ou quando se carrega em *Limpar*. Não usa `localStorage` de propósito.
- Os dados só saem pelo PDF, que se entrega pelo canal da HC.
- A página publicada não contém dados nenhuns. Mesmo assim leva `noindex`.

## Impressão / PDF

O botão *Imprimir / Guardar PDF* abre o diálogo do browser e sugere o nome de ficheiro
`HC_Avaliacao-Inicial_<data>_<iniciais>`. Na impressão:

- a medicação sai numa tabela, com fármaco e dose nas linhas e os horários em colunas;
- os diagnósticos saem numa tabela com o código CID-10, primeiro os ativos e depois os antecedentes;
- os sinais vitais fora do intervalo saem a laranja, com ↑/↓;
- os focos só aparecem se tiverem sido validados;
- o rodapé leva os dados legais e a numeração `n / total`. Funciona no Chrome e no Edge; noutros
  browsers o rodapé pode não aparecer;
- no diálogo de impressão, desligar "Cabeçalhos e rodapés" do browser e manter "Gráficos de fundo"
  ligado.

Testado em Chromium headless com dados fictícios: 7 páginas A4, sem erros de JavaScript.

## Publicar no GitHub Pages

Pages servido a partir da branch `gh-pages`, pasta raiz. O `.nojekyll` garante que os ficheiros
são servidos tal como estão.
