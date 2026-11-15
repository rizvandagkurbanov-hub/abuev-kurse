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

// 3. Анимация цифр (перетекание)
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
