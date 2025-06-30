import { useState, useEffect } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'predictor' | 'strategy' | 'accuracy';
  title: string;
  content: string;
  timestamp: number;
  minimized: boolean;
}

export default function MessageControl() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  
  // Simular mensajes del sistema
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 'pred_1',
        type: 'predictor',
        title: '🎯 Predicción +1%',
        content: 'RSI 68.2 • Probabilidad 75% • ETA 22:45',
        timestamp: Date.now(),
        minimized: false
      }
    ];
    
    setMessages(initialMessages);
    setActiveMessage(initialMessages[0]);
  }, []);

  const minimizeMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, minimized: true } : msg
    ));
    setActiveMessage(null);
  };

  const restoreMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, minimized: false } : msg
      ));
      setActiveMessage({ ...message, minimized: false });
    }
  };

  const dismissMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (activeMessage?.id === messageId) {
      setActiveMessage(null);
    }
  };

  const minimizedMessages = messages.filter(msg => msg.minimized);

  return (
    <>
      {/* Barra superior de mensajes minimizados */}
      {minimizedMessages.length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-trading-darker/95 backdrop-blur border-b border-zinc-700 p-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-zinc-400 whitespace-nowrap mr-2">Mensajes:</span>
            {minimizedMessages.map(msg => (
              <button
                key={msg.id}
                onClick={() => restoreMessage(msg.id)}
                className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 px-3 py-1 rounded text-xs text-zinc-300 border border-zinc-600 whitespace-nowrap transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                {msg.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje activo flotante */}
      {activeMessage && !activeMessage.minimized && (
        <div className="fixed bottom-6 right-6 z-40 bg-trading-darker border border-zinc-700 rounded-lg shadow-2xl max-w-sm animate-in slide-in-from-bottom-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white text-sm">{activeMessage.title}</h4>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => minimizeMessage(activeMessage.id)}
                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                  title="📥 Minimizar"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => dismissMessage(activeMessage.id)}
                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition-colors"
                  title="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{activeMessage.content}</p>
            <div className="mt-2 text-xs text-zinc-500">
              {new Date(activeMessage.timestamp).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}