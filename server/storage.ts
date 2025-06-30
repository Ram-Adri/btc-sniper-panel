import { 
  tradingLevels, 
  portfolio, 
  priceAlerts, 
  marketData,
  type TradingLevel, 
  type InsertTradingLevel,
  type Portfolio,
  type InsertPortfolio,
  type PriceAlert,
  type InsertPriceAlert,
  type MarketData,
  type InsertMarketData
} from "@shared/schema";

export interface IStorage {
  // Trading levels
  getTradingLevels(): Promise<TradingLevel[]>;
  createTradingLevel(level: InsertTradingLevel): Promise<TradingLevel>;
  updateTradingLevel(id: number, updates: Partial<TradingLevel>): Promise<TradingLevel | undefined>;
  deleteTradingLevel(id: number): Promise<boolean>;

  // Portfolio
  getPortfolio(): Promise<Portfolio | undefined>;
  updatePortfolio(data: InsertPortfolio): Promise<Portfolio>;

  // Price alerts
  getPriceAlerts(): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: number, updates: Partial<PriceAlert>): Promise<PriceAlert | undefined>;
  deletePriceAlert(id: number): Promise<boolean>;

  // Market data
  getMarketData(): Promise<MarketData | undefined>;
  updateMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class MemStorage implements IStorage {
  private tradingLevelsMap: Map<number, TradingLevel>;
  private portfolioData: Portfolio | undefined;
  private priceAlertsMap: Map<number, PriceAlert>;
  private marketDataStore: MarketData | undefined;
  private currentId: number;

  constructor() {
    this.tradingLevelsMap = new Map();
    this.priceAlertsMap = new Map();
    this.currentId = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default trading levels
    const defaultLevels: TradingLevel[] = [
      {
        id: 1,
        price: "108800",
        type: "resistance",
        description: "Resistencia clave",
        action: "Entrada agresiva si rompe con volumen",
        status: "monitoring",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        price: "108723",
        type: "entry",
        description: "Tu entrada actual",
        action: "Break-even: mantener o ajustar stop",
        status: "active",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        price: "108400",
        type: "support",
        description: "Soporte técnico",
        action: "Salir si se rompe con fuerza",
        status: "critical",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    defaultLevels.forEach(level => {
      this.tradingLevelsMap.set(level.id, level);
    });

    // Initialize default portfolio
    this.portfolioData = {
      id: 1,
      btcAmount: "0.025",
      entryPrice: "108723",
      totalInvested: "2718",
      updatedAt: new Date(),
    };

    // Initialize default market data
    this.marketDataStore = {
      id: 1,
      symbol: "BTCUSDT",
      currentPrice: "108650",
      rsi: "67.4",
      macd: "124.5",
      volume24h: "2.4B",
      volatility: "2.8",
      updatedAt: new Date(),
    };

    this.currentId = 4;
  }

  async getTradingLevels(): Promise<TradingLevel[]> {
    return Array.from(this.tradingLevelsMap.values()).filter(level => level.isActive);
  }

  async createTradingLevel(levelData: InsertTradingLevel): Promise<TradingLevel> {
    const id = this.currentId++;
    const level: TradingLevel = {
      ...levelData,
      id,
      status: levelData.status || "monitoring",
      isActive: levelData.isActive !== undefined ? levelData.isActive : true,
      createdAt: new Date(),
    };
    this.tradingLevelsMap.set(id, level);
    return level;
  }

  async updateTradingLevel(id: number, updates: Partial<TradingLevel>): Promise<TradingLevel | undefined> {
    const level = this.tradingLevelsMap.get(id);
    if (!level) return undefined;

    const updatedLevel = { ...level, ...updates };
    this.tradingLevelsMap.set(id, updatedLevel);
    return updatedLevel;
  }

  async deleteTradingLevel(id: number): Promise<boolean> {
    return this.tradingLevelsMap.delete(id);
  }

  async getPortfolio(): Promise<Portfolio | undefined> {
    return this.portfolioData;
  }

  async updatePortfolio(data: InsertPortfolio): Promise<Portfolio> {
    const updatedPortfolio: Portfolio = {
      id: 1,
      btcAmount: data.btcAmount || "0",
      entryPrice: data.entryPrice || null,
      totalInvested: data.totalInvested || "0",
      updatedAt: new Date(),
    };
    this.portfolioData = updatedPortfolio;
    return updatedPortfolio;
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    return Array.from(this.priceAlertsMap.values()).filter(alert => alert.isActive);
  }

  async createPriceAlert(alertData: InsertPriceAlert): Promise<PriceAlert> {
    const id = this.currentId++;
    const alert: PriceAlert = {
      ...alertData,
      id,
      isActive: alertData.isActive !== undefined ? alertData.isActive : true,
      triggered: false,
      createdAt: new Date(),
    };
    this.priceAlertsMap.set(id, alert);
    return alert;
  }

  async updatePriceAlert(id: number, updates: Partial<PriceAlert>): Promise<PriceAlert | undefined> {
    const alert = this.priceAlertsMap.get(id);
    if (!alert) return undefined;

    const updatedAlert = { ...alert, ...updates };
    this.priceAlertsMap.set(id, updatedAlert);
    return updatedAlert;
  }

  async deletePriceAlert(id: number): Promise<boolean> {
    return this.priceAlertsMap.delete(id);
  }

  async getMarketData(): Promise<MarketData | undefined> {
    return this.marketDataStore;
  }

  async updateMarketData(data: InsertMarketData): Promise<MarketData> {
    const updatedMarketData: MarketData = {
      id: 1,
      symbol: data.symbol || "BTCUSDT",
      currentPrice: data.currentPrice,
      rsi: data.rsi || null,
      macd: data.macd || null,
      volume24h: data.volume24h || null,
      volatility: data.volatility || null,
      updatedAt: new Date(),
    };
    this.marketDataStore = updatedMarketData;
    return updatedMarketData;
  }
}

export const storage = new MemStorage();
