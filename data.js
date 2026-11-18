/* Abuev — данные о валютах.
   c — код, s — символ, n — название (ru/en, остальные языки берутся из Intl.DisplayNames). */

var LOCALES = {
  ru: "ru-RU", en: "en-US", es: "es-ES", de: "de-DE", fr: "fr-FR",
  zh: "zh-CN", ja: "ja-JP", pt: "pt-PT", hi: "hi-IN", ar: "ar-EG"
};

var FIAT = [
  { c: "USD", s: "$", n: { ru: "Доллар США", en: "US Dollar" } },
  { c: "EUR", s: "€", n: { ru: "Евро", en: "Euro" } },
  { c: "RUB", s: "₽", n: { ru: "Российский рубль", en: "Russian Ruble" } },
  { c: "AED", s: "د.إ", n: { ru: "Дирхам ОАЭ", en: "UAE Dirham" } },
  { c: "CNY", s: "元", n: { ru: "Китайский юань", en: "Chinese Yuan" } },
  { c: "JPY", s: "¥", n: { ru: "Японская иена", en: "Japanese Yen" } },
  { c: "GBP", s: "£", n: { ru: "Британский фунт", en: "British Pound" } },
  { c: "TRY", s: "₺", n: { ru: "Турецкая лира", en: "Turkish Lira" } },
  { c: "KZT", s: "₸", n: { ru: "Казахстанский тенге", en: "Kazakhstani Tenge" } },
  { c: "CHF", s: "₣", n: { ru: "Швейцарский франк", en: "Swiss Franc" } },
  { c: "INR", s: "₹", n: { ru: "Индийская рупия", en: "Indian Rupee" } },
  { c: "KRW", s: "₩", n: { ru: "Южнокорейская вона", en: "South Korean Won" } },
  { c: "CAD", s: "C$", n: { ru: "Канадский доллар", en: "Canadian Dollar" } },
  { c: "AUD", s: "A$", n: { ru: "Австралийский доллар", en: "Australian Dollar" } },
  { c: "HKD", s: "HK$", n: { ru: "Гонконгский доллар", en: "Hong Kong Dollar" } },
  { c: "SGD", s: "S$", n: { ru: "Сингапурский доллар", en: "Singapore Dollar" } },
  { c: "BRL", s: "R$", n: { ru: "Бразильский реал", en: "Brazilian Real" } },
  { c: "MXN", s: "MX$", n: { ru: "Мексиканское песо", en: "Mexican Peso" } },
  { c: "ZAR", s: "R", n: { ru: "Южноафриканский рэнд", en: "South African Rand" } },
  { c: "BYN", s: "Br", n: { ru: "Белорусский рубль", en: "Belarusian Ruble" } },
  { c: "UZS", s: "so'm", n: { ru: "Узбекский сум", en: "Uzbekistani Som" } },
  { c: "AMD", s: "֏", n: { ru: "Армянский драм", en: "Armenian Dram" } },
  { c: "KGS", s: "с", n: { ru: "Киргизский сом", en: "Kyrgyzstani Som" } },
  { c: "TJS", s: "SM", n: { ru: "Таджикский сомони", en: "Tajikistani Somoni" } },
  { c: "AZN", s: "₼", n: { ru: "Азербайджанский манат", en: "Azerbaijani Manat" } },
  { c: "GEL", s: "₾", n: { ru: "Грузинский лари", en: "Georgian Lari" } }
];

var CRYPTO = [
  { c: "BTC", s: "₿", n: { ru: "Bitcoin", en: "Bitcoin" } },
  { c: "ETH", s: "Ξ", n: { ru: "Ethereum", en: "Ethereum" } },
  { c: "USDT", s: "₮", n: { ru: "Tether", en: "Tether" } },
  { c: "BNB", s: "B", n: { ru: "BNB", en: "BNB" } },
  { c: "SOL", s: "◎", n: { ru: "Solana", en: "Solana" } },
  { c: "XRP", s: "✕", n: { ru: "XRP", en: "XRP" } },
  { c: "TON", s: "◈", n: { ru: "Toncoin", en: "Toncoin" } },
  { c: "DOGE", s: "Ð", n: { ru: "Dogecoin", en: "Dogecoin" } },
  { c: "ADA", s: "₳", n: { ru: "Cardano", en: "Cardano" } },
  { c: "TRX", s: "◉", n: { ru: "TRON", en: "TRON" } },
  { c: "AVAX", s: "▲", n: { ru: "Avalanche", en: "Avalanche" } },
  { c: "SHIB", s: "S", n: { ru: "Shiba Inu", en: "Shiba Inu" } },
  { c: "DOT", s: "•", n: { ru: "Polkadot", en: "Polkadot" } },
  { c: "LTC", s: "Ł", n: { ru: "Litecoin", en: "Litecoin" } },
  { c: "BCH", s: "B", n: { ru: "Bitcoin Cash", en: "Bitcoin Cash" } },
  { c: "LINK", s: "⬡", n: { ru: "Chainlink", en: "Chainlink" } },
  { c: "POL", s: "M", n: { ru: "Polygon (POL)", en: "Polygon (POL)" } },
  { c: "XLM", s: "✶", n: { ru: "Stellar", en: "Stellar" } },
  { c: "ATOM", s: "⚛", n: { ru: "Cosmos", en: "Cosmos" } },
  { c: "UNI", s: "🦄", n: { ru: "Uniswap", en: "Uniswap" } }
];

/* Резервные курсы (₽ за 1 единицу) — нужны, только если сеть недоступна
   и в localStorage ещё нет сохранённых значений. */
var DEFAULT_RATES = {
  USD: 80.67, EUR: 89.81, AED: 21.96, RUB: 1, CNY: 12.08, JPY: 0.51, GBP: 102.5,
  TRY: 1.62, KZT: 0.16, CHF: 91.2, INR: 0.97, KRW: 0.06, CAD: 58.9, AUD: 52.8,
  HKD: 10.3, SGD: 60.1, BRL: 16.2, MXN: 4.7, ZAR: 4.3, BYN: 25.1, UZS: 0.0065,
  AMD: 0.2, KGS: 0.91, TJS: 7.3, AZN: 47.4, GEL: 29.5,
  BTC: 5338467, ETH: 260000, USDT: 80.6, BNB: 59000, SOL: 15300, XRP: 88,
  TON: 620, DOGE: 5.6, ADA: 20, TRX: 25, AVAX: 1400, SHIB: 0.0005, DOT: 90,
  LTC: 6100, BCH: 19000, LINK: 1200, POL: 7, XLM: 9, ATOM: 170, UNI: 700
};

/* ID монет для CoinGecko (живые цены). Если ID неверный — монета просто
   останется на дневных данных, это безопасно. */
var COINGECKO_IDS = {
  BTC: "bitcoin", ETH: "ethereum", USDT: "tether", BNB: "binancecoin", SOL: "solana",
  XRP: "ripple", TON: "the-open-network", DOGE: "dogecoin", ADA: "cardano", TRX: "tron",
  AVAX: "avalanche-2", SHIB: "shiba-inu", DOT: "polkadot", LTC: "litecoin", BCH: "bitcoin-cash",
  LINK: "chainlink", POL: "polygon-ecosystem-token", XLM: "stellar", ATOM: "cosmos", UNI: "uniswap"
};

/* Быстрые суммы под полем ввода (в базовой валюте). */
var QUICK_AMOUNTS = [100, 500, 1000, 5000];
