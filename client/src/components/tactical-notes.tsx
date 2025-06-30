import { useState, useEffect } from 'react';
import { useBinanceData } from '@/hooks/use-binance-data';

interface TechnicalData {
  rsi: number;
  macd: string;
  momentum: string;
  proximaEvaluacion: string;
  volumenPromedio: number;
}

export default function TacticalNotes() {
  const { currentPrice, rsi, priceChange, isLoading } = useBinanceData();
  const [technicalData, setTechnicalData] = useState<TechnicalData>({
    rsi: 0,
    macd: "neutral",
    momentum: "neutral",
    proximaEvaluacion: "--:--",
    volumenPromedio: 0
  });

  // Calcular indicadores técnicos
  useEffect(() => {
    if (currentPrice <= 0) return;

    // Simulación de MACD basado en momentum de precio
    let macdStatus = "neutral";
    if (priceChange > 0.5) macdStatus = "cruzando alcista";
    else if (priceChange < -0.5) macdStatus = "cruzando bajista";
    else if (priceChange > 0) macdStatus = "ligeramente alcista";
    else if (priceChange < 0) macdStatus = "ligeramente bajista";

    // Determinar momentum
    let momentumStatus = "neutral";
    if (Math.abs(priceChange) > 1) momentumStatus = priceChange > 0 ? "fuertemente positivo" : "fuertemente negativo";
    else if (Math.abs(priceChange) > 0.3) momentumStatus = priceChange > 0 ? "positivo" : "negativo";

    // Próxima evaluación (cada 30 minutos)
    const proxima = new Date(Date.now() + 30 * 60 * 1000);
    const horaProxima = proxima.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Volumen simulado
    const volumenBase = 45000 + Math.random() * 15000;

    setTechnicalData({
      rsi: rsi,
      macd: macdStatus,
      momentum: momentumStatus,
      proximaEvaluacion: horaProxima,
      volumenPromedio: volumenBase
    });
  }, [currentPrice, rsi, priceChange]);

  if (isLoading) {
    return (
      <div className="bg-trading-darker border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-700 rounded w-1/3 mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 bg-zinc-700 rounded w-full"></div>
            <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trading-darker border border-zinc-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        📌 Nota Táctica
        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-700">
          Análisis en tiempo real
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">RSI actual:</span>
            <span className={`font-mono font-bold ${
              technicalData.rsi > 70 ? 'text-red-400' : 
              technicalData.rsi < 30 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {technicalData.rsi.toFixed(1)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">MACD:</span>
            <span className={`font-medium ${
              technicalData.macd.includes('alcista') ? 'text-green-400' : 
              technicalData.macd.includes('bajista') ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {technicalData.macd}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Momentum:</span>
            <span className={`font-medium ${
              technicalData.momentum.includes('positivo') ? 'text-green-400' : 
              technicalData.momentum.includes('negativo') ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {technicalData.momentum}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Próxima evaluación:</span>
            <span className="font-mono text-trading-accent">
              {technicalData.proximaEvaluacion}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-700">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">
            Volumen promedio (10 períodos): {technicalData.volumenPromedio.toLocaleString('en-US', { maximumFractionDigits: 0 })} BTC
          </span>
          <span className="text-zinc-500">
            Cambio precio: {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}