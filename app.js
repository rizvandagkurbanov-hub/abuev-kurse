/* Abuev — основная логика: состояние, рендер, курсы, график. */

var state = {
  lang: "ru",
  theme: "auto",
  base: "USD",
  prevBase: "USD",
  view: "fiat",
  rates: {},
  apiRates: {},
  updatedAt: 0,
  favorites: [],
  query: "",
  ratesQuery: "",
  tabsOpen: false,
  screen: "converter",
  loading: false,
  chart: null,
  installPrompt: null
};

var RATES_URLS = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json"
];
var HISTORY_CACHE_MS = 6 * 60 * 60 * 1000;

/* ================= инициализация ================= */

function init() {
  restoreState();
  applyTheme(state.theme);
  applyLang(state.lang, true);
  bindEvents();
  renderTabs();
  renderList();
  renderRates();
  updateStatus(state.updatedAt
    ? t("updated_at") + " · " + formatTime(state.updatedAt, state.lang)
    : t("status_loading"));
  registerServiceWorker();
  watchConnection();
  syncRates({ silent: true });
}

function restoreState() {
  var savedLang = loadJSON("abuev_lang", null);
  if (savedLang && translations[savedLang]) state.lang = savedLang;
  else {
    var sys = (navigator.language || "ru").split("-")[0];
    state.lang = translations[sys] ? sys : "ru";
  }

  state.theme = loadJSON("abuev_theme", "auto");
  var base = loadJSON("abuev_base", "USD");
  if (FIAT.some(function (x) { return x.c === base; })) state.base = base;

  state.rates = Object.assign({}, DEFAULT_RATES);
  var storedRates = loadJSON("abuev_rates", null);
  if (storedRates) {
    Object.keys(storedRates).forEach(function (code) {
      var v = storedRates[code];
      if (typeof v === "number" && v > 0) state.rates[code] = v;
    });
  }
  state.apiRates = Object.assign({}, state.rates);
  state.updatedAt = loadJSON("abuev_rates_at", 0) || 0;

  var favs = loadJSON("abuev_favorites", []);
  if (Array.isArray(favs)) {
    state.favorites = favs.filter(function (c) {
      return FIAT.concat(CRYPTO).some(function (x) { return x.c === c; });
    });
  }
}

/* ================= тема ================= */

function applyTheme(mode) {
  state.theme = mode;
  document.documentElement.setAttribute("data-theme", mode);
  saveJSON("abuev_theme", mode);
  updateThemeMeta();
}

