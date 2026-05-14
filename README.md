# Fertilizer Application Rate Calculator

A web-based calculator for determining fertilizer application rates per application area in greenhouse and field experiments. Built for **Dr. Haydee Laza's Lab** at the Texas Tech University Department of Plant and Soil Science.

Live at → **[egrow-calculator.vercel.app](https://egrow-calculator.vercel.app)**

---

## Overview

This tool replaces a manual Excel spreadsheet workflow. Given a target nitrogen application rate and fertilizer-specific properties, it calculates the exact volume or mass of fertilizer to apply per application area — with a full step-by-step breakdown of every intermediate value.

Results update live as you type.

---

## Calculators

### Inorganic (UAN 32-0-0)
Liquid nitrogen fertilizer. Calculates the volume of diluted UAN solution to apply per application area (mL).

**Inputs:** Target N application rate, full or split application fraction, fertilizer N content (lb/gal), dilution factor, fertilizer application area

### Biosolids
Solid organic fertilizer. Calculates the mass of biosolid material per application area (g), accounting for N content and Year 1 mineralization rate.

**Inputs:** Target N application rate, fertilizer N content (%), mineralization rate (%), biosolid fraction (%), full or split application fraction, fertilizer application area

### E-GROW Slurry
Liquid organic slurry. Calculates application volume per application area (mL) by partitioning N into an immediately available ammonia fraction and a slower-release mineralized biosolid fraction.

**Inputs:** Target N application rate, total slurry N (Kjeldahl, mg/L), ammonia content (mg/L), mineralization rate (%), N content of biosolid fraction (%), fertilizer application area

---

## Features

- **Unit flexibility** — switch between Acre (lb/acre, sq ft) and Hectare (kg/ha, sq m); inputs convert automatically
- **Soil nutrient baseline** — record pre-application soil N values (total N, N-organic, N-inorganic) for each experiment
- **Live calculation** — results update on every keystroke
- **Step-by-step breakdown** — every intermediate value shown with its formula
- **Input validation** — fields highlight on invalid input with a descriptive error message
- **Reset to defaults** — one click restores all default values per tab
- **Responsive** — works on desktop and mobile
- **Print-friendly** — all three panels render cleanly via Ctrl+P
- **TTU branding** — styled with official Texas Tech red/black color theme, Inter typography, and the official Double T logo

---

## File Structure

```
├── index.html      # Page structure and markup
├── styles.css      # All styling (layout, components, print, responsive)
├── app.js          # Calculations, validation, and UI logic
└── DoubleT.png     # Official Texas Tech University Double T logo
```

---

## Credits

Developed for **Dr. Haydee Laza's Lab**
Texas Tech University — Department of Plant and Soil Science
