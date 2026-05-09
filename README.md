# Fertilizer Application Rate Calculator

A web-based calculator for determining fertilizer application rates per cone in greenhouse and field experiments. Built for **Dr. Haydee Laza's Lab** at the Texas Tech University Department of Plant and Soil Science.

Live at → **[egrow-calculator.vercel.app](https://egrow-calculator.vercel.app)**

---

## Overview

This tool replaces a manual Excel spreadsheet workflow. Given a target nitrogen rate (lb N/acre) and fertilizer-specific properties, it calculates the exact volume or mass of fertilizer to apply per cone — with a full step-by-step breakdown of every intermediate value.

Results update live as you type. No installation, no internet connection required after the first load.

---

## Calculators

### Inorganic (UAN 32-0-0)
Liquid nitrogen fertilizer. Calculates the volume of diluted UAN solution to apply per cone (mL/cone).

**Inputs:** Total N rate, fraction applied at planting, N content per gallon, dilution ratio, cone area

### Biosolids
Solid organic fertilizer. Calculates the mass of biosolid material per cone (g/cone), accounting for N content and Year 1 mineralization rate.

**Inputs:** Total N rate, N content (%), mineralization rate (%), biosolid fraction (%), fraction of N applied, cone area

### E-GROW Slurry
Liquid organic slurry (most complex). Calculates application volume per cone (mL/cone) by partitioning N into an immediately available ammonia fraction and a slower-release mineralized biosolid fraction.

**Inputs:** Total N rate, total slurry N (Kjeldahl, mg/L), ammonia content (mg/L), mineralization rate (%), N content of biosolid fraction (%), cone area

---

## Features

- **Live calculation** — results update on every keystroke
- **Step-by-step breakdown** — every intermediate value shown with its formula
- **Input validation** — fields highlight red on invalid input with a descriptive error message
- **Reset to defaults** — one click restores all Excel default values per tab
- **Responsive** — works on desktop and mobile
- **Print-friendly** — all three panels render cleanly via Ctrl+P
- **Offline-capable** — no external dependencies, works without internet after first load

---

## File Structure

```
├── index.html    # Page structure and markup
├── styles.css    # All styling (layout, components, print, responsive)
└── app.js        # Calculations, validation, and UI logic
```

No frameworks, no build tools, no dependencies. Pure HTML, CSS, and vanilla JavaScript.

---

## Running Locally

Just open `index.html` in any modern browser. No server needed.

```bash
git clone https://github.com/Aartikkk/egrow-calculator.git
cd egrow-calculator
# open index.html in your browser
```

---

## Deployment

Deployed via [Vercel](https://vercel.com). Any push to `main` triggers an automatic redeploy — the live URL updates within ~30 seconds.

---

## Credits

Developed for **Dr. Haydee Laza's Lab**
Texas Tech University — Department of Plant and Soil Science