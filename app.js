'use strict';

/* ═══════════════════════════════════════════════
   DEFAULTS
═══════════════════════════════════════════════ */
const DEFAULTS = {
  inorganic: {
    'ino-totalNRate':        120,
    'ino-fractionApplied':   0.33333,
    'ino-nContentPerGallon': 3.54,
    'ino-dilutionRatio':     250,
    'ino-coneArea':          0.0135,
  },
  biosolids: {
    'bio-totalNRate':          120,
    'bio-nContentPercent':     3.776,
    'bio-mineralizationRate':  30,
    'bio-biosolidFraction':    95,
    'bio-nAppliedFraction':    1.0,
    'bio-coneArea':            0.0135,
  },
  egrow: {
    'eg-totalNRate':          120,
    'eg-totalSlurryN':        45600,
    'eg-ammoniaContent':      214,
    'eg-mineralizationRate':  40,
    'eg-nContentBiosolid':    6,
    'eg-coneArea':            0.0135,
  },
};

/* ═══════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════ */
function sigFmt(n, sigFigs = 6) {
  if (!isFinite(n)) return 'Error';
  if (n === 0) return '0';
  return String(parseFloat(n.toPrecision(sigFigs)));
}

function fixedFmt(n, decimals = 2) {
  if (!isFinite(n)) return '—';
  return n.toFixed(decimals);
}

/* ═══════════════════════════════════════════════
   DOM HELPERS
═══════════════════════════════════════════════ */
function el(id)  { return document.getElementById(id); }
function val(id) { return parseFloat(el(id).value); }

function flashResult(id) {
  const node = el(id);
  node.classList.remove('flash');
  void node.offsetWidth; // force reflow so animation restarts
  node.classList.add('flash');
}

/* Build one timeline step row */
function makeStep(num, label, formula, result, unit) {
  return `<div class="bd-step">
    <div class="bd-num">${num}</div>
    <div class="bd-content">
      <div class="bd-label">${label}</div>
      <div class="bd-formula">${formula}</div>
      <div class="bd-result">
        <span class="bd-arrow">&#8594;</span>
        <span class="bd-value">${result}</span>
        <span class="bd-unit">${unit}</span>
      </div>
    </div>
  </div>`;
}

function showError(bodyId, message) {
  el(bodyId).innerHTML = `<div class="bd-error">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b71c1c" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    ${message}
  </div>`;
}

/* ═══════════════════════════════════════════════
   VALIDATION
═══════════════════════════════════════════════ */
function validateFields(ids, rules) {
  let allOk = true;
  ids.forEach(id => {
    const input = el(id);
    const v = parseFloat(input.value);
    let ok = isFinite(v);
    if (ok && rules[id]) ok = rules[id](v);
    input.classList.toggle('is-invalid', !ok);
    if (!ok) allOk = false;
  });
  return allOk;
}

