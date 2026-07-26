@echo off
cd /d "%~dp0"
python -m pip install pymupdf pillow -q
python scripts\extract_covers.py
start "" "%~dp0index.html"
pause
