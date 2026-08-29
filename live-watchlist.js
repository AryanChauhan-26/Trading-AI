const marketAssets = [
    ["TSLA", "Tesla Inc.", "stocks", "NASDAQ", "US", 262.50, 2, "USD", "BUY"], ["AAPL", "Apple Inc.", "stocks", "NASDAQ", "US", 215.30, 2, "USD", "NEUTRAL"], ["NVDA", "NVIDIA Corp.", "stocks", "NASDAQ", "US", 128.20, 2, "USD", "STRONG BUY"], ["MSFT", "Microsoft Corp.", "stocks", "NASDAQ", "US", 418.50, 2, "USD", "SELL"], ["AMZN", "Amazon.com Inc.", "stocks", "NASDAQ", "US", 193.10, 2, "USD", "BUY"], ["GOOGL", "Alphabet Inc.", "stocks", "NASDAQ", "US", 175.50, 2, "USD", "BUY"], ["META", "Meta Platforms Inc.", "stocks", "NASDAQ", "US", 490, 2, "USD", "BUY"], ["JNJ", "Johnson & Johnson", "stocks", "NYSE", "US", 150.25, 2, "USD", "SELL"], ["JPM", "JPMorgan Chase & Co.", "stocks", "NYSE", "US", 198.20, 2, "USD", "STRONG SELL"], ["BABA", "Alibaba Group", "stocks", "NYSE", "US", 79.80, 2, "USD", "NEUTRAL"],
    ["RELIANCE", "Reliance Industries", "stocks", "NSE", "India", 2950.75, 2, "INR", "BUY"], ["TCS", "Tata Consultancy", "stocks", "NSE", "India", 3845.50, 2, "INR", "NEUTRAL"], ["HDFCBANK", "HDFC Bank", "stocks", "NSE", "India", 1520.10, 2, "INR", "SELL"], ["INFY", "Infosys Ltd", "stocks", "NSE", "India", 1530, 2, "INR", "BUY"], ["ICICIBANK", "ICICI Bank Ltd", "stocks", "NSE", "India", 1105.50, 2, "INR", "STRONG BUY"], ["SBIN", "State Bank of India", "stocks", "NSE", "India", 830.20, 2, "INR", "NEUTRAL"], ["LT", "Larsen & Toubro Ltd", "stocks", "NSE", "India", 3550, 2, "INR", "SELL"], ["HINDUNILVR", "Hindustan Unilever Ltd", "stocks", "NSE", "India", 2450, 2, "INR", "BUY"], ["TATAMOTORS", "Tata Motors Ltd", "stocks", "NSE", "India", 970.50, 2, "INR", "STRONG BUY"], ["AXISBANK", "Axis Bank Ltd", "stocks", "NSE", "India", 1215, 2, "INR", "BUY"], ["BHARTIARTL", "Bharti Airtel Ltd", "stocks", "NSE", "India", 1410.80, 2, "INR", "NEUTRAL"], ["WIPRO", "Wipro Ltd", "stocks", "NSE", "India", 485.25, 2, "INR", "SELL"], ["KOTAKBANK", "Kotak Mahindra Bank", "stocks", "NSE", "India", 1750, 2, "INR", "NEUTRAL"],
    ["BTCUSD", "Bitcoin / Dollar", "crypto", "BINANCE", "Global", 61250, 0, "USD", "STRONG BUY"], ["ETHUSD", "Ethereum / Dollar", "crypto", "BINANCE", "Global", 3380, 2, "USD", "BUY"], ["SOLUSD", "Solana / Dollar", "crypto", "BINANCE", "Global", 142.50, 2, "USD", "STRONG SELL"], ["DOGEUSD", "Dogecoin / Dollar", "crypto", "BINANCE", "Global", 0.1580, 4, "USD", "BUY"], ["ADAUSD", "Cardano / Dollar", "crypto", "BINANCE", "Global", 0.4550, 4, "USD", "NEUTRAL"], ["XRPUSD", "Ripple / Dollar", "crypto", "BINANCE", "Global", 0.5250, 4, "USD", "SELL"], ["AVAXUSD", "Avalanche / Dollar", "crypto", "BINANCE", "Global", 35.80, 2, "USD", "STRONG BUY"],
    ["EURUSD", "Euro / US Dollar", "forex", "FX_IDC", "Global", 1.0820, 4, "USD", "NEUTRAL"], ["GBPUSD", "Pound / US Dollar", "forex", "FX_IDC", "Global", 1.2750, 4, "USD", "BUY"], ["USDJPY", "US Dollar / Japanese Yen", "forex", "FX_IDC", "Global", 157.85, 2, "USD", "SELL"], ["AUDUSD", "Australian Dollar / US Dollar", "forex", "FX_IDC", "Global", 0.6615, 4, "USD", "BUY"], ["USDCHF", "US Dollar / Swiss Franc", "forex", "FX_IDC", "Global", 0.8985, 4, "USD", "NEUTRAL"], ["USDCAD", "US Dollar / Canadian Dollar", "forex", "FX_IDC", "Global", 1.3625, 4, "USD", "BUY"], ["NZDUSD", "New Zealand Dollar / US Dollar", "forex", "FX_IDC", "Global", 0.6065, 4, "USD", "BUY"],
    ["GOLD", "Gold Spot", "commodities", "TVC", "Global", 2360.50, 2, "USD", "STRONG BUY"], ["XAGUSD", "Silver Spot", "commodities", "TVC", "Global", 30.50, 2, "USD", "BUY"], ["OIL", "Crude Oil Brent", "commodities", "TVC", "Global", 85.40, 2, "USD", "SELL"]
].map(([symbol, name, category, exchange, market, basePrice, decimals, currency, signal]) => ({ symbol, name, category, exchange, market, basePrice, price: basePrice, decimals, currency, signal }));

