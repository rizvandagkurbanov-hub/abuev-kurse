var isTabsExpanded = false;

function toggleTabs() {
  if(navigator.vibrate) navigator.vibrate(10);
  isTabsExpanded = !isTabsExpanded;
  updateTabsView();
}

function updateTabsView() {
  var wrapper = document.getElementById("tabsWrapper");
  var btn = document.getElementById("expandBtn");
  if (!wrapper || !btn) return;

  // Безопасная проверка: если from не определена, пишем USD
  var currentCurrency = (typeof from !== 'undefined') ? from : "USD";
  var labelText = "Базовая: " + currentCurrency;
  
  if (isTabsExpanded) {
    wrapper.classList.add("expanded");
    btn.innerHTML = '<span>' + labelText + '</span> ▴';
  } else {
    wrapper.classList.remove("expanded");
    btn.innerHTML = '<span>' + labelText + '</span> ▾';
  }
}

function sortByFavorites(list) {
  return list.sort(function(x, y) {
    if(typeof favorites === 'undefined') return 0;
    var isFavX = favorites.includes(x.c);
    var isFavY = favorites.includes(y.c);
    if (isFavX && !isFavY) return -1;
    if (!isFavX && isFavY) return 1;
    return 0;
  });
}
