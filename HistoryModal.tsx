import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import type { Transaction } from '@/types/wallet';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: Transaction[];
  onClear: () => void;
}

export function HistoryModal({ open, onClose, history, onClear }: HistoryModalProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
  };

  const formatHash = (hash: string) => {
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const handleClear = () => {
    if (confirm('¿Estás seguro de que quieres borrar el historial?')) {
      onClear();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <History className="w-5 h-5 text-violet-400" />
            Historial
          </DialogTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Borrar
            </Button>
          )}
        </DialogHeader>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No hay transacciones aún</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-3">
              {history.map((tx, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">
                      {formatDate(tx.timestamp)}
                    </span>
                    <span className="text-violet-400 font-medium">
                      {tx.amount.toLocaleString()} VLC
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <span className="font-mono">{formatAddress(tx.from)}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span className="font-mono">{formatAddress(tx.to)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      Hash: {formatHash(tx.tx_hash)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(tx.tx_hash)}
                      className="h-6 text-slate-500 hover:text-white"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <Button
          onClick={onClose}
          className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white"
        >
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
