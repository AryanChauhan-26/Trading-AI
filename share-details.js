const marketAssets = [
    ["TSLA", "Tesla Inc.", "stocks", "NASDAQ", "US", 262.50, 2, "USD", "BUY"], ["AAPL", "Apple Inc.", "stocks", "NASDAQ", "US", 215.30, 2, "USD", "NEUTRAL"], ["NVDA", "NVIDIA Corp.", "stocks", "NASDAQ", "US", 128.20, 2, "USD", "STRONG BUY"], ["MSFT", "Microsoft Corp.", "stocks", "NASDAQ", "US", 418.50, 2, "USD", "SELL"], ["AMZN", "Amazon.com Inc.", "stocks", "NASDAQ", "US", 193.10, 2, "USD", "BUY"], ["GOOGL", "Alphabet Inc.", "stocks", "NASDAQ", "US", 175.50, 2, "USD", "BUY"], ["META", "Meta Platforms Inc.", "stocks", "NASDAQ", "US", 490, 2, "USD", "BUY"], ["JNJ", "Johnson & Johnson", "stocks", "NYSE", "US", 150.25, 2, "USD", "SELL"], ["JPM", "JPMorgan Chase & Co.", "stocks", "NYSE", "US", 198.20, 2, "USD", "STRONG SELL"], ["BABA", "Alibaba Group", "stocks", "NYSE", "US", 79.80, 2, "USD", "NEUTRAL"],
    ["RELIANCE", "Reliance Industries", "stocks", "NSE", "India", 2950.75, 2, "INR", "BUY"], ["TCS", "Tata Consultancy", "stocks", "NSE", "India", 3845.50, 2, "INR", "NEUTRAL"], ["HDFCBANK", "HDFC Bank", "stocks", "NSE", "India", 1520.10, 2, "INR", "SELL"], ["INFY", "Infosys Ltd", "stocks", "NSE", "India", 1530, 2, "INR", "BUY"], ["ICICIBANK", "ICICI Bank Ltd", "stocks", "NSE", "India", 1105.50, 2, "INR", "STRONG BUY"], ["SBIN", "State Bank of India", "stocks", "NSE", "India", 830.20, 2, "INR", "NEUTRAL"], ["LT", "Larsen & Toubro Ltd", "stocks", "NSE", "India", 3550, 2, "INR", "SELL"], ["HINDUNILVR", "Hindustan Unilever Ltd", "stocks", "NSE", "India", 2450, 2, "INR", "BUY"], ["TATAMOTORS", "Tata Motors Ltd", "stocks", "NSE", "India", 970.50, 2, "INR", "STRONG BUY"], ["AXISBANK", "Axis Bank Ltd", "stocks", "NSE", "India", 1215, 2, "INR", "BUY"], ["BHARTIARTL", "Bharti Airtel Ltd", "stocks", "NSE", "India", 1410.80, 2, "INR", "NEUTRAL"], ["WIPRO", "Wipro Ltd", "stocks", "NSE", "India", 485.25, 2, "INR", "SELL"], ["KOTAKBANK", "Kotak Mahindra Bank", "stocks", "NSE", "India", 1750, 2, "INR", "NEUTRAL"],
    ["BTCUSD", "Bitcoin / Dollar", "crypto", "BINANCE", "Global", 61250, 0, "USD", "STRONG BUY"], ["ETHUSD", "Ethereum / Dollar", "crypto", "BINANCE", "Global", 3380, 2, "USD", "BUY"], ["SOLUSD", "Solana / Dollar", "crypto", "BINANCE", "Global", 142.50, 2, "USD", "STRONG SELL"], ["DOGEUSD", "Dogecoin / Dollar", "crypto", "BINANCE", "Global", 0.1580, 4, "USD", "BUY"], ["ADAUSD", "Cardano / Dollar", "crypto", "BINANCE", "Global", 0.4550, 4, "USD", "NEUTRAL"], ["XRPUSD", "Ripple / Dollar", "crypto", "BINANCE", "Global", 0.5250, 4, "USD", "SELL"], ["AVAXUSD", "Avalanche / Dollar", "crypto", "BINANCE", "Global", 35.80, 2, "USD", "STRONG BUY"],
    ["EURUSD", "Euro / US Dollar", "forex", "FX_IDC", "Global", 1.0820, 4, "USD", "NEUTRAL"], ["GBPUSD", "Pound / US Dollar", "forex", "FX_IDC", "Global", 1.2750, 4, "USD", "BUY"], ["USDJPY", "US Dollar / Japanese Yen", "forex", "FX_IDC", "Global", 157.85, 2, "USD", "SELL"], ["AUDUSD", "Australian Dollar / US Dollar", "forex", "FX_IDC", "Global", 0.6615, 4, "USD", "BUY"], ["USDCHF", "US Dollar / Swiss Franc", "forex", "FX_IDC", "Global", 0.8985, 4, "USD", "NEUTRAL"], ["USDCAD", "US Dollar / Canadian Dollar", "forex", "FX_IDC", "Global", 1.3625, 4, "USD", "BUY"], ["NZDUSD", "New Zealand Dollar / US Dollar", "forex", "FX_IDC", "Global", 0.6065, 4, "USD", "BUY"],
    ["GOLD", "Gold Spot", "commodities", "TVC", "Global", 2360.50, 2, "USD", "STRONG BUY"], ["XAGUSD", "Silver Spot", "commodities", "TVC", "Global", 30.50, 2, "USD", "BUY"], ["OIL", "Crude Oil Brent", "commodities", "TVC", "Global", 85.40, 2, "USD", "SELL"]
].map(([symbol, name, category, exchange, market, basePrice, decimals, currency, signal]) => ({ symbol, name, category, exchange, market, basePrice, price: basePrice, decimals, currency, signal }));

