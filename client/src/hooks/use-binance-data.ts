import { useState, useEffect } from 'react';

interface Prediction {
  hora: string;
  rsi: number;
  probabilidad: number;
  precioEntrada: number;
  evaluado: boolean;
  acertado: boolean | null;
}

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

interface MarketAnalysis {
  rsi: number;
  probability: number;
  technicalState: string;
  currentPrice: number;
  priceChange: number;
  isLoading: boolean;
  error: string | null;
}

export function useBinanceData(): MarketAnalysis {
  const [analysis, setAnalysis] = useState<MarketAnalysis>({
    rsi: 0,
    probability: 50,
    technicalState: "Cargando...",
    currentPrice: 0,
    priceChange: 0,
    isLoading: true,
    error: null
  });

  const calculateRSI = (closes: number[], periods: number = 14): number => {
    if (closes.length < periods + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= periods; i++) {
      const change = closes[closes.length - i] - closes[closes.length - i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / periods;
    const avgLoss = losses / periods;
    const rs = avgGain / (avgLoss || 1);
    
    return 100 - (100 / (1 + rs));
  };

  const guardarPrediccion = (rsi: number, probability: number, currentPrice: number) => {
    try {
      const historial: Prediction[] = JSON.parse(localStorage.getItem("historialIA") || "[]");
      
      historial.push({
        hora: new Date().toLocaleString("es-BO", { hour12: false }),
        rsi: rsi,
        probabilidad: probability,
        precioEntrada: currentPrice,
        evaluado: false,
        acertado: null
      });
      
      localStorage.setItem("historialIA", JSON.stringify(historial));
    } catch (error) {
      console.error("Error guardando predicción:", error);
    }
  };

  const analyzeMarket = async () => {
  try {
    setAnalysis(prev => ({ ...prev, isLoading: true, error: null }));

   const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly");
if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

const data = await response.json();
const closes = data.prices.map((p: number[]) => p[1]); // extrae solo el precio de cada entrada

const currentPrice = closes.at(-1) || 0;
const previousPrice = closes.at(-2) || 0;
const priceChange = currentPrice - previousPrice;

// ...tu cálculo RSI y probabilidad puede seguir tal cual 👇
const rsi = calculateRSI(closes, 14);


    // Calcular probabilidad táctica
    let probability = 50;
    if (rsi > 65) probability += 10;
    if (rsi > 70) probability += 15;
    if (rsi < 30) probability -= 20;
    if (rsi < 40) probability -= 10;
    if (priceChange > 0) probability += 5;
    if (priceChange < 0) probability -= 5;

    const trendUp = closes.slice(-5).filter((price, i, arr) =>
      i > 0 && price > arr[i - 1]
    ).length;

    if (trendUp >= 3) probability += 8;
    if (trendUp <= 1) probability -= 8;
    probability = Math.max(0, Math.min(100, probability));

    const technicalState =
      probability > 75 ? "🔥 Impulso fuerte" :
      probability > 65 ? "✅ Momentum positivo" :
      probability > 55 ? "🟡 Neutral con sesgo alcista" :
      probability > 45 ? "⚪ Neutral" :
      probability > 35 ? "🟠 Débil" :
      "🔻 Sin confirmación";

    guardarPrediccion(rsi, probability, currentPrice);

    setAnalysis({
      rsi,
      probability,
      technicalState,
      currentPrice,
      priceChange,
      isLoading: false,
      error: null
    });

  } catch (error: any) {
   console.error("Error obteniendo datos del mercado:", error.message);
setAnalysis(prev => ({
  ...prev,
  isLoading: false,
  error: "Error al conectar con CoinGecko"
}));

  }
};


  useEffect(() => {
    // Ejecutar inmediatamente
    analyzeMarket();

    // Ejecutar cada 1 minuto
    const interval = setInterval(analyzeMarket, 60000);

    return () => clearInterval(interval);
  }, []);

  return analysis;
}
