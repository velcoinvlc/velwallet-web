import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  History, 
  LogOut, 
  RefreshCw, 
  Copy, 
  Check,
  Eye,
  EyeOff,
  Wallet
} from 'lucide-react';
import type { Wallet as WalletType } from '@/types/wallet';

interface WalletDashboardProps {
  wallet: WalletType;
  balance: number | null;
  loading: boolean;
  onRefresh: () => void;
  onSend: () => void;
  onHistory: () => void;
  onLogout: () => void;
}

export function WalletDashboard({ 
  wallet, 
  balance, 
  loading, 
  onRefresh, 
  onSend, 
  onHistory, 
  onLogout 
}: WalletDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(wallet.private_key);
  };

  const formatAddress = (addr: string) => {
    if (addr.length <= 16) return addr;
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">VelCoin</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="border-violet-500/30 bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative">
            <p className="text-slate-400 text-sm mb-1">Balance Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                {balance !== null ? balance.toLocaleString() : '---'}
              </span>
              <span className="text-violet-400 font-medium">VLC</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="mt-4 text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border-slate-700 bg-slate-800/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Tu Address</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-8 text-slate-400 hover:text-white"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="font-mono text-sm text-white break-all bg-slate-900/50 p-3 rounded-lg">
              {wallet.address}
            </p>
          </CardContent>
        </Card>

        {/* Private Key (Hidden) */}
        <Card className="border-amber-500/30 bg-amber-500/5 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-400 flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                Private Key
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="h-8 text-slate-400 hover:text-white"
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                {showPrivateKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPrivateKey}
                    className="h-8 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className={`font-mono text-sm break-all bg-slate-900/50 p-3 rounded-lg ${showPrivateKey ? 'text-amber-400' : 'text-slate-600'}`}>
              {showPrivateKey ? wallet.private_key : '•'.repeat(64)}
            </p>
            <p className="text-xs text-amber-500/70 mt-2">
              ¡Nunca compartas tu private key!
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onSend}
            className="h-16 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar
          </Button>
          <Button
            onClick={onHistory}
            variant="outline"
            className="h-16 border-slate-600 text-white hover:bg-slate-800 text-lg"
          >
            <History className="w-5 h-5 mr-2" />
            Historial
          </Button>
        </div>

        {/* Public Key Info */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Public Key: {formatAddress(wallet.public_key)}
          </p>
        </div>
      </main>
    </div>
  );
}
