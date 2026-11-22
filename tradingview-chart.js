(function () {
    let scriptPromise;
    let nextChartId = 0;

    function loadTradingView() {
        if (window.TradingView && typeof window.TradingView.widget === "function") {
            return Promise.resolve();
        }

        if (!scriptPromise) {
            scriptPromise = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://s3.tradingview.com/tv.js";
                script.async = true;
                script.onload = () => {
                    if (window.TradingView && typeof window.TradingView.widget === "function") {
                        resolve();
                    } else {
                        reject(new Error("TradingView chart library did not initialize."));
                    }
                };
                script.onerror = () => reject(new Error("TradingView chart library could not be loaded."));
                document.head.appendChild(script);
            });
        }

        return scriptPromise;
    }

    function showChartError(container, host, symbol, message) {
        container.setAttribute("aria-busy", "false");
        host.replaceChildren();

        const notice = document.createElement("div");
        notice.className = "tv-chart-error";
        const text = document.createElement("p");
        text.textContent = message;
        const link = document.createElement("a");
        link.href = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `Open ${symbol} on TradingView`;
        notice.append(text, link);
        host.appendChild(notice);
    }

    window.mountTradingViewChart = function (container, symbol, interval, options = {}) {
        if (!container || !symbol) return;

        const requestId = String(Number(container.dataset.tvChartRequest || 0) + 1);
        container.dataset.tvChartRequest = requestId;
        container.setAttribute("aria-busy", "true");
        container.replaceChildren();
        container.classList.add("tv-chart-host");

        const status = document.createElement("div");
        status.className = "tv-chart-loading";
        status.textContent = "Connecting to TradingView…";
        const host = document.createElement("div");
        host.id = `tradingview-chart-${++nextChartId}`;
        host.className = "tv-chart-mount";
        container.append(status, host);

        loadTradingView().then(() => {
            if (container.dataset.tvChartRequest !== requestId) return;

            try {
                new window.TradingView.widget({
                    autosize: true,
                    symbol,
                    interval: interval || "15",
                    timezone: "Etc/UTC",
                    theme: options.theme || "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: options.theme === "light" ? "#f1f3f6" : "#0B0F19",
                    enable_publishing: false,
                    hide_side_toolbar: false,
                    allow_symbol_change: false,
                    container_id: host.id,
                    studies: options.studies || [],
                    withdateranges: true,
                    save_image: false
                });

                let observeEmbed;
                const timeout = window.setTimeout(() => {
                    if (container.dataset.tvChartRequest !== requestId) return;
                    if (!host.querySelector("iframe")) {
                        showChartError(container, host, symbol, "The TradingView chart did not load.");
                        status.remove();
                    }
                    window.clearInterval(observeEmbed);
                }, 15000);

                observeEmbed = window.setInterval(() => {
                    if (container.dataset.tvChartRequest !== requestId) {
                        window.clearInterval(observeEmbed);
                        window.clearTimeout(timeout);
                        return;
                    }
                    if (host.querySelector("iframe")) {
                        container.setAttribute("aria-busy", "false");
                        status.remove();
                        window.clearInterval(observeEmbed);
                        window.clearTimeout(timeout);
                    }
                }, 250);
            } catch (error) {
                showChartError(container, host, symbol, "The TradingView chart could not be initialized.");
                status.remove();
                console.error("TradingView chart initialization failed.", error);
            }
        }).catch(error => {
            if (container.dataset.tvChartRequest !== requestId) return;
            showChartError(container, host, symbol, "The TradingView chart is unavailable right now.");
            status.remove();
            console.error("TradingView chart loading failed.", error);
        });
    };
})();
