import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Portfolio, InsertPortfolio } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, TrendingDown, DollarSign, Target, BookOpen, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBinanceData } from '@/hooks/use-binance-data';

interface ActiveStrategy {
  objetivo: number;
  eta: string;
  comentario: string;
  probabilidad: number;
  isActive: boolean;
}

export default function TradingPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tacticalNotes, setTacticalNotes] = useState("");
  const [activeStrategy, setActiveStrategy] = useState<ActiveStrategy | null>(null);
  const { currentPrice } = useBinanceData();

  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ['/api/portfolio'],
  });

  // Cargar estrategia activa desde localStorage
  useEffect(() => {
    const estrategias = JSON.parse(localStorage.getItem("estrategiasIA") || "[]");
    const estrategiaActiva = estrategias.find((e: any) => !e.evaluado);
    
    if (estrategiaActiva) {
      const eta = new Date(Date.now() + estrategiaActiva.etaMinutos * 60 * 1000);
      setActiveStrategy({
        objetivo: estrategiaActiva.target,
        eta: eta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        comentario: estrategiaActiva.comentario,
        probabilidad: estrategiaActiva.probabilidad || 75,
        isActive: true
      });
    }
  }, []);

  const updatePortfolioMutation = useMutation({
    mutationFn: (data: InsertPortfolio) => 
      apiRequest('/api/portfolio', { method: 'PUT' }, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      toast({
        title: "Portfolio actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    },
  });

  const saveNotes = () => {
    if (portfolio) {
      updatePortfolioMutation.mutate({
        btcAmount: portfolio.btcAmount,
        entryPrice: portfolio.entryPrice || "0",
        totalInvested: "100000" // Valor simulado
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-trading-surface border-trading-border">
          <CardHeader>
            <CardTitle className="text-white">Panel de Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-20 bg-slate-700 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <Card className="bg-trading-surface border-trading-border">
        <CardHeader>
          <CardTitle className="text-white">Panel de Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">No se encontraron datos del portfolio</p>
        </CardContent>
      </Card>
    );
  }

  const currentValue = parseFloat(portfolio.btcAmount) * currentPrice;
  const entryValue = parseFloat(portfolio.btcAmount) * parseFloat(portfolio.entryPrice || "0");
  const pnl = currentValue - entryValue;
  const pnlPercentage = (pnl / entryValue) * 100;

  return (
    <div className="space-y-6">
      {/* Resumen de Estrategia Activa */}
      {activeStrategy && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-400" />
              <span>Estrategia Activa IA</span>
              <Badge className="bg-green-900/50 text-green-300 border border-green-600">
                {activeStrategy.probabilidad}% prob
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Objetivo +1%</p>
                <p className="text-green-400 font-mono text-lg font-bold">
                  ${activeStrategy.objetivo.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ETA estimado
                </p>
                <p className="text-blue-400 font-mono text-lg font-bold">
                  {activeStrategy.eta}
                </p>
              </div>
            </div>
            
            <div className="bg-trading-darker p-3 rounded border border-zinc-700">
              <p className="text-slate-300 text-sm">
                <span className="text-yellow-400 font-medium">💡 Comentario IA:</span> {activeStrategy.comentario}
              </p>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Distancia al objetivo: {((activeStrategy.objetivo - currentPrice) / currentPrice * 100).toFixed(2)}%</span>
              <span>Estado: Monitoreo activo</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-trading-surface border-trading-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-trading-accent" />
            <span>Portfolio BTC</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Holdings</p>
              <p className="text-white font-mono text-lg">{portfolio.btcAmount} BTC</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Precio de Entrada</p>
              <p className="text-white font-mono text-lg">${parseFloat(portfolio.entryPrice || "0").toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t border-trading-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">P&L Total</span>
              <div className="flex items-center space-x-2">
                {pnl >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-mono text-lg ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${pnl.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Retorno</span>
              <Badge className={`${pnl >= 0 ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-trading-surface border-trading-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-trading-accent" />
            <span>Notas Tácticas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Anota tus observaciones del mercado, estrategias y decisiones..."
            value={tacticalNotes}
            onChange={(e) => setTacticalNotes(e.target.value)}
            className="min-h-[100px] bg-trading-dark border-trading-border text-white placeholder:text-slate-500"
          />
          <Button 
            onClick={saveNotes}
            disabled={updatePortfolioMutation.isPending}
            className="mt-3 w-full bg-trading-accent hover:bg-trading-accent/80 text-black"
          >
            {updatePortfolioMutation.isPending ? 'Guardando...' : 'Guardar Notas'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}