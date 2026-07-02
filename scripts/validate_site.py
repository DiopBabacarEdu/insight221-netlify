#!/usr/bin/env python3
"""Vérifie les éléments critiques du site Insight 221 avant un déploiement."""
from pathlib import Path
from html.parser import HTMLParser
import json, re, sys, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
errors = []

required = ["index.html", "robots.txt", "sitemap.xml", "feed.xml", "site.webmanifest", "_headers", "assets/style.css", "assets/site.js", "assets/search-index.json"]
for rel in required:
    if not (DIST / rel).exists():
        errors.append(f"Fichier manquant : {rel}")

pages = list(DIST.rglob("index.html"))
for page in pages:
    source = page.read_text(encoding="utf-8")
    rel = page.relative_to(DIST)
    for token in ('<meta name="description"', '<link rel="canonical"', '<meta property="og:title"', '<script type="application/ld+json">'):
        if token not in source:
            errors.append(f"{rel}: élément SEO manquant ({token})")
    for src in re.findall(r'(?:src|href)="(/assets/[^"]+)"', source):
        if not (DIST / src.lstrip("/")).exists():
            errors.append(f"{rel}: ressource absente {src}")

try:
    ET.parse(DIST / "sitemap.xml")
except Exception as exc:
    errors.append(f"Sitemap XML invalide : {exc}")

try:
    json.loads((DIST / "assets/search-index.json").read_text(encoding="utf-8"))
except Exception as exc:
    errors.append(f"Index de recherche invalide : {exc}")

if errors:
    print("ÉCHEC")
    print("\n".join(f"- {item}" for item in errors))
    sys.exit(1)

print(f"OK — {len(pages)} pages HTML, sitemap valide, métadonnées et ressources vérifiées.")
