export interface Wallet {
  private_key: string;
  public_key: string;
  address: string;
}

export interface Transaction {
  tx_hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

export interface TransferPayload {
  from: string;
  to: string;
  amount: number;
  signature: string;
  public_key: string;
}

export interface BalanceResponse {
  balance?: number;
  address?: string;
  error?: string;
}

export interface TransferResponse {
  status?: string;
  tx_hash?: string;
  message?: string;
  error?: string;
}
