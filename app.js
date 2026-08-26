// ApexTrader AI - Application Logic
document.addEventListener("DOMContentLoaded", () => {
    // --- INJECT & ANIMATE LOGO ---
    // To enable CSS animation on the SVG paths, we inject it directly into the DOM.
    const logoIconContainer = document.querySelector('.logo-icon');
    if (logoIconContainer) {
        logoIconContainer.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="3" y1="21" x2="22" y2="5" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#6366F1"/>
                        <stop offset="1" stop-color="#06B6D4"/>
                    </linearGradient>
                </defs>
                <path class="logo-path-circle" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="url(#logoGradient)" stroke-width="2.5" stroke-linecap="round"/>
                <path class="logo-path-breakout" d="M8 15L12 11L16 14L22 5" stroke="url(#logoGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // --- WATCHLIST & MARKET DATABASE ---
    const assetsData = [
        {
            id: "TSLA",
            tvSymbol: "NASDAQ:TSLA",
            name: "Tesla Inc.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 262.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 78,
            bestLap: "15m",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Strong Buy", "1D": "Neutral" },
            rationale: "TSLA is forming a bullish flag pattern on the short-term charts. The price has consolidated above key support at $256.00 and is breaking out of a descending channel on the 15m chart. Backed by solid daily buying volume and an RSI of 58 (not yet overbought), the current momentum favors long swing trades."
        },
        {
            id: "AAPL",
            tvSymbol: "NASDAQ:AAPL",
            name: "Apple Inc.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 215.30,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "NEUTRAL",
            strength: 52,
            bestLap: "1D",
            lapRatings: { "5m": "Neutral", "15m": "Sell", "1h": "Neutral", "1D": "Buy" },
            rationale: "Apple is currently trading in a tight range. While the daily structure remains long-term bullish, the intraday timeframes (5m, 15m) show negative momentum following rejection at the $218.00 local resistance. Recommend standing aside for day trades or adding on pullbacks to the $212.00 support level."
        },
        {
            id: "NVDA",
            tvSymbol: "NASDAQ:NVDA",
            name: "NVIDIA Corp.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 128.20,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "STRONG BUY",
            strength: 92,
            bestLap: "5m",
            lapRatings: { "5m": "Strong Buy", "15m": "Strong Buy", "1h": "Buy", "1D": "Strong Buy" },
            rationale: "NVDA exhibits exceptional bullish structure across all key timeframes. Short-term 5m and 15m exponential moving averages (EMAs) show a perfect bullish fan alignment. Volume is accelerating. The best time lap for NVDA is 5m momentum scalping, riding the trend with tight trailing stops below the 9 EMA."
        },
        {
            id: "MSFT",
            tvSymbol: "NASDAQ:MSFT",
            name: "Microsoft Corp.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 418.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "SELL",
            strength: 74,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Sell", "1h": "Strong Sell", "1D": "Neutral" },
            rationale: "Microsoft has broken below its 20-day moving average on the 1h timeframe, showing a clear head-and-shoulders breakdown. Oscillators (MACD) show expanding bearish divergence. Dynamic resistance is now established at $421.50. Shorting on intraday rallies offers a high-probability trade down to $408.00."
        },
        {
            id: "AMZN",
            tvSymbol: "NASDAQ:AMZN",
            name: "Amazon.com Inc.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 193.10,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 65,
            bestLap: "15m",
            lapRatings: { "5m": "Buy", "15m": "Buy", "1h": "Neutral", "1D": "Buy" },
            rationale: "AMZN has successfully retested its breakout level near $191.00 and shown immediate buying response. Moving average convergence-divergence (MACD) on the 15m is about to print a bullish cross. Intraday momentum is shifting positive, making the 15m timeframe ideal for capturing the next wave."
        },
        {
            id: "GOOGL",
            tvSymbol: "NASDAQ:GOOGL",
            name: "Alphabet Inc. (GOOGL)",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 175.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 68,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Buy" },
            rationale: "GOOGL is finding support at the 50-day moving average on the 1h chart. After a period of consolidation, buying volume is starting to increase, suggesting a potential move back towards recent highs. The current price offers a good entry for a swing trade."
        },
        {
            id: "META",
            tvSymbol: "NASDAQ:META",
            name: "Meta Platforms Inc.",
            category: "stocks",
            exchange: "NASDAQ",
            country: "US",
            basePriceUSD: 490.00,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 70,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Strong Buy", "1D": "Buy" },
            rationale: "Meta is consolidating above key support at $485.00. The 1-hour chart shows increasing buying volume and a bullish MACD crossover. Expect a move towards $500.00."
        },
        {
            id: "JNJ",
            tvSymbol: "NYSE:JNJ",
            name: "Johnson & Johnson",
            category: "stocks",
            exchange: "NYSE",
            country: "US",
            basePriceUSD: 150.25,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "SELL",
            strength: 60,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Sell", "1h": "Strong Sell", "1D": "Neutral" },
            rationale: "JNJ has broken below its 50-day moving average on the 1-hour chart. Bearish momentum is increasing with rising volume on sell-offs. Short-term target at $148.00."
        },
        {
            id: "JPM",
            tvSymbol: "NYSE:JPM",
            name: "JPMorgan Chase & Co.",
            category: "stocks",
            exchange: "NYSE",
            country: "US",
            basePriceUSD: 198.20,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "STRONG SELL",
            strength: 85,
            bestLap: "15m",
            lapRatings: { "5m": "Sell", "15m": "Strong Sell", "1h": "Sell", "1D": "Neutral" },
            rationale: "JPM is showing signs of a short-term top, with a bearish engulfing candle on the 15m chart. RSI is overbought and showing bearish divergence. A breakdown below the $197.50 support level could trigger a sharp move lower."
        },
        {
            id: "BABA",
            tvSymbol: "NYSE:BABA",
            name: "Alibaba Group",
            category: "stocks",
            exchange: "NYSE",
            country: "US",
            basePriceUSD: 79.80,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "NEUTRAL",
            strength: 45,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "BABA is trading in a tight range with low volume, indicating market indecision. While the daily chart shows potential for a long-term bottom, short-term momentum is lacking. It is best to wait for a confirmed breakout before entering a position."
        },
        {
            id: "RELIANCE",
            tvSymbol: "NSE:RELIANCE",
            name: "Reliance Industries",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 2950.75 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "BUY",
            strength: 72,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Strong Buy" },
            rationale: "Reliance is showing strong upward momentum after breaking out of a consolidation phase. The 1-hour chart indicates a healthy uptrend with support at 2920. Favorable risk-reward for long positions targeting the 3000 psychological level."
        },
        {
            id: "TCS",
            tvSymbol: "NSE:TCS",
            name: "Tata Consultancy",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 3845.50 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "NEUTRAL",
            strength: 48,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "TCS is currently in a sideways market, trading within a defined range. While the long-term daily trend is positive, short-term indicators are mixed. It's best to wait for a clear breakout above 3900 or a breakdown below 3800 before committing to a trade."
        },
        {
            id: "HDFCBANK",
            tvSymbol: "NSE:HDFCBANK",
            name: "HDFC Bank",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1520.10 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "SELL",
            strength: 65,
            bestLap: "15m",
            lapRatings: { "5m": "Sell", "15m": "Strong Sell", "1h": "Sell", "1D": "Neutral" },
            rationale: "HDFC Bank has broken a key support level on the 15-minute chart, indicating potential for further downside. The moving averages are crossed bearishly, and volume is picking up on sell-offs. Shorting on minor rallies presents a good opportunity."
        },
        {
            id: "INFY",
            tvSymbol: "NSE:INFY",
            name: "Infosys Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1530.00 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "BUY",
            strength: 70,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Strong Buy", "1D": "Buy" },
            rationale: "Infosys is showing strong signs of a breakout above its recent consolidation range. The 1-hour chart indicates increasing buying interest with volume expansion. RSI is trending upwards, suggesting further momentum. A long position is favored with targets towards 1580."
        },
        {
            id: "ICICIBANK",
            tvSymbol: "NSE:ICICIBANK",
            name: "ICICI Bank Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1105.50 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "STRONG BUY",
            strength: 85,
            bestLap: "15m",
            lapRatings: { "5m": "Buy", "15m": "Strong Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "ICICI Bank is exhibiting robust bullish momentum on the intraday charts. A strong gap-up opening followed by sustained buying pressure suggests a continuation of the uptrend. The 15-minute chart shows a clear bullish engulfing pattern. Targets are set towards 1120."
        },
        {
            id: "SBIN",
            tvSymbol: "NSE:SBIN",
            name: "State Bank of India",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 830.20 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "NEUTRAL",
            strength: 55,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "State Bank of India is currently in a sideways consolidation phase after a significant rally. While the long-term outlook remains positive, short-term indicators are mixed. Traders should wait for a clear break above 840 or below 820 for directional clarity."
        },
        {
            id: "LT",
            tvSymbol: "NSE:LT",
            name: "Larsen & Toubro Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 3550.00 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "SELL",
            strength: 60,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Sell", "1h": "Sell", "1D": "Neutral" },
            rationale: "Larsen & Toubro is showing signs of weakness after failing to sustain above the 3600 level. The 1-hour chart indicates a bearish divergence with RSI. A breakdown below 3530 could accelerate selling pressure towards 3480. Short positions are favored on rallies."
        },
        {
            id: "HINDUNILVR",
            tvSymbol: "NSE:HINDUNILVR",
            name: "Hindustan Unilever Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 2450.00 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "BUY",
            strength: 68,
            bestLap: "1D",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Neutral", "1D": "Strong Buy" },
            rationale: "Hindustan Unilever is consolidating near a strong support zone around 2430. The daily chart shows a potential for a reversal with increasing accumulation. Long-term investors can consider adding positions here for a move towards 2500 and beyond."
        },
        {
            id: "TATAMOTORS",
            tvSymbol: "NSE:TATAMOTORS",
            name: "Tata Motors Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 970.50 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "STRONG BUY",
            strength: 88,
            bestLap: "1h",
            lapRatings: { "5m": "Buy", "15m": "Strong Buy", "1h": "Strong Buy", "1D": "Buy" },
            rationale: "Tata Motors is in a strong uptrend, consistently making higher highs and higher lows. The 1-hour chart shows a breakout from a bullish pennant, suggesting continued upward momentum. Volume is strong, supporting the move towards the 1000 level."
        },
        {
            id: "AXISBANK",
            tvSymbol: "NSE:AXISBANK",
            name: "Axis Bank Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1215.00 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "BUY",
            strength: 65,
            bestLap: "15m",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "Axis Bank has found strong support at the 1200 level and is showing signs of a reversal. The 15-minute chart shows a bullish divergence on the RSI, indicating weakening selling pressure. A good risk-reward entry for a bounce towards 1240."
        },
        {
            id: "BHARTIARTL",
            tvSymbol: "NSE:BHARTIARTL",
            name: "Bharti Airtel Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1410.80 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "NEUTRAL",
            strength: 52,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "Bharti Airtel is trading in a wide range between 1380 and 1430. While the long-term trend is bullish, short-term momentum is flat. It is advisable to wait for a breakout from this range before taking a directional trade."
        },
        {
            id: "WIPRO",
            tvSymbol: "NSE:WIPRO",
            name: "Wipro Ltd",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 485.25 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "SELL",
            strength: 70,
            bestLap: "1h",
            lapRatings: { "5m": "Sell", "15m": "Sell", "1h": "Strong Sell", "1D": "Neutral" },
            rationale: "Wipro is facing resistance at the 490 level and has formed a bearish double top pattern on the 1-hour chart. The MACD has crossed over to the downside, suggesting a potential move lower towards the 475 support level."
        },
        {
            id: "KOTAKBANK",
            tvSymbol: "NSE:KOTAKBANK",
            name: "Kotak Mahindra Bank",
            category: "stocks",
            exchange: "NSE",
            country: "India",
            basePriceUSD: 1750.00 / 83.5,
            priceDecimals: 2,
            originalCurrency: "INR",
            signal: "NEUTRAL",
            strength: 50,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "Kotak Bank is trading in a narrow range. Long-term outlook is positive, but short-term indicators are mixed. Awaiting a clear breakout above 1780 or breakdown below 1720."
        },
        {
            id: "BTCUSD",
            tvSymbol: "BINANCE:BTCUSDT",
            name: "Bitcoin / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 61250.00,
            priceDecimals: 0,
            originalCurrency: "USD",
            signal: "STRONG BUY",
            strength: 88,
            bestLap: "1h",
            lapRatings: { "5m": "Buy", "15m": "Strong Buy", "1h": "Strong Buy", "1D": "Buy" },
            rationale: "Bitcoin has reclaimed the pivotal $60,000 liquidity pool, sparking a massive short squeeze. The 1h time-lap shows strong ascending structure with increasing volume. Key indicators (RSI at 64) support continued trend expansion. Dynamic support at $59,800 is solid, targeting $64,500 next."
        },
        {
            id: "ETHUSD",
            tvSymbol: "BINANCE:ETHUSDT",
            name: "Ethereum / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 3380.00,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 70,
            bestLap: "15m",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "Ethereum is showing accumulation behavior between $3,320 and $3,360. 15-minute price action reveals a double bottom structure with bullish RSI divergence. Funding rates are neutral, indicating organic buying. A breakout above $3,400 should trigger rapid momentum toward $3,520."
        },
        {
            id: "SOLUSD",
            tvSymbol: "BINANCE:SOLUSDT",
            name: "Solana / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 142.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "STRONG SELL",
            strength: 82,
            bestLap: "15m",
            lapRatings: { "5m": "Strong Sell", "15m": "Strong Sell", "1h": "Sell", "1D": "Neutral" },
            rationale: "Solana has suffered a rejection at the $148.00 horizontal supply block. On the 15m and hourly time-laps, price is printing lower highs and lower lows under the 50-period moving average. The best strategy is shorting breakdowns of $141.50, aiming for target zones near $134.00."
        },
        {
            id: "DOGEUSD",
            tvSymbol: "BINANCE:DOGEUSDT",
            name: "Dogecoin / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 0.1580,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 75,
            bestLap: "15m",
            lapRatings: { "5m": "Buy", "15m": "Strong Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "Dogecoin is showing renewed momentum after finding support at the $0.1500 level. The 15m chart shows a bullish crossover on the MACD, suggesting a potential move towards the $0.1750 resistance. Volume is picking up, supporting the bullish case for a short-term swing trade."
        },
        {
            id: "ADAUSD",
            tvSymbol: "BINANCE:ADAUSDT",
            name: "Cardano / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 0.4550,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "NEUTRAL",
            strength: 55,
            bestLap: "1D",
            lapRatings: { "5m": "Sell", "15m": "Neutral", "1h": "Neutral", "1D": "Buy" },
            rationale: "Cardano is currently consolidating within a tight range between $0.4400 and $0.4700. While the daily chart suggests long-term accumulation, short-term momentum is flat. Traders should wait for a clear breakout above the range resistance or a breakdown below support before entering a position."
        },
        {
            id: "XRPUSD",
            tvSymbol: "BINANCE:XRPUSDT",
            name: "Ripple / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 0.5250,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "SELL",
            strength: 68,
            bestLap: "1h",
            lapRatings: { "5m": "Sell", "15m": "Sell", "1h": "Strong Sell", "1D": "Neutral" },
            rationale: "XRP has failed to break above the key resistance at $0.5400 and is showing signs of weakness. The 1-hour chart shows a bearish divergence on the RSI, and the price has broken below the 50-period moving average. A move down towards the $0.5000 support level is likely."
        },
        {
            id: "AVAXUSD",
            tvSymbol: "BINANCE:AVAXUSDT",
            name: "Avalanche / Dollar",
            category: "crypto",
            exchange: "BINANCE",
            country: "Global",
            basePriceUSD: 35.80,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "STRONG BUY",
            strength: 85,
            bestLap: "1h",
            lapRatings: { "5m": "Buy", "15m": "Strong Buy", "1h": "Strong Buy", "1D": "Buy" },
            rationale: "Avalanche is in a strong uptrend, breaking out of a bullish flag pattern on the 1-hour chart. Volume is increasing, confirming the breakout. The price is targeting the next major resistance level at $40.00. Buying on dips is the recommended strategy."
        },
        {
            id: "EURUSD",
            tvSymbol: "FX_IDC:EURUSD",
            name: "Euro / US Dollar",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 1.0820,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "NEUTRAL",
            strength: 50,
            bestLap: "1D",
            lapRatings: { "5m": "Neutral", "15m": "Neutral", "1h": "Sell", "1D": "Buy" },
            rationale: "EURUSD is flat ahead of central bank rate decisions. Range-bound oscillations between 1.0800 and 1.0840 offer limited trend opportunities. Scalpers might search for mean-reversion trades on the 5m chart, but swing traders should remain on hold until a clear breakout direction is confirmed."
        },
        {
            id: "GBPUSD",
            tvSymbol: "FX_IDC:GBPUSD",
            name: "Pound / US Dollar",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 1.2750,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 62,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Neutral", "1h": "Buy", "1D": "Buy" },
            rationale: "GBPUSD is maintaining an ascending channel on the hourly chart. The pair shows support holding firm at 1.2720 with buyers stepping in aggressively on dips. 1h trend analysis indicates buying momentum remains intact with a primary target at 1.2840, supported by positive macroeconomic sentiment."
        },
        {
            id: "USDJPY",
            tvSymbol: "FX_IDC:USDJPY",
            name: "US Dollar / Japanese Yen",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 157.85,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "SELL",
            strength: 66,
            bestLap: "15m",
            lapRatings: { "5m": "Sell", "15m": "Strong Sell", "1h": "Sell", "1D": "Neutral" },
            rationale: "USDJPY is trading under recent highs as the Yen finds support from lower-risk sentiment. The 15m chart is showing fading momentum below the 158.20 resistance zone, and bearish flow is building into the next retracement. A move toward 156.80 remains possible if the pair fails to reclaim the short-term trend line."
        },
        {
            id: "AUDUSD",
            tvSymbol: "FX_IDC:AUDUSD",
            name: "Australian Dollar / US Dollar",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 0.6615,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 63,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Strong Buy", "1D": "Neutral" },
            rationale: "AUDUSD is holding above a major support band around 0.6580 and showing constructive 1h buying pressure. Commodity-linked strength and a steady risk appetite support higher lows, making a continuation move toward 0.6680 a viable scenario if buyers keep control of the short-term trend."
        },
        {
            id: "USDCHF",
            tvSymbol: "FX_IDC:USDCHF",
            name: "US Dollar / Swiss Franc",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 0.8985,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "NEUTRAL",
            strength: 54,
            bestLap: "1D",
            lapRatings: { "5m": "Neutral", "15m": "Sell", "1h": "Neutral", "1D": "Buy" },
            rationale: "USDCHF remains trapped in a compressed range as traders await clearer macro direction. The pair is respecting support near 0.8950 and resistance around 0.9020, making it a mean-reversion pair until a break defines the next trend. Timing entries around the edges of the range can offer favorable risk-to-reward."
        },
        {
            id: "USDCAD",
            tvSymbol: "FX_IDC:USDCAD",
            name: "US Dollar / Canadian Dollar",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 1.3625,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 58,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "USDCAD is finding support near the 1.3580 area as the US Dollar remains firm against a softer commodity backdrop. The hourly structure suggests a mild bullish continuation as the pair trades above the 20-period average. Traders may look for follow-through toward 1.3680 while keeping risk defined below the recent pivot."
        },
        {
            id: "NZDUSD",
            tvSymbol: "FX_IDC:NZDUSD",
            name: "New Zealand Dollar / US Dollar",
            category: "forex",
            exchange: "FX_IDC",
            country: "Global",
            basePriceUSD: 0.6065,
            priceDecimals: 4,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 60,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Neutral" },
            rationale: "NZDUSD is showing resilience after holding the 0.6020 demand zone, with buyers gradually absorbing local weakness. The 1h chart points to a corrective rebound as the pair recovers toward the descending trend line. Momentum is modest but improving, making pullback entries a sensible strategy while sentiment remains constructive."
        },
        {
            id: "GOLD",
            tvSymbol: "TVC:GOLD",
            name: "Gold Spot",
            category: "commodities",
            exchange: "TVC",
            country: "Global",
            basePriceUSD: 2360.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "STRONG BUY",
            strength: 90,
            bestLap: "1D",
            lapRatings: { "5m": "Buy", "15m": "Buy", "1h": "Strong Buy", "1D": "Strong Buy" },
            rationale: "Gold is exhibiting a powerful macro bull run driven by safe-haven demand. The 1D and 1h charts show a parabolic breakout above critical multi-month resistance. Timeframe analysis confirms that buying pullbacks on the 1h or 1D trend is the optimal path, targeting $2,420 with protective stops at $2,340."
        },
        {
            id: "XAGUSD",
            tvSymbol: "TVC:SILVER",
            name: "Silver Spot",
            category: "commodities",
            exchange: "TVC",
            country: "Global",
            basePriceUSD: 30.50,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "BUY",
            strength: 75,
            bestLap: "1h",
            lapRatings: { "5m": "Neutral", "15m": "Buy", "1h": "Buy", "1D": "Strong Buy" },
            rationale: "Silver is showing strong bullish correlation with Gold, breaking out from a key consolidation zone around $29.80. The 1-hour chart shows a constructive uptrend with the 50 EMA acting as dynamic support. Favorable for long positions targeting the $31.70 resistance level."
        },
        {
            id: "OIL",
            tvSymbol: "TVC:USOIL",
            name: "Crude Oil Brent",
            category: "commodities",
            exchange: "TVC",
            country: "Global",
            basePriceUSD: 85.40,
            priceDecimals: 2,
            originalCurrency: "USD",
            signal: "SELL",
            strength: 68,
            bestLap: "15m",
            lapRatings: { "5m": "Sell", "15m": "Sell", "1h": "Neutral", "1D": "Sell" },
            rationale: "Crude Oil has failed to hold key support at $86.20, shifting the short-term structure to bearish. A bearish crossover on the 15m MACD confirms descending momentum. Rising supply metrics are weighing on demand. We advise selling rallies toward resistance at $85.90, targetting $83.50."
        }
    ];

    // --- APPLICATION STATE ---
    const exchangeRateUSD_INR = 83.5; // Approximate rate for demonstration
    let activeAsset = assetsData[0]; // Default to TSLA
    let activeTimeframe = localStorage.getItem("apex_timeframe") || "15"; // Default to 15m for Advanced Chart, or load from storage
    let activeCurrency = localStorage.getItem("apex_currency") || "USD"; // Default to USD, or load from storage
    const currencySymbols = { "USD": "$", "INR": "₹" };
    let favoriteAssets = new Set();
    let livePrices = {}; // Stores ticking price for each asset ID
    let priceDirection = {}; // Stores positive/negative flag for ticking colors
    
    // Paper Trading State
    let userBalanceUSD = 100000.00; // All internal balance calculations are in USD
    let activePositions = [];
    let tradeHistory = [];
    let simOrderType = "BUY"; // "BUY" or "SELL"
    let currentJournalView = "active";

    // Retrieve storage if available (sim simulated local database)
    const storedFavorites = localStorage.getItem("apex_favorites");
    if (storedFavorites) {
        try {
            favoriteAssets = new Set(JSON.parse(storedFavorites));
        } catch (e) {
            console.error("Failed to parse favorites from localStorage:", e);
            favoriteAssets = new Set();
        }
    }

    const storedBalanceUSD = localStorage.getItem("apex_balance_usd");
    if (storedBalanceUSD && !isNaN(parseFloat(storedBalanceUSD))) {
        userBalanceUSD = parseFloat(storedBalanceUSD);
    } else {
        userBalanceUSD = 100000.00;
        localStorage.setItem("apex_balance_usd", userBalanceUSD.toFixed(2));
    }
    if (localStorage.getItem("apex_history")) {
        try {
            const storedHistory = JSON.parse(localStorage.getItem("apex_history"));
            // Data migration/cleanup for older versions that might have stored 'pnl' or 'margin'
            tradeHistory = storedHistory.map(trade => {
                const pnlValueUSD = Number(trade.pnlUSD ?? trade.pnl ?? 0);
                const marginValueUSD = Number(trade.marginUSD ?? trade.margin ?? 0);
                const pnlPercentValue = marginValueUSD > 0 ? (pnlValueUSD / marginValueUSD) * 100 : 0;
                
                return {
                    ...trade,
                    pnlUSD: pnlValueUSD,
                    marginUSD: marginValueUSD,
                    pnlPercent: Number.isFinite(Number(trade.pnlPercent)) ? Number(trade.pnlPercent) : pnlPercentValue,
                    status: pnlValueUSD >= 0 ? "PROFIT" : "LOSS"
                };
            });
        } catch(e) {
            console.error("Failed to parse or migrate trade history from localStorage:", e);
            tradeHistory = [];
        }
    }
    if (localStorage.getItem("apex_positions")) {
        try {
            activePositions = JSON.parse(localStorage.getItem("apex_positions"));
        } catch(e) {
            activePositions = [];
        }
    }

    // --- INITIALIZE REAL-TIME PRICES ---
    assetsData.forEach(asset => {
        livePrices[asset.id] = asset.basePriceUSD; // Initialize live prices in USD
        priceDirection[asset.id] = "flat";
    });

    // --- DOM ELEMENT REFERENCES ---
    const watchlistContainer = document.getElementById("watchlist-container");
    const categoryTabs = document.querySelectorAll(".watchlist-filter:not(.secondary-filter) .filter-tab");
    const countryTabs = document.querySelectorAll("#country-filter-container .filter-tab");
    const searchInput = document.getElementById("symbol-search");

    // Header stats
    const elBalance = document.getElementById("account-balance");
    const elActiveTradesCount = document.getElementById("active-trades-count");
    const elNetProfitTotal = document.getElementById("net-profit-total");

    // Active Banner
    const elActiveCategory = document.getElementById("active-category");
    const elActiveExchange = document.getElementById("active-exchange");
    const elActiveFullName = document.getElementById("active-full-name");
    const elActiveSymbol = document.getElementById("active-symbol");
    const elActiveLivePrice = document.getElementById("active-live-price");
    const elActivePriceChange = document.getElementById("active-price-change");
    const currencySelector = document.getElementById("currency-selector");
    // Timeframe selector
    const chartTimeframeButtons = document.querySelectorAll("#chart-timeframe-selector .timeframe-btn");

    // "Best Time Lap" UI elements
    const elBestLapValue = document.getElementById("best-lap-value");
    const elOptimalLapBadge = document.getElementById("optimal-lap-badge");

    // New Time-Lap summary items
    const elLapItem5m = document.getElementById("lap-item-5m");
    const elLapItem15m = document.getElementById("lap-item-15m");
    const elLapItem1h = document.getElementById("lap-item-1h");
    const elLapItem1d = document.getElementById("lap-item-1d");
    
    // AI Advisor UI elements
    const elSignalIndicator = document.getElementById("advisory-signal-indicator");
    const elSignalText = document.getElementById("advisory-signal-text");
    const elSignalStrength = document.getElementById("advisory-signal-strength");
    const elTargetEntry = document.getElementById("target-entry");
    const elTargetTP1 = document.getElementById("target-tp1");
    const elTargetTP2 = document.getElementById("target-tp2");
    const elTargetSL = document.getElementById("target-sl");
    const elRationaleText = document.getElementById("advisory-rationale-text");

    // Order Simulator UI elements
    const aiCardContent = document.getElementById("ai-card-content");
    const btnOrderTabBuy = document.getElementById("order-tab-buy");
    const btnOrderTabSell = document.getElementById("order-tab-sell");
    const inputLeverage = document.getElementById("order-leverage");
    const elLeverageDisplay = document.getElementById("leverage-display");
    const inputMargin = document.getElementById("order-margin");
    const elPositionValueDisplay = document.getElementById("position-value-display");
    const elEstimateQty = document.getElementById("estimate-qty");
    const elEstimateProfit = document.getElementById("estimate-profit");
    const elEstimateLoss = document.getElementById("estimate-loss");
    const btnExecuteTrade = document.getElementById("btn-execute-trade");
    const btnResetWalletHeader = document.getElementById("btn-reset-wallet-header"); // New button for header
    const btnApplyTargets = document.getElementById("btn-apply-targets");
    const btnResetWallet = document.getElementById("btn-reset-wallet");
    const demoTradingGuide = document.getElementById("demo-trading-guide");
    const inputTP = document.getElementById("order-tp");
    const inputSL = document.getElementById("order-sl");

    // Journal elements
    const journalTabs = document.querySelectorAll(".journal-tab");
    const btnClearHistory = document.getElementById("btn-clear-history");
    const btnExportHistory = document.getElementById("btn-export-history");
    const tableActivePositions = document.getElementById("table-active-positions");
    const tableTradeHistory = document.getElementById("table-trade-history");
    const bodyActivePositions = document.getElementById("active-positions-body");
    const bodyTradeHistory = document.getElementById("trade-history-body");
    const activePositionsCountTab = document.getElementById("active-positions-count-tab");
    const elToast = document.getElementById("toast");
    const elToastMessage = document.getElementById("toast-message");

    const marketTickerTrack = document.getElementById('market-ticker-track');

    // --- HELPER UTILITIES FOR CURRENCY ---

    // Formats numbers cleanly as currency strings, converting from USD to activeCurrency for display
    function formatCurrency(amountUSD, decimalPlaces) {
        const symbol = currencySymbols[activeCurrency] || "$";
        let convertedAmount = amountUSD;
        if (activeCurrency === "INR") {
            convertedAmount = amountUSD * exchangeRateUSD_INR;
        }
        return symbol + Number(convertedAmount ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        });
    }

    // Formats numbers for input fields (no symbol, converted to activeCurrency)
    function formatCurrencyForInput(amountUSD, decimalPlaces) {
        let convertedAmount = amountUSD;
        if (activeCurrency === "INR") { convertedAmount = amountUSD * exchangeRateUSD_INR; }
        return Number(convertedAmount ?? 0).toFixed(decimalPlaces);
    }

    // --- MARKET TICKER DYNAMIC UPDATE ---
    const tickerAssetConfig = [
        { id: 'BTCUSD', display: 'BTC' },
        { id: 'NVDA', display: 'NVDA' },
        { id: 'TSLA', display: 'TSLA' },
            { id: 'META', display: 'META' }, // Added Meta Platforms Inc. to the ticker
        { id: 'META', display: 'META' }, // Added Meta Platforms Inc. to the ticker
        { id: 'DOGEUSD', display: 'DOGE' },
        { id: 'ADAUSD', display: 'ADA' },
        { id: 'RELIANCE', display: 'RELIANCE' },
        { id: 'GOLD', display: 'Gold' },
        { id: 'EURUSD', display: 'EUR/USD' }
    ];

    function initializeMarketTicker() {
        if (!marketTickerTrack) return;

        const createTickerItemHTML = (assetInfo) => {
            return `
                <span class="market-ticker__item">
                    <strong>${assetInfo.display}</strong>
                    <span id="ticker-change-${assetInfo.id}"></span>
                </span>
            `;
        };

        let itemsHTML = '';
        tickerAssetConfig.forEach(assetInfo => {
            itemsHTML += createTickerItemHTML(assetInfo);
        });

        // Duplicate for marquee effect, creating unique IDs for the duplicates
        const duplicateItemsHTML = itemsHTML.replace(/id="ticker-change-/g, 'id="ticker-change-dup-');
        marketTickerTrack.innerHTML = itemsHTML + duplicateItemsHTML;
    }

    function updateMarketTicker() {
        if (!marketTickerTrack) return;

        tickerAssetConfig.forEach(assetInfo => {
            const asset = assetsData.find(a => a.id === assetInfo.id);
            if (!asset) return;

            const currentPriceUSD = livePrices[asset.id];
            const changeValUSD = currentPriceUSD - asset.basePriceUSD;
            const changePct = (changeValUSD / asset.basePriceUSD) * 100;
            const isPositive = changeValUSD >= 0;
            const sign = isPositive ? "+" : "";
            const colorClass = isPositive ? "text-buy" : "text-sell";

            const changeText = `${sign}${changePct.toFixed(2)}%`;

            const changeEl = document.getElementById(`ticker-change-${assetInfo.id}`);
            const changeElDup = document.getElementById(`ticker-change-dup-${assetInfo.id}`);

            if (changeEl) {
                changeEl.textContent = changeText;
                changeEl.className = colorClass;
            }
            if (changeElDup) {
                changeElDup.textContent = changeText;
                changeElDup.className = colorClass;
            }
        });
    }

    // --- TRADINGVIEW WIDGET CONSTRUCTORS ---

    // 2. Advanced Main Chart Widget
    let mainChartWidget = null;
    function loadMainChart(symbol, interval) {
        const chartContainer = document.getElementById("chart-container");
        if (!chartContainer) return;
        chartContainer.innerHTML = "";

        const placeholder = document.createElement("div");
        placeholder.className = "chart-loading-state";
        placeholder.innerHTML = `
            <div class="chart-loading-card">
                <div class="chart-loading-animation">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
                <div class="chart-loading-title">Loading live chart...</div>
                <div class="chart-loading-subtitle">Connecting to the TradingView feed.</div>
            </div>
        `;
        chartContainer.appendChild(placeholder);

        const showFallbackChart = (message = "The live feed is temporarily unavailable.") => {
            if (placeholder.parentNode) { placeholder.remove(); }
            const fallback = document.createElement("div");

            // If chart fails for an Indian stock, show AI analysis instead.
            if (activeAsset.country === "India") {
                fallback.className = "chart-fallback ai-analysis-fallback";
                const signalClass = activeAsset.signal.toLowerCase().replace(' ', '-');
                fallback.innerHTML = `
                    <div class="ai-fallback-card">
                        <div class="card-header">
                            <div class="logo-group">
                                <div class="ai-pulse-ring"></div>
                                <h2>AI Analysis: ${activeAsset.id}</h2>
                            </div>
                            <span class="model-badge">Chart Unavailable</span>
                        </div>
                        <div class="advisory-signal-box">
                            <div class="signal-indicator ${signalClass}">
                                <div class="signal-text">${activeAsset.signal}</div>
                                <div class="signal-percentage">Consensus: <span>${activeAsset.strength}%</span></div>
                            </div>
                        </div>
                        <div class="advisory-rationale">
                            <h4>AI Rationale</h4>
                            <p>${activeAsset.rationale}</p>
                        </div>
                        <div class="fallback-notice">
                            <p>The live chart for this asset is currently unavailable. The AI's analysis is provided as an alternative view.</p>
                        </div>
                    </div>
                `;
            } else {
                // Original generic fallback
                fallback.className = "chart-fallback";
                fallback.innerHTML = `
                    <div class="chart-fallback__card">
                        <div class="chart-fallback__title">${symbol} live chart</div>
                        <div class="chart-fallback__subtitle">${message} A lightweight fallback view is shown so the panel stays visible.</div>
                        <svg viewBox="0 0 560 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="24" y="20" width="512" height="160" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/><path d="M60 145C110 120 135 90 180 98C225 106 244 150 290 132C336 114 360 74 410 84C460 94 485 132 500 60" stroke="#6366F1" stroke-width="4" stroke-linecap="round"/><path d="M60 145C110 120 135 90 180 98C225 106 244 150 290 132C336 114 360 74 410 84C460 94 485 132 500 60" stroke="url(#lineGlow)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="lineGlow" x1="60" y1="60" x2="500" y2="145" gradientUnits="userSpaceOnUse"><stop stop-color="#06B6D4"/><stop offset="1" stop-color="#10B981"/></linearGradient></defs></svg>
                    </div>
                `;
            }
            chartContainer.appendChild(fallback);
        };

        if (window.TradingView && typeof window.TradingView.widget === "function") {
            try {
                if (placeholder.parentNode) {
                    placeholder.remove();
                }
                new window.TradingView.widget({
                    "width": "100%",
                    "height": "100%",
                    "symbol": symbol,
                    "interval": interval,
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#0B0F19",
                    "enable_publishing": false,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": false,
                    "container_id": "chart-container",
                    "studies": [
                        "RSI@tv-basicstudies",
                        "MASimple@tv-basicstudies"
                    ],
                    "colors": {
                        "upColor": "#10b981",
                        "downColor": "#ef4444",
                        "borderUpColor": "#10b981",
                        "borderDownColor": "#ef4444",
                        "wickUpColor": "#10b981",
                        "wickDownColor": "#ef4444"
                    }
                });

                setTimeout(() => {
                    const hasWidgetCanvas = chartContainer.querySelector("iframe, .tv-widget-container, .tv-embed-widget-wrapper");
                    if (!hasWidgetCanvas) {
                        showFallbackChart("The TradingView widget did not render in time.");
                    }
                }, 1800);
            } catch (error) {
                showFallbackChart("The TradingView widget could not be initialized.");
            }
        } else {
            showFallbackChart("The live feed script is unavailable in this environment.");
        }
    }

    // Load all gauges for the active symbol
    function loadAllGauges() {
        const lapMap = {
            "5m": { el: elLapItem5m, rating: activeAsset.lapRatings["5m"] },
            "15m": { el: elLapItem15m, rating: activeAsset.lapRatings["15m"] },
            "1h": { el: elLapItem1h, rating: activeAsset.lapRatings["1h"] },
            "1D": { el: elLapItem1d, rating: activeAsset.lapRatings["1D"] }
        };

        for (const [key, value] of Object.entries(lapMap)) {
            if (!value.el) continue;

            // Reset classes
            value.el.className = 'time-lap-item';

            // Add rating class
            const ratingClass = value.rating.toLowerCase().replace(' ', '-');
            value.el.classList.add(ratingClass);

            // Add active class if it's the best lap
            if (activeAsset.bestLap === key) {
                value.el.classList.add('active-lap');
            }

            // Set text content to the rating
            const label = value.el.querySelector('.lap-item-label');
            if (label) {
                label.textContent = key.toUpperCase(); // Set the label to 5m, 15m etc.
            }
        }
    }


    // --- MARKET CLOCK & STATUS ENGINE ---
    let marketStates = { "US": true, "India": true, "Global": true };
    
    function updateMarketStates() {
        const now = new Date();
        
        // US Market (9:30 AM - 4:00 PM EST, Mon-Fri)
        const estStr = now.toLocaleString("en-US", {timeZone: "America/New_York"});
        const estDate = new Date(estStr);
        const estDay = estDate.getDay();
        const estTime = estDate.getHours() * 60 + estDate.getMinutes();
        marketStates["US"] = !(estDay === 0 || estDay === 6 || estTime < 570 || estTime >= 960);
        
        // Indian Market (9:15 AM - 3:30 PM IST, Mon-Fri)
        const istStr = now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const istDate = new Date(istStr);
        const istDay = istDate.getDay();
        const istTime = istDate.getHours() * 60 + istDate.getMinutes();
        marketStates["India"] = !(istDay === 0 || istDay === 6 || istTime < 555 || istTime >= 930);
        
        // Global Markets (Crypto, Forex)
        marketStates["Global"] = true;
    }

    function updateMarketClock() {
        if (!activeAsset) return;
        
        const elMarketClock = document.getElementById("market-clock-display");
        const elMarketStatusBadge = document.getElementById("market-status-badge");
        if (!elMarketClock || !elMarketStatusBadge) return;

        updateMarketStates();
        
        const now = new Date();
        let timeString = "";
        let prefix = "";

        if (activeAsset.country === "US") {
            timeString = now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: true, hour: "numeric", minute: "2-digit", second: "2-digit" });
            prefix = "NY Time: ";
        } else if (activeAsset.country === "India") {
            timeString = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: true, hour: "numeric", minute: "2-digit", second: "2-digit" });
            prefix = "IST Time: ";
        } else {
            timeString = now.toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "2-digit", second: "2-digit" });
            prefix = "Local Time: ";
        }

        elMarketClock.textContent = prefix + timeString;
        
        const isOpen = marketStates[activeAsset.country];
        
        if (isOpen) {
            elMarketStatusBadge.textContent = "Market Open";
            elMarketStatusBadge.className = "market-status-badge open";
            if (btnExecuteTrade) {
                btnExecuteTrade.disabled = false;
                btnExecuteTrade.style.opacity = "1";
                btnExecuteTrade.style.cursor = "pointer";
            }
        } else {
            elMarketStatusBadge.textContent = "Market Closed";
            elMarketStatusBadge.className = "market-status-badge closed";
            if (btnExecuteTrade) {
                btnExecuteTrade.disabled = true;
                btnExecuteTrade.style.opacity = "0.5";
                btnExecuteTrade.style.cursor = "not-allowed";
            }
        }
    }


    // --- SIMULATED PRICE TICK ENGINE ---
    // Creates high fidelity price oscillations
    function startPriceTicks() {
        setInterval(() => {
            updateMarketClock(); // Update clock every second
            
            assetsData.forEach(asset => {
                if (!marketStates[asset.country]) return; // Skip updating price if market is closed

                const prevPriceUSD = livePrices[asset.id]; // Always work with USD internally
                let baseVolatility = 0.08; // Base percentage range (e.g., 0.08 for +/- 0.04%)
                let bias = 0; // -1 to +1

                // Apply bias based on the AI signal to make it seem more predictive
                switch (asset.signal) {
                    case "STRONG BUY": bias = 0.025; break;
                    case "BUY": bias = 0.015; break;
                    case "SELL": bias = -0.015; break;
                    case "STRONG SELL": bias = -0.025; break;
                    default: bias = 0; break; // Neutral
                }

                // Create a random change with the applied bias
                // e.g., for BUY, random range shifts from (-0.04 to 0.045) to (-0.025 to 0.06)
                const randomFactor = (Math.random() * baseVolatility) - (baseVolatility / 2); // e.g., -0.04 to +0.04
                const changePercent = (randomFactor + bias) / 100;


                let newPriceUSD = prevPriceUSD * (1 + changePercent); // Fix: Use prevPriceUSD
                
                // Format price decimals based on asset type
                newPriceUSD = parseFloat(newPriceUSD.toFixed(asset.priceDecimals));
                
                livePrices[asset.id] = newPriceUSD; // Store in USD
                
                // Set color flash direction
                if (newPriceUSD > prevPriceUSD) { // Fix: Use prevPriceUSD
                    priceDirection[asset.id] = "up";
                } else if (newPriceUSD < prevPriceUSD) { // Fix: Use prevPriceUSD
                    priceDirection[asset.id] = "down";
                } else {
                    priceDirection[asset.id] = "flat";
                }
            });

            // Update UI elements for active asset
            updateActivePriceUI();
            // Update items in watchlist
            updateWatchlistPrices();
            // Recalculate and update open positions PnL
            updatePositionsPnL();
            // Update the market ticker
            updateMarketTicker();
        }, 1000);
    }

    // Updates price displays in active header banner and calculator
    function updateActivePriceUI() {
        if (!activeAsset || !elActiveLivePrice) return;

        const currentPriceUSD = livePrices[activeAsset.id]; // Get price in USD
        const decimals = activeAsset.priceDecimals;
        
        // Show formatted price
        elActiveLivePrice.textContent = formatCurrency(currentPriceUSD, decimals);
        
        // Ticking color class
        elActiveLivePrice.classList.remove("text-buy", "text-sell");
        if (priceDirection[activeAsset.id] === "up") { // Price direction is based on USD change
            elActiveLivePrice.classList.add("text-buy");
        } else if (priceDirection[activeAsset.id] === "down") {
            elActiveLivePrice.classList.add("text-sell");
        }

        if (elActivePriceChange) {
            const rawDiffUSD = currentPriceUSD - activeAsset.basePriceUSD; // Calculate diff in USD
            const pctDiff = (rawDiffUSD / activeAsset.basePriceUSD) * 100;
            
            const sign = rawDiffUSD >= 0 ? "+" : "";
            const formattedDiff = formatCurrency(rawDiffUSD, decimals);
            const formattedPct = pctDiff.toFixed(2);
            
            elActivePriceChange.textContent = `${sign}${formattedDiff} (${sign}${formattedPct}%)`;
            elActivePriceChange.className = "ticker-change " + (rawDiffUSD >= 0 ? "text-buy" : "text-sell");
        }

        // Update Calculator/Simulator entry display logic
        if (inputMargin && inputLeverage && elPositionValueDisplay && elEstimateQty && elEstimateProfit && elEstimateLoss) {
            updateCalculatorOutput();
        }
    }


    // --- WATCHLIST BUILD & MANAGEMENT ---
    
    // Renders the watchlist based on category & country filters & search term
    function renderWatchlist() {
        if (!watchlistContainer || !searchInput) return;

        const activeCatTab = document.querySelector(".watchlist-filter:not(.secondary-filter) .filter-tab.active");
        const category = activeCatTab ? activeCatTab.getAttribute("data-category") : "all";
        
        const activeCountryTab = document.querySelector("#country-filter-container .filter-tab.active");
        const country = activeCountryTab ? activeCountryTab.getAttribute("data-country") : "all";

        const query = searchInput.value.toLowerCase().trim();

        watchlistContainer.innerHTML = "";

        const filteredAssets = assetsData.filter(asset => {
            const matchesCategory = category === "all" || asset.category === category;
            const matchesCountry = country === "all" || asset.country === country;
            const matchesQuery = asset.id.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query);
            return matchesCategory && matchesCountry && matchesQuery;
        });

        // Sort by favorite status first, then by ID
        filteredAssets.sort((a, b) => {
            const aIsFav = favoriteAssets.has(a.id);
            const bIsFav = favoriteAssets.has(b.id);
            if (aIsFav && !bIsFav) return -1;
            if (!aIsFav && bIsFav) return 1;
            return a.id.localeCompare(b.id); // Secondary sort for consistent order
        });

        if (filteredAssets.length === 0) {
            watchlistContainer.innerHTML = `<div class="empty-journal-message">No assets match your filters.</div>`;
            return;
        }

        filteredAssets.forEach(asset => {
            const itemDiv = document.createElement("div");
            itemDiv.className = `watchlist-item ${asset.id === activeAsset.id ? "active" : ""}`;
            itemDiv.setAttribute("data-id", asset.id);

            const decimals = asset.priceDecimals;
            const currentPriceUSD = livePrices[asset.id]; // Get price in USD
            const changeValUSD = currentPriceUSD - asset.basePriceUSD; // Calculate change in USD
            const changePct = (changeValUSD / asset.basePriceUSD) * 100;
            
            const isPositive = changeValUSD >= 0;
            const sign = isPositive ? "+" : "";
            const colorClass = isPositive ? "text-buy" : "text-sell";
            const isFavorite = favoriteAssets.has(asset.id);

            itemDiv.innerHTML = `
                <div class="watchlist-item-left">
                    <button class="watchlist-fav-btn ${isFavorite ? 'favorited' : ''}" title="Toggle Favorite">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                    </button>
                    <div class="watchlist-item-info">
                        <span class="watchlist-symbol">${asset.id}</span>
                        <span class="watchlist-name">${asset.name}</span>
                    </div>
                </div>
                <div class="watchlist-item-right">
                    <span class="watchlist-price font-mono" id="w-price-${asset.id}">${formatCurrency(currentPriceUSD, decimals)}</span>
                    <span class="watchlist-change font-mono ${colorClass}" id="w-change-${asset.id}">${sign}${changePct.toFixed(2)}%</span>
                </div>
            `;

            // The main click listener for selecting an asset
            itemDiv.addEventListener("click", () => {
                selectAsset(asset);
            });

            // Event listener for the favorite button
            const favBtn = itemDiv.querySelector('.watchlist-fav-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the asset from being selected
                if (favoriteAssets.has(asset.id)) {
                    favoriteAssets.delete(asset.id);
                } else {
                    favoriteAssets.add(asset.id);
                }
                // Save to localStorage and re-render the list
                localStorage.setItem("apex_favorites", JSON.stringify(Array.from(favoriteAssets)));
                renderWatchlist();
            });

            watchlistContainer.appendChild(itemDiv);
        });
    }

    // Periodically updates prices in the sidebar list (runs every tick)
    function updateWatchlistPrices() {
        assetsData.forEach(asset => {
            const elPrice = document.getElementById(`w-price-${asset.id}`);
            const elChange = document.getElementById(`w-change-${asset.id}`);
            if (!elPrice || !elChange) return;

            const decimals = asset.priceDecimals;
            const currentPriceUSD = livePrices[asset.id]; // Get price in USD
            elPrice.textContent = formatCurrency(currentPriceUSD, decimals); // Display in active currency
            
            // Price flash color
            elPrice.classList.remove("text-buy", "text-sell");
            if (priceDirection[asset.id] === "up") {
                elPrice.classList.add("text-buy");
            } else if (priceDirection[asset.id] === "down") {
                elPrice.classList.add("text-sell");
            }

            const changeValUSD = currentPriceUSD - asset.basePriceUSD; // Calculate change in USD
            const changePct = (changeValUSD / asset.basePriceUSD) * 100;
            const isPositive = changeValUSD >= 0;
            const sign = isPositive ? "+" : ""; // Fix: Use isPositive

            elChange.textContent = `${sign}${changePct.toFixed(2)}%`;
            elChange.className = `watchlist-change font-mono ${isPositive ? "text-buy" : "text-sell"}`;
        });
    }

    // Handles picking a different asset from search/watchlist
    function selectAsset(asset) {
        // If the asset is already active, do nothing.
        if (activeAsset && activeAsset.id === asset.id) return;

        activeAsset = asset;
        loadAssetData(asset);
    }

    // Central function to load all data for a given asset
    function loadAssetData(asset) {
        if (elActiveCategory) elActiveCategory.textContent = asset.category.toUpperCase();
        if (elActiveExchange) elActiveExchange.textContent = asset.exchange;
        if (elActiveFullName) elActiveFullName.textContent = asset.name;
        if (elActiveSymbol) elActiveSymbol.textContent = asset.id;

        document.querySelectorAll(".watchlist-item").forEach(item => {
            item.classList.toggle("active", item.getAttribute("data-id") === asset.id);
        });

        updateActivePriceUI();
        updateMarketClock();

        livePrices[asset.id] = asset.basePriceUSD;

        if (document.getElementById("chart-container")) {
            loadMainChart(asset.tvSymbol, activeTimeframe);
        }

        if (aiCardContent) {
            aiCardContent.classList.add("analyzing");
        }

        showToast(`AI analyzing market data for ${asset.id}...`, 'info');

        setTimeout(() => {
            loadAllGauges();
            if (elSignalIndicator && elSignalText && elSignalStrength && elTargetEntry && elTargetTP1 && elTargetTP2 && elTargetSL && elRationaleText && elBestLapValue) {
                updateAdviceConsole();
                fillAdvisorySetup();
            }

            if (aiCardContent) {
                aiCardContent.classList.remove("analyzing");
            }

            showToast(`AI analysis for ${asset.id} complete.`, 'success', 2000);
        }, 1500);
    }


    // --- AI ADVISORY CONSOLE CONTROLLER ---
    const elSignalStrengthValue = document.getElementById("advisory-signal-strength-value");


    // Dynamically updates written recommendations and buy/sell levels relative to current prices
    function updateAdviceConsole() {
        if (!elSignalIndicator || !elSignalText || !elSignalStrength || !elTargetEntry || !elTargetTP1 || !elTargetTP2 || !elTargetSL || !elRationaleText || !elBestLapValue) {
            return;
        }

        const curPriceUSD = livePrices[activeAsset.id]; // Always work with USD internally
        const decimals = activeAsset.priceDecimals;
        
        // Determine signals
        const signal = activeAsset.signal;
        
        // Set colors and text based on signal
        elSignalIndicator.className = "signal-indicator " + signal.toLowerCase().replace(" ", "-");
        elSignalText.textContent = signal;
        elSignalStrengthValue.textContent = `${activeAsset.strength}%`;

        // Calculate dynamic entries, take-profits, and stop-losses based on ticking price
        let entryMin, entryMax, tp1, tp2, sl;
        
        if (signal.includes("BUY")) {
            // For Buy/Long trades
            entryMin = curPriceUSD * 0.995;
            entryMax = curPriceUSD * 1.002;
            tp1 = curPriceUSD * 1.035;
            tp2 = curPriceUSD * 1.068;
            sl = curPriceUSD * 0.975;
        } else if (signal.includes("SELL")) {
            // For Sell/Short trades
            entryMin = curPriceUSD * 0.998;
            entryMax = curPriceUSD * 1.005;
            tp1 = curPriceUSD * 0.965;
            tp2 = curPriceUSD * 0.932;
            sl = curPriceUSD * 1.025;
        } else { // Neutral
            // Neutral/flat advice
            entryMin = curPriceUSD * 0.997;
            entryMax = curPriceUSD * 1.003;
            tp1 = curPriceUSD * 1.015;
            tp2 = curPriceUSD * 1.030;
            sl = curPriceUSD * 0.985;
        }
        // Display converted to active currency
        elTargetEntry.textContent = `${formatCurrency(entryMin, decimals)} - ${formatCurrency(entryMax, decimals)}`;
        elTargetTP1.textContent = formatCurrency(tp1, decimals);
        elTargetTP2.textContent = formatCurrency(tp2, decimals);
        elTargetSL.textContent = formatCurrency(sl, decimals);

        // Update rationale description
        elRationaleText.textContent = activeAsset.rationale;

        // Update Optimal Timeframe Lap highlight
        const lapValues = { "5m": "5 Minutes", "15m": "15 Minutes", "1h": "1 Hour", "1D": "1 Day" };
        const recommendedLap = activeAsset.bestLap;
        elBestLapValue.textContent = lapValues[recommendedLap] || "15 Minutes";
    }

    // Auto-populates TP/SL simulator fields with AI Advisor targets
    function fillAdvisorySetup() {
        if (!inputTP || !inputSL) return;

        const curPriceUSD = livePrices[activeAsset.id]; // Always work with USD internally
        const decimals = activeAsset.priceDecimals;
        const signal = activeAsset.signal;

        let tp1, sl;
        if (signal.includes("BUY")) {
            tp1 = curPriceUSD * 1.035;
            sl = curPriceUSD * 0.975;
        } else if (signal.includes("SELL")) {
            tp1 = curPriceUSD * 0.965;
            sl = curPriceUSD * 1.025;
        } else {
            tp1 = curPriceUSD * 1.015;
            sl = curPriceUSD * 0.985;
        }

        inputTP.value = formatCurrencyForInput(tp1, decimals); // Format for input field
        inputSL.value = formatCurrencyForInput(sl, decimals); // Format for input field
        updateCalculatorOutput();
    }


    // --- SIMULATOR & CALCULATOR ENGINE ---

    function setOrderMode(mode) {
        if (!btnOrderTabBuy || !btnOrderTabSell || !btnExecuteTrade || !inputTP || !inputSL) return;

        simOrderType = mode;
        const isBuy = mode === "BUY";

        btnOrderTabBuy.classList.toggle("active", isBuy);
        btnOrderTabSell.classList.toggle("active", !isBuy);
        btnOrderTabBuy.setAttribute("aria-pressed", isBuy ? "true" : "false");
        btnOrderTabSell.setAttribute("aria-pressed", isBuy ? "false" : "true");

        btnExecuteTrade.textContent = isBuy ? "EXECUTE BUY ORDER" : "EXECUTE SELL ORDER";
        btnExecuteTrade.className = `btn-execute ${isBuy ? "buy" : "sell"}`;

        // Clear manual targets when switching order mode
        inputTP.value = "";
        inputSL.value = "";

        updateCalculatorOutput();
    }

    // Handles toggle tabs (BUY vs SELL)
    if (btnOrderTabBuy) btnOrderTabBuy.addEventListener("click", () => setOrderMode("BUY"));
    if (btnOrderTabSell) btnOrderTabSell.addEventListener("click", () => setOrderMode("SELL"));

    // Leverage range input update
    if (inputLeverage) {
        inputLeverage.addEventListener("input", (e) => {
            if (elLeverageDisplay) elLeverageDisplay.textContent = `${e.target.value}x`;
            updateCalculatorOutput();
        });
    }

    // Margin amount text input update
    if (inputMargin) {
        inputMargin.addEventListener("input", () => {
            updateCalculatorOutput();
        });
    }

    // Computes active trade sizes and potential P&L calculations
    function updateCalculatorOutput() {
        if (!inputMargin || !inputLeverage || !elPositionValueDisplay || !elEstimateQty || !elEstimateProfit || !elEstimateLoss) return;

        const marginInput = parseFloat(inputMargin.value) || 0;
        const marginUSD = (activeCurrency === "INR") ? marginInput / exchangeRateUSD_INR : marginInput;
        const leverage = parseInt(inputLeverage.value) || 1;
        const entryPriceUSD = livePrices[activeAsset.id]; // Entry price is in USD

        if (marginUSD <= 0 || !entryPriceUSD) {
            elPositionValueDisplay.textContent = formatCurrency(0, 2);
            elEstimateQty.textContent = "0.00 units";
            elEstimateProfit.textContent = `+${formatCurrency(0, 2)}`;
            elEstimateLoss.textContent = `-${formatCurrency(0, 2)}`;
            return;
        }
        
        const positionValueUSD = marginUSD * leverage; // Position value in USD
        elPositionValueDisplay.textContent = formatCurrency(positionValueUSD, 2); // Display converted

        const qty = positionValueUSD / entryPriceUSD;
        elEstimateQty.textContent = `${qty.toFixed(4)} units`;

        // TP and SL prices from input fields are in the active currency, convert to USD for calculation
        const tpPriceInput = parseFloat(inputTP.value) || 0;
        const slPriceInput = parseFloat(inputSL.value) || 0;

        let tpPriceUSD = (activeCurrency === "INR") ? tpPriceInput / exchangeRateUSD_INR : tpPriceInput;
        let slPriceUSD = (activeCurrency === "INR") ? slPriceInput / exchangeRateUSD_INR : slPriceInput;

        // Read actual TP and SL prices from input fields
        const tpPrice = parseFloat(inputTP.value) || 0;
        const slPrice = parseFloat(inputSL.value) || 0;

        let profitEst = 0;
        let lossEst = 0;

        if (tpPriceUSD > 0) {
            if (simOrderType === "BUY") {
                profitEst = Math.max(0, tpPriceUSD - entryPriceUSD) * qty;
            } else { // SELL
                profitEst = Math.max(0, entryPriceUSD - tpPriceUSD) * qty;
            }
        }
        
        if (slPriceUSD > 0) {
            if (simOrderType === "BUY") { // BUY
                lossEst = Math.max(0, entryPriceUSD - slPriceUSD) * qty;
            } else {
                lossEst = Math.max(0, slPriceUSD - entryPriceUSD) * qty;
            }
        }

        // If no custom TP/SL is set, fall back to default percentage offsets
        if (tpPriceUSD <= 0) {
            profitEst = marginUSD * 3.5; // Default to a 350% potential profit on margin
        }
        if (slPriceUSD <= 0) {
            lossEst = marginUSD; // Default to a 100% potential loss of margin
        }

        elEstimateProfit.textContent = `+${formatCurrency(profitEst, 2)}`; // Display converted
        elEstimateLoss.textContent = `-${formatCurrency(lossEst, 2)}`; // Display converted
    }


    // --- SIMULATED ORDER EXECUTION ---

    if (btnExecuteTrade) {
        btnExecuteTrade.addEventListener("click", () => {
        const marginInput = parseFloat(inputMargin.value);
        const marginUSD = (activeCurrency === "INR") ? marginInput / exchangeRateUSD_INR : marginInput;
        const leverage = parseInt(inputLeverage.value);
        const entryPriceUSD = livePrices[activeAsset.id]; // Entry price is in USD
        
        if (isNaN(marginUSD) || marginUSD <= 0) {
            showToast("Please enter a valid margin amount.", 'error');
            return;
        }
        if (!marketStates[activeAsset.country]) {
            showToast(`The ${activeAsset.country} market is currently closed.`, 'error', 4000);
            return;
        }
        if (marginUSD > userBalanceUSD) {
            showToast("Insufficient simulated balance.", 'error');
            return;
        }

        // Deduct balance
        userBalanceUSD -= marginUSD; // Deduct from USD balance
        updateBalanceUI();

        // Calculate position details
        const positionValueUSD = marginUSD * leverage;
        const qty = positionValueUSD / entryPriceUSD;

        // TP/SL prices from input need to be converted to USD for storage
        const tpPriceInput = parseFloat(inputTP.value) || 0;
        const slPriceInput = parseFloat(inputSL.value) || 0;
        let tpPriceUSD = (activeCurrency === "INR") ? tpPriceInput / exchangeRateUSD_INR : tpPriceInput;
        let slPriceUSD = (activeCurrency === "INR") ? slPriceInput / exchangeRateUSD_INR : slPriceInput;

        // Validate TP/SL logic
        if (simOrderType === "BUY") {
            if (tpPriceUSD > 0 && tpPriceUSD <= entryPriceUSD) {
                showToast("TP must be higher than entry for a BUY order.", 'error');
                return;
            }
            if (slPriceUSD > 0 && slPriceUSD >= entryPriceUSD) {
                showToast("SL must be lower than entry for a BUY order.", 'error');
                return;
            }
        } else {
            if (tpPriceUSD > 0 && tpPriceUSD >= entryPriceUSD) {
                showToast("TP must be lower than entry for a SELL order.", 'error');
                return;
            }
            if (slPriceUSD > 0 && slPriceUSD <= entryPriceUSD) {
                showToast("SL must be higher than entry for a SELL order.", 'error');
                return;
            }
        }

        const newTrade = {
            id: "trade_" + Date.now(),
            assetId: activeAsset.id,
            symbol: activeAsset.tvSymbol,
            name: activeAsset.name,
            decimals: activeAsset.priceDecimals,
            type: simOrderType, // "BUY" (Long) or "SELL" (Short)
            leverage: leverage,
            marginUSD: marginUSD, // Store margin in USD
            qty: qty,
            entryPriceUSD: entryPriceUSD, // Store entry price in USD
            currentPriceUSD: entryPriceUSD, // Store current price in USD
            tpPriceUSD: tpPriceUSD, // Store TP in USD
            slPriceUSD: slPriceUSD, // Store SL in USD
            pnlUSD: 0.00, // Store PnL in USD
            pnlPercent: 0.00,
            status: "OPEN", // Add status for active positions
            time: new Date().toLocaleTimeString()
        };

        activePositions.push(newTrade);
        localStorage.setItem("apex_positions", JSON.stringify(activePositions));
        
        // Re-render
        demoTradingGuide.classList.add("hidden"); // Hide the guide after the first trade
        renderActivePositions();
        updateHeaderStats();
        
        // Show success notification toast
        showToast(`${simOrderType === "BUY" ? "Long" : "Short"} position opened for ${activeAsset.id}!`, 'success');
    });
    }

    // Renders active trades list in the journal table
    function renderActivePositions() {
        if (!bodyActivePositions) return;

        bodyActivePositions.innerHTML = "";

        if (activePositions.length === 0) {
            bodyActivePositions.innerHTML = `
                <tr>
                    <td colspan="11" class="empty-journal-message">No active positions. Open a simulated trade above to begin trading.</td>
                </tr>
            `;
            if (activePositionsCountTab) activePositionsCountTab.textContent = "0";
            return;
        }

        if (activePositionsCountTab) activePositionsCountTab.textContent = activePositions.length; // No change

        activePositions.forEach(pos => {
            const tr = document.createElement("tr");
            tr.id = `pos-row-${pos.id}`;

            const pnlClass = pos.pnlUSD > 0 ? "text-buy" : pos.pnlUSD < 0 ? "text-sell" : "text-neutral";
            const pnlText = formatPnlDisplay(pos.pnlUSD, 2); // Display PnL in active currency
            const inputStep = pos.decimals === 4 ? "0.0001" : (pos.decimals === 2 ? "0.01" : "1");

            const tpValue = pos.tpPriceUSD > 0 ? `value="${formatCurrencyForInput(pos.tpPriceUSD, pos.decimals)}"` : 'placeholder="None"';
            const slValue = pos.slPriceUSD > 0 ? `value="${formatCurrencyForInput(pos.slPriceUSD, pos.decimals)}"` : 'placeholder="None"';

            tr.innerHTML = `
                <td><strong>${pos.assetId}</strong></td>
                <td><span class="badge-position ${pos.type.toLowerCase()}">${pos.type}</span></td>
                <td class="text-mono">${pos.leverage}x</td>
                <td class="text-mono">${pos.qty.toFixed(4)}</td>
                <td class="text-mono">${formatCurrency(pos.marginUSD, 2)}</td>
                <td class="text-mono">${formatCurrency(pos.entryPriceUSD, pos.decimals)}</td>
                <td class="text-mono" id="pos-curprice-${pos.id}">${formatCurrency(pos.currentPriceUSD, pos.decimals)}</td>
                <td><input type="number" class="pos-edit-input" id="pos-tp-${pos.id}" ${tpValue} step="${inputStep}"></td>
                <td><input type="number" class="pos-edit-input" id="pos-sl-${pos.id}" ${slValue} step="${inputStep}"></td>
                <td class="text-mono ${pnlClass}" id="pos-pnl-${pos.id}">${pnlText} (${formatPnlDisplay(pos.pnlPercent, 2)}%)</td>
                <td><button class="btn-close-position" data-trade-id="${pos.id}">CLOSE</button></td>
            `;

            // Add a temporary class for the fade-in animation
            setTimeout(() => {
                tr.classList.add('new-row');
            }, 10);


            bodyActivePositions.appendChild(tr);

            // Bind click to Close Button
            tr.querySelector(".btn-close-position").addEventListener("click", () => {
                closePosition(pos.id);
            });

            // Bind change events to new TP/SL inputs
            const inputTP = document.getElementById(`pos-tp-${pos.id}`);
            const inputSL = document.getElementById(`pos-sl-${pos.id}`);

            inputTP.addEventListener("change", (e) => {
                const newTpPrice = parseFloat(e.target.value);
                if (!isNaN(newTpPrice) && newTpPrice > 0) { // Input is in active currency
                    pos.tpPriceUSD = (activeCurrency === "INR") ? newTpPrice / exchangeRateUSD_INR : newTpPrice; // Convert to USD for storage
                    showToast(`TP for ${pos.assetId} updated.`, 'info');
                }
            });
            inputSL.addEventListener("change", (e) => {
                const newSlPrice = parseFloat(e.target.value);
                if (!isNaN(newSlPrice) && newSlPrice > 0) { // Input is in active currency
                    pos.slPriceUSD = (activeCurrency === "INR") ? newSlPrice / exchangeRateUSD_INR : newSlPrice; // Convert to USD for storage
                    showToast(`SL for ${pos.assetId} updated.`, 'info');
                }
            });
        });
    }

    // Updates live prices, margins, PnL ratios in active rows (runs every tick)
    function updatePositionsPnL() {
        if (activePositions.length === 0) return;

        const positionsToAutoClose = [];

        activePositions.forEach(pos => {
            const currentPriceUSD = livePrices[pos.assetId]; // Current price is in USD
            pos.currentPriceUSD = currentPriceUSD; // Update current price in USD

            // PnL calculations
            let priceDiffUSD = 0;
            if (pos.type === "BUY") {
                priceDiffUSD = currentPriceUSD - pos.entryPriceUSD;
            } else {
                priceDiffUSD = pos.entryPriceUSD - currentPriceUSD;
            }

            pos.pnlUSD = priceDiffUSD * pos.qty; // PnL is in USD
            pos.pnlPercent = (pos.pnlUSD / pos.marginUSD) * 100; // PnL % based on USD margin

            // Update UI row elements
            const elCurPrice = document.getElementById(`pos-curprice-${pos.id}`);
            const elPnl = document.getElementById(`pos-pnl-${pos.id}`);

            if (elCurPrice) {
                elCurPrice.textContent = formatCurrency(currentPriceUSD, pos.decimals); // Display converted
            }
            if (elPnl) {
                elPnl.textContent = `${formatPnlDisplay(pos.pnlUSD, 2)} (${formatPnlDisplay(pos.pnlPercent, 2)}%)`; // Display PnL in active currency
                elPnl.className = `text-mono ${pos.pnlUSD > 0 ? "text-buy" : pos.pnlUSD < 0 ? "text-sell" : "text-neutral"}`;
            }

            // Check auto execution (Take Profit & Stop Loss triggers)
            if (pos.type === "BUY") {
                if (pos.tpPriceUSD > pos.entryPriceUSD && currentPriceUSD >= pos.tpPriceUSD) {
                    positionsToAutoClose.push({ id: pos.id, reason: "Take Profit Target Met" });
                } else if (pos.slPriceUSD > 0 && pos.slPriceUSD < pos.entryPriceUSD && currentPriceUSD <= pos.slPriceUSD) {
                    positionsToAutoClose.push({ id: pos.id, reason: "Stop Loss Triggered" });
                }
            } else {
                if (pos.tpPriceUSD > 0 && pos.tpPriceUSD < pos.entryPriceUSD && currentPriceUSD <= pos.tpPriceUSD) {
                    positionsToAutoClose.push({ id: pos.id, reason: "Take Profit Target Met" });
                } else if (pos.slPriceUSD > pos.entryPriceUSD && currentPriceUSD >= pos.slPriceUSD) {
                    positionsToAutoClose.push({ id: pos.id, reason: "Stop Loss Triggered" });
                }
            }
            // Check for Liquidation (loss equals or exceeds margin) - all in USD
            if (pos.pnlUSD <= -pos.marginUSD) {
                positionsToAutoClose.push({ id: pos.id, reason: "Position Liquidated" });
            }
        });

        // If any positions were auto-closed, we need to handle them.
        // We process them one by one to avoid issues with modifying the array while looping.
        if (positionsToAutoClose.length > 0) {
            // Close the first triggered position. The function will be called again on the next tick for others.
            const itemToClose = positionsToAutoClose[0];
            closePosition(itemToClose.id, itemToClose.reason);
        }

        // Update global net profit count in stats bar
        updateHeaderStats();
    }

    // Closes an open position and updates simulated balances
    function closePosition(tradeId, triggerReason = "") {
        const posIndex = activePositions.findIndex(p => p.id === tradeId);
        if (posIndex === -1) return;

        const pos = activePositions[posIndex];
        
        // Remove from active
        activePositions.splice(posIndex, 1);
        localStorage.setItem("apex_positions", JSON.stringify(activePositions));

        // Refund margin and add/subtract PnL
        const returnAmountUSD = pos.marginUSD + pos.pnlUSD; // All in USD
        userBalanceUSD += returnAmountUSD; // Update USD balance
        
        updateBalanceUI();

        // Add to historical trades log
        const pnlValueUSD = Number(pos.pnlUSD ?? 0); // PnL is in USD
        const pnlPercentValue = pos.marginUSD > 0 ? (pnlValueUSD / pos.marginUSD) * 100 : 0; // PnL % based on USD margin
        const completedTrade = {
            assetId: pos.assetId,
            type: pos.type,
            leverage: pos.leverage,
            marginUSD: pos.marginUSD, // Store margin in USD
            entryPriceUSD: pos.entryPriceUSD, // Store entry price in USD
            exitPriceUSD: livePrices[pos.assetId], // Store exit price in USD
            pnlUSD: pnlValueUSD, // Store PnL in USD
            pnlPercent: pnlPercentValue, // Recalculate PnL % at close
            status: pnlValueUSD >= 0 ? "PROFIT" : "LOSS",
            time: new Date().toLocaleTimeString(),
            decimals: pos.decimals
        };

        tradeHistory.unshift(completedTrade); // Add to top
        localStorage.setItem("apex_history", JSON.stringify(tradeHistory));

        // Re-render grids and show the completed trade immediately
        renderActivePositions();
        renderTradeHistory();
        updateHeaderStats();
        setJournalView(currentJournalView);

        const pnlText = pos.pnlUSD >= 0 ? `+${formatCurrency(pos.pnlUSD, 2)}` : `${formatCurrency(pos.pnlUSD, 2)}`;
        const toastType = pos.pnlUSD >= 0 ? 'success' : 'error';

        if (triggerReason) {
            const autoCloseToastType = triggerReason.includes("Profit") ? 'success' : 'error';
            showToast(`Auto-Closed: ${pos.assetId} ${triggerReason}. PnL: ${pnlText}`, autoCloseToastType, 4000);
        } else {
            showToast(`Closed ${pos.assetId} trade. PnL: ${pnlText}`, toastType);
        }
    }

    // Renders completed/closed trades list
    function renderTradeHistory() {
        if (!bodyTradeHistory) return;

        bodyTradeHistory.innerHTML = "";

        if (tradeHistory.length === 0) {
            bodyTradeHistory.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-journal-message">No trading history available yet.</td>
                </tr>
            `;
            return;
        }

        tradeHistory.forEach(trade => {
            const tr = document.createElement("tr");
            
            const pnlValueUSD = Number(trade.pnlUSD ?? 0);
            const pnlPercentValue = Number.isFinite(Number(trade.pnlPercent)) ? Number(trade.pnlPercent) : 0;
            const isProfit = pnlValueUSD > 0;
            const pnlClass = isProfit ? "text-buy" : pnlValueUSD < 0 ? "text-sell" : "text-neutral";
            const statusClass = isProfit ? "lap-status-badge text-buy" : pnlValueUSD < 0 ? "lap-status-badge text-sell" : "lap-status-badge text-neutral";
            const statusLabel = pnlValueUSD > 0 ? "PROFIT" : pnlValueUSD < 0 ? "LOSS" : "BREAKEVEN";
            const tradeDecimals = trade.decimals ?? 2; // Fallback to 2 decimals if not present

            // Defensively cast values to numbers to prevent errors from old/corrupt localStorage data
            const entryPriceUSD = Number(trade.entryPriceUSD ?? 0);
            const exitPriceUSD = Number(trade.exitPriceUSD ?? 0);
            const marginValueUSD = Number(trade.marginUSD ?? 0);

            tr.innerHTML = `
                <td><strong>${trade.assetId}</strong></td>
                <td><span class="badge-position ${trade.type.toLowerCase()}">${trade.type}</span></td>
                <td class="text-mono">${trade.leverage}x</td>
                <td class="text-mono">${formatCurrency(marginValueUSD, 2)}</td>
                <td class="text-mono">${formatCurrency(entryPriceUSD, tradeDecimals)}</td>
                <td class="text-mono">${formatCurrency(exitPriceUSD, tradeDecimals)}</td>
                <td class="text-mono ${pnlClass}">${formatPnlDisplay(pnlValueUSD, 2)} (${formatPnlDisplay(pnlPercentValue, 2)}%)</td>
                <td><span class="${statusClass}">${statusLabel}</span></td>
                <td class="text-muted text-mono">${trade.time}</td>
            `;

            bodyTradeHistory.appendChild(tr);
            setTimeout(() => {
                tr.classList.add('new-row');
            }, 10);
        });
    }

    // Updates global totals inside header cards
    function updateHeaderStats() {
        // Total PnL for active positions
        let activePnlTotal = 0;
        activePositions.forEach(p => {
            activePnlTotal += p.pnlUSD;
        });

        // Total historical realized net profit
        let realizedPnlTotal = 0;
        tradeHistory.forEach(h => {
            realizedPnlTotal += Number(h.pnlUSD ?? 0);
        });

        const totalNetProfit = activePnlTotal + realizedPnlTotal;
        elNetProfitTotal.textContent = (totalNetProfit >= 0 ? "+" : "") + formatCurrency(totalNetProfit, 2);
        elNetProfitTotal.className = "stat-value " + (totalNetProfit >= 0 ? "text-buy" : "text-sell");

        elActiveTradesCount.textContent = activePositions.length;
    }

    // Refreshes simulated wallet amounts
    function updateBalanceUI() {
        elBalance.textContent = formatCurrency(userBalanceUSD, 2); // Display USD balance converted
        localStorage.setItem("apex_balance_usd", userBalanceUSD.toFixed(2)); // Store USD balance
    }


    // --- UI EVENT LISTENERS ---

    // Signal posts jump directly to the matching live chart and analysis.
    document.querySelectorAll("[data-signal-symbol]").forEach(postLink => {
        postLink.addEventListener("click", event => {
            event.preventDefault();
            const asset = assetsData.find(item => item.id === postLink.dataset.signalSymbol);
            if (!asset) return;
            selectAsset(asset);
            document.getElementById("chart-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });

    // Search bar functionality
    searchInput.addEventListener("input", () => {
        renderWatchlist();
    });

    // Category filtering buttons
    categoryTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            categoryTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderWatchlist();
        });
    });

    // Country filtering buttons
    countryTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            countryTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderWatchlist();
        });
    });

    // Timeframe selector bar
    chartTimeframeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            chartTimeframeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const interval = btn.getAttribute("data-tv-interval");
            activeTimeframe = interval;
            localStorage.setItem("apex_timeframe", activeTimeframe); // Store the active timeframe
            
            // Re-render TradingView Advanced chart
            loadMainChart(activeAsset.tvSymbol, activeTimeframe);
            
            showToast(`Timeframe changed to ${btn.textContent}`, 'info');
        });
    });

    // Currency selector event listener
    currencySelector.addEventListener("change", (e) => {
        activeCurrency = e.target.value;
        localStorage.setItem("apex_currency", activeCurrency);
        updateAllCurrencyDisplays(); // Re-render all currency-related UI
        showToast(`Currency changed to ${activeCurrency}`, 'info');
    });

    // Function to update the active state of timeframe buttons
    function updateTimeframeButtonsUI() {
        chartTimeframeButtons.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-tv-interval") === activeTimeframe);
        });
    }
    function setJournalView(view) {
        currentJournalView = view;
        if (journalTabs) {
            journalTabs.forEach(tab => {
                const isActive = tab.getAttribute("data-journal-view") === view;
                tab.classList.toggle("active", isActive);
            });
        }

        if (tableActivePositions && tableTradeHistory) {
            if (view === "active") {
                tableActivePositions.classList.remove("hidden");
                tableTradeHistory.classList.add("hidden");
            } else {
                tableActivePositions.classList.add("hidden");
                tableTradeHistory.classList.remove("hidden");
            }
        }
    }

    // Journal Tabs (Active vs History)
    journalTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const view = tab.getAttribute("data-journal-view");
            setJournalView(view);
        });
    });

    // Clear history logs
    if (btnClearHistory) {
        btnClearHistory.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your trade history?")) {
                tradeHistory = [];
                localStorage.setItem("apex_history", JSON.stringify([]));
                renderTradeHistory();
                updateHeaderStats();
                showToast("Trading history cleared.", 'success');
            }
        });
    }

    // Apply Advisory targets to Simulator button
    if (btnApplyTargets) {
        btnApplyTargets.addEventListener("click", () => {
            fillAdvisorySetup();
            showToast("AI Advisory setup applied to Simulator.", 'success');
        });
    }

    // Common function to reset the demo wallet and trade history
    function resetDemoWallet() {
        if (confirm("Reset the demo wallet and clear all trades?")) {
            userBalanceUSD = 100000.00; // Reset USD balance
            activePositions = [];
            tradeHistory = [];
            localStorage.setItem("apex_balance_usd", userBalanceUSD.toFixed(2)); // Store USD balance
            localStorage.setItem("apex_positions", JSON.stringify(activePositions));
            localStorage.setItem("apex_history", JSON.stringify(tradeHistory));
            
            updateBalanceUI();
            renderActivePositions();
            renderTradeHistory();
            updateHeaderStats();
            
            if (inputMargin) inputMargin.value = 1000;
            if (inputLeverage) inputLeverage.value = 10;
            if (inputTP) inputTP.value = 0;
            if (inputSL) inputSL.value = 0;
            if (inputMargin && inputLeverage && elPositionValueDisplay && elEstimateQty && elEstimateProfit && elEstimateLoss) {
                updateCalculatorOutput();
            }
            
            if (demoTradingGuide) demoTradingGuide.classList.remove("hidden"); // Show the guide again after resetting
            showToast("Demo wallet reset to $100,000.", 'success');
        }
    }

    // Event listener for the existing reset wallet button (in simulator card)
    if (btnResetWallet) {
        btnResetWallet.addEventListener("click", resetDemoWallet);
    }
    
    // Event listener for the new header reset button
    if (btnResetWalletHeader) {
        btnResetWalletHeader.addEventListener("click", resetDemoWallet);
    }

    // Handle manual entry of TP/SL prices in simulator
    if (inputTP) inputTP.addEventListener("input", () => {
        updateCalculatorOutput();
    });
    if (inputSL) inputSL.addEventListener("input", () => {
        updateCalculatorOutput();
    });

    // Clickable Time-Lap Grid Cards to automatically change chart timeframe
    if (elLapItem5m) elLapItem5m.addEventListener("click", () => {
        const btn = document.querySelector('[data-tv-interval="5"]');
        if (btn) btn.click();
    });
    if (elLapItem15m) elLapItem15m.addEventListener("click", () => {
        const btn = document.querySelector('[data-tv-interval="15"]');
        if (btn) btn.click();
    });
    if (elLapItem1h) elLapItem1h.addEventListener("click", () => {
        const btn = document.querySelector('[data-tv-interval="60"]');
        if (btn) btn.click();
    });
    if (elLapItem1d) elLapItem1d.addEventListener("click", () => {
        const btn = document.querySelector('[data-tv-interval="D"]');
        if (btn) btn.click();
    });

    // --- HELPER UTILITIES ---

    // Exports trade history to a CSV file
    function exportTradeHistoryToCSV() {
        if (tradeHistory.length === 0) {
            showToast("No trade history to export.", 'info', 2000);
            return;
        }

        const headers = [
            "Asset", "Type", "Leverage", "Margin (USD)", "Entry Price (USD)", "Exit Price (USD)",
            "PnL (USD)", "PnL (%)", "Status", "Time"
        ];

        const rows = tradeHistory.map(trade => {
            const pnlValueUSD = Number(trade.pnlUSD ?? 0); // PnL is in USD
            const pnlPercentValue = Number.isFinite(Number(trade.pnlPercent)) ? Number(trade.pnlPercent) : 0;
            const entryPriceUSD = Number(trade.entryPriceUSD ?? 0);
            const exitPriceUSD = Number(trade.exitPriceUSD ?? 0);
            const marginValueUSD = Number(trade.marginUSD ?? 0);

            return [
                trade.assetId, trade.type, `${trade.leverage}x`, marginValueUSD.toFixed(2),
                entryPriceUSD.toFixed(trade.decimals ?? 2), exitPriceUSD.toFixed(trade.decimals ?? 2),
                pnlValueUSD.toFixed(2), pnlPercentValue.toFixed(2), trade.status, trade.time
            ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','); // Enclose fields in quotes and escape existing quotes
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `quantum_trading_history_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Trade history exported successfully!", 'success', 3000);
    }

    function formatPnlDisplay(number, decimalPlaces = 2) {
        const numericValue = Number(number ?? 0);
        const isNegative = numericValue < 0;
        const sign = isNegative ? "-" : "+";
        const absValue = Math.abs(numericValue);
        return `${sign}${formatCurrency(absValue, decimalPlaces)}`;
    }

    function showToast(message, type = 'info', duration = 3000) {
        clearTimeout(toastTimeout);
        elToastMessage.textContent = message;

        // Reset classes and show
        elToast.className = 'toast'; // Reset to base class
        elToast.classList.add(type); // Add the new type class

        toastTimeout = setTimeout(() => elToast.classList.add("hidden"), duration);
    }
    
    // Triggers slide-up alert notification toasts
    let toastTimeout = null;
    // --- APPLICATION STARTUP SEQUENCE ---

    // Function to update all UI elements that display currency
    function updateAllCurrencyDisplays() {
        updateBalanceUI(); // Updates header balance display
        updateHeaderStats(); // Updates Net Profit and Active Trade counts
        renderWatchlist(); // Re-renders watchlist with new currency prices
        if (typeof renderActivePositions === 'function') renderActivePositions();
        if (typeof renderTradeHistory === 'function') renderTradeHistory();
        if (elSignalIndicator && elSignalText && elSignalStrength && elTargetEntry && elTargetTP1 && elTargetTP2 && elTargetSL && elRationaleText && elBestLapValue) {
            updateAdviceConsole();
        }
        if (inputMargin && inputLeverage && elPositionValueDisplay && elEstimateQty && elEstimateProfit && elEstimateLoss) {
            updateCalculatorOutput();
        }
        if (inputTP && inputSL) {
            fillAdvisorySetup();
        }
    }

    currencySelector.value = activeCurrency; // Set initial currency selector value

    // 1. Start live simulated price tick stream
    startPriceTicks();

    // 2. Render initial UI elements
    initializeMarketTicker();
    updateBalanceUI();
    renderWatchlist();
    renderActivePositions();
    renderTradeHistory();
    updateHeaderStats();
    updateTimeframeButtonsUI(); // Set the active class for the correct timeframe button on load (no currency impact)

    // 3. Load all data for the default asset (TSLA)
    loadAssetData(activeAsset);
    if (btnOrderTabBuy && btnOrderTabSell && btnExecuteTrade && inputTP && inputSL) {
        setOrderMode("BUY");
    }

    // 4. Show a one-time welcome message for new users
    if (!localStorage.getItem("apex_visited") || (activePositions.length === 0 && tradeHistory.length === 0)) {
        setTimeout(() => {
            showToast("Welcome! Your demo wallet starts at $100,000. Pick an asset to explore the market watch.", 'info', 6500);
        }, 1000);
        localStorage.setItem("apex_visited", "true");
        if (demoTradingGuide) demoTradingGuide.classList.remove("hidden");
    }
    // Event listener for export button
    if (btnExportHistory) btnExportHistory.addEventListener("click", exportTradeHistoryToCSV);

    // Initial update of all currency displays
    updateAllCurrencyDisplays();
});
