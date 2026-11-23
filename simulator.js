const instruments = [
    { id: 'TSLA', name: 'Tesla, Inc.', tvSymbol: 'NASDAQ:TSLA', exchange: 'NASDAQ', price: 262.84, change: 2.84, bias: 'STRONG BUY' },
    { id: 'NVDA', name: 'NVIDIA Corp.', tvSymbol: 'NASDAQ:NVDA', exchange: 'NASDAQ', price: 141.26, change: 1.92, bias: 'BUY' },
    { id: 'AAPL', name: 'Apple Inc.', tvSymbol: 'NASDAQ:AAPL', exchange: 'NASDAQ', price: 227.16, change: -0.42, bias: 'NEUTRAL' },
    { id: 'BTCUSD', name: 'Bitcoin / USD', tvSymbol: 'BITSTAMP:BTCUSD', exchange: 'BITSTAMP', price: 104220, change: 3.61, bias: 'STRONG BUY' },
    { id: 'RELIANCE', name: 'Reliance Industries', tvSymbol: 'NSE:RELIANCE', exchange: 'NSE', price: 1284.40, change: -1.16, bias: 'SELL' },
    { id: 'XAUUSD', name: 'Gold / USD', tvSymbol: 'TVC:GOLD', exchange: 'TVC', price: 2742.80, change: 0.77, bias: 'BUY' }
];

const $ = id => document.getElementById(id);
const money = value => '$' + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const prices = Object.fromEntries(instruments.map(item => [item.id, item.price]));
const sessionHighs = { ...prices };
const sessionLows = { ...prices };
let selected = instruments.find(item => item.id === 'BTCUSD');
let side = 'BUY';
let activeInterval = '15';
let chartSelection = '';
let toastTimeout;

function readJson(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.error(`Unable to read ${key} from local storage.`, error);
        return fallback;
    }
}

function readPositions() {
    const stored = readJson('apex_positions', []);
    if (!Array.isArray(stored)) return [];

    return stored.filter(position =>
        position &&
        typeof position.id === 'string' &&
        typeof position.assetId === 'string' &&
        ['BUY', 'SELL'].includes(position.type) &&
        Number.isFinite(Number(position.qty)) &&
        Number(position.qty) > 0 &&
        Number.isFinite(Number(position.entryPriceUSD)) &&
        Number(position.entryPriceUSD) > 0 &&
        Number.isFinite(Number(position.marginUSD)) &&
        Number(position.marginUSD) >= 0
    ).map(position => ({
        ...position,
        qty: Number(position.qty),
        entryPriceUSD: Number(position.entryPriceUSD),
        marginUSD: Number(position.marginUSD),
        leverage: Number(position.leverage) || 1,
        currentPriceUSD: Number(position.currentPriceUSD) > 0 ? Number(position.currentPriceUSD) : Number(position.entryPriceUSD),
        tpPriceUSD: Number(position.tpPriceUSD) || 0,
        slPriceUSD: Number(position.slPriceUSD) || 0
    }));
}

let positions = readPositions();
let storedBalance;
try {
    const stored = localStorage.getItem('apex_balance_usd');
    storedBalance = stored === null ? NaN : Number(stored);
} catch (error) {
    console.error('Unable to read the paper account balance.', error);
    storedBalance = NaN;
}
let balance = Number.isFinite(storedBalance) && storedBalance >= 0 ? storedBalance : 100000;

function saveState() {
    try {
        localStorage.setItem('apex_positions', JSON.stringify(positions));
        localStorage.setItem('apex_balance_usd', balance.toFixed(2));
    } catch (error) {
        console.error('Unable to save the paper trading account.', error);
        showToast('Could not save your account. Check browser storage.', true);
    }
}

