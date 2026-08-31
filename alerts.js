const storageKey = "apex_price_alerts";
const form = document.getElementById("alert-form");
const list = document.getElementById("alerts-list");
const count = document.getElementById("alerts-count");
const empty = document.getElementById("alerts-empty");

function getAlerts() { try { const alerts = JSON.parse(localStorage.getItem(storageKey)); return Array.isArray(alerts) ? alerts : []; } catch { return []; } }
function saveAlerts(alerts) { localStorage.setItem(storageKey, JSON.stringify(alerts)); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function renderAlerts() {
  const alerts = getAlerts();
  count.textContent = alerts.length;
  empty.hidden = alerts.length > 0;
  list.innerHTML = alerts.map(alert => `<article class="alert-item"><div class="alert-item__icon">⌁</div><div class="alert-item__body"><strong>${escapeHtml(alert.symbol)}</strong><span>${alert.condition === "above" ? "Moves above" : "Drops below"} <b>${escapeHtml(alert.price)}</b></span><small>Created ${new Date(alert.createdAt).toLocaleDateString()}</small></div><span class="alert-status">Watching</span><button class="alert-remove" data-id="${escapeHtml(alert.id)}" aria-label="Remove ${escapeHtml(alert.symbol)} alert">Remove</button></article>`).join("");
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const symbol = data.get("symbol").trim().toUpperCase();
  const price = Number(data.get("price"));
  if (!symbol || !Number.isFinite(price) || price <= 0) return;
  saveAlerts([...getAlerts(), { id: `${Date.now()}-${symbol}`, symbol, condition: data.get("condition"), price: price.toLocaleString("en-US", { maximumFractionDigits: 6 }), createdAt: Date.now() }]);
  form.reset();
  renderAlerts();
});
list.addEventListener("click", event => { const button = event.target.closest(".alert-remove"); if (!button) return; saveAlerts(getAlerts().filter(alert => alert.id !== button.dataset.id)); renderAlerts(); });
renderAlerts();
