import TradingHeader from "@/components/trading-header";
import TradingViewWidgets from "@/components/tradingview-widgets";
import ActionZonesTable from "@/components/action-zones-table";
import TradingPanel from "@/components/trading-panel";
import MobileNav from "@/components/mobile-nav";
import PredictorAlert from "@/components/predictor-alert";
import AccuracyTracker from "@/components/accuracy-tracker";
import StrategyPanel from "@/components/strategy-panel";
import StrategyEvaluator from "@/components/strategy-evaluator";
import TacticalNotes from "@/components/tactical-notes";
import MessageControl from "@/components/message-control";
import TechnicalIndicators from "@/components/technical-indicators";

export default function Home() {
  return (
    <div className="min-h-screen bg-trading-dark text-slate-100 font-sans antialiased">
      <TradingHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
        <TradingViewWidgets />
        
        <StrategyPanel />
        
        <TacticalNotes />
        
        <TechnicalIndicators />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActionZonesTable />
          </div>
          <div>
            <TradingPanel />
          </div>
        </div>
      </main>
      
      <MobileNav />
      <AccuracyTracker />
      <StrategyEvaluator />
      <MessageControl />
      <PredictorAlert />
    </div>
  );
}
