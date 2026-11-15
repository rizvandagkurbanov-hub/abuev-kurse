var t={ru:{app_title:"Abuev",app_subtitle:"Конвертер валют и криптовалют",amount:"Сумма",tab_fiat:"💵 Валюты",tab_crypto:"🪙 Крипта",rates_to_rub:"Курсы к рублю",btn_update:"Обновить курс",btn_loading:"Загрузка...",status_loading:"Обновляю курсы…",status_updated:"Курсы обновлены",status_error:"Нет связи. Используется сохранённый курс.",toast_copied:"Скопировано!"},en:{app_title:"Abuev",app_subtitle:"Currency & Crypto Converter",amount:"Amount",tab_fiat:"💵 Currencies",tab_crypto:"🪙 Crypto",rates_to_rub:"Rates to RUB",btn_update:"Update rates",btn_loading:"Loading...",status_loading:"Updating rates…",status_updated:"Rates updated",status_error:"Offline. Using saved rates.",toast_copied:"Copied!"},es:{app_title:"Abuev",app_subtitle:"Convertidor de Monedas y Cripto",amount:"Cantidad",tab_fiat:"💵 Monedas",tab_crypto:"🪙 Cripto",rates_to_rub:"Tasas a RUB",btn_update:"Actualizar",btn_loading:"Cargando...",status_loading:"Actualizando...",status_updated:"Tasas actualizadas",status_error:"Sin conexión. Tasas guardadas.",toast_copied:"¡Copiado!"},de:{app_title:"Abuev",app_subtitle:"Währungs- & Krypto-Rechner",amount:"Betrag",tab_fiat:"💵 Währungen",tab_crypto:"🪙 Krypto",rates_to_rub:"Kurse zu RUB",btn_update:"Aktualisieren",btn_loading:"Lädt...",status_loading:"Aktualisiere...",status_updated:"Kurse aktualisiert",status_error:"Offline. Gespeicherte Kurse.",toast_copied:"Kopiert!"},fr:{app_title:"Abuev",app_subtitle:"Convertisseur Devises & Crypto",amount:"Montant",tab_fiat:"💵 Devises",tab_crypto:"🪙 Crypto",rates_to_rub:"Taux en RUB",btn_update:"Mettre à jour",btn_loading:"Chargement...",status_loading:"Mise à jour...",status_updated:"Taux mis à jour",status_error:"Hors ligne. Taux enregistrés.",toast_copied:"Copié !"},zh:{app_title:"Abuev",app_subtitle:"货币与加密货币转换器",amount:"金额",tab_fiat:"💵 货币",tab_crypto:"🪙 加密货币",rates_to_rub:"兑卢布汇率",btn_update:"更新汇率",btn_loading:"加载中...",status_loading:"正在更新...",status_updated:"汇率已更新",status_error:"离线。使用已保存的汇率。",toast_copied:"已复制！"},ja:{app_title:"Abuev",app_subtitle:"通貨・暗号資産コンバーター",amount:"金額",tab_fiat:"💵 通貨",tab_crypto:"🪙 暗号資産",rates_to_rub:"ルーブルへのレート",btn_update:"レートを更新",btn_loading:"読み込み中...",status_loading:"更新中...",status_updated:"レートが更新されました",status_error:"オフライン。保存されたレート。",toast_copied:"コピーしました！"},pt:{app_title:"Abuev",app_subtitle:"Conversor de Moedas e Cripto",amount:"Quantia",tab_fiat:"💵 Moedas",tab_crypto:"🪙 Cripto",rates_to_rub:"Taxas para RUB",btn_update:"Atualizar",btn_loading:"Carregando...",status_loading:"Atualizando...",status_updated:"Taxas atualizadas",status_error:"Offline. Taxas salvas.",toast_copied:"Copiado!"},hi:{app_title:"Abuev",app_subtitle:"मुद्रा और क्रिप्टो कनवर्टर",amount:"राशि",tab_fiat:"💵 मुद्राएं",tab_crypto:"🪙 क्रिप्टो",rates_to_rub:"रूबल में दरें",btn_update:"दरें अपडेट करें",btn_loading:"लोड हो रहा है...",status_loading:"अपडेट हो रहा है...",status_updated:"दरें अपडेट हुईं",status_error:"ऑफ़लाइन। सहेजी गई दरें।",toast_copied:"कॉपी किया गया!"},ar:{app_title:"أبوييف",app_subtitle:"محول العملات والعملات المشفرة",amount:"المبلغ",tab_fiat:"💵 العملات",tab_crypto:"🪙 عملات مشفرة",rates_to_rub:"الأسعار مقابل الروبل",btn_update:"تحديث الأسعار",btn_loading:"جار التحميل...",status_loading:"جاري التحديث...",status_updated:"تم تحديث الأسعار",status_error:"غير متصل. الأسعار المحفوظة.",toast_copied:"تم النسخ!"}};
var currentLang='ru';
var FIAT=[
  {c:"USD",s:"$",n:{ru:"Доллар США",en:"US Dollar",es:"Dólar",de:"US-Dollar",fr:"Dollar US",zh:"美元",ja:"米ドル",pt:"Dólar",hi:"अमेरिकी डॉलर",ar:"دولار أمريكي"}},
  {c:"EUR",s:"€",n:{ru:"Евро",en:"Euro",es:"Euro",de:"Euro",fr:"Euro",zh:"欧元",ja:"ユーロ",pt:"Euro",hi:"यूरो",ar:"يورو"}},
  {c:"RUB",s:"₽",n:{ru:"Российский рубль",en:"Russian Ruble",es:"Rublo ruso",de:"Russischer Rubel",fr:"Rouble russe",zh:"卢布",ja:"ロシアルーブル",pt:"Rublo russo",hi:"रूसी रूबल",ar:"روبل روسي"}},
  {c:"AED",s:"د.إ",n:{ru:"Дирхам ОАЭ",en:"UAE Dirham",es:"Dírham EAU",de:"VAE-Dirham",fr:"Dirham EAU",zh:"阿联酋迪拉姆",ja:"UAEディルハム",pt:"Dirham EAU",hi:"यूएई दिरहम",ar:"درهم إماراتي"}},
  {c:"CNY",s:"元",n:{ru:"Китайский юань",en:"Chinese Yuan",es:"Yuan chino",de:"Chinesischer Yuan",fr:"Yuan chinois",zh:"人民币",ja:"中国人民元",pt:"Yuan chinês",hi:"चीनी युआन",ar:"يوان صيني"}},
  {c:"JPY",s:"¥",n:{ru:"Японская иена",en:"Japanese Yen",es:"Yen japonés",de:"Japanischer Yen",fr:"Yen japonais",zh:"日元",ja:"日本円",pt:"Iene japonês",hi:"जापानी येन",ar:"ين ياباني"}},
  {c:"TRY",s:"₺",n:{ru:"Турецкая лира",en:"Turkish Lira",es:"Lira turca",de:"Türkische Lira",fr:"Livre turque",zh:"土耳其里拉",ja:"トルコリラ",pt:"Lira turca",hi:"तुर्की लीरा",ar:"ليرة تركية"}},
  {c:"KZT",s:"₸",n:{ru:"Казахстанский тенге",en:"Kazakhstani Tenge",es:"Tenge kazajo",de:"Kasachischer Tenge",fr:"Tenge kazakh",zh:"哈萨克斯坦坚戈",ja:"カザフスタンテンゲ",pt:"Tenge cazaque",hi:"कजाख टेंगे",ar:"تينغ كازاخستاني"}},
  {c:"GBP",s:"£",n:{ru:"Британский фунт",en:"British Pound",es:"Libra esterlina",de:"Britisches Pfund",fr:"Livre sterling",zh:"英镑",ja:"英ポンド",pt:"Libra esterlina",hi:"ब्रिटिश पाउंड",ar:"جنيه إسترليني"}},
  {c:"CHF",s:"₣",n:{ru:"Швейцарский франк",en:"Swiss Franc",es:"Franco suizo",de:"Schweizer Franken",fr:"Franc suisse",zh:"瑞士法郎",ja:"スイスフラン",pt:"Franco suíço",hi:"स्विस फ्रैंक",ar:"فرنك سويسري"}},
  {c:"INR",s:"₹",n:{ru:"Индийская рупия",en:"Indian Rupee",es:"Rupia india",de:"Indische Rupie",fr:"Roupie indienne",zh:"印度卢比",ja:"インドルピー",pt:"Rupia indiana",hi:"भारतीय रुपया",ar:"روبية هندية"}},
  {c:"KRW",s:"₩",n:{ru:"Южнокорейская вона",en:"South Korean Won",es:"Won surcoreano",de:"Südkoreanischer Won",fr:"Won sud-coréen",zh:"韩元",ja:"韓国ウォン",pt:"Won sul-coreano",hi:"दक्षिण कोरियाई वॉन",ar:"وون كوري جنوبي"}},
  {c:"CAD",s:"C$",n:{ru:"Канадский доллар",en:"Canadian Dollar",es:"Dólar canadiense",de:"Kanadischer Dollar",fr:"Dollar canadien",zh:"加元",ja:"カナダドル",pt:"Dólar canadense",hi:"कनाडाई डॉलर",ar:"دولار كندي"}},
  {c:"AUD",s:"A$",n:{ru:"Австралийский доллар",en:"Australian Dollar",es:"Dólar australiano",de:"Australischer Dollar",fr:"Dollar australien",zh:"澳元",ja:"豪ドル",pt:"Dólar australiano",hi:"ऑस्ट्रेलियाई डॉलर",ar:"دولار أسترالي"}},
  {c:"HKD",s:"HK$",n:{ru:"Гонконгский доллар",en:"Hong Kong Dollar",es:"Dólar de Hong Kong",de:"Hongkong-Dollar",fr:"Dollar de Hong Kong",zh:"港元",ja:"香港ドル",pt:"Dólar de Hong Kong",hi:"हांगकांग डॉलर",ar:"دولار هونغ كونغ"}},
  {c:"SGD",s:"S$",n:{ru:"Сингапурский доллар",en:"Singapore Dollar",es:"Dólar de Singapur",de:"Singapur-Dollar",fr:"Dollar de Singapour",zh:"新加坡元",ja:"シンガポールドル",pt:"Dólar de Singapura",hi:"सिंगापुर डॉलर",ar:"دولار سنغافوري"}},
  {c:"BRL",s:"R$",n:{ru:"Бразильский реал",en:"Brazilian Real",es:"Real brasileño",de:"Brasilianischer Real",fr:"Réal brésilien",zh:"巴西雷亚尔",ja:"ブラジルレアル",pt:"Real brasileiro",hi:"ब्राज़ीलियाई रियल",ar:"ريال برازيلي"}},
  {c:"MXN",s:"MX$",n:{ru:"Мексиканское песо",en:"Mexican Peso",es:"Peso mexicano",de:"Mexikanischer Peso",fr:"Peso mexicain",zh:"墨西哥比索",ja:"メキシコペソ",pt:"Peso mexicano",hi:"मैक्सिकन पेसो",ar:"بيزو مكسيكي"}},
  {c:"ZAR",s:"R",n:{ru:"Южноафриканский рэнд",en:"South African Rand",es:"Rand sudafricano",de:"Südafrikanischer Rand",fr:"Rand sud-africain",zh:"南非兰特",ja:"南アフリカランド",pt:"Rand sul-africano",hi:"दक्षिण अफ्रीकी रैंड",ar:"راند جنوب أفريقي"}},
  {c:"BYN",s:"Br",n:{ru:"Белорусский рубль",en:"Belarusian Ruble",es:"Rublo bielorruso",de:"Belarussischer Rubel",fr:"Rouble biélorusse",zh:"白俄罗斯卢布",ja:"ベラルーシルーブル",pt:"Rublo bielorrusso",hi:"बेलारूसी रूबल",ar:"روبل بيلاروسي"}},
  {c:"UZS",s:"so'm",n:{ru:"Узбекский сум",en:"Uzbekistani Som",es:"Som uzbeko",de:"Usbekischer Sum",fr:"Sum ouzbek",zh:"乌兹别克斯坦苏姆",ja:"ウズベキスタンスム",pt:"Som uzbeque",hi:"उज़्बेक सोम",ar:"سوم أوزبكي"}},
  {c:"AMD",s:"֏",n:{ru:"Армянский драм",en:"Armenian Dram",es:"Dram armenio",de:"Armenischer Dram",fr:"Dram arménien",zh:"亚美尼亚德拉姆",ja:"アルメニアドラム",pt:"Dram armênio",hi:"आर्मेनियाई द्राम",ar:"درام أرميني"}}
];
var CRYPTO=[
  {c:"BTC",s:"₿",n:{ru:"Bitcoin",en:"Bitcoin",es:"Bitcoin",de:"Bitcoin",fr:"Bitcoin",zh:"比特币",ja:"ビットコイン",pt:"Bitcoin",hi:"बिटकॉइन",ar:"بيتكوين"}},
  {c:"ETH",s:"Ξ",n:{ru:"Ethereum",en:"Ethereum",es:"Ethereum",de:"Ethereum",fr:"Ethereum",zh:"以太坊",ja:"イーサリアム",pt:"Ethereum",hi:"एथेरियम",ar:"إيثريوم"}},
  {c:"USDT",s:"₮",n:{ru:"Tether",en:"Tether",es:"Tether",de:"Tether",fr:"Tether",zh:"泰达币",ja:"テザー",pt:"Tether",hi:"टेदर",ar:"تيثر"}},
  {c:"BNB",s:"B",n:{ru:"Binance Coin",en:"Binance Coin",es:"Binance Coin",de:"Binance Coin",fr:"Binance Coin",zh:"币安币",ja:"バイナンスコイン",pt:"Binance Coin",hi:"बाइनेंस कॉइन",ar:"بينانس كوين"}},
  {c:"SOL",s:"◎",n:{ru:"Solana",en:"Solana",es:"Solana",de:"Solana",fr:"Solana",zh:"索拉纳",ja:"ソラナ",pt:"Solana",hi:"सोलाना",ar:"سولانا"}},
  {c:"XRP",s:"XRP",n:{ru:"Ripple",en:"Ripple",es:"Ripple",de:"Ripple",fr:"Ripple",zh:"瑞波币",ja:"リップル",pt:"Ripple",hi:"रिपल",ar:"ريبل"}},
  {c:"TON",s:"💎",n:{ru:"Toncoin",en:"Toncoin",es:"Toncoin",de:"Toncoin",fr:"Toncoin",zh:"Toncoin",ja:"トンコイン",pt:"Toncoin",hi:"टनकॉइन",ar:"تون كوين"}},
  {c:"DOGE",s:"Ð",n:{ru:"Dogecoin",en:"Dogecoin",es:"Dogecoin",de:"Dogecoin",fr:"Dogecoin",zh:"狗狗币",ja:"ドージコイン",pt:"Dogecoin",hi:"डॉगकॉइन",ar:"دوجكوين"}}
];
var currentView='fiat',activeList=FIAT,from="USD";
var searchQuery = "";
var favorites = JSON.parse(localStorage.getItem("fx_favorites") || "[]");
var isTabsExpanded = false;

