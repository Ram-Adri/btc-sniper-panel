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
        hora: new Date().toISOString(),
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

      // Obtener datos históricos de Bitcoin a través del proxy CoinGecko
      const response = await fetch("/corsproxy.io/?/api/bitcoin/price-history");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extraer precios de cierre
      const closes = data.map((kline: any) => parseFloat(kline[4]));
      const currentPrice = closes[closes.length - 1];
      const previousPrice = closes[closes.length - 2];
      const priceChange = currentPrice - previousPrice;

      // Calcular RSI
      const rsi = calculateRSI(closes, 14);

      // Lógica táctica para probabilidad
      let probability = 50;
      
      if (rsi > 65) probability += 10;
      if (rsi > 70) probability += 15;
      if (rsi < 30) probability -= 20;
      if (rsi < 40) probability -= 10;
      
      // Factor de tendencia reciente
      if (priceChange > 0) probability += 5;
      if (priceChange < 0) probability -= 5;

      // Tendencia general (últimas 5 velas)
      const recentTrend = closes.slice(-5);
      const trendUp = recentTrend.filter((price: number, i: number) => 
        i > 0 && price > recentTrend[i - 1]
      ).length;
      
      if (trendUp >= 3) probability += 8;
      if (trendUp <= 1) probability -= 8;

      probability = Math.max(0, Math.min(100, probability));

      // Determinar estado técnico
      const technicalState = 
        probability > 75 ? "🔥 Impulso fuerte" :
        probability > 65 ? "✅ Momentum positivo" :
        probability > 55 ? "🟡 Neutral con sesgo alcista" :
        probability > 45 ? "⚪ Neutral" :
        probability > 35 ? "🟠 Débil" :
        "🔻 Sin confirmación";

      // Guardar esta predicción en el historial
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

    } catch (error) {
      console.error("Error obteniendo datos de Bitcoin:", error);
      setAnalysis(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error de conexión"
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
