import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle } from 'lucide-react';

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (recipient: string, amount: number) => Promise<boolean>;
  balance: number;
}

export function SendModal({ open, onClose, onSend, balance }: SendModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipient.trim()) {
      setError('Ingresa un address de destino');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    if (amountNum > balance) {
      setError('Saldo insuficiente');
      return;
    }

    setLoading(true);
    const success = await onSend(recipient.trim(), amountNum);
    setLoading(false);

    if (success) {
      setRecipient('');
      setAmount('');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRecipient('');
      setAmount('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="w-5 h-5 text-violet-400" />
            Enviar VLC
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Address de Destino</Label>
            <Input
              placeholder="a1b2c3d4..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 font-mono"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-slate-300">Cantidad</Label>
              <span className="text-xs text-slate-500">
                Disponible: {balance.toLocaleString()} VLC
              </span>
            </div>
            <Input
              type="number"
              step="0.000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
