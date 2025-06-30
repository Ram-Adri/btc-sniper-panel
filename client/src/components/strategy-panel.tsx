import { useState, useEffect } from 'react';

interface StrategyData {
  precioActual: number;
  target: number;
  etaMinutos: number;
  fechaETA: string;
  probabilidad: number;
  comentario: string;
  isActive: boolean;
}

interface StrategyRecord {
  hora: string;
  target: number;
  etaMinutos: number;
  precioInicial: number;
  comentario: string;
  cumplido: boolean;
  evaluado: boolean;
}

export default function StrategyPanel() {
  const [strategy, setStrategy] = useState<StrategyData>({
    precioActual: 0,
    target: 0,
    etaMinutos: 0,
    fechaETA: "",
    probabilidad: 0,
    comentario: "",
    isActive: false
  });

  const estrategiaPlusUno = async () => {
    try {
      // Usar nuestro endpoint de Bitcoin (intervalos más largos debido a limitaciones de API gratuita)
      const res = await fetch("/api/bitcoin/price-history");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data received");
      }

      // Extraer precios de cierre de los últimos 10 puntos
      const cierres = data.slice(-10).map((item: any) => parseFloat(item[4]));
      const precioActual = cierres[cierres.length - 1];
      const target = +(precioActual * 1.01).toFixed(2);
      const diferencia = target - precioActual;
      
      // Calcular velocidad (momentum): cambios positivos promedio
      let subidas = [];
      for (let i = 1; i < cierres.length; i++) {
        const diff = cierres[i] - cierres[i - 1];
        if (diff > 0) subidas.push(diff);
      }
      
      const velocidadPromedio = subidas.length ? subidas.reduce((a, b) => a + b) / subidas.length : 50; // Valor más realista para Bitcoin
      const minutosETA = Math.max(10, Math.round(diferencia / (velocidadPromedio / 60))); // Ajustar para timeframes más largos
      const fechaETA = new Date(Date.now() + minutosETA * 60000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // Generar comentario táctico basado en momentum
      const comentario = velocidadPromedio > 100
        ? "Entrada sugerida: momentum fuerte detectado. Confirmar con volumen."
        : velocidadPromedio > 50
        ? "Potencial alcista con impulso moderado. RSI > 65 recomendado antes de entrada."
        : "Esperar confirmación de tendencia alcista en próximos marcos temporales.";

      const probabilidad = Math.min(95, Math.round((subidas.length / 9) * 100));

      setStrategy({
        precioActual,
        target,
        etaMinutos: minutosETA,
        fechaETA,
        probabilidad,
        comentario,
        isActive: true
      });

      // Guardar estrategia para evaluación futura
      const estrategiaRecord: StrategyRecord = {
        hora: new Date().toISOString(),
        target: target,
        etaMinutos: minutosETA,
        precioInicial: precioActual,
        comentario,
        cumplido: false,
        evaluado: false
      };

      const estrategias: StrategyRecord[] = JSON.parse(localStorage.getItem("estrategiasIA") || "[]");
      estrategias.push(estrategiaRecord);
      localStorage.setItem("estrategiasIA", JSON.stringify(estrategias));

    } catch (e) {
      console.error("⚠️ Error al calcular estrategia:", e);
      setStrategy(prev => ({ ...prev, isActive: false }));
    }
  };

  useEffect(() => {
    // Ejecutar inmediatamente
    estrategiaPlusUno();

    // Ejecutar cada 2 minutos (más realista para datos de Bitcoin)
    const interval = setInterval(estrategiaPlusUno, 120000);

    return () => clearInterval(interval);
  }, []);

  if (!strategy.isActive) {
    return null;
  }

  return (
    <div className="estrategia-activa">
      🎯 <strong>Estrategia de +1%</strong> detectada<br />
      Precio actual: <span>${strategy.precioActual.toFixed(2)}</span><br />
      Objetivo: <strong>${strategy.target}</strong><br />
      ETA estimada: <strong>{strategy.etaMinutos} min → {strategy.fechaETA}</strong><br />
      Probabilidad estimada: <strong>{strategy.probabilidad}%</strong><br />
      🧠 Estrategia sugerida:<br />
      <em>{strategy.comentario}</em>
    </div>
  );
}