function currentThemeIsDark() {
  if (state.theme === "dark") return true;
  if (state.theme === "light") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function updateThemeMeta() {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", currentThemeIsDark() ? "#0b1020" : "#f4f6fb");
}

function cycleTheme() {
  var order = ["auto", "light", "dark"];
  var next = order[(order.indexOf(state.theme) + 1) % order.length];
  applyTheme(next);
  haptic();
  toast(t("theme") + ": " + t("theme_" + next));
  if (state.chart) drawChart(state.chart.activeIndex);
}

/* ================= язык ================= */

function applyLang(lang, firstRun) {
  if (!translations[lang]) lang = "ru";
  state.lang = lang;
  saveJSON("abuev_lang", lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t("app_title") + " — " + t("app_subtitle");

  var select = $("#langSelect");
  if (select) select.value = lang;

  translateStatic();
  if (typeof setTabsExpanded === "function") setTabsExpanded(state.tabsOpen);

  var amt = $("#amt");
  if (amt) amt.setAttribute("aria-label", t("amount"));

  applyAriaLabels();
  renderTabs();
  renderList();
  renderRates();
  renderSegThumbs();

  if (!firstRun) {
    var st = $("#status");
    if (st) {
      st.textContent = state.updatedAt
        ? t("updated_at") + " · " + formatTime(state.updatedAt, state.lang)
        : t("status_error");
    }
  }

  if (state.chart) {
    updateChartHeader();
    renderChartStats(state.chart.series || []);
    drawChart(state.chart.activeIndex);
  }
}

function translateStatic() {
  $$("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (translations[state.lang][key]) el.textContent = translations[state.lang][key];
  });
  $$("[data-i18n-ph]").forEach(function (el) {
    var key = el.getAttribute("data-i18n-ph");
    if (translations[state.lang][key]) el.placeholder = translations[state.lang][key];
  });
  $$("[data-i18n-title]").forEach(function (el) {
    var key = el.getAttribute("data-i18n-title");
    if (translations[state.lang][key]) el.title = translations[state.lang][key];
  });
}

function applyAriaLabels() {
  var map = [
    ["#themeBtn", "theme"],
    ["#installBtn", "install"],
    ["#closeChart", "close"],
    ["#searchInput", "search_ph"],
    ["#ratesSearch", "rates_search_ph"],
    ["#swapBtn", "base_label"]
  ];
  map.forEach(function (pair) {
    var el = $(pair[0]);
    if (el) el.setAttribute("aria-label", t(pair[1]));
  });
}

/* ================= вкладки базовой валюты ================= */

function activeList() {
  return state.view === "crypto" ? CRYPTO : FIAT;
}

function renderTabs() {
  var wrap = $("#tabs");
  if (!wrap) return;
  var fragment = document.createDocumentFragment();
  FIAT.forEach(function (item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab" + (item.c === state.base ? " on" : "");
    btn.textContent = item.c;
    btn.setAttribute("aria-pressed", item.c === state.base ? "true" : "false");
    btn.setAttribute("aria-label", currencyName(item, state.lang));
    btn.addEventListener("click", function () {
      haptic();
      setBase(item.c);
    });
    fragment.appendChild(btn);
  });
  wrap.textContent = "";
  wrap.appendChild(fragment);

  var badge = $("#baseCode");
  if (badge) badge.textContent = state.base;
}

function setBase(code) {
  state.base = code;
  saveJSON("abuev_base", code);
  renderTabs();
  renderList();
}

/* ================= список конвертации ================= */

function matchesQuery(item, query) {
  if (!query) return true;
  var q = query.toLowerCase();
  if (item.c.toLowerCase().indexOf(q) > -1) return true;
  var name = currencyName(item, state.lang).toLowerCase();
  if (name.indexOf(q) > -1) return true;
  if (item.n && item.n.en && item.n.en.toLowerCase().indexOf(q) > -1) return true;
  return false;
}

function convert(amount, from, to) {
  var rf = state.rates[from] || 0;
  var rt = state.rates[to] || 0;
  if (!rf || !rt) return 0;
  return amount * rf / rt;
}

function renderList(animate) {
  var listEl = $("#list");
  var emptyEl = $("#empty");
  if (!listEl) return;

  var query = state.query.trim();
  var items = activeList().filter(function (item) { return matchesQuery(item, query); });
  items = sortFavorites(items);

  listEl.textContent = "";
  if (emptyEl) emptyEl.hidden = items.length > 0;

  var amount = parseAmount($("#amt") ? $("#amt").value : 0);
  var calc = amount > 0 ? amount : 1;
  var fragment = document.createDocumentFragment();

  items.forEach(function (item) {
    fragment.appendChild(buildRow(item, calc, amount, animate !== false));
  });

  listEl.appendChild(fragment);
  staggerIn(listEl);
  renderSegThumbs();
}

function buildRow(item, calcAmount, realAmount, animate) {
  var isBase = item.c === state.base;
  var value = isBase ? calcAmount : convert(calcAmount, state.base, item.c);
  var one = convert(1, state.base, item.c);
  var rubValue = convert(value, item.c, "RUB");
  var fav = state.favorites.indexOf(item.c) > -1;

  var row = document.createElement("article");
  row.className = "row" + (isBase ? " src" : "");
  row.setAttribute("role", "listitem");
  row.setAttribute("data-code", item.c);

  /* звезда */
  var star = document.createElement("button");
  star.type = "button";
  star.className = "star" + (fav ? " on" : "");
  star.setAttribute("aria-pressed", fav ? "true" : "false");
  star.setAttribute("aria-label", fav ? t("remove_fav") : t("add_fav"));
  star.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3.1 1.3-6.2L3 9.6l6.3-.7z"/></svg>';
  star.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleFavorite(item.c);
  });

  /* название */
  var main = document.createElement("div");
  main.className = "row-main";
  if (!isBase) {
    main.addEventListener("click", function () { openChart(item.c); });
    main.setAttribute("role", "button");
    main.setAttribute("tabindex", "0");
    main.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openChart(item.c); }
    });
  }

  var code = document.createElement("div");
  code.className = "row-code";
  code.appendChild(document.createTextNode(item.c));
  if (!isBase) {
    code.insertAdjacentHTML("beforeend",
      '<svg class="row-chart" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16.5 9 10l5 4 7-8"/><path d="M15 6h6v6"/></svg>');
  }

  var sym = document.createElement("span");
  sym.className = "row-sym";
  sym.textContent = item.s;
  code.insertBefore(sym, code.firstChild);

  var name = document.createElement("div");
  name.className = "row-name";
  name.textContent = currencyName(item, state.lang);

  main.appendChild(code);
  main.appendChild(name);

  /* значение */
  var valueBox = document.createElement("div");
  valueBox.className = "row-value";
  valueBox.setAttribute("role", "button");
  valueBox.setAttribute("tabindex", "0");

  var valueLine = document.createElement("div");
  valueLine.className = "value";

  var num = document.createElement("span");
  num.className = "num";
  valueLine.appendChild(num);

  var unit = document.createElement("small");
  unit.textContent = item.s;
  valueLine.appendChild(unit);

  var per = document.createElement("div");
  per.className = "per";
  if (isBase) {
    per.textContent = "≈ " + formatShort(convert(calcAmount, item.c, "RUB"), state.lang) + " ₽";
  } else if (state.view === "crypto" && item.c !== "RUB") {
    per.textContent = "≈ " + formatShort(rubValue, state.lang) + " ₽";
  } else {
    per.textContent = "1 " + state.base + " = " + formatShort(one, state.lang) + " " + item.c;
  }

  valueBox.appendChild(valueLine);
  valueBox.appendChild(per);

  function copyValue() {
    var text = formatMoney(value, state.lang) + " " + item.c;
    copyText(text).then(function (ok) { toast(ok ? t("toast_copied") : t("toast_copy_error")); });
  }
  valueBox.addEventListener("click", copyValue);
  valueBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); copyValue(); }
  });

  /* поделиться */
  var share = document.createElement("button");
  share.type = "button";
  share.className = "row-share";
  share.setAttribute("aria-label", t("share"));
  share.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3"/></svg>';
  share.addEventListener("click", function (event) {
    event.stopPropagation();
    haptic();
    var total = isBase ? calcAmount : value;
    var text = formatMoney(isBase ? realAmount || calcAmount : total, state.lang) + " " + state.base +
      " = " + formatMoney(total, state.lang) + " " + item.c;
    shareResult(text);
  });

  row.appendChild(star);
  row.appendChild(main);
  row.appendChild(valueBox);
  row.appendChild(share);

  countUpIfNeeded(num, value, state.lang, animate);
  return row;
}

