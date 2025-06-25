import { useEffect, useState } from 'react';

export default function TradeUpdates() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'init') setTrades(msg.data);
      if (msg.type === 'trade') setTrades(t => [...t, msg.data]);
    };
    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Live Trades</h2>
      <ul>
        {trades.map((t, i) => (
          <li key={i}>{t.user}: {t.symbol} {t.qty} @ {t.price}</li>
        ))}
      </ul>
    </div>
  );
}
