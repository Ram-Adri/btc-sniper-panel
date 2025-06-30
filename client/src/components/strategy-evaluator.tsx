import { useState, useEffect } from 'react';

interface StrategyRecord {
  hora: string;
  target: number;
  etaMinutos: number;
  precioInicial: number;
  comentario: string;
  cumplido: boolean;
  evaluado: boolean;
}

export default function StrategyEvaluator() {
  const [estrategiaStats, setEstrategiaStats] = useState({
    total: 0,
    cumplidas: 0,
    porcentaje: "--",
    ultimaEvaluacion: "--"
  });

  const evaluarEstrategias = async () => {
    const estrategias: StrategyRecord[] = JSON.parse(localStorage.getItem("estrategiasIA") || "[]");
    let cambios = false;

    for (const estrategia of estrategias) {
      // Evaluar estrategias después del tiempo ETA estimado
      if (!estrategia.evaluado && Date.now() - new Date(estrategia.hora).getTime() > estrategia.etaMinutos * 60 * 1000) {
        try {
          const res = await fetch("/api/bitcoin/current-price");
          const data = await res.json();
          const precioActual = parseFloat(data.price);
          
          estrategia.cumplido = precioActual >= estrategia.target;
          estrategia.evaluado = true;
          cambios = true;
        } catch (error) {
          console.error("Error evaluando estrategia:", error);
        }
      }
    }

    if (cambios) {
      localStorage.setItem("estrategiasIA", JSON.stringify(estrategias));
    }

    // Actualizar estadísticas
    const evaluadas = estrategias.filter(e => e.evaluado);
    const cumplidas = evaluadas.filter(e => e.cumplido);
    
    if (evaluadas.length > 0) {
      const porcentaje = ((cumplidas.length / evaluadas.length) * 100).toFixed(1);
      const ultima = evaluadas[evaluadas.length - 1];
      const horaLocal = new Date(ultima.hora).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      setEstrategiaStats({
        total: evaluadas.length,
        cumplidas: cumplidas.length,
        porcentaje: `${porcentaje}%`,
        ultimaEvaluacion: horaLocal
      });
    }
  };

  useEffect(() => {
    // Evaluar inmediatamente
    evaluarEstrategias();

    // Evaluar cada 5 minutos
    const interval = setInterval(evaluarEstrategias, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="strategy-stats-panel">
      📈 Efectividad +1%: <strong>{estrategiaStats.porcentaje}</strong><br />
      Estrategias cumplidas: {estrategiaStats.cumplidas}/{estrategiaStats.total}<br />
      <small>Última evaluación: {estrategiaStats.ultimaEvaluacion}</small>
    </div>
  );
}