function countUpIfNeeded(el, value, lang, animate) {
  if (animate) countUp(el, value, lang);
  else el.textContent = formatMoney(value, lang);
}

function toggleFavorite(code) {
  var index = state.favorites.indexOf(code);
  if (index > -1) state.favorites.splice(index, 1);
  else {
    state.favorites.push(code);
    haptic();
  }
  saveJSON("abuev_favorites", state.favorites);
  renderList(false);
}

/* ================= экран курсов ================= */

function renderRates() {
  var wrap = $("#ratesList");
  if (!wrap) return;
  var query = state.ratesQuery.trim();
  var items = FIAT.concat(CRYPTO).filter(function (item) { return matchesQuery(item, query); });

  wrap.textContent = "";
  if (!items.length) {
    var empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = t("no_results");
    wrap.appendChild(empty);
    return;
  }

  items.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "rate-row";

    var label = document.createElement("div");
    var code = document.createElement("span");
    code.className = "rate-code";
    code.textContent = item.c;
    var name = document.createElement("span");
    name.className = "rate-name";
    name.textContent = currencyName(item, state.lang);
    label.appendChild(code);
    label.appendChild(name);

    var input = document.createElement("input");
    input.className = "rate-input";
    input.type = "text";
    input.inputMode = "decimal";
    input.value = formatNumber(state.rates[item.c] || 0, state.lang, 2, 4);
    input.setAttribute("aria-label", item.c + " — " + currencyName(item, state.lang) + " / RUB");
    input.addEventListener("input", function () {
      var parsed = parseAmount(input.value);
      if (parsed > 0) {
        state.rates[item.c] = parsed;
        saveJSON("abuev_rates", state.rates);
        saveJSON("abuev_rates_at", state.updatedAt);
        renderList(false);
      }
    });
    input.addEventListener("blur", function () {
      input.value = formatNumber(state.rates[item.c] || 0, state.lang, 2, 4);
    });

    row.appendChild(label);
    row.appendChild(input);
    wrap.appendChild(row);
  });
}

