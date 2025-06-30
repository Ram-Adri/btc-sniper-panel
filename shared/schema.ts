import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tradingLevels = pgTable("trading_levels", {
  id: serial("id").primaryKey(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'support', 'resistance', 'entry'
  description: text("description").notNull(),
  action: text("action").notNull(),
  status: text("status").notNull().default("monitoring"), // 'monitoring', 'active', 'triggered'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  btcAmount: decimal("btc_amount", { precision: 10, scale: 8 }).notNull().default("0"),
  entryPrice: decimal("entry_price", { precision: 10, scale: 2 }),
  totalInvested: decimal("total_invested", { precision: 10, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }).notNull(),
  direction: text("direction").notNull(), // 'above', 'below'
  message: text("message").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  triggered: boolean("triggered").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().default("BTCUSDT"),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  rsi: decimal("rsi", { precision: 5, scale: 2 }),
  macd: decimal("macd", { precision: 10, scale: 2 }),
  volume24h: text("volume_24h"),
  volatility: decimal("volatility", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTradingLevelSchema = createInsertSchema(tradingLevels).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolio).omit({
  id: true,
  updatedAt: true,
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
  triggered: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  updatedAt: true,
});

export type TradingLevel = typeof tradingLevels.$inferSelect;
export type InsertTradingLevel = z.infer<typeof insertTradingLevelSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
