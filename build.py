#!/usr/bin/env python3
"""Constrói o site hc-dom: cada página sai como ficheiro HTML único e autossuficiente.

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

# (template, scripts embebidos como texto, saída)
PAGINAS = [
    (SRC / "index.src.html", {}, RAIZ / "index.html"),
    (
        SRC / "eval-hc-patient" / "form.src.html",
        {
            "{{DADOS_JS}}": SRC / "eval-hc-patient" / "dados.js",
            "{{APP_JS}}": SRC / "eval-hc-patient" / "app.js",
        },
        RAIZ / "eval-hc-patient" / "index.html",
    ),
]


def data_uri(caminho: pathlib.Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(caminho.read_bytes()).decode("ascii")


def construir(template: pathlib.Path, scripts: dict, saida: pathlib.Path) -> bool:
    html = template.read_text(encoding="utf-8")
    for marcador, caminho in scripts.items():
        js = caminho.read_text(encoding="utf-8")
        if "</script" in js.lower():
            print(f"erro: {caminho.name} contém '</script' e partiria o HTML", file=sys.stderr)
            return False
        html = html.replace(marcador, js)
    for marcador, (caminho, mime) in EMBEBER.items():
        if marcador in html:
            html = html.replace(marcador, data_uri(caminho, mime))
    if "{{" in html:
        print(f"erro: ficaram marcadores por substituir em {template.name}", file=sys.stderr)
        return False
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(html, encoding="utf-8")
    print(f"{saida.relative_to(RAIZ)} · {saida.stat().st_size / 1024:.0f} KB")
    return True


def main() -> int:
    ok = all([construir(*p) for p in PAGINAS])
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
