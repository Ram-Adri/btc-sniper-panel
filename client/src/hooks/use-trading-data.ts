import { useQuery } from "@tanstack/react-query";
import type { TradingLevel, Portfolio, MarketData, PriceAlert } from "@shared/schema";

export function useTradingData() {
  const { data: tradingLevels, isLoading: levelsLoading } = useQuery<TradingLevel[]>({
    queryKey: ["/api/trading-levels"],
  });

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const { data: marketData, isLoading: marketLoading } = useQuery<MarketData>({
    queryKey: ["/api/market-data"],
  });

  const { data: priceAlerts, isLoading: alertsLoading } = useQuery<PriceAlert[]>({
    queryKey: ["/api/price-alerts"],
  });

  return {
    tradingLevels,
    portfolio,
    marketData,
    priceAlerts,
    isLoading: levelsLoading || portfolioLoading || marketLoading || alertsLoading,
  };
}
