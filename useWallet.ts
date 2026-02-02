import { useState, useEffect, useCallback } from 'react';
import type { Wallet, Transaction } from '@/types/wallet';
import { generateWallet, importWallet, getBalance, sendTransaction } from '@/lib/crypto';

const WALLET_KEY = 'velcoin_wallet';
const HISTORY_KEY = 'velcoin_history';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem(WALLET_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet));
      } catch (e) {
        console.error('Error parsing wallet:', e);
      }
    }
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  // Save wallet to localStorage
  const saveWallet = useCallback((newWallet: Wallet | null) => {
    if (newWallet) {
      localStorage.setItem(WALLET_KEY, JSON.stringify(newWallet));
    } else {
      localStorage.removeItem(WALLET_KEY);
    }
    setWallet(newWallet);
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: Transaction[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  }, []);

  // Create new wallet
  const createWallet = useCallback(() => {
    const newWallet = generateWallet();
    saveWallet(newWallet);
    return newWallet;
  }, [saveWallet]);

  // Import existing wallet
  const importExistingWallet = useCallback((privateKey: string, address: string): boolean => {
    const imported = importWallet(privateKey, address);
    if (imported) {
      saveWallet(imported);
      return true;
    }
    return false;
  }, [saveWallet]);

  // Logout wallet
  const logout = useCallback(() => {
    saveWallet(null);
    setBalance(null);
  }, [saveWallet]);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    const bal = await getBalance(wallet.address);
    setBalance(bal);
    setLoading(false);
  }, [wallet]);

  // Send VLC
  const sendVLC = useCallback(async (recipient: string, amount: number): Promise<{ success: boolean; message?: string; txHash?: string }> => {
    if (!wallet) return { success: false, message: 'No wallet connected' };
    
    setLoading(true);
    const result = await sendTransaction(wallet, recipient, amount);
    
    if (result.success && result.txHash) {
      const newTx: Transaction = {
        tx_hash: result.txHash,
        from: wallet.address,
        to: recipient,
        amount: amount,
        timestamp: Date.now() / 1000
      };
      saveHistory([newTx, ...history]);
    }
    
    setLoading(false);
    return result;
  }, [wallet, history, saveHistory]);

  // Clear history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return {
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
  };
}
