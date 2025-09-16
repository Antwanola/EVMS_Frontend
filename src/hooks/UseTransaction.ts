'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/app/types/ocpp';
import { ApiResponse } from '@/app/types/ocpp';
import { ocppApi } from '@/app/lib/api';

interface UseTransactionsOptions {
  filters?: Record<string, string>;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const { filters = {}, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response: ApiResponse<Transaction[]> = await ocppApi.getTransactions(filters);
      
      const validatedData = Array.isArray(response.data) ? response.data : [];
      setTransactions(validatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      console.error('Error fetching transactions:', err);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchTransactions, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  };
}