const shareList = document.getElementById("live-share-list");
const searchInput = document.getElementById("live-share-search");
const currencySymbols = { USD: "$", INR: "₹" };

function marketTime(timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    return { day: parts.find(part => part.type === "weekday").value, minutes: Number(parts.find(part => part.type === "hour").value) * 60 + Number(parts.find(part => part.type === "minute").value) };
}

function isMarketLive(asset) {
    return true;
}

function formatPrice(asset) { return `${currencySymbols[asset.currency]}${asset.price.toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })}`; }
function signalClass(signal) { return signal.includes("SELL") ? "sell" : signal === "NEUTRAL" ? "neutral" : "buy"; }

function getMarketDateLabel() {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date());
}

function getTimeBasedDrift(asset) {
    const now = Date.now();
    const seed = [...asset.symbol].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const volatility = asset.category === "crypto" ? 0.012 : asset.category === "forex" ? 0.0065 : asset.category === "commodities" ? 0.008 : 0.011;
    return Math.sin(now / 1100 + seed * 0.42) * volatility + Math.cos(now / 2200 + seed * 0.27) * (volatility * 0.55);
}

function openShareDetail(symbol) {
    const url = `share-details.html?symbol=${encodeURIComponent(symbol)}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
}

function getLivePrice(asset) {
    const drift = getTimeBasedDrift(asset);
    const target = asset.basePrice * (1 + drift);
    return Number(Math.max(0.0001, target).toFixed(asset.decimals));
}

function renderShares() {
    const query = searchInput.value.toLowerCase().trim();
    const visibleShares = marketAssets.filter(asset => `${asset.symbol} ${asset.name} ${asset.category} ${asset.exchange}`.toLowerCase().includes(query));
    shareList.innerHTML = visibleShares.map(asset => {
        asset.price = getLivePrice(asset);
        const changePercent = ((asset.price - asset.basePrice) / asset.basePrice) * 100;
        const direction = changePercent >= 0 ? "up" : "down";
        return `<tr class="share-row" data-symbol="${asset.symbol}" tabindex="0"><td><div class="share-identity"><span class="share-symbol">${asset.symbol}</span><span>${asset.name}</span></div></td><td><span class="exchange-badge">${asset.exchange}</span></td><td><span class="signal-badge ${signalClass(asset.signal)}">${asset.category} / ${asset.signal}</span></td><td class="numeric-column"><strong class="live-price ${direction}" id="price-${asset.symbol}">${formatPrice(asset)}</strong></td><td class="numeric-column"><span class="live-change ${direction}" id="change-${asset.symbol}">${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%</span></td><td class="numeric-column"><span class="session-bar"><i style="width: ${Math.max(18, Math.min(96, 52 + changePercent * 11))}%"></i></span></td></tr>`;
    }).join("");
    document.getElementById("live-empty-state").hidden = visibleShares.length !== 0;
    updateSummary();
}

shareList.addEventListener("click", (event) => {
    const row = event.target.closest(".share-row");
    if (!row) return;
    openShareDetail(row.dataset.symbol);
});

shareList.addEventListener("keydown", (event) => {
    const row = event.target.closest(".share-row");
    if (!row) return;
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openShareDetail(row.dataset.symbol);
    }
});

function updateSummary() {
    const liveAssets = marketAssets.filter(isMarketLive);
    const advancing = liveAssets.filter(asset => asset.price >= asset.basePrice).length;
    document.getElementById("tracked-count").textContent = liveAssets.length;
    document.getElementById("advancing-count").textContent = advancing;
    document.getElementById("declining-count").textContent = liveAssets.length - advancing;
    const now = new Date();
    document.getElementById("market-date").textContent = getMarketDateLabel();
    document.getElementById("refresh-time").textContent = now.toLocaleTimeString([], { hour12: false });
    document.getElementById("last-updated").textContent = `Updated ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function updateMarket() {
    marketAssets.forEach(asset => {
        asset.price = getLivePrice(asset);
    });
    renderShares();
}

searchInput.addEventListener("input", renderShares);
renderShares();
setInterval(updateMarket, 1000);