var DEF={USD:80.67,EUR:89.81,AED:21.96,RUB:1,CNY:12.08,JPY:0.51,TRY:1.62,KZT:0.16,GBP:102.5,CHF:91.2,INR:0.97,KRW:0.06,CAD:58.9,AUD:52.8,HKD:10.3,SGD:60.1,BRL:16.2,MXN:4.7,ZAR:4.3,BYN:25.1,UZS:0.0065,AMD:0.20,BTC:4500000,ETH:240000,USDT:80.6,BNB:40000,SOL:13000,XRP:50,TON:600,DOGE:12};
var rates=Object.assign({},DEF);try{var s=localStorage.getItem("fx_rates");if(s){var p=JSON.parse(s);for(var k in DEF){if(p[k]>0)rates[k]=p[k];}}}catch(e){}rates.RUB=1;
var amt=document.getElementById("amt"),tabs=document.getElementById("tabs"),rbox=document.getElementById("rates"),st=document.getElementById("st"),toast=document.getElementById("toast"),btn=document.getElementById("reset"),btnIcon=document.getElementById("btn-icon"),btnText=document.getElementById("btn-text"),listContainer=document.getElementById("listContainer"),modal=document.getElementById("chartModal"),closeChart=document.getElementById("closeChart"),chartCanvas=document.getElementById("chartCanvas"),chartTitle=document.getElementById("chartTitle");
var searchInput = document.getElementById("searchInput");

