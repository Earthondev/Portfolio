(() => {
  const MONTH_LABELS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const CATEGORY_META = [
    { key: 'amino', label: 'Amino Acids', baseDemand: 86, baseCost: 1680, leadTime: [12, 26] },
    { key: 'fertilizer', label: 'Fertilizer Additives', baseDemand: 54, baseCost: 1320, leadTime: [15, 34] },
    { key: 'consumables', label: 'Lab Consumables', baseDemand: 112, baseCost: 220, leadTime: [7, 18] },
    { key: 'packaging', label: 'Packaging', baseDemand: 74, baseCost: 410, leadTime: [10, 22] },
    { key: 'maintenance', label: 'Maintenance', baseDemand: 28, baseCost: 910, leadTime: [18, 45] }
  ];
  const SUPPLIERS = ['Siam Inputs', 'Nova Source', 'ChemBridge', 'Thai Industrial Lab', 'Pacific Materials'];

  const state = {
    category: 'all',
    supplier: 'all',
    status: 'all',
    search: '',
    safetyMultiplier: 1,
    leadTimeBuffer: 1,
    selectedSku: ''
  };

  const elements = {
    categoryFilter: document.getElementById('category-filter'),
    supplierFilter: document.getElementById('supplier-filter'),
    statusFilter: document.getElementById('status-filter'),
    searchInput: document.getElementById('search-input'),
    scenarioSafety: document.getElementById('scenario-safety'),
    scenarioLead: document.getElementById('scenario-lead'),
    scenarioSafetyValue: document.getElementById('scenario-safety-value'),
    scenarioLeadValue: document.getElementById('scenario-lead-value'),
    scenarioSummary: document.getElementById('scenario-summary'),
    executiveSummary: document.getElementById('executive-summary'),
    metricGrid: document.getElementById('metric-grid'),
    demandChart: document.getElementById('demand-stock-chart'),
    categoryChart: document.getElementById('category-turnover-chart'),
    abcMixChart: document.getElementById('abc-mix-chart'),
    supplierRiskTable: document.getElementById('supplier-risk-table'),
    actionList: document.getElementById('action-list'),
    alertTable: document.getElementById('alert-table-body'),
    detailTable: document.getElementById('detail-table-body'),
    selectedSkuPanel: document.getElementById('selected-sku-panel'),
    resultLabel: document.getElementById('result-label'),
    downloadBtn: document.getElementById('download-alerts')
  };

  function mulberry32(seed) {
    return function prng() {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0
    }).format(value);
  }

  function average(values) {
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  }

  function seededDataset() {
    const random = mulberry32(20260325);
    let index = 1;

    return CATEGORY_META.flatMap((categoryMeta, categoryIndex) => {
      const itemCount = 34 + categoryIndex * 3;
      return Array.from({ length: itemCount }, (_, itemIndex) => {
        const season = Array.from({ length: 12 }, (_, monthIndex) => {
          const wave = 0.72 + (Math.sin((monthIndex + categoryIndex) * 0.7) + 1) * 0.24;
          const noise = 0.75 + random() * 0.65;
          return Math.max(0, Math.round(categoryMeta.baseDemand * wave * noise));
        });

        const avgDemand = average(season.slice(-3));
        const leadTimeDays = Math.round(categoryMeta.leadTime[0] + random() * (categoryMeta.leadTime[1] - categoryMeta.leadTime[0]));
        const safetyStock = Math.round(avgDemand * (0.55 + random() * 0.8));
        const onOrder = Math.round(avgDemand * (random() > 0.68 ? 1.4 : 0.45));
        const reserved = Math.round(avgDemand * (0.05 + random() * 0.18));
        let onHand = Math.round(avgDemand * (0.7 + random() * 2.8));

        if (random() > 0.9) onHand = Math.round(avgDemand * (0.16 + random() * 0.5));
        if (random() > 0.95) {
          season[9] = Math.round(season[9] * 0.16);
          season[10] = Math.round(season[10] * 0.1);
          season[11] = Math.round(season[11] * 0.06);
          onHand = Math.round(onHand * (1.9 + random() * 1.2));
        }

        const unitCost = Math.round(categoryMeta.baseCost * (0.78 + random() * 1.35));
        const supplier = SUPPLIERS[Math.floor(random() * SUPPLIERS.length)];
        const skuId = `${categoryMeta.key.slice(0, 3).toUpperCase()}-${String(index).padStart(4, '0')}`;
        index += 1;

        return {
          sku: skuId,
          name: `${categoryMeta.label.replace(' ', ' ')} ${itemIndex + 1}`,
          category: categoryMeta.label,
          supplier,
          unitCost,
          leadTimeDays,
          safetyStock,
          onHand,
          onOrder,
          reserved,
          monthlyDemand: season
        };
      });
    });
  }

  const dataset = seededDataset();

  function enrichItem(item) {
    const avgMonthlyDemand = average(item.monthlyDemand.slice(-3));
    const annualDemand = item.monthlyDemand.reduce((sum, month) => sum + month, 0);
    const availableStock = Math.max(0, item.onHand + item.onOrder - item.reserved);
    const dailyDemand = avgMonthlyDemand / 30;
    const coverDays = dailyDemand > 0 ? availableStock / dailyDemand : 999;
    const inventoryValue = item.onHand * item.unitCost;
    const annualConsumptionValue = annualDemand * item.unitCost;
    const turnoverRate = inventoryValue > 0 ? (annualDemand * item.unitCost) / inventoryValue : 0;
    const effectiveSafetyStock = Math.round(item.safetyStock * state.safetyMultiplier);
    const bufferedLeadTime = item.leadTimeDays * state.leadTimeBuffer;
    const isDeadStock = average(item.monthlyDemand.slice(-3)) < 2 && item.onHand > effectiveSafetyStock * 1.4;
    const reorderRisk = availableStock < effectiveSafetyStock || coverDays < bufferedLeadTime;
    const excessRatio = effectiveSafetyStock > 0 ? item.onHand / effectiveSafetyStock : 1;
    const healthScore = clamp(
      100
      - (reorderRisk ? 26 : 0)
      - (isDeadStock ? 28 : 0)
      - Math.max(0, 18 - coverDays) * 1.4
      + Math.min(20, turnoverRate * 2.5)
      - Math.max(0, excessRatio - 3) * 6,
      22,
      96
    );

    let status = 'Healthy';
    if (isDeadStock) status = 'Dead Stock';
    else if (reorderRisk && coverDays < bufferedLeadTime * 0.75) status = 'Urgent Reorder';
    else if (reorderRisk) status = 'Watchlist';

    return {
      ...item,
      avgMonthlyDemand,
      annualDemand,
      annualConsumptionValue,
      availableStock,
      coverDays,
      inventoryValue,
      turnoverRate,
      isDeadStock,
      reorderRisk,
      healthScore,
      status,
      effectiveSafetyStock,
      bufferedLeadTime
    };
  }

  function populateFilters() {
    const categories = [...new Set(dataset.map((item) => item.category))];
    const suppliers = [...new Set(dataset.map((item) => item.supplier))];

    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      elements.categoryFilter.append(option);
    });

    suppliers.forEach((supplier) => {
      const option = document.createElement('option');
      option.value = supplier;
      option.textContent = supplier;
      elements.supplierFilter.append(option);
    });
  }

  function getFilteredData() {
    return dataset.map((item) => enrichItem(item)).filter((item) => {
      const categoryMatch = state.category === 'all' || item.category === state.category;
      const supplierMatch = state.supplier === 'all' || item.supplier === state.supplier;
      const searchMatch = !state.search
        || `${item.sku} ${item.name} ${item.category} ${item.supplier}`.toLowerCase().includes(state.search);

      let statusMatch = true;
      if (state.status === 'risk') statusMatch = item.reorderRisk;
      if (state.status === 'dead') statusMatch = item.isDeadStock;
      if (state.status === 'healthy') statusMatch = !item.reorderRisk && !item.isDeadStock;

      return categoryMatch && supplierMatch && statusMatch && searchMatch;
    });
  }

  function updateScenarioLabel() {
    if (elements.scenarioSafetyValue) elements.scenarioSafetyValue.textContent = `${formatNumber(state.safetyMultiplier, 2)}x`;
    if (elements.scenarioLeadValue) elements.scenarioLeadValue.textContent = `${formatNumber(state.leadTimeBuffer, 2)}x`;

    const posture = state.safetyMultiplier > 1.15 || state.leadTimeBuffer > 1.15
      ? 'more conservative'
      : state.safetyMultiplier < 0.95 || state.leadTimeBuffer < 0.95
        ? 'leaner'
        : 'balanced';

    if (elements.scenarioSummary) {
      elements.scenarioSummary.textContent = `Current policy is ${posture}: safety stock ${formatNumber(state.safetyMultiplier, 2)}x and lead time buffer ${formatNumber(state.leadTimeBuffer, 2)}x.`;
    }
  }

  function summarize(items) {
    const totalValue = items.reduce((sum, item) => sum + item.inventoryValue, 0);
    const riskItems = items.filter((item) => item.reorderRisk).length;
    const deadStockItems = items.filter((item) => item.isDeadStock);
    const deadStockValue = deadStockItems.reduce((sum, item) => sum + item.inventoryValue, 0);
    const avgCover = average(items.map((item) => Math.min(item.coverDays, 120)));
    const avgTurnover = average(items.map((item) => item.turnoverRate));
    const avgHealth = average(items.map((item) => item.healthScore));

    return {
      totalItems: items.length,
      totalValue,
      riskItems,
      deadStockValue,
      avgCover,
      avgTurnover,
      avgHealth,
      riskShare: items.length ? riskItems / items.length : 0
    };
  }

  function projectedDemand(item, months = 1) {
    return average(item.monthlyDemand.slice(-3)) * months;
  }

  function reorderSuggestion(item) {
    const nextMonthDemand = projectedDemand(item, 1);
    const targetCoverageDays = Math.max(30, item.bufferedLeadTime * 1.35);
    const targetStock = Math.round((item.avgMonthlyDemand / 30) * targetCoverageDays + item.effectiveSafetyStock);
    const netAvailable = item.onHand + item.onOrder - item.reserved;
    const reorderQty = Math.max(0, Math.round(targetStock - netAvailable));
    return {
      nextMonthDemand,
      targetCoverageDays,
      targetStock,
      reorderQty
    };
  }

  function monthlySeries(items) {
    return MONTH_LABELS.map((label, monthIndex) => ({
      label,
      demand: items.reduce((sum, item) => sum + item.monthlyDemand[monthIndex], 0),
      stock: items.reduce((sum, item) => sum + item.onHand, 0)
    }));
  }

  function categoryBreakdown(items) {
    const groups = new Map();
    items.forEach((item) => {
      if (!groups.has(item.category)) {
        groups.set(item.category, {
          category: item.category,
          turnover: [],
          value: 0,
          riskCount: 0
        });
      }
      const entry = groups.get(item.category);
      entry.turnover.push(item.turnoverRate);
      entry.value += item.inventoryValue;
      if (item.reorderRisk || item.isDeadStock) entry.riskCount += 1;
    });

    return [...groups.values()]
      .map((entry) => ({
        category: entry.category,
        avgTurnover: average(entry.turnover),
        value: entry.value,
        riskCount: entry.riskCount
      }))
      .sort((a, b) => b.value - a.value);
  }

  function abcBreakdown(items) {
    const sorted = [...items].sort((a, b) => b.annualConsumptionValue - a.annualConsumptionValue);
    const totalAnnualValue = sorted.reduce((sum, item) => sum + item.annualConsumptionValue, 0) || 1;
    let cumulative = 0;

    const buckets = new Map([
      ['A', { label: 'A', items: 0, value: 0, flagged: 0 }],
      ['B', { label: 'B', items: 0, value: 0, flagged: 0 }],
      ['C', { label: 'C', items: 0, value: 0, flagged: 0 }]
    ]);

    sorted.forEach((item) => {
      cumulative += item.annualConsumptionValue;
      const ratio = cumulative / totalAnnualValue;
      const bucket = ratio <= 0.8 ? 'A' : ratio <= 0.95 ? 'B' : 'C';
      const entry = buckets.get(bucket);
      entry.items += 1;
      entry.value += item.annualConsumptionValue;
      if (item.reorderRisk || item.isDeadStock) entry.flagged += 1;
    });

    return [...buckets.values()].map((entry) => ({
      ...entry,
      share: entry.value / totalAnnualValue
    }));
  }

  function supplierBreakdown(items) {
    const groups = new Map();
    items.forEach((item) => {
      if (!groups.has(item.supplier)) {
        groups.set(item.supplier, {
          supplier: item.supplier,
          items: 0,
          flagged: 0,
          inventoryValue: 0,
          annualValue: 0
        });
      }
      const entry = groups.get(item.supplier);
      entry.items += 1;
      entry.inventoryValue += item.inventoryValue;
      entry.annualValue += item.annualConsumptionValue;
      if (item.reorderRisk || item.isDeadStock) entry.flagged += 1;
    });

    return [...groups.values()]
      .map((entry) => ({
        ...entry,
        riskShare: entry.items ? entry.flagged / entry.items : 0
      }))
      .sort((a, b) => (b.flagged - a.flagged) || (b.annualValue - a.annualValue));
  }

  function metricCard(label, value, helper, accent) {
    return `
      <article class="rounded-3xl border border-white/8 bg-white/[0.03] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <p class="text-xs uppercase tracking-[0.18em] text-gray-500">${label}</p>
        <p class="mt-3 text-3xl font-bold ${accent}">${value}</p>
        <p class="mt-2 text-sm text-gray-400">${helper}</p>
      </article>
    `;
  }

  function renderMetrics(items) {
    const stats = summarize(items);
    elements.metricGrid.innerHTML = [
      metricCard('Filtered SKUs', formatNumber(stats.totalItems), 'Items matching current filters', 'text-[#00D9FF]'),
      metricCard('Inventory Value', formatCurrency(stats.totalValue), 'Current on-hand inventory value', 'text-white'),
      metricCard('Reorder Risk', formatNumber(stats.riskItems), 'SKUs below safety or cover threshold', 'text-[#FF8A5B]'),
      metricCard('Dead Stock Value', formatCurrency(stats.deadStockValue), 'Slow-moving capital tied in stock', 'text-[#FFE066]'),
      metricCard('Average Cover Days', formatNumber(stats.avgCover, 1), 'Days of stock coverage vs current demand', 'text-[#00FF94]'),
      metricCard('Health Score', formatNumber(stats.avgHealth, 0), `Avg turnover ${formatNumber(stats.avgTurnover, 1)}x`, 'text-[#8BC7FF]')
    ].join('');
  }

  function lineChartPath(values, width, height, padding) {
    const max = Math.max(...values, 1);
    const min = 0;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return values.map((value, index) => {
      const x = padding + (usableWidth / Math.max(values.length - 1, 1)) * index;
      const y = height - padding - ((value - min) / (max - min || 1)) * usableHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  function renderDemandChart(items) {
    const series = monthlySeries(items);
    const demandValues = series.map((entry) => entry.demand);
    const stockValues = series.map((entry) => entry.stock);
    const width = 760;
    const height = 300;
    const padding = 36;
    const topValue = Math.max(...demandValues, ...stockValues, 1);
    const yTicks = 4;

    const tickLines = Array.from({ length: yTicks + 1 }, (_, index) => {
      const y = padding + ((height - padding * 2) / yTicks) * index;
      const value = Math.round(topValue - (topValue / yTicks) * index);
      return `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.08)" />
        <text x="0" y="${y + 5}" fill="#6B7280" font-size="12">${formatNumber(value)}</text>
      `;
    }).join('');

    const monthLabels = series.map((entry, index) => {
      const x = padding + ((width - padding * 2) / Math.max(series.length - 1, 1)) * index;
      return `<text x="${x}" y="${height - 6}" fill="#6B7280" font-size="12" text-anchor="middle">${entry.label}</text>`;
    }).join('');

    elements.demandChart.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="h-[300px] w-full">
        ${tickLines}
        ${monthLabels}
        <path d="${lineChartPath(stockValues, width, height, padding)}" fill="none" stroke="#00D9FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="${lineChartPath(demandValues, width, height, padding)}" fill="none" stroke="#00FF94" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
  }

  function renderCategoryChart(items) {
    const data = categoryBreakdown(items).slice(0, 5);
    const maxValue = Math.max(...data.map((entry) => entry.value), 1);

    elements.categoryChart.innerHTML = data.map((entry) => {
      const width = (entry.value / maxValue) * 100;
      return `
        <div class="space-y-2">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-white">${entry.category}</p>
              <p class="text-xs text-gray-500">${formatNumber(entry.avgTurnover, 1)}x turnover • ${entry.riskCount} flagged</p>
            </div>
            <p class="text-sm text-gray-300">${formatCurrency(entry.value)}</p>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white/5">
            <div class="h-full rounded-full bg-gradient-to-r from-[#00D9FF] via-[#00FF94] to-[#FFE066]" style="width:${width}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAbcMix(items) {
    const colors = {
      A: 'from-[#00D9FF]/20 to-[#00D9FF]/5 border-[#00D9FF]/20 text-[#8EDBFF]',
      B: 'from-[#00FF94]/20 to-[#00FF94]/5 border-[#00FF94]/20 text-[#BBFFD8]',
      C: 'from-[#FFE066]/20 to-[#FFE066]/5 border-[#FFE066]/20 text-[#FFF2B8]'
    };

    elements.abcMixChart.innerHTML = abcBreakdown(items).map((entry) => `
      <article class="rounded-3xl border bg-gradient-to-br ${colors[entry.label]} p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-white">Class ${entry.label}</p>
            <p class="mt-1 text-xs text-gray-400">${formatNumber(entry.items)} SKUs • ${formatNumber(entry.flagged)} flagged</p>
          </div>
          <p class="text-sm font-semibold">${formatNumber(entry.share * 100, 1)}%</p>
        </div>
        <div class="mt-4 h-3 overflow-hidden rounded-full bg-black/15">
          <div class="h-full rounded-full bg-white/70" style="width:${entry.share * 100}%"></div>
        </div>
        <p class="mt-4 text-sm text-gray-300">${formatCurrency(entry.value)} annual consumption value</p>
      </article>
    `).join('');
  }

  function renderSupplierRisk(items) {
    const rows = supplierBreakdown(items).slice(0, 5);
    const maxFlagged = Math.max(...rows.map((entry) => entry.flagged), 1);

    elements.supplierRiskTable.innerHTML = rows.map((entry) => `
      <article class="space-y-2 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-white">${entry.supplier}</p>
            <p class="text-xs text-gray-500">${formatNumber(entry.flagged)} flagged of ${formatNumber(entry.items)} items • ${formatNumber(entry.riskShare * 100, 0)}% risk share</p>
          </div>
          <p class="text-sm text-gray-300">${formatCurrency(entry.inventoryValue)}</p>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-white/5">
          <div class="h-full rounded-full bg-gradient-to-r from-[#FF8A5B] to-[#FFE066]" style="width:${(entry.flagged / maxFlagged) * 100}%"></div>
        </div>
      </article>
    `).join('');
  }

  function renderExecutiveSummary(items) {
    const stats = summarize(items);
    const riskItems = [...items]
      .filter((item) => item.reorderRisk)
      .sort((a, b) => (a.coverDays - b.coverDays) || (b.annualConsumptionValue - a.annualConsumptionValue));
    const topRisk = riskItems[0];
    const deadItem = [...items]
      .filter((item) => item.isDeadStock)
      .sort((a, b) => b.inventoryValue - a.inventoryValue)[0];
    const supplier = supplierBreakdown(items)[0];

    const summaryLine = topRisk
      ? `${topRisk.sku} is the first reorder candidate with ${formatNumber(topRisk.coverDays, 1)} cover days against a ${formatNumber(topRisk.bufferedLeadTime, 1)} day threshold.`
      : 'No urgent reorder candidates are showing under the current filter set.';

    const bullets = [
      `${formatNumber(stats.riskItems)} of ${formatNumber(stats.totalItems)} SKUs are currently at risk (${formatNumber(stats.riskShare * 100, 0)}% of the filtered view).`,
      deadItem
        ? `Highest slow-moving exposure is ${deadItem.sku} at ${formatCurrency(deadItem.inventoryValue)} of on-hand value.`
        : 'No dead-stock exposure is currently flagged under this scenario.',
      supplier
        ? `${supplier.supplier} has the highest visible supplier concentration with ${formatNumber(supplier.flagged)} flagged items.`
        : 'Supplier risk is evenly distributed across the current filter.'
    ];

    elements.executiveSummary.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-gray-500">Executive Summary</p>
          <h2 class="mt-3 text-2xl font-bold text-white">What needs attention right now</h2>
          <p class="mt-4 text-base leading-relaxed text-gray-300">${summaryLine}</p>
          <div class="mt-5 grid gap-3">
            ${bullets.map((bullet) => `
              <div class="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">${bullet}</div>
            `).join('')}
          </div>
        </div>
        <div class="rounded-[1.75rem] border border-[#00D9FF]/12 bg-gradient-to-br from-[#00D9FF]/10 via-white/[0.02] to-[#00FF94]/10 p-5">
          <p class="text-xs uppercase tracking-[0.18em] text-[#8BC7FF]">Current filter posture</p>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Health</p>
              <p class="mt-2 text-2xl font-bold text-white">${formatNumber(stats.avgHealth, 0)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Avg Cover</p>
              <p class="mt-2 text-2xl font-bold text-white">${formatNumber(stats.avgCover, 1)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Inventory Value</p>
              <p class="mt-2 text-lg font-bold text-white">${formatCurrency(stats.totalValue)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Scenario</p>
              <p class="mt-2 text-sm font-semibold text-white">${formatNumber(state.safetyMultiplier, 2)}x safety • ${formatNumber(state.leadTimeBuffer, 2)}x lead</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderActions(items) {
    const riskItems = [...items]
      .filter((item) => item.reorderRisk)
      .sort((a, b) => (a.coverDays - b.coverDays) || (b.annualDemand - a.annualDemand))
      .slice(0, 4);

    const deadItems = [...items]
      .filter((item) => item.isDeadStock)
      .sort((a, b) => b.inventoryValue - a.inventoryValue)
      .slice(0, 2);

    const actionCards = [];
    if (riskItems[0]) {
      actionCards.push({
        title: 'Urgent reorder attention',
        body: `${riskItems[0].sku} has ${formatNumber(riskItems[0].coverDays, 1)} cover days against a buffered lead-time target of ${formatNumber(riskItems[0].bufferedLeadTime, 1)} days.`,
        tone: 'from-[#FF8A5B]/20 to-[#FF8A5B]/5 border-[#FF8A5B]/20'
      });
    }
    if (riskItems.length > 1) {
      actionCards.push({
        title: 'This week purchase queue',
        body: `${formatNumber(riskItems.length)} SKUs are below safety or cover threshold and should be reviewed with suppliers.`,
        tone: 'from-[#00D9FF]/20 to-[#00D9FF]/5 border-[#00D9FF]/20'
      });
    }
    if (deadItems[0]) {
      actionCards.push({
        title: 'Slow-moving value',
        body: `${deadItems[0].sku} is the highest dead-stock item at ${formatCurrency(deadItems[0].inventoryValue)} on hand.`,
        tone: 'from-[#FFE066]/20 to-[#FFE066]/5 border-[#FFE066]/20'
      });
    }

    const avgHealth = summarize(items).avgHealth;
    actionCards.push({
      title: 'Health snapshot',
      body: `Current filtered inventory health is ${formatNumber(avgHealth, 0)}/100. Use category and supplier filters to drill into root causes.`,
      tone: 'from-[#00FF94]/20 to-[#00FF94]/5 border-[#00FF94]/20'
    });

    elements.actionList.innerHTML = actionCards.slice(0, 4).map((action) => `
      <article class="rounded-3xl border bg-gradient-to-br ${action.tone} p-5">
        <p class="text-sm font-semibold text-white">${action.title}</p>
        <p class="mt-2 text-sm leading-relaxed text-gray-300">${action.body}</p>
      </article>
    `).join('');
  }

  function riskBadge(status) {
    if (status === 'Dead Stock') return 'bg-[#FFE066]/10 text-[#FFE066] border-[#FFE066]/20';
    if (status === 'Urgent Reorder') return 'bg-[#FF8A5B]/10 text-[#FF8A5B] border-[#FF8A5B]/20';
    if (status === 'Watchlist') return 'bg-[#8BC7FF]/10 text-[#8BC7FF] border-[#8BC7FF]/20';
    return 'bg-[#00FF94]/10 text-[#00FF94] border-[#00FF94]/20';
  }

  function recommendation(item) {
    if (item.isDeadStock) return 'Review min/max and freeze purchasing';
    if (item.coverDays < item.bufferedLeadTime * 0.75) return 'Escalate reorder with supplier';
    if (item.reorderRisk) return 'Add to weekly PO review';
    return 'Monitor';
  }

  function renderAlertTable(items) {
    const rows = [...items]
      .filter((item) => item.reorderRisk || item.isDeadStock)
      .sort((a, b) => (a.healthScore - b.healthScore) || (a.coverDays - b.coverDays))
      .slice(0, 14);

    elements.alertTable.innerHTML = rows.map((item) => `
      <tr class="table-row-button cursor-pointer border-b border-white/5" data-sku="${item.sku}">
        <td class="py-3 pr-4 align-top">
          <p class="font-semibold text-white">${item.sku}</p>
          <p class="text-xs text-gray-500">${item.category}</p>
        </td>
        <td class="py-3 pr-4 text-gray-300">${item.supplier}</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatNumber(item.availableStock)}</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatNumber(item.effectiveSafetyStock)}</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatNumber(item.coverDays, 1)}</td>
        <td class="py-3 pr-4">
          <span class="inline-flex rounded-full border px-3 py-1 text-xs font-medium ${riskBadge(item.status)}">${item.status}</span>
        </td>
        <td class="py-3 text-sm text-gray-400">${recommendation(item)}</td>
      </tr>
    `).join('') || `
      <tr>
        <td colspan="7" class="py-8 text-center text-gray-500">No flagged SKUs under the current filters.</td>
      </tr>
    `;

    elements.alertTable.querySelectorAll('[data-sku]').forEach((row) => {
      row.addEventListener('click', () => {
        state.selectedSku = row.dataset.sku || '';
        renderSelectedItem(items);
      });
    });
  }

  function renderDetailTable(items) {
    const rows = [...items]
      .sort((a, b) => (a.healthScore - b.healthScore) || (b.inventoryValue - a.inventoryValue))
      .slice(0, 18);

    elements.detailTable.innerHTML = rows.map((item) => `
      <tr class="table-row-button cursor-pointer border-b border-white/5" data-sku="${item.sku}">
        <td class="py-3 pr-4">
          <p class="font-semibold text-white">${item.sku}</p>
          <p class="text-xs text-gray-500">${item.name}</p>
        </td>
        <td class="py-3 pr-4 text-gray-300">${item.category}</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatCurrency(item.inventoryValue)}</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatNumber(item.turnoverRate, 1)}x</td>
        <td class="py-3 pr-4 text-right text-gray-300">${formatNumber(item.coverDays, 1)}</td>
        <td class="py-3 text-right text-gray-300">${formatNumber(item.healthScore, 0)}</td>
      </tr>
    `).join('');

    elements.detailTable.querySelectorAll('[data-sku]').forEach((row) => {
      row.addEventListener('click', () => {
        state.selectedSku = row.dataset.sku || '';
        renderSelectedItem(items);
      });
    });
  }

  function renderResultLabel(items) {
    const categoryLabel = state.category === 'all' ? 'all categories' : state.category;
    const supplierLabel = state.supplier === 'all' ? 'all suppliers' : state.supplier;
    elements.resultLabel.textContent = `${formatNumber(items.length)} SKUs shown • ${categoryLabel} • ${supplierLabel}`;
  }

  function downloadAlerts(items) {
    const rows = [...items]
      .filter((item) => item.reorderRisk || item.isDeadStock)
      .sort((a, b) => (a.healthScore - b.healthScore) || (a.coverDays - b.coverDays))
      .map((item) => ({
        sku: item.sku,
        name: item.name,
        category: item.category,
        supplier: item.supplier,
        status: item.status,
        available_stock: item.availableStock,
        safety_stock: item.safetyStock,
        cover_days: formatNumber(item.coverDays, 1),
        recommendation: recommendation(item)
      }));

    const header = Object.keys(rows[0] || {
      sku: '',
      name: '',
      category: '',
      supplier: '',
      status: '',
      available_stock: '',
      safety_stock: '',
      cover_days: '',
      recommendation: ''
    });

    const csv = [
      header.join(','),
      ...rows.map((row) => header.map((key) => `"${String(row[key]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-alerts.csv';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function miniBars(values) {
    const topValue = Math.max(...values, 1);
    return values.map((value, index) => {
      const height = Math.max(10, (value / topValue) * 100);
      return `
        <div class="flex flex-1 flex-col items-center gap-2">
          <div class="w-full rounded-t-xl bg-gradient-to-t from-[#00D9FF] to-[#00FF94]" style="height:${height}px"></div>
          <span class="text-[10px] uppercase tracking-[0.12em] text-gray-500">${MONTH_LABELS[index + (MONTH_LABELS.length - values.length)]}</span>
        </div>
      `;
    }).join('');
  }

  function renderSelectedItem(items) {
    const selected = items.find((item) => item.sku === state.selectedSku) || items[0];
    if (!selected) {
      elements.selectedSkuPanel.innerHTML = '<p class="text-sm text-gray-500">No SKU available under the current filters.</p>';
      return;
    }

    state.selectedSku = selected.sku;
    const recentDemand = average(selected.monthlyDemand.slice(-3));
    const demandTrend = selected.monthlyDemand.slice(-6);
    const forecast = reorderSuggestion(selected);

    elements.selectedSkuPanel.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article class="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-gray-500">Selected Item</p>
              <h3 class="mt-3 text-2xl font-bold text-white">${selected.sku}</h3>
              <p class="mt-1 text-sm text-gray-400">${selected.name}</p>
            </div>
            <span class="inline-flex rounded-full border px-3 py-1 text-xs font-medium ${riskBadge(selected.status)}">${selected.status}</span>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Supplier</p>
              <p class="mt-2 font-semibold text-white">${selected.supplier}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Category</p>
              <p class="mt-2 font-semibold text-white">${selected.category}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Available Stock</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.availableStock)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Buffered Lead Time</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.bufferedLeadTime, 1)} days</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Effective Safety</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.effectiveSafetyStock)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Health Score</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.healthScore, 0)} / 100</p>
            </div>
          </div>
        </article>

        <article class="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5">
          <p class="text-xs uppercase tracking-[0.18em] text-gray-500">Demand Pattern</p>
          <div class="mt-5 flex h-[132px] items-end gap-2">
            ${miniBars(demandTrend)}
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-4">
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Recent Demand</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(recentDemand, 1)} / month</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Cover Days</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.coverDays, 1)}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Turnover</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(selected.turnoverRate, 1)}x</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-black/10 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Annual Value</p>
              <p class="mt-2 font-semibold text-white">${formatCurrency(selected.annualConsumptionValue)}</p>
            </div>
          </div>
          <div class="mt-5 grid gap-3 md:grid-cols-3">
            <div class="rounded-2xl border border-[#00D9FF]/15 bg-[#00D9FF]/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Forecast Next 30D</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(forecast.nextMonthDemand, 0)} units</p>
            </div>
            <div class="rounded-2xl border border-[#FFE066]/15 bg-[#FFE066]/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Target Stock</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(forecast.targetStock)}</p>
            </div>
            <div class="rounded-2xl border border-[#00FF94]/15 bg-[#00FF94]/5 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-gray-500">Suggested Reorder</p>
              <p class="mt-2 font-semibold text-white">${formatNumber(forecast.reorderQty)}</p>
            </div>
          </div>
          <div class="mt-5 rounded-2xl border border-[#00D9FF]/15 bg-[#00D9FF]/5 p-4 text-sm text-gray-300">
            <p class="font-semibold text-white">Decision logic</p>
            <p class="mt-2">${selected.sku} is tagged as <span class="text-white">${selected.status}</span> because available stock is ${formatNumber(selected.availableStock)}, effective safety stock is ${formatNumber(selected.effectiveSafetyStock)}, and the item has ${formatNumber(selected.coverDays, 1)} days of cover versus a buffered lead time of ${formatNumber(selected.bufferedLeadTime, 1)} days. Suggested reorder quantity is ${formatNumber(forecast.reorderQty)} units based on a target of ${formatNumber(forecast.targetCoverageDays, 1)} coverage days.</p>
          </div>
        </article>
      </div>
    `;
  }

  function render() {
    const filtered = getFilteredData();
    updateScenarioLabel();
    renderExecutiveSummary(filtered);
    renderMetrics(filtered);
    renderDemandChart(filtered);
    renderCategoryChart(filtered);
    renderAbcMix(filtered);
    renderSupplierRisk(filtered);
    renderActions(filtered);
    renderAlertTable(filtered);
    renderDetailTable(filtered);
    renderSelectedItem(filtered);
    renderResultLabel(filtered);

    elements.downloadBtn.onclick = () => downloadAlerts(filtered);
  }

  function bindEvents() {
    elements.categoryFilter.addEventListener('change', (event) => {
      state.category = event.target.value;
      render();
    });
    elements.supplierFilter.addEventListener('change', (event) => {
      state.supplier = event.target.value;
      render();
    });
    elements.statusFilter.addEventListener('change', (event) => {
      state.status = event.target.value;
      render();
    });
    elements.searchInput.addEventListener('input', (event) => {
      state.search = String(event.target.value || '').toLowerCase().trim();
      render();
    });
    if (elements.scenarioSafety) {
      elements.scenarioSafety.addEventListener('input', (event) => {
        state.safetyMultiplier = Number(event.target.value || 1);
        render();
      });
    }
    if (elements.scenarioLead) {
      elements.scenarioLead.addEventListener('input', (event) => {
        state.leadTimeBuffer = Number(event.target.value || 1);
        render();
      });
    }
  }

  populateFilters();
  bindEvents();
  render();
})();
