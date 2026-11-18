/* Abuev — вспомогательные функции: хранилище, форматирование, копирование, тосты. */

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

/* ---------- localStorage ---------- */
function loadJSON(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

/* ---------- переводы ---------- */
function t(key) {
  var dict = translations[state.lang] || translations.ru;
  return dict[key] || translations.ru[key] || key;
}

/* ---------- названия валют ---------- */
var _displayNames = {};
function currencyName(item, lang) {
  var code = item.c;
  if (_displayNames[lang] && _displayNames[lang][code]) return _displayNames[lang][code];
  var result = null;
  try {
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      var dn = new Intl.DisplayNames([LOCALES[lang] || lang], { type: "currency" });
      var name = dn.of(code);
      if (name && name !== code) result = name;
    }
  } catch (e) { /* криптовалюты Intl не знает — используем словарь */ }
  if (!result) result = (item.n && (item.n[lang] || item.n.en)) || code;
  _displayNames[lang] = _displayNames[lang] || {};
  _displayNames[lang][code] = result;
  return result;
}

/* ---------- числа ---------- */
var _numberFormats = {};
function formatNumber(value, lang, minFrac, maxFrac) {
  var key = lang + "|" + minFrac + "|" + maxFrac;
  if (!_numberFormats[key]) {
    _numberFormats[key] = new Intl.NumberFormat(LOCALES[lang] || "en-US", {
      minimumFractionDigits: minFrac,
      maximumFractionDigits: maxFrac
    });
  }
  return _numberFormats[key].format(value);
}

function decimalsFor(value) {
  var a = Math.abs(value);
  if (a >= 1000000) return 0;
  if (a >= 1) return 2;
  if (a >= 0.01) return 4;
  if (a >= 0.0001) return 6;
  return 8;
}

/* Аккуратно разбирает "1 234,56", "1,234.56", "0,5" и т.п. */
function parseAmount(raw) {
  if (raw === null || raw === undefined) return 0;
  var s = String(raw).trim().replace(/[\s\u00a0\u202f']/g, "");
  if (!s) return 0;
  var comma = s.lastIndexOf(",");
  var dot = s.lastIndexOf(".");
  if (comma > -1 && dot > -1) {
    // десятичный разделитель — тот, что правее
    if (comma > dot) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (comma > -1) {
    var parts = s.split(",");
    var looksLikeThousands = parts.length === 2 && parts[1].length === 3 && parts[0] !== "0";
    s = looksLikeThousands ? s.replace(/,/g, "") : s.replace(",", ".");
  } else if (dot > -1 && s.split(".").length > 2) {
    // 1.234.567 — точки здесь разделяют тысячи
    s = s.replace(/\./g, "");
  }
  var value = parseFloat(s);
  return isFinite(value) ? value : 0;
}

function formatMoney(value, lang) {
  var d = decimalsFor(value);
  return formatNumber(value, lang, Math.min(2, d), d);
}

function formatShort(value, lang) {
  var d = decimalsFor(value);
  return formatNumber(value, lang, 0, d);
}

/* Компактный вид для подписей на графике: 5,3 млн / 12,4 тыс. */
function formatCompact(value, lang) {
  try {
    var key = "compact|" + lang;
    if (!_numberFormats[key]) {
      _numberFormats[key] = new Intl.NumberFormat(LOCALES[lang] || "en-US", {
        notation: "compact",
        maximumFractionDigits: 1
      });
    }
    return _numberFormats[key].format(value);
  } catch (e) {
    return formatShort(value, lang);
  }
}

/* ---------- даты ---------- */
function formatDayMonth(date, lang) {
  try {
    return new Intl.DateTimeFormat(LOCALES[lang] || "en-US", { day: "numeric", month: "short" }).format(date);
  } catch (e) { return date.getDate() + "." + (date.getMonth() + 1); }
}
function formatTime(ts, lang) {
  try {
    return new Intl.DateTimeFormat(LOCALES[lang] || "en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(ts));
  } catch (e) { return new Date(ts).toLocaleTimeString(); }
}

/* "2026-11-17" → "17 нояб. 2026" на языке интерфейса */
function formatDateISO(iso, lang) {
  try {
    var d = new Date(iso + "T00:00:00");
    return new Intl.DateTimeFormat(LOCALES[lang] || "en-US", { day: "numeric", month: "short", year: "numeric" }).format(d);
  } catch (e) { return iso; }
}

/* ---------- буфер обмена ---------- */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return legacyCopy(text); });
  }
  return Promise.resolve(legacyCopy(text));
}
function legacyCopy(text) {
  var area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  document.body.removeChild(area);
  return ok;
}

/* ---------- прочее ---------- */
function haptic() {
  if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
}

var _toastTimer = null;
function toast(message) {
  var el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
}

function shareResult(text) {
  if (navigator.share) {
    navigator.share({ title: "Abuev", text: text, url: location.href }).catch(function () {});
  } else {
    copyText(text).then(function (ok) { toast(ok ? t("toast_copied") : t("toast_copy_error")); });
  }
}