const currencySymbols = { USD: "$", INR: "₹" };

function formatPrice(asset) {
    const value = typeof asset.price === "number" ? asset.price : asset.basePrice;
    return `${currencySymbols[asset.currency] || "$"}${value.toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })}`;
}

function getAssetSeed(symbol) {
    return [...symbol].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getTimeBasedDrift(asset) {
    const now = Date.now();
    const seed = getAssetSeed(asset.symbol);
    const volatility = asset.category === "crypto" ? 0.012 : asset.category === "forex" ? 0.0065 : asset.category === "commodities" ? 0.008 : 0.011;
    return Math.sin(now / 1100 + seed * 0.42) * volatility + Math.cos(now / 2200 + seed * 0.27) * (volatility * 0.55);
}

function getCurrentDateLabel() {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date());
}

function getLivePrice(asset) {
    const drift = getTimeBasedDrift(asset);
    const target = asset.basePrice * (1 + drift);
    return Number(Math.max(0.0001, target).toFixed(asset.decimals));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getChangePercent(asset) {
    return ((asset.price - asset.basePrice) / asset.basePrice) * 100;
}

function getRecommendation(asset) {
    const changePercent = getChangePercent(asset);
    const signal = asset.signal.toUpperCase();
    let score = 54;
    if (signal.includes("STRONG BUY") || signal.includes("BUY")) score += 18;
    if (signal.includes("STRONG SELL") || signal.includes("SELL")) score -= 18;
    if (changePercent > 0) score += 8;
    if (changePercent < 0) score -= 8;
    if (asset.category === "crypto") score += 4;
    if (asset.category === "commodities") score += 3;
    score = clamp(score, 0, 100);

    if (signal.includes("STRONG SELL") || (signal.includes("SELL") && score < 45)) {
        return { action: "SELL", score, title: "Strong downside risk", tone: "sell" };
    }

    if (signal.includes("STRONG BUY") || (signal.includes("BUY") && score > 60)) {
        return { action: "BUY", score, title: "Bullish momentum intact", tone: "buy" };
    }

    return { action: "HOLD", score, title: "Neutral structure", tone: "neutral" };
}

function buildTradePlan(asset, recommendation) {
    const volatility = asset.category === "crypto" ? 0.065 : asset.category === "forex" ? 0.022 : asset.category === "commodities" ? 0.032 : 0.045;
    const direction = recommendation.action === "BUY" ? 1 : recommendation.action === "SELL" ? -1 : 0;
    const base = asset.price;
    const stopLoss = base * (1 - volatility * (direction === 1 ? 1.1 : direction === -1 ? 1.2 : 1));
    const takeProfit = base * (1 + volatility * (direction === 1 ? 1.9 : direction === -1 ? 1.5 : 1.3));
    const positionSize = recommendation.action === "BUY" ? "$5,000" : recommendation.action === "SELL" ? "$3,500" : "$2,000";

    return { stopLoss, takeProfit, positionSize };
}

function getAssetBySymbol(symbol) {
    const target = (symbol || "AAPL").toUpperCase();
    return marketAssets.find(asset => asset.symbol === target) || marketAssets[0];
}

function populateDetails() {
    const params = new URLSearchParams(window.location.search);
    const asset = getAssetBySymbol(params.get("symbol"));
    asset.price = getLivePrice(asset);
    const changePercent = getChangePercent(asset);
    const recommendation = getRecommendation(asset);
    const tradePlan = buildTradePlan(asset, recommendation);
    const signalClass = recommendation.tone;

    document.title = `${asset.symbol} Analysis | Quantum Trading AI`;
    document.getElementById("share-title").textContent = `${asset.symbol} • ${asset.name}`;
    document.getElementById("share-meta").textContent = `${asset.exchange} • ${asset.category}`;
    document.getElementById("share-market").textContent = `${asset.market} market`;
    document.getElementById("share-date").textContent = getCurrentDateLabel();
    document.getElementById("share-price").textContent = formatPrice(asset);
    document.getElementById("share-change").textContent = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}% today`;
    document.getElementById("share-change").className = `main-price-change ${changePercent >= 0 ? "text-buy" : "text-sell"}`;
    document.getElementById("market-pill").textContent = asset.exchange;

    const dayRangeLow = (asset.price * (1 - 0.022)).toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals });
    const dayRangeHigh = (asset.price * (1 + 0.022)).toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals });
    document.getElementById("day-range").textContent = `${currencySymbols[asset.currency] || "$"}${dayRangeLow} - ${currencySymbols[asset.currency] || "$"}${dayRangeHigh}`;
    document.getElementById("signal-score").textContent = `${recommendation.score}/100`;
    document.getElementById("risk-reward").textContent = `${(tradePlan.takeProfit / tradePlan.stopLoss).toFixed(2)}:1`;

    const badge = document.getElementById("signal-badge");
    badge.textContent = recommendation.action;
    badge.className = `choice-badge ${signalClass}`;

    document.getElementById("entry-price").textContent = formatPrice(asset);
    document.getElementById("stop-loss").textContent = formatPrice({ ...asset, price: tradePlan.stopLoss });
    document.getElementById("take-profit").textContent = formatPrice({ ...asset, price: tradePlan.takeProfit });
    document.getElementById("position-size").textContent = tradePlan.positionSize;

    const summaryText = recommendation.action === "BUY"
        ? `Momentum remains constructive for ${asset.symbol}. The setup favors accumulation near current levels while price holds above the short-term support zone.`
        : recommendation.action === "SELL"
            ? `The broader structure for ${asset.symbol} is weak. Momentum and short-term resistance suggest waiting for a failure near current levels before initiating a short setup.`
            : `The market is balanced for ${asset.symbol}. The best approach is to wait for confirmation while managing risk tightly around the current trading range.`;

    document.getElementById("analysis-summary").textContent = summaryText;

    const points = [
        {
            title: "Trend direction",
            text: recommendation.action === "BUY" ? "The market trend is leaning bullish and the current price is holding above a stable support band." : recommendation.action === "SELL" ? "Momentum is fading and the asset is pressing against resistance with a weaker trend profile." : "Price action is balanced, and the trend is waiting for a clear breakout or rejection at the key range." 
        },
        {
            title: "Volume and conviction",
            text: `${asset.symbol} shows ${recommendation.action === "BUY" ? "healthy participation and support" : recommendation.action === "SELL" ? "thin participation at higher prices and weaker conviction" : "moderate participation without a decisive directional impulse"}.`
        },
        {
            title: "Execution plan",
            text: recommendation.action === "BUY" ? `Prefer buying on pullbacks near the current support zone while keeping the stop below the recent swing low.` : recommendation.action === "SELL" ? `Look for entries on rallies near resistance and keep the stop above the recent swing high.` : `Wait for a breakout confirmation before committing new capital.`
        }
    ];

    const list = document.getElementById("analysis-points");
    list.innerHTML = points.map(point => `
        <li>
            <strong>${point.title}</strong>
            <span>${point.text}</span>
        </li>
    `).join("");

    const scoreBar = document.createElement("div");
    scoreBar.className = "score-bar";
    scoreBar.innerHTML = `<i style="width: ${recommendation.score}%"></i>`;
    list.appendChild(scoreBar);
}

populateDetails();
setInterval(populateDetails, 1500);