/* ================= загрузка курсов ================= */

function fetchJSON(urls, timeoutMs) {
  var list = urls.slice();
  var timeout = timeoutMs || 9000;

  function attempt(index) {
    if (index >= list.length) return Promise.reject(new Error("network"));
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, timeout);
    return fetch(list[index], { cache: "no-store", signal: controller ? controller.signal : undefined })
      .then(function (response) {
        clearTimeout(timer);
        if (!response.ok) throw new Error("http " + response.status);
        return response.json();
      })
      .catch(function (error) {
        clearTimeout(timer);
        return attempt(index + 1);
      });
  }
  return attempt(0);
}

async function fetchRates() {
  var data = await fetchJSON(RATES_URLS);
  var usd = data && data.usd;
  if (!usd || !(usd.rub > 0)) throw new Error("bad payload");

  var next = {};
  FIAT.concat(CRYPTO).forEach(function (item) {
    if (item.c === "RUB") { next.RUB = 1; return; }
    var rate = usd[item.c.toLowerCase()];
    if (rate > 0) next[item.c] = usd.rub / rate;
  });
  next.RUB = 1;
  if (!next.USD) next.USD = usd.rub;

  Object.keys(next).forEach(function (code) {
    if (next[code] > 0) state.rates[code] = next[code];
  });
  state.apiRates = Object.assign({}, state.rates);
  state.updatedAt = Date.now();
  saveJSON("abuev_rates", state.rates);
  saveJSON("abuev_rates_at", state.updatedAt);
}

async function syncRates(options) {
  var opts = options || {};
  if (state.loading) return;
  state.loading = true;
  setButtonState(true);
  updateStatus(t("status_loading"));

  try {
    await fetchRates();
    renderRates();
    renderList(false);
    updateStatus(t("status_updated") + " · " + formatTime(state.updatedAt, state.lang));
    if (!opts.silent) toast(t("status_updated"));
  } catch (error) {
    updateStatus(t("status_error"));
  } finally {
    state.loading = false;
    setButtonState(false);
  }
}

function setButtonState(loading) {
  var btn = $("#updateBtn");
  var spinner = $("#btnSpinner");
  var text = $("#btnText");
  if (btn) btn.disabled = loading;
  if (spinner) spinner.hidden = !loading;
  if (text) text.textContent = loading ? t("btn_loading") : t("btn_update");
}

function updateStatus(text) {
  var el = $("#status");
  if (el) el.textContent = text;
}

/* ================= график ================= */

function todayISO(offsetDays) {
  var date = new Date();
  date.setDate(date.getDate() + offsetDays);
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, "0");
  var d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function historyURLs(dateISO) {
  var datePart = dateISO === todayISO(0) ? "latest" : dateISO;
  return [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@" + datePart + "/v1/currencies/usd.min.json",
    "https://" + datePart + ".currency-api.pages.dev/v1/currencies/usd.min.json"
  ];
}

var dayCache = {};

