import { useState, useEffect } from 'react';
import { useBinanceData } from '@/hooks/use-binance-data';

interface ActionZone {
  nivel: string;
  tipo: string;
  accion: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export default function ActionZonesTable() {
  const { currentPrice, rsi, isLoading } = useBinanceData();
  const [zones, setZones] = useState<ActionZone[]>([]);
  const [supportLevel, setSupportLevel] = useState<number>(0);
  const [strategyData, setStrategyData] = useState<any>(null);

  // Obtener datos de estrategia desde localStorage
  useEffect(() => {
    const estrategias = JSON.parse(localStorage.getItem("estrategiasIA") || "[]");
    const estrategiaActiva = estrategias.find((e: any) => !e.evaluado);
    setStrategyData(estrategiaActiva);
  }, []);

  // Calcular soporte técnico (mínimo local simulado)
  useEffect(() => {
    if (currentPrice > 0) {
      const soporte = currentPrice * 0.985; // Simulación de soporte 1.5% abajo
      setSupportLevel(soporte);
    }
  }, [currentPrice]);

  // Generar zonas dinámicas
  useEffect(() => {
    if (currentPrice <= 0) return;

    const newZones: ActionZone[] = [];
    
    // 1. Objetivo +1%
    const objetivo = currentPrice * 1.01;
    newZones.push({
      nivel: `$${objetivo.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      tipo: "🎯 Objetivo IA",
      accion: "Tomar ganancias si se alcanza",
      prioridad: 'alta'
    });

    // 2. Entrada proyectada (si hay estrategia activa)
    if (strategyData) {
      const eta = new Date(Date.now() + strategyData.etaMinutos * 60 * 1000);
      const horaETA = eta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      newZones.push({
        nivel: `$${strategyData.precioInicial.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        tipo: "Entrada proyectada IA",
        accion: `Evaluar entrada a las ${horaETA} si momentum se mantiene`,
        prioridad: 'media'
      });
    }

    // 3. Precio actual (seguimiento)
    newZones.push({
      nivel: `$${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      tipo: "🔄 Seguimiento",
      accion: "Vigilancia activa",
      prioridad: 'media'
    });

    // 4. Soporte técnico
    newZones.push({
      nivel: `$${supportLevel.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      tipo: "Soporte técnico",
      accion: "Cortar si hay ruptura con volumen",
      prioridad: 'baja'
    });

    setZones(newZones);
  }, [currentPrice, supportLevel, strategyData]);

  if (isLoading) {
    return (
      <div className="bg-trading-darker border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Zonas de Acción Dinámicas</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trading-darker border border-zinc-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Zonas de Acción Dinámicas
        <span className="text-sm text-zinc-400 ml-2">• Actualización automática</span>
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-3 px-2 text-zinc-400 font-medium">Nivel</th>
              <th className="text-left py-3 px-2 text-zinc-400 font-medium">Tipo</th>
              <th className="text-left py-3 px-2 text-zinc-400 font-medium">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, index) => (
              <tr key={index} className={`border-b border-zinc-800 hover:bg-zinc-800/50 ${
                zone.prioridad === 'alta' ? 'bg-green-900/10' : 
                zone.prioridad === 'media' ? 'bg-blue-900/10' : 'bg-zinc-900/10'
              }`}>
                <td className="py-3 px-2 font-mono text-trading-accent font-semibold">
                  {zone.nivel}
                </td>
                <td className="py-3 px-2 text-slate-300">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    zone.prioridad === 'alta' 
                      ? 'bg-green-900/30 text-green-400 border border-green-700' 
                      : zone.prioridad === 'media'
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                      : 'bg-zinc-900/30 text-zinc-400 border border-zinc-700'
                  }`}>
                    {zone.tipo}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-300 text-sm">
                  {zone.accion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-zinc-500 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Zonas actualizadas cada 15 segundos • RSI: {rsi.toFixed(1)}
      </div>
    </div>
  );
}