function showToast(message, error = false) {
    const toast = $('toast');
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = `toast show${error ? ' error' : ''}`;
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderQuotes(filter = '') {
    const query = filter.trim().toLowerCase();
    const list = $('quote-list');
    list.replaceChildren();

    instruments.filter(item => `${item.id} ${item.name}`.toLowerCase().includes(query)).forEach(item => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = `quote-row${item.id === selected.id ? ' selected' : ''}`;
        row.setAttribute('aria-pressed', String(item.id === selected.id));
        row.addEventListener('click', () => selectInstrument(item.id));

        const details = document.createElement('span');
        const symbol = document.createElement('strong');
        symbol.textContent = item.id;
        const name = document.createElement('small');
        name.textContent = item.name;
        details.append(symbol, name);

        const quote = document.createElement('span');
        const price = document.createElement('span');
        price.className = 'quote-price';
        price.textContent = money(prices[item.id]);
        const change = document.createElement('span');
        change.className = `quote-change ${item.change >= 0 ? 'positive' : 'negative'}`;
        change.textContent = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`;
        quote.append(price, change);
        row.append(details, quote);
        list.appendChild(row);
    });
}

function updateSelectedDisplay() {
    $('selected-price').textContent = money(prices[selected.id]);
    $('ticket-price').textContent = money(prices[selected.id]);
    $('session-high').textContent = money(sessionHighs[selected.id]);
    $('session-low').textContent = money(sessionLows[selected.id]);
    $('selected-change').textContent = `${selected.change >= 0 ? '+' : ''}${selected.change.toFixed(2)}%`;
    renderQuotes($('quote-search').value);
}

function loadSelectedChart() {
    const key = `${selected.tvSymbol}:${activeInterval}`;
    if (chartSelection === key) return;
    chartSelection = key;
    if (typeof window.mountTradingViewChart === 'function') {
        window.mountTradingViewChart($('simulator-chart'), selected.tvSymbol, activeInterval, { theme: 'dark' });
    } else {
        $('simulator-chart').textContent = 'Chart unavailable. Paper trading is still ready.';
    }
}

function selectInstrument(id) {
    const instrument = instruments.find(item => item.id === id);
    if (!instrument) return;
    selected = instrument;
    $('selected-symbol').textContent = selected.id;
    $('selected-name').textContent = selected.name;
    $('selected-exchange').textContent = selected.exchange;
    $('ticket-symbol').textContent = selected.id;
    $('ai-bias').textContent = selected.bias;
    $('ai-bias').className = selected.bias.includes('SELL') ? 'negative' : selected.bias === 'NEUTRAL' ? '' : 'bias-buy';
    updateSelectedDisplay();
    updateTicket();
    loadSelectedChart();
}

function optionalPrice(id) {
    const raw = $(id).value.trim();
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : NaN;
}

function updateTicket() {
    const margin = Number($('margin').value);
    const safeMargin = Number.isFinite(margin) && margin > 0 ? margin : 0;
    const leverage = Number($('leverage').value);
    const price = prices[selected.id];
    const quantity = safeMargin * leverage / price;
    $('leverage-value').textContent = `${leverage}x`;
    $('position-value').textContent = money(safeMargin * leverage);
    $('quantity').textContent = quantity.toFixed(4);
    $('margin').max = String(Math.max(10, balance));

    const takeProfit = optionalPrice('take-profit');
    const stopLoss = optionalPrice('stop-loss');
    const profitDistance = takeProfit === null || !Number.isFinite(takeProfit)
        ? null
        : side === 'BUY' ? takeProfit - price : price - takeProfit;
    const lossDistance = stopLoss === null || !Number.isFinite(stopLoss)
        ? null
        : side === 'BUY' ? price - stopLoss : stopLoss - price;
    const profit = profitDistance !== null && profitDistance > 0 ? profitDistance * quantity : null;
    const loss = lossDistance !== null && lossDistance > 0 ? Math.min(safeMargin, lossDistance * quantity) : null;
    $('potential-profit').textContent = profit === null ? '—' : `+${money(profit)}`;
    $('potential-loss').textContent = loss === null ? '—' : `-${money(loss)}`;
}

function setSide(nextSide) {
    side = nextSide;
    const buy = side === 'BUY';
    $('buy-tab').classList.toggle('active', buy);
    $('sell-tab').classList.toggle('active', !buy);
    $('execute-order').className = `execute-button ${buy ? 'buy' : 'sell'}`;
    $('execute-order').innerHTML = `EXECUTE ${buy ? 'BUY' : 'SELL'} ORDER <span>↗</span>`;
    updateTicket();
}

function positionPnl(position, price) {
    const direction = position.type === 'BUY' ? 1 : -1;
    return (price - position.entryPriceUSD) * position.qty * direction;
}

function renderPositions() {
    $('position-count').textContent = positions.length;
    const body = $('positions-body');
    body.replaceChildren();

    if (!positions.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8;
        cell.className = 'empty-state';
        const title = document.createElement('strong');
        title.textContent = 'Your next trade starts here.';
        const description = document.createElement('span');
        description.textContent = 'Choose an instrument and execute a paper order to populate this journal.';
        cell.append(title, description);
        row.appendChild(cell);
        body.appendChild(row);
        return;
    }

    positions.forEach(position => {
        const current = prices[position.assetId] || position.currentPriceUSD;
        const pnl = positionPnl(position, current);
        position.currentPriceUSD = current;
        position.pnlUSD = pnl;
        const row = document.createElement('tr');
        const values = [
            position.assetId,
            position.type === 'BUY' ? 'LONG' : 'SHORT',
            Number(position.qty).toFixed(4),
            money(position.entryPriceUSD),
            money(current),
            money(position.marginUSD),
            `${pnl >= 0 ? '+' : '-'}${money(Math.abs(pnl))}`
        ];
        values.forEach((value, index) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            if (index === 0) {
                const strong = document.createElement('strong');
                strong.textContent = value;
                cell.replaceChildren(strong);
            } else if (index === 1) {
                cell.className = position.type === 'BUY' ? 'side-buy' : 'side-sell';
            } else if (index === 6) {
                cell.className = pnl >= 0 ? 'positive' : 'negative';
            }
            row.appendChild(cell);
        });
        const action = document.createElement('td');
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'close-position';
        close.textContent = 'CLOSE';
        close.addEventListener('click', () => closePosition(position.id));
        action.appendChild(close);
        row.appendChild(action);
        body.appendChild(row);
    });
    saveState();
}

function updateBalanceDisplay() {
    $('account-balance').textContent = money(balance);
}

function executeOrder() {
    const margin = Number($('margin').value);
    const leverage = Number($('leverage').value);
    const price = prices[selected.id];
    const takeProfit = optionalPrice('take-profit');
    const stopLoss = optionalPrice('stop-loss');

    if (!Number.isFinite(margin) || margin < 10) return showToast('Minimum margin is $10.', true);
    if (margin > balance) return showToast('Insufficient simulated balance.', true);
    if (!Number.isFinite(leverage) || leverage < 1 || leverage > 50) return showToast('Choose leverage between 1x and 50x.', true);
    if (takeProfit !== null && !Number.isFinite(takeProfit) || stopLoss !== null && !Number.isFinite(stopLoss)) {
        return showToast('Enter valid positive take-profit and stop-loss prices.', true);
    }
    if ((side === 'BUY' && ((takeProfit !== null && takeProfit <= price) || (stopLoss !== null && stopLoss >= price))) ||
        (side === 'SELL' && ((takeProfit !== null && takeProfit >= price) || (stopLoss !== null && stopLoss <= price)))) {
        return showToast('Check your take profit and stop loss levels.', true);
    }

    const position = {
        id: `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        assetId: selected.id,
        symbol: selected.id,
        name: selected.name,
        type: side,
        leverage,
        marginUSD: margin,
        qty: margin * leverage / price,
        entryPriceUSD: price,
        currentPriceUSD: price,
        tpPriceUSD: takeProfit || 0,
        slPriceUSD: stopLoss || 0,
        pnlUSD: 0,
        pnlPercent: 0,
        status: 'OPEN',
        time: new Date().toLocaleTimeString()
    };
    balance -= margin;
    positions.push(position);
    saveState();
    renderPositions();
    updateBalanceDisplay();
    showToast(`${side === 'BUY' ? 'Long' : 'Short'} ${selected.id} position opened.`);
}

function closePosition(id, reason = '') {
    const index = positions.findIndex(position => position.id === id);
    if (index < 0) return;
    const position = positions[index];
    const current = prices[position.assetId] || position.currentPriceUSD || position.entryPriceUSD;
    const pnl = Math.max(-position.marginUSD, positionPnl(position, current));
    const history = readJson('apex_history', []);
    const safeHistory = Array.isArray(history) ? history : [];
    safeHistory.unshift({
        ...position,
        exitPriceUSD: current,
        pnlUSD: pnl,
        pnlPercent: position.marginUSD ? pnl / position.marginUSD * 100 : 0,
        status: pnl >= 0 ? 'PROFIT' : 'LOSS',
        closedAt: new Date().toISOString(),
        closeReason: reason || 'Manual close'
    });
    try {
        localStorage.setItem('apex_history', JSON.stringify(safeHistory));
    } catch (error) {
        console.error('Unable to save the trade history.', error);
        showToast('Trade closed, but history could not be saved.', true);
    }
    balance += position.marginUSD + pnl;
    positions.splice(index, 1);
    saveState();
    updateBalanceDisplay();
    renderPositions();
    showToast(`${position.assetId} ${reason ? `${reason.toLowerCase()} at` : 'closed at'} ${pnl >= 0 ? '+' : '-'}${money(Math.abs(pnl))}.`);
}

function tick() {
    instruments.forEach(item => {
        prices[item.id] *= 1 + (Math.random() - 0.48) * 0.0008;
        sessionHighs[item.id] = Math.max(sessionHighs[item.id], prices[item.id]);
        sessionLows[item.id] = Math.min(sessionLows[item.id], prices[item.id]);
    });

    const triggered = positions.filter(position => {
        const price = prices[position.assetId];
        if (!price) return false;
        const liquidated = positionPnl(position, price) <= -position.marginUSD;
        const takeProfitHit = position.type === 'BUY'
            ? position.tpPriceUSD > 0 && price >= position.tpPriceUSD
            : position.tpPriceUSD > 0 && price <= position.tpPriceUSD;
        const stopLossHit = position.type === 'BUY'
            ? position.slPriceUSD > 0 && price <= position.slPriceUSD
            : position.slPriceUSD > 0 && price >= position.slPriceUSD;
        return liquidated || takeProfitHit || stopLossHit;
    });
    triggered.forEach(position => {
        const price = prices[position.assetId];
        const reason = positionPnl(position, price) <= -position.marginUSD
            ? 'Position liquidated'
            : 'Target/stop triggered';
        closePosition(position.id, reason);
    });

    updateSelectedDisplay();
    updateTicket();
    renderPositions();
}

function exportHistory() {
    const history = readJson('apex_history', []);
    if (!Array.isArray(history) || !history.length) return showToast('No closed trades to export.', true);
    const headers = ['Instrument', 'Side', 'Entry price', 'Exit price', 'Margin', 'PnL', 'PnL %', 'Closed at'];
    const rows = history.map(trade => [
        trade.assetId, trade.type, trade.entryPriceUSD, trade.exitPriceUSD, trade.marginUSD,
        trade.pnlUSD, trade.pnlPercent, trade.closedAt || trade.time
    ].map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'trading-ai-history.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('quote-search').addEventListener('input', event => renderQuotes(event.target.value));
['leverage', 'margin', 'take-profit', 'stop-loss'].forEach(id => $(id).addEventListener('input', updateTicket));
$('buy-tab').addEventListener('click', () => setSide('BUY'));
$('sell-tab').addEventListener('click', () => setSide('SELL'));
$('execute-order').addEventListener('click', executeOrder);
$('reset-account').addEventListener('click', () => {
    if (!window.confirm('Reset your paper account and close all open positions? Closed trade history will be kept.')) return;
    balance = 100000;
    positions = [];
    saveState();
    updateBalanceDisplay();
    renderPositions();
    showToast('Paper account reset.');
});
$('clear-history').addEventListener('click', () => {
    try {
        localStorage.removeItem('apex_history');
        showToast('Trade history cleared.');
    } catch (error) {
        console.error('Unable to clear trade history.', error);
        showToast('Could not clear trade history.', true);
    }
});
$('export-history').addEventListener('click', exportHistory);
document.querySelectorAll('.time-button').forEach(button => button.addEventListener('click', () => {
    activeInterval = button.dataset.interval;
    document.querySelectorAll('.time-button').forEach(item => item.classList.toggle('active', item === button));
    chartSelection = '';
    loadSelectedChart();
}));
$('chart-fullscreen').addEventListener('click', async () => {
    const chart = document.querySelector('.chart-workspace');
    try {
        if (!document.fullscreenElement) await chart.requestFullscreen?.();
        else await document.exitFullscreen?.();
    } catch (error) {
        console.error('Unable to change chart fullscreen mode.', error);
        showToast('Fullscreen is unavailable in this browser.', true);
    }
});

function updateClock() {
    $('session-clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' });
}

updateBalanceDisplay();
renderQuotes();
selectInstrument(selected.id);
renderPositions();
updateClock();
setInterval(updateClock, 1000);
setInterval(tick, 1800);