async function fetchDayUsd(dateISO) {
  if (dayCache[dateISO]) return dayCache[dateISO];
  var data = await fetchJSON(historyURLs(dateISO), 8000);
  if (data && data.usd) dayCache[dateISO] = data.usd;
  return dayCache[dateISO] || null;
}

async function loadSeries(code, days) {
  var cacheKey = "abuev_hist_" + code + "_" + days;
  var cached = loadJSON(cacheKey, null);
  if (cached && cached.at && Date.now() - cached.at < HISTORY_CACHE_MS && Array.isArray(cached.points)) {
    return cached.points.map(function (p) { return { date: p[0], value: p[1] }; });
  }

  var step = days > 10 ? 2 : 1;
  var offsets = [];
  for (var i = days - 1; i >= 0; i -= step) offsets.push(-i);
  if (offsets[offsets.length - 1] !== 0) offsets.push(0);

  var results = await Promise.all(offsets.map(async function (offset) {
    var dateISO = todayISO(offset);
    try {
      var usd = await fetchDayUsd(dateISO);
      if (!usd) return null;
      var rub = usd.rub;
      var rate = code === "RUB" ? 1 : usd[code.toLowerCase()];
      if (!(rub > 0) || !(rate > 0)) return null;
      return { date: dateISO, value: rub / rate };
    } catch (error) {
      return null;
    }
  }));

  var points = results.filter(Boolean);
  if (points.length) {
    saveJSON(cacheKey, { at: Date.now(), points: points.map(function (p) { return [p.date, p.value]; }) });
  }
  return points;
}

function updateChartHeader() {
  var chart = state.chart;
  if (!chart) return;
  var item = FIAT.concat(CRYPTO).filter(function (x) { return x.c === chart.code; })[0];
  var title = $("#chartTitle");
  var subtitle = $("#chartSubtitle");
  if (title) title.textContent = chart.code + " / RUB";
  if (subtitle) subtitle.textContent = item ? currencyName(item, state.lang) : "";
}

async function openChart(code) {
  var modal = $("#chartModal");
  state.chart = { code: code, days: 7, series: [], activeIndex: -1 };
  updateChartHeader();
  setPeriodButtons(7);
  renderChartStats([]);
  showChartState(t("chart_loading"));
  clearCanvas();

  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = $("#closeChart");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  try {
    var series = await loadSeries(code, 7);
    if (!state.chart || state.chart.code !== code) return;
    state.chart.series = series;
    if (!series.length) {
      showChartState(t("chart_error"));
      return;
    }
    hideChartState();
    renderChartStats(series);
    drawChart(-1);
  } catch (error) {
    showChartState(t("chart_error"));
  }
}