function changeLang(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=(lang==='ar')?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(function(el){var key=el.getAttribute('data-i18n');if(t[lang]&&t[lang][key])el.textContent=t[lang][key];});amt.placeholder=(lang==='ar')?"٠":"0";renderTabs();renderOut();renderRates();}
function switchTab(type){currentView=type;activeList=(type==='fiat')?FIAT:CRYPTO;from=activeList[0].c;document.getElementById('btnFiat').className='filter-btn'+(type==='fiat'?' on':'');document.getElementById('btnCrypto').className='filter-btn'+(type==='crypto'?' on':'');renderTabs();renderOut();renderRates();}
function num(str){if(!str)return 0;var v=parseFloat(String(str).replace(/\s/g,"").replace(",","."));return isFinite(v)?v:0;}
function fmt(v,d){return v.toLocaleString(currentLang==='ar'?'ar-EG':(currentLang==='hi'?'hi-IN':'ru-RU'),{minimumFractionDigits:d,maximumFractionDigits:d});}
function conv(a,f,t){return a*rates[f]/rates[t];}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(function(){toast.classList.remove("show");},2500);}
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){showToast(t[currentLang].toast_copied+" "+text);}).catch(function(){showToast("Error");});}else{var x=document.createElement("textarea");x.value=text;document.body.appendChild(x);x.select();try{document.execCommand("copy");showToast(t[currentLang].toast_copied+" "+text);}catch(e){showToast("Error");}document.body.removeChild(x);}}

