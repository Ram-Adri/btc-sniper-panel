import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradingLevelSchema, insertPriceAlertSchema, insertMarketDataSchema, insertPortfolioSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Trading levels endpoints
  app.get("/api/trading-levels", async (req, res) => {
    try {
      const levels = await storage.getTradingLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading levels" });
    }
  });

  app.post("/api/trading-levels", async (req, res) => {
    try {
      const validatedData = insertTradingLevelSchema.parse(req.body);
      const level = await storage.createTradingLevel(validatedData);
      res.json(level);
    } catch (error) {
      res.status(400).json({ message: "Invalid trading level data" });
    }
  });

  app.put("/api/trading-levels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const level = await storage.updateTradingLevel(id, updates);
      if (!level) {
        return res.status(404).json({ message: "Trading level not found" });
      }
      res.json(level);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trading level" });
    }
  });

  app.delete("/api/trading-levels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTradingLevel(id);
      if (!success) {
        return res.status(404).json({ message: "Trading level not found" });
      }
      res.json({ message: "Trading level deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete trading level" });
    }
  });

  // Portfolio endpoints
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio();
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.put("/api/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.updatePortfolio(validatedData);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Price alerts endpoints
  app.get("/api/price-alerts", async (req, res) => {
    try {
      const alerts = await storage.getPriceAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price alerts" });
    }
  });

  app.post("/api/price-alerts", async (req, res) => {
    try {
      const validatedData = insertPriceAlertSchema.parse(req.body);
      const alert = await storage.createPriceAlert(validatedData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid price alert data" });
    }
  });

  app.delete("/api/price-alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePriceAlert(id);
      if (!success) {
        return res.status(404).json({ message: "Price alert not found" });
      }
      res.json({ message: "Price alert deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete price alert" });
    }
  });

  // Market data endpoints
  app.get("/api/market-data", async (req, res) => {
    try {
      const data = await storage.getMarketData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.put("/api/market-data", async (req, res) => {
    try {
      const validatedData = insertMarketDataSchema.parse(req.body);
      const data = await storage.updateMarketData(validatedData);
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid market data" });
    }
  });

  // Cache para datos históricos
  let historyCache: { data: any[]; timestamp: number } | null = null;
  const HISTORY_CACHE_DURATION = 300000; // 5 minutos

  // Proxy endpoint for Bitcoin data using CoinGecko API (daily data - free tier)
  app.get("/api/bitcoin/price-history", async (req, res) => {
    try {
      // Verificar cache primero
      if (historyCache && Date.now() - historyCache.timestamp < HISTORY_CACHE_DURATION) {
        res.json(historyCache.data);
        return;
      }

      // CoinGecko API para obtener datos históricos de Bitcoin (sin interval=hourly)
      const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30`;
      
      const response = await fetch(coinGeckoUrl);
      if (!response.ok) {
        // Si hay rate limiting, usar cache si existe
        if (response.status === 429 && historyCache) {
          res.json(historyCache.data);
          return;
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error("Invalid data format from CoinGecko");
      }
      
      // Transformar datos al formato esperado (similar a Binance klines)
      // Tomar los últimos 100 puntos de datos
      const klines = data.prices.slice(-100).map((price: any) => [
        price[0], // timestamp
        price[1].toString(), // open (usar precio actual)
        price[1].toString(), // high
        price[1].toString(), // low
        price[1].toString(), // close
        "1000", // volume (simulado)
        price[0] + 3600000 // close time (1 hora después)
      ]);
      
      // Actualizar cache
      historyCache = {
        data: klines,
        timestamp: Date.now()
      };
      
      res.json(klines);
    } catch (error) {
      console.error("Error fetching Bitcoin data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Cache para reducir llamadas a la API
  let priceCache: { price: number; timestamp: number } | null = null;
  const CACHE_DURATION = 60000; // 1 minuto

  app.get("/api/bitcoin/current-price", async (req, res) => {
    try {
      // Verificar cache primero
      if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
        res.json({
          symbol: "BTCUSD",
          price: priceCache.price.toString()
        });
        return;
      }

      // CoinGecko API para precio actual con rate limiting
      const coinGeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
      
      const response = await fetch(coinGeckoUrl);
      if (!response.ok) {
        // Si hay error de rate limiting, usar precio del cache de historial
        if (response.status === 429 && priceCache) {
          res.json({
            symbol: "BTCUSD",
            price: priceCache.price.toString()
          });
          return;
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      const price = data.bitcoin.usd;
      
      // Actualizar cache
      priceCache = {
        price: price,
        timestamp: Date.now()
      };
      
      // Transformar al formato esperado
      res.json({
        symbol: "BTCUSD",
        price: price.toString()
      });
    } catch (error) {
      console.error("Error fetching Bitcoin price:", error);
      res.status(500).json({ error: "Failed to fetch price data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
