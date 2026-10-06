const marketData = [
  ["NVDA", "NVIDIA Corporation", "stocks", "$128.20", 0.31], ["TSLA", "Tesla, Inc.", "stocks", "$262.50", 1.32], ["RELIANCE", "Reliance Industries", "stocks", "₹2,950.75", 0.74],
  ["BTCUSD", "Bitcoin / US Dollar", "crypto", "$61,250.00", 2.16], ["ETHUSD", "Ethereum / US Dollar", "crypto", "$3,380.00", -0.42], ["SOLUSD", "Solana / US Dollar", "crypto", "$142.50", -1.14],
  ["EURUSD", "Euro / US Dollar", "forex", "$1.0820", 0.08], ["GBPUSD", "British Pound / US Dollar", "forex", "$1.2750", -0.14], ["USDJPY", "US Dollar / Japanese Yen", "forex", "$157.85", -0.21],
  ["GOLD", "Gold Spot", "commodities", "$2,360.50", 0.53], ["OIL", "Brent Crude Oil", "commodities", "$85.40", -0.67]
].map(([symbol, name, category, price, change]) => ({ symbol, name, category, price, change }));

const grid = document.getElementById("markets-grid");
const searchInput = document.getElementById("market-search");
const emptyState = document.getElementById("markets-empty");
const categoryLabels = {
  stocks: "Stocks",
  crypto: "Crypto",
  forex: "Forex",
  commodities: "Commodities"
};
let category = "all";

function sparkline(asset, index) {
  const direction = asset.change >= 0 ? 1 : -1;
  const points = Array.from({ length: 13 }, (_, point) => {
    const noise = Math.sin((point + 1) * (index + 2) * 0.71) * 3.2;
    const trend = direction * (point / 12) * 8;
    return `${point * 8},${16 - noise - trend}`;
  });
  const path = points.map((point, pointIndex) => `${pointIndex ? "L" : "M"}${point}`).join(" ");
  return `<svg class="market-sparkline ${direction > 0 ? "is-up" : "is-down"}" viewBox="0 0 96 32" aria-hidden="true"><path d="${path}"/></svg>`;
}

function renderMarketRow(asset, index) {
    const up = asset.change >= 0;
    return `<a class="market-row" href="share-details.html?symbol=${encodeURIComponent(asset.symbol)}" aria-label="${asset.symbol}, ${asset.name}, ${asset.price}, ${up ? "up" : "down"} ${Math.abs(asset.change).toFixed(2)} percent">
      <span class="market-row__instrument"><span class="market-row__avatar market-row__avatar--${asset.category}">${asset.symbol.slice(0, 1)}</span><span><strong>${asset.symbol}</strong><small>${asset.name}</small></span></span>
      <span class="market-row__class"><span class="market-class-dot market-class-dot--${asset.category}"></span>${categoryLabels[asset.category]}</span>
      <span class="market-row__trend">${sparkline(asset, index)}</span>
      <span class="market-row__price">${asset.price}</span>
      <span class="market-row__change ${up ? "is-up" : "is-down"}"><span>${up ? "↗" : "↘"}</span>${up ? "+" : ""}${asset.change.toFixed(2)}%</span>
      <span class="market-row__arrow" aria-hidden="true">↗</span>
    </a>`;
}

function renderMovers(visible) {
  const movers = [...visible]
    .sort((first, second) => Math.abs(second.change) - Math.abs(first.change))
    .slice(0, 3);
  document.getElementById("markets-movers").innerHTML = movers.map(asset => {
    const up = asset.change >= 0;
    return `<a class="market-mover" href="share-details.html?symbol=${encodeURIComponent(asset.symbol)}"><span class="market-mover__initial market-mover__initial--${asset.category}">${asset.symbol.slice(0, 1)}</span><span class="market-mover__name"><strong>${asset.symbol}</strong><small>${categoryLabels[asset.category]}</small></span><span class="market-mover__change ${up ? "is-up" : "is-down"}">${up ? "+" : ""}${asset.change.toFixed(2)}%</span></a>`;
  }).join("") || `<p class="markets-side-empty">No movers match this search.</p>`;
}

function renderMarketMix() {
  const totals = Object.keys(categoryLabels).map(key => ({
    key,
    count: marketData.filter(asset => asset.category === key).length
  }));
  document.getElementById("markets-mix").innerHTML = totals.map(item => {
    const share = (item.count / marketData.length) * 100;
    return `<button class="market-mix-row ${category === item.key ? "is-selected" : ""}" type="button" data-category="${item.key}" aria-label="Show ${categoryLabels[item.key]}"><span class="market-mix-row__label"><i class="market-class-dot market-class-dot--${item.key}"></i>${categoryLabels[item.key]}</span><span class="market-mix-row__bar"><i class="market-mix-row__fill market-mix-row__fill--${item.key}" style="width:${share}%"></i></span><strong>${item.count}</strong></button>`;
  }).join("");
}

function renderMarkets() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = marketData.filter(asset => {
    const matchesCategory = category === "all" || asset.category === category;
    const matchesSearch = `${asset.symbol} ${asset.name} ${asset.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = visible.map(renderMarketRow).join("");
  emptyState.hidden = visible.length > 0;
  document.getElementById("market-count").textContent = visible.length;
  document.getElementById("advancing-count").textContent = visible.filter(asset => asset.change >= 0).length;
  document.getElementById("declining-count").textContent = visible.filter(asset => asset.change < 0).length;
  document.getElementById("markets-updated").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("filter-count-all").textContent = marketData.length;
  renderMovers(visible);
  renderMarketMix();
}

document.querySelectorAll(".market-filter").forEach(button => button.addEventListener("click", () => {
  category = button.dataset.category;
  document.querySelectorAll(".market-filter").forEach(item => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  renderMarkets();
}));
document.getElementById("markets-mix").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) document.querySelector(`.market-filter[data-category="${button.dataset.category}"]`).click();
});
searchInput.addEventListener("input", renderMarkets);
document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderMarkets();
    searchInput.blur();
  }
});
renderMarkets();
setInterval(renderMarkets, 15000);
