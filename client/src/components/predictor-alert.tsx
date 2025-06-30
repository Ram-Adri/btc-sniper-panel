import { useBinanceData } from "@/hooks/use-binance-data";

export default function PredictorAlert() {
  const { 
    probability, 
    technicalState, 
    rsi, 
    currentPrice, 
    priceChange, 
    isLoading, 
    error 
  } = useBinanceData();

  const getProbabilityColor = () => {
    if (probability > 70) return "#00ff88";
    if (probability > 60) return "#00ffa2";
    if (probability > 50) return "#ffcc00";
    return "#ff6666";
  };

  if (error) {
    return (
      <div className="predictor-alert" style={{ borderColor: "#ff6666" }}>
        ⚠️ Error de conexión con datos de Bitcoin<br />
        <small>Reintentando automáticamente...</small>
      </div>
    );
  }

  return (
    <div className="predictor-alert">
      🔍 Probabilidad estimada de subida: <strong 
        style={{ color: getProbabilityColor() }}
      >
        {isLoading ? "..." : `${probability}%`}
      </strong><br />
      Estado técnico: <span style={{ color: getProbabilityColor() }}>
        {technicalState}
      </span>
      {!isLoading && (
        <>
          <br />
          <small style={{ color: "#c9d1d9" }}>
            RSI: {rsi.toFixed(1)} | Precio: ${currentPrice.toFixed(0)} 
            <span style={{ color: priceChange >= 0 ? "#00ff88" : "#ff6666" }}>
              {priceChange >= 0 ? " +" : " "}{priceChange.toFixed(0)}
            </span>
          </small>
        </>
      )}
    </div>
  );
}