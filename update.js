// --- НОВЫЕ ОБНОВЛЕНИЯ ---

// 1. Вибро-отклик
function haptic() {
  if (navigator.vibrate) navigator.vibrate(10);
}

// 2. Кнопка Поделиться (через системное меню)
function shareResult(amount, fromCur, toCur, result) {
  haptic();
  var text = amount + " " + fromCur + " = " + result + " " + toCur;
  if (navigator.share) {
    navigator.share({ title: 'Abuev Конвертер', text: text, url: window.location.href }).catch(console.error);
  } else {
    copyText(text);
  }
}

// 3. Свайпы и долгое нажатие
// (Эта функция будет вызываться внутри карточек, когда мы их отрисовываем)
function addSwipeListeners(cardElement, currency, amount, fromCur, result) {
  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
  
  cardElement.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
  }, {passive: true});

  cardElement.addEventListener('touchend', function(e) {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;
    let duration = Date.now() - touchStartTime;

    // Долгое нажатие (более 500мс) -> Поделиться
    if (duration > 500 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      haptic();
      shareResult(amount, fromCur, currency, result);
      return;
    }

    // Свайпы
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0 && currency !== fromCur) {
        // Свайп влево -> открыть график
        openChart(currency);
      } else if (diffX < 0) {
        // Свайп вправо -> скопировать
        copyText(result + " " + currency);
      }
    }
  }, {passive: true});
}

// 4. Анимация цифр (перетекание)
function animateValue(obj, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    obj.innerHTML = current.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + (suffix ? ' ' + suffix : '');
    if (progress < 1) { window.requestAnimationFrame(step); } else { obj.innerHTML = end.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + (suffix ? ' ' + suffix : ''); }
  };
  window.requestAnimationFrame(step);
}
