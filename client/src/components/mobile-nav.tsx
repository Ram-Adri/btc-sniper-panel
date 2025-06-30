import { useState } from "react";
import { BarChart3, Target, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const [activeTab, setActiveTab] = useState("chart");

  const navItems = [
    { id: "chart", label: "Gráfico", icon: BarChart3 },
    { id: "positions", label: "Posiciones", icon: Target },
    { id: "alerts", label: "Alertas", icon: Bell },
    { id: "profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-trading-surface border-t border-trading-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? "text-blue-500" : "text-slate-400"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