/* ═══════════════════════════════════════════════
   CALC 1 — INORGANIC (UAN 32-0-0)
═══════════════════════════════════════════════ */
function calcInorganic() {
  const ids = [
    'ino-totalNRate', 'ino-fractionApplied', 'ino-nContentPerGallon',
    'ino-dilutionRatio', 'ino-coneArea',
  ];
  const rules = {
    'ino-totalNRate':        v => v >= 0,
    'ino-fractionApplied':   v => v > 0 && v <= 1,
    'ino-nContentPerGallon': v => v > 0,
    'ino-dilutionRatio':     v => v > 0,
    'ino-coneArea':          v => v > 0,
  };

  if (!validateFields(ids, rules)) {
    el('ino-result-val').textContent = '—';
    showError('ino-bd-body', 'Please correct the highlighted input(s).');
    return;
  }

  const totalNRate        = val('ino-totalNRate');
  const fractionApplied   = val('ino-fractionApplied');
  const nContentPerGallon = val('ino-nContentPerGallon');
  const dilutionRatio     = val('ino-dilutionRatio');
  const coneArea          = val('ino-coneArea');

  const nAppliedAtPlanting = totalNRate * fractionApplied;
  const nPerSqFt           = nAppliedAtPlanting / 43560;
  const nContentPerLiter   = nContentPerGallon / 3.78;
  const nContentDiluted    = nContentPerLiter / dilutionRatio;
  const nPerCone           = coneArea * nPerSqFt;
  const appVolume_mL       = (nPerCone / nContentDiluted) * 1000;

  el('ino-result-val').textContent = fixedFmt(appVolume_mL, 2);
  flashResult('ino-result-val');

  el('ino-bd-body').innerHTML = [
    makeStep(1, 'N applied at planting',
      `${totalNRate} lb N/acre &times; ${fractionApplied}`,
      sigFmt(nAppliedAtPlanting), 'lb N / acre'),

    makeStep(2, 'N per square foot',
      `${sigFmt(nAppliedAtPlanting)} &divide; 43,560 sq ft/acre`,
      sigFmt(nPerSqFt), 'lb N / sq ft'),

    makeStep(3, 'N content per liter (undiluted)',
      `${nContentPerGallon} lb N/gal &divide; 3.78 L/gal`,
      sigFmt(nContentPerLiter), 'lb N / L'),

    makeStep(4, `N content per liter (diluted 1&thinsp;:&thinsp;${dilutionRatio})`,
      `${sigFmt(nContentPerLiter)} &divide; ${dilutionRatio}`,
      sigFmt(nContentDiluted), 'lb N / L'),

    makeStep(5, 'N needed per cone',
      `${coneArea} sq ft &times; ${sigFmt(nPerSqFt)} lb N/sq ft`,
      sigFmt(nPerCone), 'lb N / cone'),

    makeStep(6, 'Application volume per cone',
      `(${sigFmt(nPerCone)} &divide; ${sigFmt(nContentDiluted)}) &times; 1,000 mL/L`,
      fixedFmt(appVolume_mL, 4), 'mL / cone'),
  ].join('');
}

/* ═══════════════════════════════════════════════
   CALC 2 — BIOSOLIDS
═══════════════════════════════════════════════ */
function calcBiosolids() {
  const ids = [
    'bio-totalNRate', 'bio-nContentPercent', 'bio-mineralizationRate',
    'bio-biosolidFraction', 'bio-nAppliedFraction', 'bio-coneArea',
  ];
  const rules = {
    'bio-totalNRate':         v => v >= 0,
    'bio-nContentPercent':    v => v > 0 && v <= 100,
    'bio-mineralizationRate': v => v > 0 && v <= 100,
    'bio-biosolidFraction':   v => v > 0 && v <= 100,
    'bio-nAppliedFraction':   v => v > 0 && v <= 1,
    'bio-coneArea':           v => v > 0,
  };

  if (!validateFields(ids, rules)) {
    el('bio-result-val').textContent = '—';
    showError('bio-bd-body', 'Please correct the highlighted input(s).');
    return;
  }

  const totalNRate         = val('bio-totalNRate');
  const nContentPercent    = val('bio-nContentPercent');
  const mineralizationRate = val('bio-mineralizationRate');
  const biosolidFraction   = val('bio-biosolidFraction');
  const nAppliedFraction   = val('bio-nAppliedFraction');
  const coneArea           = val('bio-coneArea');

  const nContentDecimal      = nContentPercent / 100;
  const lbNPerTon            = nContentDecimal * 2000;
  const mineralizationDec    = mineralizationRate / 100;
  const bioavailableNPerTon  = lbNPerTon * mineralizationDec;
  const bioavailableNPerGram = bioavailableNPerTon / 907185;
  const nApplied             = totalNRate * nAppliedFraction;
  const nPerSqFt             = nApplied / 43560;
  const nPerCone             = nPerSqFt * coneArea;
  const biosolidFracDec      = biosolidFraction / 100;
  const appMass_g            = (nPerCone / bioavailableNPerGram) * biosolidFracDec;

  el('bio-result-val').textContent = fixedFmt(appMass_g, 3);
  flashResult('bio-result-val');

  el('bio-bd-body').innerHTML = [
    makeStep(1, 'N content (decimal)',
      `${nContentPercent}% &divide; 100`,
      sigFmt(nContentDecimal), '(dimensionless)'),

    makeStep(2, 'lb N per ton of biosolid',
      `${sigFmt(nContentDecimal)} &times; 2,000 lb/ton`,
      sigFmt(lbNPerTon), 'lb N / ton'),

    makeStep(3, 'Mineralization rate (decimal)',
      `${mineralizationRate}% &divide; 100`,
      sigFmt(mineralizationDec), '(dimensionless)'),

    makeStep(4, 'Bioavailable N per ton',
      `${sigFmt(lbNPerTon)} &times; ${sigFmt(mineralizationDec)}`,
      sigFmt(bioavailableNPerTon), 'lb N / ton'),

    makeStep(5, 'Bioavailable N per gram',
      `${sigFmt(bioavailableNPerTon)} &divide; 907,185 g/ton`,
      sigFmt(bioavailableNPerGram), 'lb N / g'),

    makeStep(6, 'N applied per acre',
      `${totalNRate} &times; ${nAppliedFraction}`,
      sigFmt(nApplied), 'lb N / acre'),

    makeStep(7, 'N per square foot',
      `${sigFmt(nApplied)} &divide; 43,560 sq ft/acre`,
      sigFmt(nPerSqFt), 'lb N / sq ft'),

    makeStep(8, 'N needed per cone',
      `${sigFmt(nPerSqFt)} &times; ${coneArea} sq ft`,
      sigFmt(nPerCone), 'lb N / cone'),

    makeStep(9, 'Biosolid fraction (decimal)',
      `${biosolidFraction}% &divide; 100`,
      sigFmt(biosolidFracDec), '(dimensionless)'),

    makeStep(10, 'Application mass per cone',
      `(${sigFmt(nPerCone)} &divide; ${sigFmt(bioavailableNPerGram)}) &times; ${sigFmt(biosolidFracDec)}`,
      fixedFmt(appMass_g, 4), 'g / cone'),
  ].join('');
}

