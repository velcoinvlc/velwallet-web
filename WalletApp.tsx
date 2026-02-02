import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WelcomeScreen } from './WelcomeScreen';
import { WalletDashboard } from './WalletDashboard';
import { SendModal } from './SendModal';
import { HistoryModal } from './HistoryModal';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export function WalletApp() {
  const {
    wallet,
    balance,
    history,
    loading,
    createWallet,
    importExistingWallet,
    logout,
    fetchBalance,
    sendVLC,
    clearHistory
  } = useWallet();

  const [showSend, setShowSend] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Auto-refresh balance every 30 seconds when wallet is connected
  useEffect(() => {
    if (!wallet) return;
    
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet, fetchBalance]);

  const handleCreateWallet = () => {
    const newWallet = createWallet();
    toast.success('Wallet creada exitosamente', {
      description: `Address: ${newWallet.address.substring(0, 12)}...`
    });
  };

  const handleImportWallet = (privateKey: string, address: string) => {
    const success = importExistingWallet(privateKey, address);
    if (success) {
      toast.success('Wallet importada exitosamente');
    } else {
      toast.error('Error al importar wallet', {
        description: 'Verifica que la private key sea válida'
      });
    }
    return success;
  };

  const handleSend = async (recipient: string, amount: number) => {
    const result = await sendVLC(recipient, amount);
    if (result.success) {
      toast.success('Transacción enviada', {
        description: `Hash: ${result.txHash?.substring(0, 16)}...`
      });
      setShowSend(false);
      fetchBalance();
    } else {
      toast.error('Error al enviar', {
        description: result.message
      });
    }
    return result.success;
  };

  const handleLogout = () => {
    logout();
    toast.info('Wallet desconectada');
  };

  if (!wallet) {
    return (
      <>
        <WelcomeScreen 
          onCreateWallet={handleCreateWallet}
          onImportWallet={handleImportWallet}
        />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <WalletDashboard
        wallet={wallet}
        balance={balance}
        loading={loading}
        onRefresh={fetchBalance}
        onSend={() => setShowSend(true)}
        onHistory={() => setShowHistory(true)}
        onLogout={handleLogout}
      />
      
      <SendModal
        open={showSend}
        onClose={() => setShowSend(false)}
        onSend={handleSend}
        balance={balance || 0}
      />

      <HistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onClear={clearHistory}
      />

      <Toaster position="top-center" />
    </>
  );
}
