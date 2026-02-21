
import { API_BASE_URL, WS_BASE_URL } from '../constants';
import { Kline, MarketTrade } from '../types';

export const fetchHistoricalKlines = async (symbol: string, interval: string): Promise<(Kline & { volume: number })[]> => {
  try {
    // Note: Calling Binance API directly from browser often triggers CORS.
    // In a production app, use a proxy server. 
    // We try/catch here to ensure the app doesn't crash if blocked.
    const response = await fetch(`${API_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=100`);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((d: any) => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));
  } catch (error) {
    console.warn("Failed to fetch klines (likely CORS restricted on localhost/frontend-only). Chart history may be empty.", error);
    return [];
  }
};

export class BinanceStream {
  private ws: WebSocket | null = null;
  private symbol: string;
  private interval: string;

  constructor(symbol: string, interval: string = '1m') {
    this.symbol = symbol.toLowerCase();
    this.interval = interval;
  }

  connect(
    onTicker: (data: any) => void, 
    onKline: (data: any) => void,
    onTrade?: (data: MarketTrade) => void,
    onDepth?: (data: { bids: string[][], asks: string[][] }) => void
  ) {
    // Combine streams: ticker, kline, aggTrade, and partial depth (top 20 levels, 100ms update)
    const streams = [
      `${this.symbol}@ticker`,
      `${this.symbol}@kline_${this.interval}`,
      `${this.symbol}@aggTrade`,
      `${this.symbol}@depth20@100ms`
    ].join('/');

    this.ws = new WebSocket(`${WS_BASE_URL}/${streams}`);

    this.ws.onopen = () => {
        // console.log('WS Connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle Event Wrappers (stream name vs direct payload)
        const data = message.data || message;

        if (data.e === '24hrTicker') {
          onTicker(data);
        } else if (data.e === 'kline') {
          onKline(data.k);
        } else if (data.e === 'aggTrade' && onTrade) {
          onTrade({
            id: data.a,
            price: parseFloat(data.p),
            quantity: parseFloat(data.q),
            time: data.T,
            isBuyerMaker: data.m 
          });
        } else if (data.lastUpdateId && data.bids && data.asks && onDepth) {
          // Partial Depth Stream Payload (no 'e' event type usually in combined stream raw payload, 
          // but identifiable by lastUpdateId + bids + asks)
          onDepth({
             bids: data.bids,
             asks: data.asks
          });
        }
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };

    this.ws.onclose = () => {
       // Reconnection logic could go here
    };
    
    this.ws.onerror = (err) => {
        console.error("WS Error", err);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