/* ═══════════════════════════════════════════════
   CALC 3 — E-GROW SLURRY
═══════════════════════════════════════════════ */
function calcEgrow() {
  const ids = [
    'eg-totalNRate', 'eg-totalSlurryN', 'eg-ammoniaContent',
    'eg-mineralizationRate', 'eg-nContentBiosolid', 'eg-coneArea',
  ];

  const totalSlurryN   = val('eg-totalSlurryN');
  const ammoniaContent = val('eg-ammoniaContent');

  const rules = {
    'eg-totalNRate':         v => v >= 0,
    'eg-totalSlurryN':       v => v > 0,
    'eg-ammoniaContent':     v => v >= 0 && v <= totalSlurryN,
    'eg-mineralizationRate': v => v > 0 && v <= 100,
    'eg-nContentBiosolid':   v => v > 0 && v <= 100,
    'eg-coneArea':           v => v > 0,
  };

  if (!validateFields(ids, rules)) {
    el('eg-result-val').textContent = '—';
    const ammErr = isFinite(ammoniaContent) && isFinite(totalSlurryN)
                   && ammoniaContent > totalSlurryN;
    showError('eg-bd-body', ammErr
      ? 'Ammonia content cannot exceed total slurry N.'
      : 'Please correct the highlighted input(s).');
    return;
  }

  const totalNRate         = val('eg-totalNRate');
  const mineralizationRate = val('eg-mineralizationRate');
  const nContentBiosolid   = val('eg-nContentBiosolid');
  const coneArea           = val('eg-coneArea');

  const totalNRate_mgPerSqFt    = (totalNRate * 453592) / 43560;
  const biosolidFractionN       = totalSlurryN - ammoniaContent;
  const ammonia_mgPerML         = ammoniaContent / 1000;
  const biosolidN_mgPerML       = biosolidFractionN / 1000;
  const mineralizationDec       = mineralizationRate / 100;
  const nContentBiosolidDec     = nContentBiosolid / 100;
  const mineralizedNPerML       = biosolidN_mgPerML * mineralizationDec * nContentBiosolidDec;
  const bioavailableNPerML      = ammonia_mgPerML + mineralizedNPerML;
  const nNeededPerCone          = totalNRate_mgPerSqFt * coneArea;
  const appVolume_mL            = nNeededPerCone / bioavailableNPerML;

  el('eg-result-val').textContent = fixedFmt(appVolume_mL, 2);
  flashResult('eg-result-val');

  el('eg-bd-body').innerHTML = [
    makeStep(1, 'Total N rate in mg N per sq ft',
      `(${totalNRate} lb/acre &times; 453,592 mg/lb) &divide; 43,560 sq ft/acre`,
      sigFmt(totalNRate_mgPerSqFt), 'mg N / sq ft'),

    makeStep(2, 'N from biosolid fraction of slurry',
      `${totalSlurryN} &minus; ${ammoniaContent}`,
      sigFmt(biosolidFractionN), 'mg / L'),

    makeStep(3, 'Ammonia N per mL',
      `${ammoniaContent} mg/L &divide; 1,000 mL/L`,
      sigFmt(ammonia_mgPerML), 'mg N / mL'),

    makeStep(4, 'Biosolid fraction N per mL',
      `${sigFmt(biosolidFractionN)} mg/L &divide; 1,000 mL/L`,
      sigFmt(biosolidN_mgPerML), 'mg / mL'),

    makeStep(5, 'Mineralization rate (decimal)',
      `${mineralizationRate}% &divide; 100`,
      sigFmt(mineralizationDec), '(dimensionless)'),

    makeStep(6, 'N content of biosolid fraction (decimal)',
      `${nContentBiosolid}% &divide; 100`,
      sigFmt(nContentBiosolidDec), '(dimensionless)'),

    makeStep(7, 'Mineralized N per mL',
      `${sigFmt(biosolidN_mgPerML)} &times; ${sigFmt(mineralizationDec)} &times; ${sigFmt(nContentBiosolidDec)}`,
      sigFmt(mineralizedNPerML), 'mg N / mL'),

    makeStep(8, 'Total bioavailable N per mL',
      `${sigFmt(ammonia_mgPerML)} (ammonia) + ${sigFmt(mineralizedNPerML)} (mineralized)`,
      sigFmt(bioavailableNPerML), 'mg N / mL'),

    makeStep(9, 'N needed per cone',
      `${sigFmt(totalNRate_mgPerSqFt)} mg/sq ft &times; ${coneArea} sq ft`,
      sigFmt(nNeededPerCone), 'mg N / cone'),

    makeStep(10, 'Application volume per cone',
      `${sigFmt(nNeededPerCone)} &divide; ${sigFmt(bioavailableNPerML)}`,
      fixedFmt(appVolume_mL, 4), 'mL / cone'),
  ].join('');
}

