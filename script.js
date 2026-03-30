const form = document.getElementById("calcForm");
const loadExampleBtn = document.getElementById("loadExampleBtn");
const simpleModeBtn = document.getElementById("simpleModeBtn");
const advancedModeBtn = document.getElementById("advancedModeBtn");
const modeDescriptionEl = document.getElementById("modeDescription");
const inputsSectionEl = document.getElementById("inputsSection");
const modeBadgeEl = document.getElementById("modeBadge");
const overflowEnergyInput = document.getElementById("overflowEnergy");
const overflowEnergyNumberInput = document.getElementById("overflowEnergyNumber");
const energyBackInput = document.getElementById("energyBack");
const energyBackNumberInput = document.getElementById("energyBackNumber");
const pricePowerInput = document.getElementById("pricePower");
const pricePowerNumberInput = document.getElementById("pricePowerNumber");
const priceBuyoutInput = document.getElementById("priceBuyout");
const priceBuyoutNumberInput = document.getElementById("priceBuyoutNumber");
const nextYearOverflowInput = document.getElementById("nextYearOverflow");
const nextYearOverflowNumberInput = document.getElementById("nextYearOverflowNumber");
const seasonProfileInput = document.getElementById("seasonProfile");
const errorEl = document.getElementById("error");
const overflowEnergyValueEl = document.getElementById("overflowEnergyValue");
const energyBackValueEl = document.getElementById("energyBackValue");
const pricePowerValueEl = document.getElementById("pricePowerValue");
const priceBuyoutValueEl = document.getElementById("priceBuyoutValue");
const nextYearOverflowValueEl = document.getElementById("nextYearOverflowValue");
const seasonProfileValueEl = document.getElementById("seasonProfileValue");
const bandLabelEl = document.getElementById("bandLabel");
const bandFeeEl = document.getElementById("bandFee");
const usableEnergyEl = document.getElementById("usableEnergy");
const cardVbEl = document.getElementById("cardVb");
const cardVbpEl = document.getElementById("cardVbp");
const cardBuyoutEl = document.getElementById("cardBuyout");
const rankVbEl = document.getElementById("rankVb");
const rankVbpEl = document.getElementById("rankVbp");
const rankBuyoutEl = document.getElementById("rankBuyout");
const copyResponseBtn = document.getElementById("copyResponseBtn");
const copyResponseStatusEl = document.getElementById("copyResponseStatus");
const customerResponseTemplateEl = document.getElementById("customerResponseTemplate");

const vbMonthlyEl = document.getElementById("vbMonthly");
const vbYearlyEl = document.getElementById("vbYearly");
const vbpMonthlyEl = document.getElementById("vbpMonthly");
const vbpYearlyEl = document.getElementById("vbpYearly");
const buyoutYearlyEl = document.getElementById("buyoutYearly");
const bestVariantEl = document.getElementById("bestVariant");
const bestDiffEl = document.getElementById("bestDiff");
const bestReasonEl = document.getElementById("bestReason");
const vbBarEl = document.getElementById("vbBar");
const vbpBarEl = document.getElementById("vbpBar");
const buyoutBarEl = document.getElementById("buyoutBar");
const vbBarValueEl = document.getElementById("vbBarValue");
const vbpBarValueEl = document.getElementById("vbpBarValue");
const buyoutBarValueEl = document.getElementById("buyoutBarValue");
const vbEnergyValueEl = document.getElementById("vbEnergyValue");
const vbFeeMonthlyDetailEl = document.getElementById("vbFeeMonthlyDetail");
const vbFeeYearlyDetailEl = document.getElementById("vbFeeYearlyDetail");
const vbTotalDetailEl = document.getElementById("vbTotalDetail");
const vbpEnergyValueEl = document.getElementById("vbpEnergyValue");
const vbpFeeMonthlyDetailEl = document.getElementById("vbpFeeMonthlyDetail");
const vbpBalanceYearlyDetailEl = document.getElementById("vbpBalanceYearlyDetail");
const vbpTotalDetailEl = document.getElementById("vbpTotalDetail");
const buyoutOverflowDetailEl = document.getElementById("buyoutOverflowDetail");
const buyoutPriceDetailEl = document.getElementById("buyoutPriceDetail");
const buyoutRevenueDetailEl = document.getElementById("buyoutRevenueDetail");
const buyoutTotalDetailEl = document.getElementById("buyoutTotalDetail");
const simYear1StartEl = document.getElementById("simYear1Start");
const simYear1EndEl = document.getElementById("simYear1End");
const simYear2StartEl = document.getElementById("simYear2Start");
const simYear2EndEl = document.getElementById("simYear2End");
const simYear3StartEl = document.getElementById("simYear3Start");
const simulationTableBodyEl = document.getElementById("simulationTableBody");
let mode = "simple";

