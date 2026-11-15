var currentLang = localStorage.getItem("app_lang") || 'ru';
var currentView='fiat',activeList=FIAT,from="USD";
var searchQuery = "";
var favorites = JSON.parse(localStorage.getItem("fx_favorites") || "[]");

var DEF={USD:80.67,EUR:89.81,AED:21.96,RUB:1,CNY:12.08,JPY:0.51,TRY:1.62,KZT:0.16,GBP:102.5,CHF:91.2,INR:0.97,KRW:0.06,CAD:58.9,AUD:52.8,HKD:10.3,SGD:60.1,BRL:16.2,MXN:4.7,ZAR:4.3,BYN:25.1,UZS:0.0065,AMD:0.20,KGS:0.91,TJS:7.3,AZN:47.4,GEL:29.5,BTC:4500000,ETH:240000,USDT:80.6,BNB:40000,SOL:13000,XRP:50,TON:600,DOGE:12,ADA:35,TRX:7,AVAX:3000,SHIB:0.002,DOT:600,LTC:6500,BCH:20000,LINK:1200,MATIC:80,XLM:9,ATOM:800,UNI:700};
var rates=Object.assign({},DEF);try{var s=localStorage.getItem("fx_rates");if(s){var p=JSON.parse(s);for(var k in DEF){if(p[k]>0)rates[k]=p[k];}}}catch(e){}rates.RUB=1;
var amt=document.getElementById("amt"),tabs=document.getElementById("tabs"),rbox=document.getElementById("rates"),st=document.getElementById("st"),toast=document.getElementById("toast"),btn=document.getElementById("reset"),btnIcon=document.getElementById("btn-icon"),btnText=document.getElementById("btn-text"),listContainer=document.getElementById("listContainer"),modal=document.getElementById("chartModal"),closeChart=document.getElementById("closeChart"),chartCanvas=document.getElementById("chartCanvas"),chartTitle=document.getElementById("chartTitle");
var searchInput = document.getElementById("searchInput");

function switchScreen(screenName, event) {
  if(navigator.vibrate) navigator.vibrate(10);
  document.querySelectorAll('.screen').forEach(function(el){ el.classList.remove('active'); });
  if (screenName === 'converter') { document.getElementById('screen-converter').classList.add('active'); } 
  else { document.getElementById('screen-rates').classList.add('active'); }
  document.querySelectorAll('.nav-item').forEach(function(btn){ btn.classList.remove('active'); });
  if(event) event.currentTarget.classList.add('active');
}

function changeLang(lang){
  currentLang=lang;
  localStorage.setItem("app_lang", lang);
  document.documentElement.lang=lang;
  document.documentElement.dir=(lang==='ar')?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    if(translations[lang] && translations[lang][key]) el.textContent=translations[lang][key];
  });
  amt.placeholder=(lang==='ar')?"٠":"0";
  if(typeof updatePickerBtn === 'function') updatePickerBtn();
  renderTabs();renderOut();renderRates();
}

function switchTab(type){currentView=type;activeList=(type==='fiat')?FIAT:CRYPTO;from=activeList[0].c;if(typeof updatePickerBtn === 'function') updatePickerBtn();document.getElementById('btnFiat').className='filter-btn'+(type==='fiat'?' on':'');document.getElementById('btnCrypto').className='filter-btn'+(type==='crypto'?' on':'');renderTabs();renderOut();renderRates();}
function num(str){if(!str)return 0;var v=parseFloat(String(str).replace(/\s/g,"").replace(",","."));return isFinite(v)?v:0;}
function fmt(v,d){return v.toLocaleString(currentLang==='ar'?'ar-EG':(currentLang==='hi'?'hi-IN':'ru-RU'),{minimumFractionDigits:d,maximumFractionDigits:d});}
function conv(a,f,t){return a*rates[f]/rates[t];}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(function(){toast.classList.remove("show");},2500);}
function copyText(text){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){showToast(translations[currentLang].toast_copied+" "+text);}).catch(function(){showToast("Error");});}else{var x=document.createElement("textarea");x.value=text;document.body.appendChild(x);x.select();try{document.execCommand("copy");showToast(translations[currentLang].toast_copied+" "+text);}catch(e){showToast("Error");}document.body.removeChild(x);}}

function toggleFavorite(currencyCode) {
  var idx = favorites.indexOf(currencyCode);
  if (idx > -1) { favorites.splice(idx, 1); } else { favorites.push(currencyCode); }
  localStorage.setItem("fx_favorites", JSON.stringify(favorites));
  renderOut();
}

function renderTabs(){tabs.innerHTML="";activeList.forEach(function(x){var b=document.createElement("button");b.className="tab"+(x.c===from?" on":"");b.textContent=x.c;b.onclick=function(){from=x.c;if(typeof updatePickerBtn === 'function') updatePickerBtn();renderTabs();renderOut();};tabs.appendChild(b);});}

