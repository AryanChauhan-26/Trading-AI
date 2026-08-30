const newsFeed = document.getElementById('tradingview-news-feed');
const newsTitle = document.getElementById('news-symbol-name');
const symbolButtons = document.querySelectorAll('.news-symbol');

function renderNews(symbol) {
  newsFeed.replaceChildren();

  const host = document.createElement('div');
  host.className = 'tradingview-widget-container';
  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';
  host.appendChild(widget);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
  script.textContent = JSON.stringify({
    feedMode: 'symbol',
    symbol,
    colorTheme: 'dark',
    isTransparent: true,
    displayMode: 'regular',
    width: '100%',
    height: '100%',
    locale: 'en'
  });

  host.appendChild(script);
  newsFeed.appendChild(host);
}

symbolButtons.forEach((button) => {
  button.addEventListener('click', () => {
    symbolButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    newsTitle.textContent = button.dataset.name;
    renderNews(button.dataset.symbol);
  });
});

renderNews('NASDAQ:TSLA');