function formatCurrency(value) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMWh(value) {
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getBandFromOverflow(overflowEnergy) {
  if (overflowEnergy <= 1) {
    return { fee: 99, label: "do 1 MWh" };
  }
  if (overflowEnergy <= 2) {
    return { fee: 199, label: "do 2 MWh" };
  }
  if (overflowEnergy <= 3) {
    return { fee: 299, label: "do 3 MWh" };
  }
  return { fee: 450, label: "do 4 MWh" };
}

function getBandLabelByFee(fee) {
  if (fee === 99) {
    return "do 1 MWh";
  }
  if (fee === 199) {
    return "do 2 MWh";
  }
  if (fee === 299) {
    return "do 3 MWh";
  }
  return "do 4 MWh";
}

function getMonthlyDistribution(annualOverflow, profile) {
  if (profile === "solar") {
    // Typicka sezonnost FVE: vice preteka v lete.
    const weights = [3, 4, 7, 10, 13, 15, 15, 13, 10, 6, 3, 1];
    const weightSum = weights.reduce((sum, item) => sum + item, 0);
    return weights.map((w) => (annualOverflow * w) / weightSum);
  }

  return new Array(12).fill(annualOverflow / 12);
}

function simulateSolarYear(startFee, annualOverflow, profile) {
  const monthlyDistribution = getMonthlyDistribution(annualOverflow, profile);
  let cumulative = 0;
  let feeForCurrentMonth = startFee;
  let feeForNextMonth = startFee;
  const rows = [];

  for (let month = 1; month <= 12; month += 1) {
    cumulative += monthlyDistribution[month - 1];
    const reachedBand = getBandFromOverflow(Math.min(cumulative, 4));
    feeForNextMonth = Math.max(feeForNextMonth, reachedBand.fee);

    rows.push({
      month,
      fee: feeForCurrentMonth,
      cumulative,
    });

    feeForCurrentMonth = feeForNextMonth;
  }

  const achievedBandByCumulative = getBandFromOverflow(Math.min(annualOverflow, 4));

  return {
    rows,
    startFee,
    endFee: feeForCurrentMonth,
    feeForNextYearStart: achievedBandByCumulative.fee,
  };
}

function validateInputs(
  overflowEnergy,
  energyBack,
  pricePower,
  priceBuyout,
  nextYearOverflow
) {
  if (
    Number.isNaN(overflowEnergy) ||
    Number.isNaN(energyBack) ||
    Number.isNaN(pricePower) ||
    Number.isNaN(priceBuyout) ||
    Number.isNaN(nextYearOverflow)
  ) {
    return "Vyplňte prosím číselné hodnoty.";
  }
  if (overflowEnergy < 0 || overflowEnergy > 8) {
    return "Roční přetok musí být v rozsahu 0 až 8 MWh.";
  }
  if (pricePower < 0 || priceBuyout < 0) {
    return "Cena energie nemůže být záporná.";
  }
  if (energyBack < 0 || energyBack > 4) {
    return "Energie zpět musí být v rozsahu 0 až 4 MWh (limit VB za solární rok).";
  }
  if (nextYearOverflow < 0 || nextYearOverflow > 8) {
    return "Přetok v dalším roce musí být v rozsahu 0 až 8 MWh.";
  }
  return "";
}

function syncPair(rangeInput, numberInput) {
  const min = Number(rangeInput.min);
  const max = Number(rangeInput.max);

  const fromRange = () => {
    numberInput.value = rangeInput.value;
    calculate();
  };

  const fromNumber = () => {
    const raw = Number(numberInput.value);
    const clamped = Number.isNaN(raw) ? min : Math.min(Math.max(raw, min), max);
    numberInput.value = String(clamped);
    rangeInput.value = String(clamped);
    calculate();
  };

  rangeInput.addEventListener("input", fromRange);
  numberInput.addEventListener("input", fromNumber);
}

function applyMode(nextMode) {
  mode = nextMode;
  const isAdvanced = mode === "advanced";
  document.querySelectorAll(".advanced-only").forEach((el) => {
    el.classList.toggle("hidden", !isAdvanced);
  });
  document.querySelectorAll(".simple-only").forEach((el) => {
    el.classList.toggle("hidden", isAdvanced);
  });
  simpleModeBtn.classList.toggle("active", !isAdvanced);
  advancedModeBtn.classList.toggle("active", isAdvanced);
  simpleModeBtn.setAttribute("aria-pressed", String(!isAdvanced));
  advancedModeBtn.setAttribute("aria-pressed", String(isAdvanced));
  if (modeDescriptionEl) {
    modeDescriptionEl.textContent = isAdvanced
      ? "Pokročilý režim: detailní rozpad výpočtu, grafy, simulace po měsících a doplňující sekce."
      : "Jednoduchý režim: jen základní vstupy a souhrnné výsledky — bez grafů a rozpadů.";
  }
  if (inputsSectionEl) {
    inputsSectionEl.dataset.mode = isAdvanced ? "advanced" : "simple";
  }
  if (modeBadgeEl) {
    modeBadgeEl.textContent = isAdvanced ? "Pokročilý režim" : "Jednoduchý režim";
    modeBadgeEl.classList.toggle("mode-badge--advanced", isAdvanced);
    modeBadgeEl.classList.toggle("mode-badge--simple", !isAdvanced);
  }
}

function setInputPair(rangeInput, numberInput, value) {
  rangeInput.value = String(value);
  numberInput.value = String(value);
}

function loadExamplePreset() {
  setInputPair(overflowEnergyInput, overflowEnergyNumberInput, 4.3);
  // Pri ukazkovem systemu pocitame s maximalnim vyuzitim limitu virtualni baterie.
  setInputPair(energyBackInput, energyBackNumberInput, 4);
  setInputPair(pricePowerInput, pricePowerNumberInput, 3500);
  setInputPair(priceBuyoutInput, priceBuyoutNumberInput, 300);
  setInputPair(nextYearOverflowInput, nextYearOverflowNumberInput, 2.4);
  seasonProfileInput.value = "solar";
  applyMode("simple");
  calculate();
}

function buildCustomerResponseTemplate(data) {
  const {
    bestName,
    bestValue,
    secondName,
    diffToSecond,
    overflowEnergy,
    energyBack,
    monthlyFee,
    monthlyBalanceVbp,
    yearlyVb,
    yearlyVbp,
    yearlyBuyout,
  } = data;

  const recommendationText =
    bestName === "Virtuální baterie+"
      ? "Doporučená varianta je Virtuální baterie+, protože kombinuje využití přetoků a odměnu za flexibilitu."
      : bestName === "Virtuální baterie"
      ? "Doporučená varianta je Virtuální baterie, protože v tomto nastavení vychází nejlépe."
      : "Doporučená varianta je čistý výkup, protože v tomto nastavení vychází nejlépe.";

  return `Dobrý den,

na základě zadaných údajů jsme pro Vás připravili srovnání variant:

- Roční přetok do sítě: ${formatMWh(overflowEnergy)} MWh
- Energie čerpaná zpět z virtuální baterie: ${formatMWh(energyBack)} MWh
- Měsíční poplatek služby (dle pásma): ${formatCurrency(monthlyFee)}
- Odměna za flexibilitu u Virtuální baterie+: ${formatCurrency(450)}/měs.
- Měsíční bilance u Virtuální baterie+: ${formatCurrency(monthlyBalanceVbp)}/měs.

Roční výsledek variant:
- Virtuální baterie: ${formatCurrency(yearlyVb)}
- Virtuální baterie+: ${formatCurrency(yearlyVbp)}
- Čistý výkup: ${formatCurrency(yearlyBuyout)}

${recommendationText}
Nejvýhodnější vychází: ${bestName} (${formatCurrency(bestValue)} / rok), což je o ${formatCurrency(
    diffToSecond
  )} více než druhá nejlepší varianta (${secondName}).

Poznámka:
Výpočet je orientační a pracuje s aktuálně zadanými vstupy. V průběhu solárního roku se může měnit pásmo služby podle kumulativně uložené energie.

S pozdravem
E.ON tým`;
}

async function copyCustomerTemplate() {
  try {
    await navigator.clipboard.writeText(customerResponseTemplateEl.value);
    copyResponseStatusEl.textContent = "Zkopírováno.";
  } catch (error) {
    copyResponseStatusEl.textContent = "Kopírování se nepovedlo, použijte Ctrl+C.";
  }
}

function calculate() {
  const overflowEnergy = Number(overflowEnergyInput.value);
  const energyBack = Number(energyBackInput.value);
  const pricePower = Number(pricePowerInput.value);
  const priceBuyout = Number(priceBuyoutInput.value);
  const nextYearOverflow = Number(nextYearOverflowInput.value);
  const seasonProfile = seasonProfileInput.value;
  const validationError = validateInputs(
    overflowEnergy,
    energyBack,
    pricePower,
    priceBuyout,
    nextYearOverflow
  );
  errorEl.textContent = validationError;
  if (validationError) {
    return;
  }

  const band = getBandFromOverflow(overflowEnergy);
  const monthlyFee = band.fee;
  const usableEnergy = Math.min(overflowEnergy, 4);

  overflowEnergyValueEl.textContent = `${formatMWh(overflowEnergy)} MWh`;
  energyBackValueEl.textContent = `${formatMWh(energyBack)} MWh`;
  pricePowerValueEl.textContent = `${formatCurrency(pricePower).replace(
    ",00",
    ""
  )}/MWh`;
  priceBuyoutValueEl.textContent = `${formatCurrency(priceBuyout).replace(
    ",00",
    ""
  )}/MWh`;
  nextYearOverflowValueEl.textContent = `${formatMWh(nextYearOverflow)} MWh`;
  seasonProfileValueEl.textContent =
    seasonProfile === "solar" ? "Typická FVE křivka" : "Rovnoměrně";
  bandLabelEl.textContent = band.label;
  bandFeeEl.textContent = formatCurrency(monthlyFee).replace(",00", "");
  usableEnergyEl.textContent = `${formatMWh(usableEnergy)} MWh`;

  const monthlyBalanceVb = -monthlyFee;
  const monthlyBalanceVbp = 450 - monthlyFee;
  const energyValue = energyBack * pricePower;
  const yearlyFee = monthlyFee * 12;
  const yearlyBalanceVbp = monthlyBalanceVbp * 12;

  const yearlyVb = energyBack * pricePower + 12 * monthlyBalanceVb - 1200;
  const yearlyVbp = energyBack * pricePower + 12 * monthlyBalanceVbp - 1200;
  const yearlyBuyout = overflowEnergy * priceBuyout;

  vbMonthlyEl.textContent = formatCurrency(monthlyBalanceVb);
  vbpMonthlyEl.textContent = formatCurrency(monthlyBalanceVbp);
  vbYearlyEl.textContent = formatCurrency(yearlyVb);
  vbpYearlyEl.textContent = formatCurrency(yearlyVbp);
  buyoutYearlyEl.textContent = formatCurrency(yearlyBuyout);

  const variants = [
    { key: "vb", name: "Virtuální baterie", value: yearlyVb, el: cardVbEl, rankEl: rankVbEl },
    { key: "vbp", name: "Virtuální baterie+", value: yearlyVbp, el: cardVbpEl, rankEl: rankVbpEl },
    { key: "buyout", name: "Čistý výkup", value: yearlyBuyout, el: cardBuyoutEl, rankEl: rankBuyoutEl },
  ].sort((a, b) => b.value - a.value);

  bestVariantEl.textContent = variants[0].name;
  bestDiffEl.textContent = `${formatCurrency(variants[0].value - variants[1].value)}/rok`;
  bestReasonEl.textContent =
    variants[0].name === "Virtuální baterie+"
      ? "Kombinace využití přetoků a odměny za flexibilitu dává v tomto scénáři nejlepší výsledek."
      : variants[0].name === "Virtuální baterie"
      ? "V tomto scénáři vychází nejlépe využití přetoků přes virtuální baterii bez flexibility."
      : "Při zadaných hodnotách je nejvýhodnější energii přímo prodávat přes čistý výkup.";
  customerResponseTemplateEl.value = buildCustomerResponseTemplate({
    bestName: variants[0].name,
    bestValue: variants[0].value,
    secondName: variants[1].name,
    diffToSecond: variants[0].value - variants[1].value,
    overflowEnergy,
    energyBack,
    monthlyFee,
    monthlyBalanceVbp,
    yearlyVb,
    yearlyVbp,
    yearlyBuyout,
  });
  copyResponseStatusEl.textContent = "";

  variants.forEach((item, index) => {
    item.rankEl.textContent = `#${index + 1}`;
    item.rankEl.classList.toggle("top", index === 0);
    item.el.classList.remove("rank-1", "rank-2", "rank-3");
    item.el.classList.add(`rank-${index + 1}`);
    item.el.style.order = String(index + 1);
  });

  vbBarValueEl.textContent = formatCurrency(yearlyVb);
  vbpBarValueEl.textContent = formatCurrency(yearlyVbp);
  buyoutBarValueEl.textContent = formatCurrency(yearlyBuyout);

  vbEnergyValueEl.textContent = `${formatCurrency(energyValue)}/rok`;
  vbFeeMonthlyDetailEl.textContent = `${formatCurrency(-monthlyFee)}/měs.`;
  vbFeeYearlyDetailEl.textContent = `${formatCurrency(-yearlyFee)}/rok`;
  vbTotalDetailEl.textContent = `${formatCurrency(yearlyVb)}/rok`;

  vbpEnergyValueEl.textContent = `${formatCurrency(energyValue)}/rok`;
  vbpFeeMonthlyDetailEl.textContent = `${formatCurrency(-monthlyFee)}/měs.`;
  vbpBalanceYearlyDetailEl.textContent = `${formatCurrency(yearlyBalanceVbp)}/rok`;
  vbpTotalDetailEl.textContent = `${formatCurrency(yearlyVbp)}/rok`;

  buyoutOverflowDetailEl.textContent = `${formatMWh(overflowEnergy)} MWh`;
  buyoutPriceDetailEl.textContent = `${formatCurrency(priceBuyout).replace(",00", "")}/MWh`;
  buyoutRevenueDetailEl.textContent = `${formatCurrency(yearlyBuyout)}/rok`;
  buyoutTotalDetailEl.textContent = `${formatCurrency(yearlyBuyout)}/rok`;

  const maxAbs = Math.max(
    Math.abs(yearlyVb),
    Math.abs(yearlyVbp),
    Math.abs(yearlyBuyout),
    1
  );
  vbBarEl.style.width = `${(Math.abs(yearlyVb) / maxAbs) * 100}%`;
  vbpBarEl.style.width = `${(Math.abs(yearlyVbp) / maxAbs) * 100}%`;
  buyoutBarEl.style.width = `${(Math.abs(yearlyBuyout) / maxAbs) * 100}%`;

  const notices = [];
  if (overflowEnergy > 4) {
    notices.push(
      "Pro pásmo služby se v rámci jednoho solárního roku počítá maximum 4 MWh uložené energie."
    );
  }
  if (notices.length > 0) {
    errorEl.textContent = notices.join(" ");
  }

  const year1 = simulateSolarYear(99, overflowEnergy, seasonProfile);
  const year2 = simulateSolarYear(year1.endFee, nextYearOverflow, seasonProfile);

  simYear1StartEl.textContent = getBandLabelByFee(year1.startFee);
  simYear1EndEl.textContent = getBandLabelByFee(year1.endFee);
  simYear2StartEl.textContent = getBandLabelByFee(year2.startFee);
  simYear2EndEl.textContent = getBandLabelByFee(year2.endFee);
  simYear3StartEl.textContent = getBandLabelByFee(year2.feeForNextYearStart);

  simulationTableBodyEl.innerHTML = "";
  for (let i = 0; i < 12; i += 1) {
    const rowYear1 = year1.rows[i];
    const rowYear2 = year2.rows[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${getBandLabelByFee(rowYear1.fee)}</td>
      <td>${formatMWh(rowYear1.cumulative)}</td>
      <td>${getBandLabelByFee(rowYear2.fee)}</td>
      <td>${formatMWh(rowYear2.cumulative)}</td>
    `;
    simulationTableBodyEl.appendChild(tr);
  }
}

syncPair(overflowEnergyInput, overflowEnergyNumberInput);
syncPair(energyBackInput, energyBackNumberInput);
syncPair(pricePowerInput, pricePowerNumberInput);
syncPair(priceBuyoutInput, priceBuyoutNumberInput);
syncPair(nextYearOverflowInput, nextYearOverflowNumberInput);

seasonProfileInput.addEventListener("change", calculate);
simpleModeBtn.addEventListener("click", () => applyMode("simple"));
advancedModeBtn.addEventListener("click", () => applyMode("advanced"));
loadExampleBtn.addEventListener("click", loadExamplePreset);
copyResponseBtn.addEventListener("click", copyCustomerTemplate);

applyMode("simple");
calculate();
