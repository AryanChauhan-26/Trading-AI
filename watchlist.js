const defaultSymbols = ["TSLA", "NVDA", "BTCUSD", "RELIANCE"];
const list = document.getElementById("saved-watchlist");
const search = document.getElementById("watchlist-search");
const count = document.getElementById("watchlist-count");
const empty = document.getElementById("watchlist-empty");
const emptyTitle = document.getElementById("watchlist-empty-title");
const emptyDescription = document.getElementById("watchlist-empty-description");
const currencySymbols = { USD: "$", INR: "₹" };

function savedSymbols() {
  const stored = localStorage.getItem("apex_favorites");
  if (stored === null) return defaultSymbols;

  try {
    const saved = JSON.parse(stored);
    if (!Array.isArray(saved) || !saved.every(symbol => typeof symbol === "string")) {
      throw new TypeError("Saved watchlist must be an array of symbols.");
    }
    return [...new Set(saved)];
  } catch (error) {
    console.error("Failed to read saved watchlist from localStorage:", error);
    return defaultSymbols;
  }
}

function saveSymbols(symbols) {
  localStorage.setItem("apex_favorites", JSON.stringify(symbols));
}

function signalClass(signal) {
  return signal.includes("SELL") ? "sell" : signal === "NEUTRAL" ? "neutral" : "buy";
}

function formatPrice(asset) {
  return `${currencySymbols[asset.currency]}${asset.basePrice.toLocaleString("en-US", {
    minimumFractionDigits: asset.decimals,
    maximumFractionDigits: asset.decimals
  })}`;
}

function render() {
  const symbols = savedSymbols();
  const query = search.value.trim().toLowerCase();
  const visible = marketUniverse.filter(asset =>
    symbols.includes(asset.symbol) && `${asset.symbol} ${asset.name} ${asset.category} ${asset.exchange}`.toLowerCase().includes(query)
  );

  count.textContent = symbols.length;
  list.innerHTML = visible.map(asset => `
    <article class="saved-watchlist-item">
      <div class="saved-watchlist-item__asset">
        <span class="saved-watchlist-item__icon" aria-hidden="true">${asset.symbol.slice(0, 1)}</span>
        <span class="saved-watchlist-item__identity">
          <strong>${asset.symbol}</strong>
          <span>${asset.name}</span>
        </span>
      </div>
      <div class="saved-watchlist-item__market">
        <span>${asset.category}</span>
        <small>${asset.exchange}</small>
      </div>
      <strong class="saved-watchlist-item__price">${formatPrice(asset)}</strong>
      <span class="signal-badge ${signalClass(asset.signal)}">${asset.signal}</span>
      <div class="saved-watchlist-item__actions">
        <a class="watchlist-open" href="share-details.html?symbol=${encodeURIComponent(asset.symbol)}" aria-label="View ${asset.symbol} details">View</a>
        <button class="watchlist-remove" data-symbol="${asset.symbol}" aria-label="Remove ${asset.symbol} from watchlist" title="Remove from watchlist">×</button>
      </div>
    </article>
  `).join("");

  empty.hidden = visible.length !== 0;
  if (symbols.length === 0) {
    emptyTitle.textContent = "Your watchlist is empty";
    emptyDescription.textContent = "Add markets from the live feed to keep them close at hand.";
  } else {
    emptyTitle.textContent = "No markets found";
    emptyDescription.textContent = "Try another symbol or company name, or browse the live market feed.";
  }
}

search.addEventListener("input", render);
list.addEventListener("click", event => {
  const button = event.target.closest(".watchlist-remove");
  if (!button) return;
  saveSymbols(savedSymbols().filter(symbol => symbol !== button.dataset.symbol));
  render();
});

render();
