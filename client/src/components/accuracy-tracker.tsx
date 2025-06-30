import { useState, useEffect } from 'react';

interface Prediction {
  hora: string;
  rsi: number;
  probabilidad: number;
  precioEntrada: number;
  evaluado: boolean;
  acertado: boolean | null;
}

export default function AccuracyTracker() {
  const [porcentajeAciertos, setPorcentajeAciertos] = useState<string>("--");
  const [ultimaEvaluacion, setUltimaEvaluacion] = useState<string>("--");

  const getHistorial = (): Prediction[] => {
    try {
      return JSON.parse(localStorage.getItem("historialIA") || "[]");
    } catch {
      return [];
    }
  };

  const guardarHistorial = (historial: Prediction[]) => {
    localStorage.setItem("historialIA", JSON.stringify(historial));
  };

  const evaluarPredicciones = async () => {
    const historial = getHistorial();
    let cambios = false;

    for (const pred of historial) {
      if (!pred.evaluado && Date.now() - new Date(pred.hora).getTime() > 30 * 60 * 1000) {
        try {
          const res = await fetch("/api/bitcoin/current-price");
          const data = await res.json();
          const precioActual = parseFloat(data.price);
          const subio = precioActual > pred.precioEntrada;
          
          pred.evaluado = true;
          pred.acertado = (subio && pred.probabilidad >= 60) || (!subio && pred.probabilidad < 60);
          cambios = true;
        } catch (error) {
          console.error("Error evaluando predicción:", error);
        }
      }
    }

    if (cambios) {
      guardarHistorial(historial);
      actualizarAciertos();
    }
  };

  const actualizarAciertos = () => {
    const historial = getHistorial();
    const evaluadas = historial.filter(p => p.evaluado);
    const aciertos = evaluadas.filter(p => p.acertado).length;
    
    if (evaluadas.length > 0) {
      const porcentaje = ((aciertos / evaluadas.length) * 100).toFixed(1);
      setPorcentajeAciertos(`${porcentaje}%`);
      
      const ultima = evaluadas[evaluadas.length - 1];
      const horaLocal = new Date(ultima.hora).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setUltimaEvaluacion(horaLocal);
    } else {
      setPorcentajeAciertos("--");
      setUltimaEvaluacion("--");
    }
  };

  useEffect(() => {
    // Evaluar predicciones inmediatamente
    evaluarPredicciones();
    actualizarAciertos();

    // Evaluar cada 5 minutos
    const interval = setInterval(evaluarPredicciones, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aciertos-panel">
      📊 Precisión acumulada: <strong id="porcentajeAciertos">{porcentajeAciertos}</strong><br />
      Última evaluación: <span id="ultimaEvaluacion">{ultimaEvaluacion}</span>
    </div>
  );
}