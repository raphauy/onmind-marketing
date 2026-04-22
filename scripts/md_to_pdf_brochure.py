#!/usr/bin/env python3
"""
Variante de md_to_pdf.py para brochures. Mismo look visual que la guia de marca
(tamanos, margenes, H2 teal con border-bottom, blockquotes tipo callout),
pero sin paginacion al pie.

Uso:
    python3 scripts/md_to_pdf_brochure.py docs/presentacion/onmind-brochure-argentina-2026-04-22.md
"""

import shutil
import sys
from pathlib import Path

try:
    import markdown2
    from weasyprint import HTML, CSS
    from weasyprint.text.fonts import FontConfiguration
except ImportError:
    print("Error: Faltan dependencias. Ejecuta:")
    print("  pip install markdown2 weasyprint")
    sys.exit(1)


CSS_STYLES = """
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
}
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
}
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-MediumItalic.ttf') format('truetype');
    font-weight: 500;
    font-style: italic;
}
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
}
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
}
@font-face {
    font-family: 'Geist';
    src: url('file:///home/raphael/desarrollo/onmind-marketing/public/fonts/Geist-Black.ttf') format('truetype');
    font-weight: 800;
    font-style: normal;
}

@page {
    size: A4;
    margin: 1.4cm 2cm;
}

body {
    font-family: 'Geist', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333;
}

h1 {
    font-size: 24pt;
    color: #1a1a1a;
    padding-bottom: 10px;
    margin-top: 0;
}

h2 {
    font-size: 16pt;
    color: #007056;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-top: 22px;
    page-break-after: avoid;
}

h3 {
    font-size: 13pt;
    color: #004A37;
    margin-top: 20px;
    page-break-after: avoid;
}

h4 {
    font-size: 11pt;
    color: #374151;
    margin-top: 15px;
    page-break-after: avoid;
}

p {
    margin: 8px 0;
    text-align: justify;
}

ul, ol {
    margin: 8px 0;
    padding-left: 22px;
}

li {
    margin: 4px 0;
    page-break-inside: avoid;
}

strong {
    color: #1f2937;
}

em {
    font-style: italic;
}

a {
    color: #007056;
    text-decoration: none;
    font-weight: 600;
}

hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 30px 0;
}

blockquote {
    background-color: #f8fafc;
    border-left: 4px solid #007056;
    padding: 10px 15px;
    margin: 15px 0;
    color: #555;
}

blockquote p {
    margin: 5px 0;
}

h2 + *, h3 + *, h4 + * {
    page-break-before: avoid;
}
"""


def convert(input_path: str, output_path: str = None) -> str:
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"No se encontro el archivo: {input_path}")

    if output_path is None:
        output_path = input_file.with_suffix('.pdf')

    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"Leyendo: {input_file}")
    md_content = input_file.read_text(encoding='utf-8')

    print("Convirtiendo Markdown a HTML...")
    html_content = markdown2.markdown(
        md_content,
        extras=['tables', 'fenced-code-blocks', 'header-ids', 'cuddled-lists', 'break-on-newline']
    )

    full_html = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>OnMind</title></head>
<body>
{html_content}
</body></html>"""

    print(f"Generando PDF: {output_file}")
    font_config = FontConfiguration()
    HTML(string=full_html).write_pdf(
        output_file,
        stylesheets=[CSS(string=CSS_STYLES, font_config=font_config)],
        font_config=font_config,
    )
    print(f"OK: {output_file}")

    # Sincronizar copia publica para el link compartible
    if "docs/presentacion/" in str(output_file):
        public_target = Path("public/presentacion") / output_file.name
        public_target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(output_file, public_target)
        print(f"Copia publica: {public_target}")

    return str(output_file)


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 scripts/md_to_pdf_brochure.py <archivo.md> [salida.pdf]")
        sys.exit(1)
    try:
        convert(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
