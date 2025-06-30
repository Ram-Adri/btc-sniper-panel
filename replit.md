# BTCUSDT Tracker - Replit Configuration

## Overview

This is a full-stack cryptocurrency tracking application specifically designed for monitoring BTCUSDT trading pairs. The application provides real-time market data, trading level management, portfolio tracking, and price alerts with a professional trading interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom trading-specific color scheme
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with proper error handling
- **Session Storage**: PostgreSQL-based session storage

### Key Components

#### Database Schema
- **Trading Levels**: Store support/resistance levels and entry points
- **Portfolio**: Track BTC holdings and investment performance
- **Price Alerts**: Manage price-based notifications
- **Market Data**: Store real-time market indicators (price, RSI, MACD, volume)

#### Frontend Components
- **TradingView Integration**: Embedded widgets for professional charting
- **Action Zones Table**: Interactive trading levels management
- **Trading Panel**: Portfolio overview and tactical notes
- **Mobile Navigation**: Responsive mobile-first design
- **Real-time Updates**: Live price tracking and market data

#### API Endpoints
- `GET/POST/PUT/DELETE /api/trading-levels` - Trading level management
- `GET/PUT /api/portfolio` - Portfolio data operations
- `GET/POST/PUT/DELETE /api/price-alerts` - Price alert management
- `GET/PUT /api/market-data` - Market data retrieval and updates

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and validate data
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Delivery**: JSON responses sent back to client
5. **UI Updates**: React components re-render with new data
6. **Real-time Updates**: Periodic polling for live market data

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool with HMR and optimization
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production

### Trading-Specific Features
- **TradingView Widgets**: Professional charting integration
- **Real-time Data**: Live BTCUSDT price tracking
- **Technical Indicators**: RSI, MACD, and volume analysis
- **Responsive Design**: Mobile-optimized trading interface

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: Node.js with tsx for TypeScript execution
- **Database**: Neon Database with connection pooling
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles server code for Node.js
- **Database**: Drizzle migrations for schema management
- **Static Assets**: Served through Express static middleware

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes

## Recent Changes

### June 30, 2025 - Real-time Bitcoin Integration & Accuracy Tracking
- Implemented real-time Bitcoin data connection using CoinGecko API
- Added backend proxy endpoints to handle CORS for external API calls
- Created automatic prediction accuracy tracking system with 30-minute evaluation window  
- Built prediction history storage using localStorage for persistence
- Integrated authentic Bitcoin price data with RSI calculation and technical analysis
- Added visual accuracy panel showing cumulative success percentage
- Resolved API connection issues by switching from blocked Binance API to working CoinGecko endpoints

### June 30, 2025 - Complete Tactical Trading System Implementation
- **Dynamic Action Zones**: Replaced static table with intelligent dynamic zones (Objective +1%, Projected Entry, Active Monitoring, Technical Support)
- **Advanced Technical Analysis**: Integrated RSI, MACD simulation, volume analysis, and momentum calculations with real-time updates
- **Tactical Notes Panel**: Dynamic technical summary with RSI status, MACD signals, momentum analysis, and next evaluation timing
- **Enhanced Strategy Panel**: Active strategy tracking with ETA calculations, probability assessments, and AI-generated tactical comments
- **Strategy Effectiveness Tracking**: Automated evaluation system for +1% strategy success rate with historical performance analytics
- **Message Control System**: Advanced minimize/restore functionality for floating alerts with centralized message management
- **Performance Optimization**: Implemented comprehensive caching system to handle API rate limits efficiently
- **Training Data Collection**: Systematic recording of strategy launches with success/failure tracking for future AI model training

### Architecture Updates
- **New API Endpoints**: `/api/bitcoin/price-history` and `/api/bitcoin/current-price` with intelligent caching
- **Enhanced Components**: 
  - ActionZonesTable: Dynamic zone generation with priority-based styling
  - TacticalNotes: Real-time technical analysis summary
  - TechnicalIndicators: Comprehensive indicator dashboard
  - MessageControl: Advanced alert management system
  - StrategyEvaluator: Automated effectiveness tracking
- **Data Flow**: Real Bitcoin prices → Technical analysis → Dynamic zones → Strategy evaluation → Performance tracking
- **Storage Strategy**: localStorage for predictions and strategies with automatic cleanup and persistence
- **Caching Strategy**: Multi-level caching (1min price, 5min history) to optimize API usage and reduce rate limiting

## Changelog
- June 30, 2025. Initial setup with TradingView integration
- June 30, 2025. Added real-time Bitcoin data and prediction accuracy tracking

## User Preferences

Preferred communication style: Simple, everyday language.
Request focus: Registro real de cada predicción, comparación automática con precio futuro, porcentaje de aciertos actualizable en vivo, base para futura red neuronal entrenable.