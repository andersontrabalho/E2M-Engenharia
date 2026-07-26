# Anderson Drumond — MEP Portfolio · E2M Engenharia

Site estático HTML/CSS/JS — **EN · PT · ES** (botões no topo). Marca visual: E2M — Elétrica, Montagem e Mecânica.

## Preview local

```powershell
cd "d:\PROJETOS COM CLAUDE\01-PORFÓLIO\portfolio-anderson"
python -m http.server 8080
```

Abra: http://localhost:8080

## Imagens dos projetos

As capas foram extraídas automaticamente dos PDFs originais dos clientes.

**Importante:** os PDFs de origem (`ARQUIVOS PARA PORTIFOLIO/`) ficam **fora** deste repositório, na pasta acima (`01-PORFÓLIO/ARQUIVOS PARA PORTIFOLIO/`). Eles são confidenciais e não devem ser versionados nem publicados no GitHub — só as imagens já recortadas em `assets/projects/` entram no site.

Para regenerar as capas após trocar PDFs:

```powershell
python scripts/extract_covers.py
```

| Pasta | PDF origem |
|-------|-----------|
| `innova-spk/` | SPRINKLER — 02.pdf (+ galeria 01, 03) |
| `hpn-horizonte/` | HPN — ELE Viv (+ HID, ESG) |
| `moto-honda-se69/` | CANALETAS 02 (+ 01) |
| `uea-esa/` | UEA HID Folha 02 (+ ESG Folha 01) |
| `altos-do-aleixo-eletrica/` | ALT ELE-001 |
| `altos-do-aleixo-hidraulica/` | ALT HID-001 |

Clique em qualquer projeto no site para ver a galeria ampliada.

## Contato

O formulário de contato foi substituído por um botão direto de WhatsApp (`js/i18n.js`, chaves `form.whatsapp*`). Não usa mais Formspree.

## GitHub Pages

Publicação feita via GitHub Desktop (não linha de comando). Repositório remoto:
`https://github.com/andersontrabalho/andersontrabalho-E2M-Engenharia`

Site publicado: `https://andersontrabalho.github.io/andersontrabalho-E2M-Engenharia/`

Settings → Pages → branch `master` / root.

## Estrutura

```
index.html          — site principal
cv.html             — CV (Print → PDF)
css/style.css       — estilos (paleta dourado/preto E2M)
js/main.js          — idioma, filtros, imagens, modal
js/i18n.js          — textos EN/PT/ES
assets/brand/       — logo E2M (mark + versão completa)
assets/projects/    — imagens já recortadas dos projetos (públicas)
scripts/extract_covers.py — gera as imagens acima a partir dos PDFs de origem
```
