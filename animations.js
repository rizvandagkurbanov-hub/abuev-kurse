/* Abuev — мелкие анимации и поведение интерфейса. */

var prefersReducedMotion = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- раскрытие списка базовых валют ---------- */
function setTabsExpanded(open) {
  state.tabsOpen = open;
  var wrapper = $("#tabsWrapper");
  var btn = $("#expandBtn");
  if (!wrapper || !btn) return;
  wrapper.classList.toggle("expanded", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.querySelector("span").textContent = open ? t("collapse") : t("expand");
  btn.classList.toggle("is-open", open);
  if (!open) wrapper.scrollTop = 0;
}

/* ---------- избранное вверх списка ---------- */
function sortFavorites(list) {
  return list.slice().sort(function (a, b) {
    var fa = state.favorites.indexOf(a.c) > -1;
    var fb = state.favorites.indexOf(b.c) > -1;
    if (fa === fb) return 0;
    return fa ? -1 : 1;
  });
}

/* ---------- плавный счётчик ---------- */
function countUp(el, value, lang) {
  if (!el) return;
  if (prefersReducedMotion) {
    el.textContent = formatMoney(value, lang);
    return;
  }
  var duration = 420;
  var start = 0;
  var startedAt = null;
  var token = (el._countToken || 0) + 1;
  el._countToken = token;

  function frame(now) {
    if (el._countToken !== token) return; // отменено новым рендером
    if (!startedAt) startedAt = now;
    var progress = Math.min((now - startedAt) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatMoney(start + (value - start) * eased, lang);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = formatMoney(value, lang);
  }
  requestAnimationFrame(frame);
}

/* ---------- задержка для поиска ---------- */
function debounce(fn, wait) {
  var timer = null;
  return function () {
    var args = arguments;
    var self = this;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(self, args); }, wait);
  };
}

/* ---------- «пилюля» в нижнем меню ---------- */
function moveNavPill(button) {
  var pill = $("#navPill");
  if (!pill || !button) return;
  var nav = button.parentElement;
  var navRect = nav.getBoundingClientRect();
  var rect = button.getBoundingClientRect();
  pill.style.width = rect.width + "px";
  pill.style.transform = "translateX(" + (rect.left - navRect.left) + "px)";
}

/* ---------- появление элементов списка ---------- */
function staggerIn(container) {
  if (prefersReducedMotion) return;
  var rows = container.querySelectorAll(".row");
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.animationDelay = Math.min(i * 18, 220) + "ms";
  }
}
