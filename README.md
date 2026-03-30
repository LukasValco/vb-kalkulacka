# VB kalkulačka (E.ON)

Jednoduchá webová aplikace pro porovnání `Virtuální baterie` a `Virtuální baterie+` podle SSOT metodiky.

## Co umí

- Výpočet ročního přínosu podle vzorce:
  - `R = (E_zpet * C_sil) + (12 * P_bilance) - 1200`
- Porovnání variant:
  - `Virtuální baterie (klasik)`
  - `Virtuální baterie+`
- `Čistý výkup (bez VB)`
- Uživatelské vstupy přes posuvníky:
  - roční přetok do sítě
  - cena silové energie
  - cena výkupu
- Automatické přiřazení pásma podle přetoku.
- Automatické vyhodnocení nejvýhodnější varianty.
- Přehled klíčových rozdílů produktů v tabulce.

## Spuštění lokálně

1. Otevřete soubor `index.html` v prohlížeči.
2. Nebo spusťte jednoduchý statický server (doporučeno).

## Online nasazení

Protože jde o statický web (`HTML/CSS/JS`), můžete nasadit přes:

- GitHub Pages
- Netlify
- Vercel (static)

Stačí nahrát obsah složky `vb-kalkulacka`.