function toggleFavorite(currencyCode) {
  var idx = favorites.indexOf(currencyCode);
  if (idx > -1) { favorites.splice(idx, 1); } else { favorites.push(currencyCode); }
  localStorage.setItem("fx_favorites", JSON.stringify(favorites));
  renderOut();
}

function toggleTabs() {
  isTabsExpanded = !isTabsExpanded;
  if (isTabsExpanded) {
    tabs.classList.remove("collapsed");
    document.getElementById("expandBtn").textContent = "Свернуть ▴";
  } else {
    tabs.classList.add("collapsed");
    document.getElementById("expandBtn").textContent = "Показать все валюты ▾";
  }
}

function renderTabs(){
  tabs.innerHTML="";
  activeList.forEach(function(x){
    var b=document.createElement("button");
    b.className="tab"+(x.c===from?" on":"");
    b.textContent=x.c;
    b.onclick=function(){from=x.c;renderTabs();renderOut();};
    tabs.appendChild(b);
  });
  if(!isTabsExpanded) tabs.classList.add("collapsed");
}

function renderOut(){
  var a=num(amt.value);
  listContainer.innerHTML="";
  var filtered = activeList.filter(function(x){
    if (!searchQuery) return true;
    var q = searchQuery.toLowerCase();
    return x.c.toLowerCase().includes(q) || (x.n[currentLang] && x.n[currentLang].toLowerCase().includes(q)) || (x.n['en'] && x.n['en'].toLowerCase().includes(q));
  });
  filtered.sort(function(x, y) {
    var isFavX = favorites.includes(x.c), isFavY = favorites.includes(y.c);
    if (isFavX && !isFavY) return -1; if (!isFavX && isFavY) return 1; return 0;
  });

  filtered.forEach(function(x){
    var v=conv(a,from,x.c);
    var vRub=(x.c==="RUB")?v:conv(v,x.c,"RUB");
    var one=conv(1,from,x.c);
    var d=document.createElement("div");
    d.className="res"+(x.c===from?" src":"");
    var isFav = favorites.includes(x.c);
    var starClass = "star-btn" + (isFav ? " active" : "");
    var starIcon = '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
    var leftPart=document.createElement("div");
    leftPart.className="res-left";
    var starBtn = document.createElement("button");
    starBtn.className = starClass;
    starBtn.innerHTML = starIcon;
    starBtn.onclick = function(e) { e.stopPropagation(); toggleFavorite(x.c); };
    var textPart = document.createElement("div");
    textPart.onclick=function(){if(x.c!==from){openChart(x.c);}};
    var chartIcon=(x.c!==from)?'<svg class="chart-icon" viewBox="0 0 24 24"><polyline points="3 17 9 11 15 15 21 7"></polyline><polyline points="14 7 21 7 21 14"></polyline></svg>':'';
    var currencyName=x.n[currentLang]||x.n['en'];
    textPart.innerHTML='<div class="code">'+x.s+" "+x.c+chartIcon+'</div><div class="name">'+currencyName+'</div>';
    leftPart.appendChild(starBtn); leftPart.appendChild(textPart);
    var rightPart=document.createElement("div");
    rightPart.className="res-right";
    rightPart.onclick=function(){copyText(fmt(v,2)+" "+x.c);};
    var shareBtn = document.createElement("button");
    shareBtn.className = "btn-share";
    shareBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Поделиться';
    shareBtn.onclick = function(e) { e.stopPropagation(); if(typeof shareResult === 'function') shareResult(fmt(a,2), from, x.c, fmt(v,2)); };
    if (x.c === "RUB") {
      rightPart.innerHTML = '<div class="val-main" data-curr=""></div>' + (x.c===from?'':'<div class="one">1 '+from+" = "+fmt(one,one<0.1?6:4)+" RUB</div>");
    } else {
      var rubLine = (currentView === 'crypto') ? '<div class="val-sec" data-rub="true">≈ ' + fmt(vRub, 0) + ' RUB</div>' : '';
      rightPart.innerHTML = '<div class="val-main" data-curr="'+x.c+'"></div>' + rubLine + (x.c===from?'':'<div class="one">1 '+from+" = "+fmt(one,one<0.1?6:4)+" "+x.c+'</div>');
    }
    if (x.c !== from) { rightPart.appendChild(shareBtn); }
    d.appendChild(leftPart); d.appendChild(rightPart);
    listContainer.appendChild(d);
    let mainVal = rightPart.querySelector('.val-main');
    if (mainVal) {
      if(typeof animateValue === 'function') { animateValue(mainVal, 0, v, 400, x.c === "RUB" ? "" : x.c); }
      else { mainVal.innerHTML = fmt(v,2) + (x.c === "RUB" ? "" : " " + x.c); }
    }
    if (currentView === 'crypto' && x.c !== "RUB") {
      let rubSec = rightPart.querySelector('.val-sec');
      if (rubSec) { rubSec.innerHTML = '≈ ' + fmt(vRub, 0) + ' RUB'; }
    }
  });
}

