"""Extract portfolio cover images from project PDFs."""
from pathlib import Path

import fitz

BASE = Path(__file__).resolve().parents[1]
# Fonte fica FORA do repositório Git (arquivos confidenciais de clientes,
# não devem ser versionados nem publicados no GitHub).
SRC = BASE.parent / "ARQUIVOS PARA PORTIFOLIO"
OUT = BASE / "assets" / "projects"
DPI = 180
ZOOM = DPI / 72

# project_id -> (pdf path relative to SRC, page index 0-based)
PROJECTS = {
    "innova-spk": (
        Path("SPRINKLER - MASTER'S INNOVA") / "02.pdf",
        0,
    ),
    "hpn-horizonte": (
        Path("CONSTRUTORA CAPITAL") / "HORIZONTE PONTA NEGRA" / "DRML-029-24-HPN-ELE-CANT-R00-ENG_Viv.pdf",
        0,
    ),
    "moto-honda-se69": (
        Path("CANALETAS - MASTER'S HONDA") / "PR.146.24-SE69-CANALETAS_METALICAS_02.R00.pdf",
        0,
    ),
    "uea-esa": (
        Path("HIDRAULICA - UEA ESA") / "PROJETO UEA ESA - Folha - 02 - HID - UEA - ESA.pdf",
        0,
    ),
    "altos-do-aleixo-eletrica": (
        Path("CONSTRUTORA CAPITAL") / "ALTOS DO ALEIXO" / "DRML-008-25-ALT-001-ELE-CANT-R00.pdf",
        0,
    ),
    "altos-do-aleixo-hidraulica": (
        Path("CONSTRUTORA CAPITAL") / "ALTOS DO ALEIXO" / "DRML-008-25-ALT-001-HID-CANT-R00.pdf",
        0,
    ),
}

# Extra gallery pages: project_id -> list of (pdf, page)
GALLERY = {
    "innova-spk": [
        (Path("SPRINKLER - MASTER'S INNOVA") / "01.pdf", 0),
        (Path("SPRINKLER - MASTER'S INNOVA") / "03.pdf", 0),
    ],
    "hpn-horizonte": [
        (Path("CONSTRUTORA CAPITAL") / "HORIZONTE PONTA NEGRA" / "DRML-029-24-HPN-003-HID-CANT-R00.pdf", 0),
        (Path("CONSTRUTORA CAPITAL") / "HORIZONTE PONTA NEGRA" / "DRML-029-24-HPN-002-ESG-CANT-R00.pdf", 0),
    ],
    "moto-honda-se69": [
        (Path("CANALETAS - MASTER'S HONDA") / "PR.146.24-SE69-CANALETAS_METALICAS_01.R00.pdf", 0),
    ],
    "uea-esa": [
        (Path("HIDRAULICA - UEA ESA") / "PROJETO UEA ESA - Folha - 01 - ESG - UEA - ESA.pdf", 0),
    ],
}


def render_page(pdf_path: Path, page_index: int, out_path: Path) -> None:
    doc = fitz.open(pdf_path)
    if page_index >= len(doc):
        page_index = 0
    page = doc[page_index]
    matrix = fitz.Matrix(ZOOM, ZOOM)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(str(out_path))
    doc.close()
    print(f"  OK {out_path.name} ({pix.width}x{pix.height})")


def main() -> None:
    print("Extracting cover images...")
    for project_id, (rel_path, page) in PROJECTS.items():
        pdf = SRC / rel_path
        if not pdf.exists():
            print(f"  SKIP {project_id}: missing {pdf}")
            continue
        out = OUT / project_id / "cover.jpg"
        print(f"{project_id} <- {rel_path.name}")
        render_page(pdf, page, out)

    print("\nExtracting gallery images...")
    for project_id, items in GALLERY.items():
        for i, (rel_path, page) in enumerate(items, start=1):
            pdf = SRC / rel_path
            if not pdf.exists():
                continue
            out = OUT / project_id / f"{i:02d}.jpg"
            print(f"{project_id} gallery {i} <- {rel_path.name}")
            render_page(pdf, page, out)

    print("\nDone.")


if __name__ == "__main__":
    main()
