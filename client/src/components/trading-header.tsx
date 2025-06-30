import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TradingHeader() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'America/La_Paz'
      };
      const timeStr = now.toLocaleTimeString('es-BO', options) + ' BOT';
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-trading-surface border-b border-trading-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <h1 className="text-xl font-bold text-white">BTCUSDT Tracker</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-trading-success rounded-full animate-pulse"></span>
              <span className="text-slate-400">En vivo</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-slate-400">
              <span>{currentTime}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
