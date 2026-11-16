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

  if (isTabsExpanded) {
    wrapper.classList.add("expanded");
    btn.textContent = "Свернуть ▴";
  } else {
    wrapper.classList.remove("expanded");
    btn.textContent = "Показать все валюты ▾";
  }
}

function sortByFavorites(list) {
  return list.sort(function(x, y) {
    var isFavX = favorites.includes(x.c);
    var isFavY = favorites.includes(y.c);
    if (isFavX && !isFavY) return -1;
    if (!isFavX && isFavY) return 1;
    return 0;
  });
}