function renderOut(){
  var a=num(amt.value);
  var calcValue = (a === 0) ? 1 : a;
  
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
    var v=conv(calcValue,from,x.c);
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
    shareBtn.onclick = function(e) { e.stopPropagation(); if(typeof shareResult === 'function') shareResult(fmt(calcValue,2), from, x.c, fmt(v,2)); };
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
function renderRates(){rbox.innerHTML="";var listToShow=activeList.filter(function(x){return x.c!=="RUB";});listToShow.slice(0,6).forEach(function(x){var w=document.createElement("div");var l=document.createElement("label");l.textContent="1 "+x.c+" ("+(translations[currentLang].rates_to_rub)+")";var i=document.createElement("input");i.type="text";i.inputMode="decimal";i.value=String(rates[x.c].toFixed(4)).replace(".",",");i.oninput=function(){var v=num(i.value);if(v>0){rates[x.c]=v;save();renderOut();}};w.appendChild(l);w.appendChild(i);rbox.appendChild(w);});}
amt.oninput=renderOut;
if(searchInput) { searchInput.oninput = function() { searchQuery = this.value; renderOut(); }; }

function fetchWithTimeout(url,timeout){timeout=timeout||2500;return Promise.race([fetch(url,{cache:"no-store"}),new Promise(function(_,reject){setTimeout(function(){reject(new Error("timeout"));},timeout);})]);}
function fetchRates(){return fetchWithTimeout("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json").then(function(r){return r.json();}).then(function(j){var R=j.usd;if(!R||!R.rub)throw new Error("data");rates.USD=R.rub;FIAT.forEach(function(item){if(item.c!=="USD"&&item.c!=="RUB"&&R[item.c.toLowerCase()])rates[item.c]=R.rub/R[item.c.toLowerCase()];});CRYPTO.forEach(function(item){if(item.c==="USDT")rates[item.c]=R.rub;else if(R[item.c.toLowerCase()])rates[item.c]=R.rub/R[item.c.toLowerCase()];});return translations[currentLang].status_updated;});}

function load(){
  btn.blur(); 
  btn.disabled=true;
  btnIcon.innerHTML='<span class="spinner"></span>';
  btnText.textContent=translations[currentLang].btn_loading;
  st.textContent=translations[currentLang].status_loading;
  fetchRates().then(function(label){
    save(); renderRates(); renderOut();
    st.textContent=label+" ("+new Date().toLocaleTimeString().slice(0,5)+")";
  }).catch(function(){ st.textContent=translations[currentLang].status_error; })
    .finally(function(){ btn.disabled=false; btnIcon.innerHTML=''; btnText.textContent=translations[currentLang].btn_update; });
}

btn.onclick=load;
function openChart(currency){modal.classList.add("show");chartTitle.innerHTML='<svg class="chart-icon" style="width:20px;height:20px;" viewBox="0 0 24 24"><polyline points="3 17 9 11 15 15 21 7"></polyline><polyline points="14 7 21 7 21 14"></polyline></svg> '+currency+' / RUB';const ctx=chartCanvas.getContext("2d");ctx.clearRect(0,0,chartCanvas.width,chartCanvas.height);const dpr=window.devicePixelRatio||1;const w=chartCanvas.offsetWidth;const h=chartCanvas.offsetHeight;chartCanvas.width=w*dpr;chartCanvas.height=h*dpr;ctx.scale(dpr,dpr);setTimeout(()=>{let currentRate=rates[currency];let points=[];let labels=[];let d=new Date();for(let i=6;i>=0;i--){let tempDate=new Date(d);tempDate.setDate(d.getDate()-i);labels.push(tempDate.getDate()+"."+(tempDate.getMonth()+1));let volatility=(currentView==='crypto')?0.08:0.02;let fluctuation=1+(Math.random()-0.5)*volatility;points.push(currentRate*fluctuation);}drawChart(points,labels,w,h);},100);}
function drawChart(points,labels,w,h){const ctx=chartCanvas.getContext("2d");const pl=10,pr=10,pt=20,pb=30;const max=Math.max(...points);const min=Math.min(...points);const range=max-min||1;ctx.clearRect(0,0,w,h);let stepX=(w-pl-pr)/(points.length-1);let coords=points.map((p,i)=>({x:pl+i*stepX,y:h-pb-((p-min)/range)*(h-pt-pb)}));ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line').trim();ctx.lineWidth=1;for(let i=0;i<=3;i++){let y=pt+(h-pt-pb)*(i/3);ctx.beginPath();ctx.moveTo(pl,y);ctx.lineTo(w-pr,y);ctx.stroke();}let gradient=ctx.createLinearGradient(0,pt,0,h-pb);gradient.addColorStop(0,"rgba(124, 147, 255, 0.4)");gradient.addColorStop(1,"rgba(124, 147, 255, 0)");ctx.beginPath();ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim();ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";ctx.moveTo(coords[0].x,coords[0].y);for(let i=0;i<coords.length-1;i++){let midX=(coords[i].x+coords[i+1].x)/2;ctx.bezierCurveTo(midX,coords[i].y,midX,coords[i+1].y,coords[i+1].x,coords[i+1].y);}ctx.stroke();ctx.lineTo(coords[coords.length-1].x,h-pb);ctx.lineTo(coords[0].x,h-pb);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();coords.forEach((c,i)=>{ctx.beginPath();ctx.arc(c.x,c.y,4,0,Math.PI*2);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--card').trim();ctx.fill();ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim();ctx.lineWidth=2;ctx.stroke();});ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--muted').trim();ctx.font='10px Inter, sans-serif';ctx.textAlign="center";coords.forEach((c,i)=>{ctx.fillText(labels[i],c.x,h-10);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--text').trim();ctx.font='bold 9px Inter, sans-serif';let priceVal=points[i];let priceText=priceVal>10000?(priceVal/1000).toFixed(0)+'k':priceVal.toFixed(1);ctx.fillText(priceText,c.x,h-22);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--muted').trim();ctx.font='10px Inter, sans-serif';});}
closeChart.onclick=function(){modal.classList.remove("show");};modal.onclick=function(e){if(e.target===modal)modal.classList.remove("show");};

changeLang(currentLang);switchTab('fiat');load();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js').catch(function(){});});}