function save(){try{localStorage.setItem("fx_rates",JSON.stringify(rates));}catch(e){}}
function renderRates(){rbox.innerHTML="";var listToShow=activeList.filter(function(x){return x.c!=="RUB";});listToShow.slice(0,6).forEach(function(x){var w=document.createElement("div");var l=document.createElement("label");l.textContent="1 "+x.c+" ("+(t[currentLang].rates_to_rub)+")";var i=document.createElement("input");i.type="text";i.inputMode="decimal";i.value=String(rates[x.c].toFixed(4)).replace(".",",");i.oninput=function(){var v=num(i.value);if(v>0){rates[x.c]=v;save();renderOut();}};w.appendChild(l);w.appendChild(i);rbox.appendChild(w);});}
amt.oninput=renderOut;
if(searchInput) { searchInput.oninput = function() { searchQuery = this.value; renderOut(); }; }

function fetchWithTimeout(url,timeout){timeout=timeout||2500;return Promise.race([fetch(url,{cache:"no-store"}),new Promise(function(_,reject){setTimeout(function(){reject(new Error("timeout"));},timeout);})]);}
function fetchRates(){return fetchWithTimeout("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json").then(function(r){return r.json();}).then(function(j){var R=j.usd;if(!R||!R.rub)throw new Error("data");rates.USD=R.rub;FIAT.forEach(function(item){if(item.c!=="USD"&&item.c!=="RUB"&&R[item.c.toLowerCase()])rates[item.c]=R.rub/R[item.c.toLowerCase()];});CRYPTO.forEach(function(item){if(item.c==="USDT")rates[item.c]=R.rub;else if(R[item.c.toLowerCase()])rates[item.c]=R.rub/R[item.c.toLowerCase()];});return t[currentLang].status_updated;});}