function closeChart() {
  var modal = $("#chartModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.chart = null;
}

function showChartState(text) {
  var el = $("#chartState");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("hidden");
}

function hideChartState() {
  var el = $("#chartState");
  if (el) el.classList.add("hidden");
}

function clearCanvas() {
  var canvas = $("#chartCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var tip = $("#chartTip");
  if (tip) tip.hidden = true;
}

function renderChartStats(series) {
  var box = $("#chartStats");
  if (!box) return;
  box.textContent = "";
  if (!series || !series.length) return;

  var values = series.map(function (p) { return p.value; });
  var min = Math.min.apply(null, values);
  var max = Math.max.apply(null, values);
  var first = values[0];
  var last = values[values.length - 1];
  var change = first ? (last - first) / first * 100 : 0;

  function stat(label, text, cls) {
    var div = document.createElement("div");
    div.className = "stat" + (cls ? " " + cls : "");
    var l = document.createElement("span");
    l.className = "stat-label";
    l.textContent = label;
    var v = document.createElement("span");
    v.className = "stat-value";
    v.textContent = text;
    div.appendChild(l);
    div.appendChild(v);
    return div;
  }

  box.appendChild(stat(t("chart_min"), formatMoney(min, state.lang) + " ₽"));
  box.appendChild(stat(t("chart_max"), formatMoney(max, state.lang) + " ₽"));

  var sign = change > 0 ? "+" : "";
  var changeText = sign + formatNumber(change, state.lang, 1, 2) + "%";
  var changeEl = stat(t("chart_change"), changeText, change > 0 ? "up" : change < 0 ? "down" : "");
  box.appendChild(changeEl);
}

function hexToRgba(hex, alpha) {
  var clean = hex.replace("#", "").trim();
  if (clean.length === 3) clean = clean.split("").map(function (c) { return c + c; }).join("");
  var num = parseInt(clean, 16);
  if (!isFinite(num)) return "rgba(59,91,219," + alpha + ")";
  var r = (num >> 16) & 255;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim() || "#3b5bdb";
}

function drawChart(activeIndex) {
  var canvas = $("#chartCanvas");
  var box = $("#chartBox");
  var chart = state.chart;
  if (!canvas || !box || !chart || !chart.series || chart.series.length < 2) return;

  var series = chart.series;
  var rect = box.getBoundingClientRect();
  var width = Math.max(rect.width, 240);
  var height = Math.max(rect.height, 170);
  var dpr = Math.min(window.devicePixelRatio || 1, 2.5);

  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  var ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  var pad = { top: 18, right: 10, bottom: 26, left: 10 };
  var innerW = width - pad.left - pad.right;
  var innerH = height - pad.top - pad.bottom;

  var values = series.map(function (p) { return p.value; });
  var min = Math.min.apply(null, values);
  var max = Math.max.apply(null, values);
  if (min === max) { min *= 0.99; max *= 1.01; }
  var padding = (max - min) * 0.12;
  min -= padding;
  max += padding;

  var accent = cssVar("--accent") || "#3b5bdb";
  var lineColor = cssVar("--line") || "#e4e9f4";
  var muted = cssVar("--muted") || "#657092";
  var card = cssVar("--card") || "#ffffff";

  var x = function (i) { return pad.left + (innerW * i) / (series.length - 1); };
  var y = function (v) { return pad.top + innerH - ((v - min) / (max - min)) * innerH; };

  /* сетка и подписи по Y */
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "left";
  for (var g = 0; g <= 2; g++) {
    var gy = pad.top + (innerH * g) / 2;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(width - pad.right, gy);
    ctx.stroke();
    var labelValue = max - ((max - min) * g) / 2;
    ctx.fillStyle = muted;
    ctx.fillText(formatCompact(labelValue, state.lang), pad.left + 3, gy - 6);
  }
  ctx.setLineDash([]);

  /* заливка */
  var gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  gradient.addColorStop(0, hexToRgba(accent, 0.30));
  gradient.addColorStop(1, hexToRgba(accent, 0));
  ctx.beginPath();
  ctx.moveTo(x(0), y(values[0]));
  for (var i = 1; i < series.length; i++) {
    var prevX = x(i - 1), curX = x(i);
    var midX = (prevX + curX) / 2;
    ctx.bezierCurveTo(midX, y(values[i - 1]), midX, y(values[i]), curX, y(values[i]));
  }
  ctx.lineTo(x(series.length - 1), height - pad.bottom);
  ctx.lineTo(x(0), height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  /* линия */
  ctx.beginPath();
  ctx.moveTo(x(0), y(values[0]));
  for (var j = 1; j < series.length; j++) {
    var px = x(j - 1), cx = x(j);
    var mx = (px + cx) / 2;
    ctx.bezierCurveTo(mx, y(values[j - 1]), mx, y(values[j]), cx, y(values[j]));
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  /* точки */
  ctx.fillStyle = card;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  for (var d = 0; d < series.length; d++) {
    ctx.beginPath();
    ctx.arc(x(d), y(values[d]), d === activeIndex ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  /* подписи дат */
  ctx.fillStyle = muted;
  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "center";
  var labelIndexes = [0, Math.floor((series.length - 1) / 2), series.length - 1];
  labelIndexes.forEach(function (idx, order) {
    var date = new Date(series[idx].date + "T00:00:00");
    ctx.textAlign = order === 0 ? "left" : order === labelIndexes.length - 1 ? "right" : "center";
    ctx.fillText(formatDayMonth(date, state.lang), x(idx), height - 8);
  });

  chart.points = series.map(function (p, idx) { return { x: x(idx), y: y(p.value), value: p.value, date: p.date }; });
  chart.activeIndex = activeIndex;

  /* подсветка выбранной точки */
  if (activeIndex > -1 && chart.points[activeIndex]) {
    var pt = chart.points[activeIndex];
    ctx.strokeStyle = hexToRgba(accent, 0.45);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pt.x, pad.top);
    ctx.lineTo(pt.x, height - pad.bottom);
    ctx.stroke();
  }
}

function handleChartPointer(event) {
  var chart = state.chart;
  var box = $("#chartBox");
  var tip = $("#chartTip");
  if (!chart || !chart.points || !chart.points.length || !box || !tip) return;

  var rect = box.getBoundingClientRect();
  var px = event.clientX - rect.left;
  var nearest = 0;
  var best = Infinity;
  chart.points.forEach(function (point, index) {
    var distance = Math.abs(point.x - px);
    if (distance < best) { best = distance; nearest = index; }
  });

  var point = chart.points[nearest];
  var date = new Date(point.date + "T00:00:00");
  tip.textContent = formatDayMonth(date, state.lang) + " · " + formatMoney(point.value, state.lang) + " ₽";
  tip.style.left = point.x + "px";
  tip.style.top = point.y + "px";
  tip.hidden = false;

  if (chart.activeIndex !== nearest) drawChart(nearest);
}

function hideChartTip() {
  var tip = $("#chartTip");
  if (tip) tip.hidden = true;
  if (state.chart) drawChart(-1);
}

function setPeriodButtons(days) {
  $$("#periodSeg .seg-btn").forEach(function (btn) {
    var on = Number(btn.getAttribute("data-days")) === days;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  moveThumb("#periodSeg", "#periodThumb");
}

async function changePeriod(days) {
  if (!state.chart) return;
  state.chart.days = days;
  setPeriodButtons(days);
  showChartState(t("chart_loading"));
  hideChartTip();
  renderChartStats([]);

  try {
    var series = await loadSeries(state.chart.code, days);
    if (!state.chart) return;
    state.chart.series = series;
    if (!series.length) { showChartState(t("chart_error")); return; }
    hideChartState();
    renderChartStats(series);
    drawChart(-1);
  } catch (error) {
    showChartState(t("chart_error"));
  }
}

/* ================= навигация ================= */

function switchScreen(name, button) {
  state.screen = name;
  $$(".screen").forEach(function (screen) {
    screen.classList.toggle("active", screen.id === "screen-" + name);
  });
  $$(".nav-item").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("data-screen") === name);
  });
  moveNavPill(button || $('.nav-item[data-screen="' + name + '"]'));
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

function setView(view) {
  state.view = view;
  $$("#viewSeg .seg-btn").forEach(function (btn) {
    var on = btn.getAttribute("data-view") === view;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  moveThumb("#viewSeg", "#segThumb");
  renderList();
}

function moveThumb(segSelector, thumbSelector) {
  var seg = $(segSelector);
  var thumb = $(thumbSelector);
  if (!seg || !thumb) return;
  var active = seg.querySelector(".seg-btn.on");
  if (!active) return;
  var segRect = seg.getBoundingClientRect();
  var rect = active.getBoundingClientRect();
  thumb.style.width = rect.width + "px";
  thumb.style.transform = "translateX(" + (rect.left - segRect.left - 3) + "px)";
}

function renderSegThumbs() {
  moveThumb("#viewSeg", "#segThumb");
  if (state.chart) moveThumb("#periodSeg", "#periodThumb");
  var first = document.querySelector('.nav-item.active');
  if (first) moveNavPill(first);
}

/* ================= подключение / SW ================= */

function watchConnection() {
  var bar = $("#offlineBar");
  function update() {
    if (!bar) return;
    bar.hidden = navigator.onLine;
  }
  window.addEventListener("online", function () {
    update();
    syncRates({ silent: true });
  });
  window.addEventListener("offline", update);
  update();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {});
  });
}

/* ================= события ================= */

function bindEvents() {
  var amt = $("#amt");
  if (amt) {
    amt.addEventListener("input", function () {
      renderList(false);
    });
    amt.addEventListener("focus", function () { amt.select(); });
  }

  var themeBtn = $("#themeBtn");
  if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

  var langSelect = $("#langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", function () {
      applyLang(langSelect.value, false);
    });
  }

  var expandBtn = $("#expandBtn");
  if (expandBtn) {
    expandBtn.addEventListener("click", function () {
      haptic();
      setTabsExpanded(!state.tabsOpen);
    });
  }

  var search = $("#searchInput");
  var clearSearch = $("#clearSearch");
  if (search) {
    search.addEventListener("input", function () {
      state.query = search.value;
      if (clearSearch) clearSearch.hidden = !search.value;
      renderList(false);
    });
  }
  if (clearSearch) {
    clearSearch.addEventListener("click", function () {
      if (!search) return;
      search.value = "";
      state.query = "";
      clearSearch.hidden = true;
      renderList(false);
      search.focus();
    });
  }

  var ratesSearch = $("#ratesSearch");
  if (ratesSearch) {
    ratesSearch.addEventListener("input", function () {
      state.ratesQuery = ratesSearch.value;
      renderRates();
    });
  }

  var updateBtn = $("#updateBtn");
  if (updateBtn) {
    updateBtn.addEventListener("click", function () { haptic(); syncRates(); });
  }

  var resetBtn = $("#resetRates");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      haptic();
      state.rates = Object.assign({}, state.apiRates || DEFAULT_RATES);
      state.rates.RUB = 1;
      saveJSON("abuev_rates", state.rates);
      renderRates();
      renderList(false);
      toast(t("reset_rates"));
    });
  }

  $$(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
      haptic();
      switchScreen(item.getAttribute("data-screen"), item);
    });
  });

  $$("#viewSeg .seg-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      haptic();
      setView(btn.getAttribute("data-view"));
    });
  });

  var swapBtn = $("#swapBtn");
  if (swapBtn) {
    swapBtn.addEventListener("click", function () {
      haptic();
      if (state.base === "RUB") {
        setBase(state.prevBase || "USD");
      } else {
        state.prevBase = state.base;
        setBase("RUB");
      }
    });
  }

  /* график */
  $$("#periodSeg .seg-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      haptic();
      changePeriod(Number(btn.getAttribute("data-days")));
    });
  });

  var modal = $("#chartModal");
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.getAttribute("data-close")) closeChart();
    });
  }
  var closeBtn = $("#closeChart");
  if (closeBtn) closeBtn.addEventListener("click", closeChart);

  var canvas = $("#chartCanvas");
  if (canvas) {
    canvas.addEventListener("pointermove", handleChartPointer);
    canvas.addEventListener("pointerleave", hideChartTip);
    canvas.addEventListener("pointercancel", hideChartTip);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.chart) closeChart();
  });

  window.addEventListener("resize", debounce(function () {
    if (state.chart) drawChart(state.chart.activeIndex);
  }, 150));

  /* установка приложения */
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    state.installPrompt = event;
    var btn = $("#installBtn");
    if (btn) btn.hidden = false;
  });

  var installBtn = $("#installBtn");
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!state.installPrompt) return toast(t("install"));
      state.installPrompt.prompt();
      state.installPrompt.userChoice.then(function () {
        state.installPrompt = null;
        installBtn.hidden = true;
      });
    });
  }

  window.addEventListener("appinstalled", function () {
    var btn = $("#installBtn");
    if (btn) btn.hidden = true;
  });

  /* тень у шапки при прокрутке */
  window.addEventListener("scroll", function () {
    var topbar = $(".topbar");
    if (topbar) topbar.classList.toggle("is-scrolled", window.scrollY > 4);
  }, { passive: true });

  if (window.matchMedia) {
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      if (state.theme === "auto") {
        updateThemeMeta();
        if (state.chart) drawChart(state.chart.activeIndex);
      }
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }
}

/* ================= старт ================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
