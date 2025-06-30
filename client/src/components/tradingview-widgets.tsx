import { useEffect } from "react";

export default function TradingViewWidgets() {
  useEffect(() => {
    // Reload iframes to ensure TradingView widgets work properly
    const iframes = document.querySelectorAll('iframe[src*="tradingview"]');
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src');
      if (src) {
        iframe.setAttribute('src', src);
      }
    });
  }, []);

  return (
    <div className="mb-8">
      {/* Price Ticker */}
      <div className="bg-trading-surface rounded-lg border border-trading-border overflow-hidden mb-4">
        <div className="p-4 border-b border-trading-border">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>Precio en Tiempo Real</span>
            <div className="w-2 h-2 bg-trading-success rounded-full animate-pulse"></div>
          </h2>
        </div>
        <div className="tradingview-container">
          <iframe 
            src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=es&symbols=%5B%7B%22proName%22%3A%22BINANCE%3ABTCUSDT%22%2C%22title%22%3A%22Bitcoin%20%2F%20Tether%22%7D%5D&showSymbolLogo=true&colorTheme=dark&isTransparent=false&displayMode=adaptive&width=100%25&height=46#%7B%22utm_source%22%3A%22localhost%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22ticker-tape%22%7D"
            width="100%" 
            height="46" 
            frameBorder="0" 
            scrolling="no"
            className="w-full"
          />
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-trading-surface rounded-lg border border-trading-border overflow-hidden">
        <div className="p-4 border-b border-trading-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Gráfico Principal</h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">1H</span>
              <span className="text-slate-400">BINANCE:BTCUSDT</span>
            </div>
          </div>
        </div>
        <div className="tradingview-container bg-white">
          <iframe 
            src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=es&symbol=BINANCE%3ABTCUSDT&interval=1H&timezone=America%2FLa_Paz&theme=dark&style=1&withdateranges=true&hide_side_toolbar=false&allow_symbol_change=true&save_image=false&calendar=false&hide_volume=false&support_host=https%3A%2F%2Fwww.tradingview.com&width=100%25&height=500#%7B%22utm_source%22%3A%22localhost%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22chart%22%7D"
            width="100%" 
            height="500" 
            frameBorder="0" 
            scrolling="no"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