/* ═══════════════════════════════════════════════
   UI INIT
═══════════════════════════════════════════════ */
const CALCS = {
  inorganic: calcInorganic,
  biosolids: calcBiosolids,
  egrow:     calcEgrow,
};

/* Tab switching */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === target);
      b.setAttribute('aria-selected', b.dataset.tab === target ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + target);
    });
  });
});

/* Accordion toggles */
[
  ['ino-bd-toggle', 'ino-bd-body'],
  ['bio-bd-toggle', 'bio-bd-body'],
  ['eg-bd-toggle',  'eg-bd-body'],
].forEach(([toggleId, bodyId]) => {
  const toggle = el(toggleId);
  const body   = el(bodyId);
  toggle.addEventListener('click', () => {
    const open = body.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
});

/* Reset buttons */
document.querySelectorAll('.btn-reset').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.reset;
    Object.entries(DEFAULTS[tab]).forEach(([id, v]) => {
      el(id).value = v;
      el(id).classList.remove('is-invalid');
    });
    CALCS[tab]();
  });
});

/* Live input listeners */
['ino-totalNRate','ino-fractionApplied','ino-nContentPerGallon','ino-dilutionRatio','ino-coneArea']
  .forEach(id => el(id).addEventListener('input', calcInorganic));

['bio-totalNRate','bio-nContentPercent','bio-mineralizationRate','bio-biosolidFraction','bio-nAppliedFraction','bio-coneArea']
  .forEach(id => el(id).addEventListener('input', calcBiosolids));

['eg-totalNRate','eg-totalSlurryN','eg-ammoniaContent','eg-mineralizationRate','eg-nContentBiosolid','eg-coneArea']
  .forEach(id => el(id).addEventListener('input', calcEgrow));

/* Initial calculation + open first breakdown */
calcInorganic();
calcBiosolids();
calcEgrow();
el('ino-bd-toggle').click();