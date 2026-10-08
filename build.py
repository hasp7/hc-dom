#!/usr/bin/env python3
"""Constrói o site hc-dom: cada página sai como ficheiro HTML único e autossuficiente.

Páginas: índice, eval-hc-patient/, barthel/, morse/. As escalas vêm de src/shared/escalas.js.

Embebe scripts, logótipo e fontes (assets/) para que o site funcione igual no GitHub Pages,
offline ou enviado por email — sem nenhum pedido de rede. Sem dependências: só biblioteca padrão.

Uso:  python3 build.py
"""
import base64
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent
ASSETS = RAIZ / "assets"
SRC = RAIZ / "src"

# Derivados de claude/design-md/hc/assets/ (hasp-HQ). Se a marca mudar, recopiar de lá.
EMBEBER = {
    "{{LOGO_PNG}}": (ASSETS / "hc-logo-horizontal.png", "image/png"),
    "{{FONT_LATO_400}}": (ASSETS / "fonts" / "lato-400.woff2", "font/woff2"),
    "{{FONT_LATO_700}}": (ASSETS / "fonts" / "lato-700.woff2", "font/woff2"),
    "{{FONT_MONTSERRAT}}": (ASSETS / "fonts" / "montserrat-var.woff2", "font/woff2"),
}

ESCALAS_JS = SRC / "shared" / "escalas.js"

# Embebidos em todas as páginas que tenham o marcador (tema claro/escuro)
GLOBAIS = {
    "{{TEMA_CSS}}": SRC / "shared" / "tema.css",
    "{{TEMA_JS}}": SRC / "shared" / "tema.js",
}

FONTE_BARTHEL = ("Índice de Barthel: Mahoney FI, Barthel DW (1965). Faixas de interpretação: Shah S, Vanclay F, Cooper B (1989). "
                 "Instrumento de apoio à avaliação; a interpretação é sempre do profissional.")
FONTE_MORSE = ("Escala de Quedas de Morse: Morse JM, Morse RM, Tylko SJ (1989); versão portuguesa: Costa-Dias, Ferreira, Oliveira (2014). "
               "Instrumento de apoio à avaliação do risco; não dispensa o juízo clínico.")


def config_escala(chave, nome, itens, classes, faixas, fonte, info):
    return (f'var ESCALA = {{ chave: "{chave}", nome: "{nome}", itens: {itens}, classes: {classes}, '
            f'faixas: {faixas}, fonte: "{fonte}", info: {info} }};')


# Cada página: template, scripts embebidos (ficheiros), textos a substituir, saída
PAGINAS = [
    dict(template=SRC / "index.src.html", scripts={}, textos={}, saida=RAIZ / "index.html"),
    dict(
        template=SRC / "eval-hc-patient" / "form.src.html",
        scripts={
            "{{ESCALAS_JS}}": ESCALAS_JS,
            "{{DADOS_JS}}": SRC / "eval-hc-patient" / "dados.js",
            "{{APP_JS}}": SRC / "eval-hc-patient" / "app.js",
        },
        textos={},
        saida=RAIZ / "eval-hc-patient" / "index.html",
    ),
    dict(
        template=SRC / "escala" / "escala.src.html",
        scripts={"{{ESCALAS_JS}}": ESCALAS_JS, "{{ESCALA_JS}}": SRC / "escala" / "escala.js"},
        textos={
            "{{TITULO}}": "Índice de Barthel",
            "{{SUBTITULO}}": "Avaliação da independência nas atividades de vida diária",
            "{{CONFIG_JS}}": config_escala("barthel", "Barthel", "BARTHEL_ITENS", "BARTHEL_CLASSES",
                                           "BARTHEL_FAIXAS", FONTE_BARTHEL, "BARTHEL_INFO"),
        },
        saida=RAIZ / "barthel" / "index.html",
    ),
    dict(
        template=SRC / "escala" / "escala.src.html",
        scripts={"{{ESCALAS_JS}}": ESCALAS_JS, "{{ESCALA_JS}}": SRC / "escala" / "escala.js"},
        textos={
            "{{TITULO}}": "Escala de Morse",
            "{{SUBTITULO}}": "Avaliação do risco de queda",
            "{{CONFIG_JS}}": config_escala("morse", "Morse", "MORSE_ITENS", "MORSE_CLASSES",
                                           "MORSE_FAIXAS", FONTE_MORSE, "MORSE_INFO"),
        },
        saida=RAIZ / "morse" / "index.html",
    ),
    dict(
        template=SRC / "esc" / "esc.src.html",
        scripts={"{{ESC_ITENS_JS}}": SRC / "shared" / "esc-itens.js", "{{ESC_JS}}": SRC / "esc" / "esc.js"},
        textos={},
        saida=RAIZ / "esc-zarit" / "index.html",
    ),
]


def data_uri(caminho: pathlib.Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(caminho.read_bytes()).decode("ascii")


def construir(template: pathlib.Path, scripts: dict, textos: dict, saida: pathlib.Path) -> bool:
    html = template.read_text(encoding="utf-8")
    for marcador, texto in textos.items():
        html = html.replace(marcador, texto)
    for marcador, caminho in {**GLOBAIS, **scripts}.items():
        js = caminho.read_text(encoding="utf-8")
        if "</script" in js.lower():
            print(f"erro: {caminho.name} contém '</script' e partiria o HTML", file=sys.stderr)
            return False
        html = html.replace(marcador, js)
    for marcador, (caminho, mime) in EMBEBER.items():
        if marcador in html:
            html = html.replace(marcador, data_uri(caminho, mime))
    if "{{" in html:
        print(f"erro: ficaram marcadores por substituir em {saida.relative_to(RAIZ)}", file=sys.stderr)
        return False
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding="utf-8")
    print(f"{saida.relative_to(RAIZ)} · {saida.stat().st_size / 1024:.0f} KB")
    return True


def main() -> int:
    ok = all([construir(**p) for p in PAGINAS])
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
