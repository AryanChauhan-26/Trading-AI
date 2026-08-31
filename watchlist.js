const assets = [
  ["TSLA", "Tesla Inc.", "$262.50", "+1.32%", "BUY"], ["NVDA", "NVIDIA Corp.", "$128.20", "+0.31%", "STRONG BUY"],
  ["AAPL", "Apple Inc.", "$215.30", "-0.18%", "NEUTRAL"], ["BTCUSD", "Bitcoin / Dollar", "$61,250.00", "+2.16%", "STRONG BUY"],
  ["RELIANCE", "Reliance Industries", "₹2,950.75", "+0.74%", "BUY"], ["ETHUSD", "Ethereum / Dollar", "$3,380.00", "-0.42%", "SELL"]
].map(([symbol, name, price, change, signal]) => ({ symbol, name, price, change, signal }));

const defaultSymbols = ["TSLA", "NVDA", "BTCUSD", "RELIANCE"];
const list = document.getElementById("saved-watchlist");
const search = document.getElementById("watchlist-search");
const count = document.getElementById("watchlist-count");
const empty = document.getElementById("watchlist-empty");

function savedSymbols() {
  try {
    const saved = JSON.parse(localStorage.getItem("apex_favorites"));
    return Array.isArray(saved) && saved.length ? saved : defaultSymbols;
  } catch { return defaultSymbols; }
}
function saveSymbols(symbols) { localStorage.setItem("apex_favorites", JSON.stringify(symbols)); }
function signalClass(signal) { return signal.includes("SELL") ? "sell" : signal === "NEUTRAL" ? "neutral" : "buy"; }
function render() {
  const symbols = savedSymbols();
  const query = search.value.trim().toLowerCase();
  const visible = assets.filter(asset => symbols.includes(asset.symbol) && `${asset.symbol} ${asset.name}`.toLowerCase().includes(query));
  count.textContent = symbols.length;
  list.innerHTML = visible.map(asset => `<article class="saved-watchlist-item"><div class="saved-watchlist-item__asset"><span class="saved-watchlist-item__symbol">${asset.symbol}</span><span>${asset.name}</span></div><span class="signal-badge ${signalClass(asset.signal)}">${asset.signal}</span><strong>${asset.price}</strong><span class="live-change ${asset.change.startsWith("-") ? "down" : "up"}">${asset.change}</span><button class="watchlist-remove" data-symbol="${asset.symbol}" aria-label="Remove ${asset.symbol} from watchlist">Remove</button></article>`).join("");
  empty.hidden = visible.length !== 0;
}
search.addEventListener("input", render);
list.addEventListener("click", event => {
  const button = event.target.closest(".watchlist-remove");
  if (!button) return;
  saveSymbols(savedSymbols().filter(symbol => symbol !== button.dataset.symbol));
  render();
});
render();
