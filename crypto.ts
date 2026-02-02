import { ec as EC } from 'elliptic';
import CryptoJS from 'crypto-js';
import type { Wallet, TransferPayload } from '@/types/wallet';

const ec = new EC('secp256k1');
const NODE_URL = 'https://velcoin.onrender.com';

export function generateWallet(): Wallet {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');
  const address = CryptoJS.SHA256(publicKey).toString().substring(0, 40);

  return {
    private_key: privateKey,
    public_key: publicKey,
    address: address
  };
}

export function importWallet(privateKeyHex: string, addressHex: string): Wallet | null {
  try {
    const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
    const publicKey = keyPair.getPublic('hex');
    
    return {
      private_key: privateKeyHex,
      public_key: publicKey,
      address: addressHex
    };
  } catch (error) {
    console.error('Error importing wallet:', error);
    return null;
  }
}

export function signTransaction(wallet: Wallet, recipient: string, amount: number): string {
  const keyPair = ec.keyFromPrivate(wallet.private_key, 'hex');
  const msg = `${wallet.address}->${recipient}:${amount}`;
  const msgHash = CryptoJS.SHA256(msg).toString();
  const signature = keyPair.sign(msgHash, 'hex');
  return signature.toDER('hex');
}

export async function getBalance(address: string): Promise<number | null> {
  try {
    const response = await fetch(`${NODE_URL}/balance/${address}`);
    const data = await response.json();
    return data.balance ?? null;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

export async function sendTransaction(
  wallet: Wallet, 
  recipient: string, 
  amount: number
): Promise<{ success: boolean; txHash?: string; message?: string }> {
  try {
    const signature = signTransaction(wallet, recipient, amount);
    
    const payload: TransferPayload = {
      from: wallet.address,
      to: recipient,
      amount: amount,
      signature: signature,
      public_key: wallet.public_key
    };

    const response = await fetch(`${NODE_URL}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, txHash: data.tx_hash };
    } else {
      return { success: false, message: data.message || data.error };
    }
  } catch (error) {
    console.error('Error sending transaction:', error);
    return { success: false, message: 'No se pudo contactar el nodo' };
  }
}
