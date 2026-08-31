const marketData = [
  ["NVDA", "NVIDIA Corp.", "stocks", "$128.20", 0.31], ["TSLA", "Tesla Inc.", "stocks", "$262.50", 1.32], ["RELIANCE", "Reliance Industries", "stocks", "₹2,950.75", 0.74],
  ["BTCUSD", "Bitcoin / Dollar", "crypto", "$61,250.00", 2.16], ["ETHUSD", "Ethereum / Dollar", "crypto", "$3,380.00", -0.42], ["SOLUSD", "Solana / Dollar", "crypto", "$142.50", -1.14],
  ["EURUSD", "Euro / US Dollar", "forex", "$1.0820", 0.08], ["GBPUSD", "Pound / US Dollar", "forex", "$1.2750", -0.14], ["USDJPY", "US Dollar / Japanese Yen", "forex", "$157.85", -0.21],
  ["GOLD", "Gold Spot", "commodities", "$2,360.50", 0.53], ["OIL", "Crude Oil Brent", "commodities", "$85.40", -0.67]
].map(([symbol, name, category, price, change]) => ({ symbol, name, category, price, change }));

const grid = document.getElementById("markets-grid");
let category = "all";
function renderMarkets() {
  const visible = marketData.filter(asset => category === "all" || asset.category === category);
  grid.innerHTML = visible.map(asset => {
    const up = asset.change >= 0;
    return `<a class="market-quote-card" href="share-details.html?symbol=${encodeURIComponent(asset.symbol)}"><div class="market-quote-card__top"><span class="market-quote-card__category">${asset.category}</span><span class="${up ? "text-buy" : "text-sell"}">${up ? "+" : ""}${asset.change.toFixed(2)}%</span></div><strong>${asset.symbol}</strong><span>${asset.name}</span><b>${asset.price}</b></a>`;
  }).join("");
  document.getElementById("market-count").textContent = visible.length;
  document.getElementById("advancing-count").textContent = visible.filter(asset => asset.change >= 0).length;
  document.getElementById("declining-count").textContent = visible.filter(asset => asset.change < 0).length;
  document.getElementById("markets-updated").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
document.querySelectorAll(".market-filter").forEach(button => button.addEventListener("click", () => { category = button.dataset.category; document.querySelectorAll(".market-filter").forEach(item => item.classList.toggle("active", item === button)); renderMarkets(); }));
renderMarkets();
setInterval(renderMarkets, 15000);