function load(){
  btn.blur(); 
  btn.disabled=true;
  btnIcon.innerHTML='<span class="spinner"></span>';
  btnText.textContent=t[currentLang].btn_loading;
  st.textContent=t[currentLang].status_loading;
  fetchRates().then(function(label){
    save(); renderRates(); renderOut();
    st.textContent=label+" ("+new Date().toLocaleTimeString().slice(0,5)+")";
  }).catch(function(){ st.textContent=t[currentLang].status_error; })
    .finally(function(){ btn.disabled=false; btnIcon.innerHTML=''; btnText.textContent=t[currentLang].btn_update; });
}

btn.onclick=load;
function openChart(currency){modal.classList.add("show");chartTitle.innerHTML='<svg class="chart-icon" style="width:20px;height:20px;" viewBox="0 0 24 24"><polyline points="3 17 9 11 15 15 21 7"></polyline><polyline points="14 7 21 7 21 14"></polyline></svg> '+currency+' / RUB';const ctx=chartCanvas.getContext("2d");ctx.clearRect(0,0,chartCanvas.width,chartCanvas.height);const dpr=window.devicePixelRatio||1;const w=chartCanvas.offsetWidth;const h=chartCanvas.offsetHeight;chartCanvas.width=w*dpr;chartCanvas.height=h*dpr;ctx.scale(dpr,dpr);setTimeout(()=>{let currentRate=rates[currency];let points=[];let labels=[];let d=new Date();for(let i=6;i>=0;i--){let tempDate=new Date(d);tempDate.setDate(d.getDate()-i);labels.push(tempDate.getDate()+"."+(tempDate.getMonth()+1));let volatility=(currentView==='crypto')?0.08:0.02;let fluctuation=1+(Math.random()-0.5)*volatility;points.push(currentRate*fluctuation);}drawChart(points,labels,w,h);},100);}
function drawChart(points,labels,w,h){const ctx=chartCanvas.getContext("2d");const pl=10,pr=10,pt=20,pb=30;const max=Math.max(...points);const min=Math.min(...points);const range=max-min||1;ctx.clearRect(0,0,w,h);let stepX=(w-pl-pr)/(points.length-1);let coords=points.map((p,i)=>({x:pl+i*stepX,y:h-pb-((p-min)/range)*(h-pt-pb)}));ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line').trim();ctx.lineWidth=1;for(let i=0;i<=3;i++){let y=pt+(h-pt-pb)*(i/3);ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(w-pr,y);ctx.stroke();}let gradient=ctx.createLinearGradient(0,pt,0,h-pb);gradient.addColorStop(0,"rgba(124, 147, 255, 0.4)");gradient.addColorStop(1,"rgba(124, 147, 255, 0)");ctx.beginPath();ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim();ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";ctx.moveTo(coords[0].x,coords[0].y);for(let i=0;i<coords.length-1;i++){let midX=(coords[i].x+coords[i+1].x)/2;ctx.bezierCurveTo(midX,coords[i].y,midX,coords[i+1].y,coords[i+1].x,coords[i+1].y);}ctx.stroke();ctx.lineTo(coords[coords.length-1].x,h-pb);ctx.lineTo(coords[0].x,h-pb);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();coords.forEach((c,i)=>{ctx.beginPath();ctx.arc(c.x,c.y,4,0,Math.PI*2);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--card').trim();ctx.fill();ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim();ctx.lineWidth=2;ctx.stroke();});ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--muted').trim();ctx.font='10px Inter, sans-serif';ctx.textAlign="center";coords.forEach((c,i)=>{ctx.fillText(labels[i],c.x,h-10);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--text').trim();ctx.font='bold 9px Inter, sans-serif';let priceVal=points[i];let priceText=priceVal>10000?(priceVal/1000).toFixed(0)+'k':priceVal.toFixed(1);ctx.fillText(priceText,c.x,h-22);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--muted').trim();ctx.font='10px Inter, sans-serif';});}
closeChart.onclick=function(){modal.classList.remove("show");};modal.onclick=function(e){if(e.target===modal)modal.classList.remove("show");};

changeLang('ru');switchTab('fiat');load();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){});});}
