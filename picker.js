var picker = document.getElementById("currencyPicker");
var pickerList = document.getElementById("pickerList");
var pickerSearch = document.getElementById("pickerSearch");

function openCurrencyPicker() {
  picker.classList.add("show");
  renderPickerList("");
}

function closeCurrencyPicker() {
  picker.classList.remove("show");
}

function renderPickerList(query) {
  pickerList.innerHTML = "";
  var q = query.toLowerCase();
  
  activeList.forEach(function(x) {
    var name = x.n[currentLang] || x.n['en'];
    if (q && !x.c.toLowerCase().includes(q) && !name.toLowerCase().includes(q)) return;
    
    var div = document.createElement("div");
    div.className = "picker-item";
    div.onclick = function() {
      from = x.c;
      closeCurrencyPicker();
      renderTabs();
      renderOut();
    };
    div.innerHTML = '<span class="picker-flag">' + x.s + '</span><div><div class="picker-code">' + x.c + '</div><div class="picker-name">' + name + '</div></div>';
    pickerList.appendChild(div);
  });
}

pickerSearch.oninput = function() { renderPickerList(this.value); };
