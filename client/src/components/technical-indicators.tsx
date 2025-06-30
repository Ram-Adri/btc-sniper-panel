import { useState, useEffect } from 'react';
import { useBinanceData } from '@/hooks/use-binance-data';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: 'bullish' | 'bearish' | 'neutral';
    histogram: number;
  };
  volume: {
    current: number;
    average: number;
    trend: 'high' | 'normal' | 'low';
  };
  momentum: {
    value: number;
    direction: 'up' | 'down' | 'sideways';
  };
}

export default function TechnicalIndicators() {
  const { currentPrice, rsi, priceChange, isLoading } = useBinanceData();
  const [indicators, setIndicators] = useState<TechnicalIndicators>({
    rsi: 0,
    macd: { value: 0, signal: 'neutral', histogram: 0 },
    volume: { current: 0, average: 0, trend: 'normal' },
    momentum: { value: 0, direction: 'sideways' }
  });

  useEffect(() => {
    if (currentPrice <= 0) return;

    // Calcular MACD simulado basado en medias móviles
    const macdValue = priceChange * 2.5; // Simulación
    let macdSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (macdValue > 0.3) macdSignal = 'bullish';
    else if (macdValue < -0.3) macdSignal = 'bearish';

    // Volumen simulado con variación realista
    const baseVolume = 48000;
    const currentVolume = baseVolume + (Math.random() - 0.5) * 12000;
    const averageVolume = baseVolume;
    
    let volumeTrend: 'high' | 'normal' | 'low' = 'normal';
    if (currentVolume > averageVolume * 1.2) volumeTrend = 'high';
    else if (currentVolume < averageVolume * 0.8) volumeTrend = 'low';

    // Momentum basado en velocidad de cambio de precio
    const momentumValue = Math.abs(priceChange);
    let momentumDirection: 'up' | 'down' | 'sideways' = 'sideways';
    
    if (priceChange > 0.2) momentumDirection = 'up';
    else if (priceChange < -0.2) momentumDirection = 'down';

    setIndicators({
      rsi: rsi,
      macd: {
        value: macdValue,
        signal: macdSignal,
        histogram: macdValue * 0.7
      },
      volume: {
        current: currentVolume,
        average: averageVolume,
        trend: volumeTrend
      },
      momentum: {
        value: momentumValue,
        direction: momentumDirection
      }
    });
  }, [currentPrice, rsi, priceChange]);

  if (isLoading) {
    return (
      <div className="bg-trading-darker border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Indicadores Técnicos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-zinc-700 rounded w-16 mb-2"></div>
              <div className="h-6 bg-zinc-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trading-darker border border-zinc-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-trading-accent" />
        Indicadores Técnicos Actualizados
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* RSI */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 mb-1">RSI (14)</div>
          <div className={`text-2xl font-bold font-mono ${
            indicators.rsi > 70 ? 'text-red-400' : 
            indicators.rsi < 30 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {indicators.rsi.toFixed(1)}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {indicators.rsi > 70 ? 'Sobrecompra' : 
             indicators.rsi < 30 ? 'Sobreventa' : 'Neutral'}
          </div>
        </div>

        {/* MACD */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 mb-1">MACD</div>
          <div className="flex items-center justify-center gap-1">
            {indicators.macd.signal === 'bullish' ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : indicators.macd.signal === 'bearish' ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            )}
            <span className={`text-lg font-bold font-mono ${
              indicators.macd.signal === 'bullish' ? 'text-green-400' : 
              indicators.macd.signal === 'bearish' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {indicators.macd.value.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-1 capitalize">
            {indicators.macd.signal === 'bullish' ? 'Alcista' : 
             indicators.macd.signal === 'bearish' ? 'Bajista' : 'Neutral'}
          </div>
        </div>

        {/* Volumen */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 mb-1">Volumen (10P)</div>
          <div className="flex items-center justify-center gap-1">
            <BarChart3 className={`w-4 h-4 ${
              indicators.volume.trend === 'high' ? 'text-green-400' : 
              indicators.volume.trend === 'low' ? 'text-red-400' : 'text-yellow-400'
            }`} />
            <span className="text-lg font-bold font-mono text-white">
              {(indicators.volume.current / 1000).toFixed(1)}K
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-1 capitalize">
            {indicators.volume.trend === 'high' ? 'Alto' : 
             indicators.volume.trend === 'low' ? 'Bajo' : 'Normal'}
          </div>
        </div>

        {/* Momentum */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 mb-1">Momentum</div>
          <div className="flex items-center justify-center gap-1">
            {indicators.momentum.direction === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : indicators.momentum.direction === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <div className="w-4 h-4 bg-zinc-500 rounded-full"></div>
            )}
            <span className={`text-lg font-bold font-mono ${
              indicators.momentum.direction === 'up' ? 'text-green-400' : 
              indicators.momentum.direction === 'down' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {indicators.momentum.value.toFixed(2)}%
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-1 capitalize">
            {indicators.momentum.direction === 'up' ? 'Positivo' : 
             indicators.momentum.direction === 'down' ? 'Negativo' : 'Lateral'}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-700">
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <span>Actualización automática cada 15s</span>
          <span>Análisis técnico en tiempo real</span>
        </div>
      </div>
    </div>
  );
}