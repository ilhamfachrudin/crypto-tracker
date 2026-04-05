const grid = document.getElementById('coins-grid');
const search = document.getElementById('search');

let allCoins = [];

function fmt(n) {
  if (n === null || n === undefined) return 'N/A';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + n.toFixed(6);
}

function pct(n) {
  if (n === null || n === undefined) return '—';
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(2) + '%';
}

function renderCoin(c) {
  const change = c.price_change_percentage_24h;
  const upOrDown = change >= 0 ? 'up' : 'down';
  return `
    <div class="coin-card">
      <div class="coin-header">
        <span class="coin-rank">#${c.market_cap_rank}</span>
        <div>
          <div class="coin-name">${c.name}</div>
          <div class="coin-symbol">${c.symbol}</div>
        </div>
      </div>
      <div class="coin-price">${fmt(c.current_price)}</div>
      <div class="coin-change ${upOrDown}">${pct(change)} (24h)</div>
      <div class="coin-meta">
        <span>Market Cap: ${fmt(c.market_cap)}</span>
        <span>Volume: ${fmt(c.total_volume)}</span>
      </div>
    </div>`;
}

function render(coins) {
  if (!coins.length) { grid.innerHTML = '<div class="error">No coins found.</div>'; return; }
  grid.innerHTML = coins.map(renderCoin).join('');
}

async function fetchCoins() {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=24&page=1&sparkline=false';
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    allCoins = await res.json();
    render(allCoins);
  } catch (err) {
    // Fallback: show mock data when API is unavailable
    allCoins = [
      { market_cap_rank: 1, name: 'Bitcoin', symbol: 'btc', current_price: 65000, price_change_percentage_24h: 2.3, market_cap: 1.27e12, total_volume: 28e9 },
      { market_cap_rank: 2, name: 'Ethereum', symbol: 'eth', current_price: 3400, price_change_percentage_24h: -1.1, market_cap: 409e9, total_volume: 15e9 },
      { market_cap_rank: 3, name: 'BNB', symbol: 'bnb', current_price: 580, price_change_percentage_24h: 0.8, market_cap: 84e9, total_volume: 2e9 },
      { market_cap_rank: 4, name: 'Solana', symbol: 'sol', current_price: 178, price_change_percentage_24h: 5.2, market_cap: 76e9, total_volume: 4e9 },
      { market_cap_rank: 5, name: 'XRP', symbol: 'xrp', current_price: 0.52, price_change_percentage_24h: -0.4, market_cap: 29e9, total_volume: 1.2e9 },
      { market_cap_rank: 6, name: 'USDC', symbol: 'usdc', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 27e9, total_volume: 6e9 },
    ];
    render(allCoins);
  }
}

search.addEventListener('input', () => {
  const q = search.value.toLowerCase();
  const filtered = allCoins.filter(c =>
    c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  );
  render(filtered);
});

fetchCoins();
setInterval(fetchCoins, 60000);
