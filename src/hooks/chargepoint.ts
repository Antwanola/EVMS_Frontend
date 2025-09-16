'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChargePoint, OCPPCommand, OCPPCommandPayload } from '@/app/types/ocpp';
import { ApiResponse } from '@/app/types/ocpp';
import { ocppApi } from '@/app/lib/api';

interface UseChargePointsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseChargePointsReturn {
  chargePoints: ChargePoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  sendCommand: <T extends OCPPCommand>(
    chargePointId: string, 
    command: T, 
    params: OCPPCommandPayload[T]
  ) => Promise<void>;
}

export function useChargePoints(options: UseChargePointsOptions = {}): UseChargePointsReturn {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChargePoints = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response: ApiResponse<ChargePoint[]> = await ocppApi.getChargePoints();
      
      // Ensure data is array and has expected structure
      const validatedData = Array.isArray(response.data) ? response.data : [];
      setChargePoints(validatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch charge points';
      console.error('Error fetching charge points:', err);
      setError(errorMessage);
      setChargePoints([]); // Reset on error
    } finally {
      setLoading(false);
    }
  }, []);

  const sendCommand = useCallback(async <T extends OCPPCommand>(
    chargePointId: string, 
    command: T, 
    params: OCPPCommandPayload[T]
  ): Promise<void> => {
    try {
      await ocppApi.sendCommand(chargePointId, command, params);
      // Refresh data after successful command
      await fetchChargePoints();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send command';
      console.error('Error sending command:', err);
      setError(errorMessage);
      throw err; // Re-throw so UI can handle it
    }
  }, [fetchChargePoints]);

  useEffect(() => {
    fetchChargePoints();
  }, [fetchChargePoints]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchChargePoints, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchChargePoints]);

  return {
    chargePoints,
    loading,
    error,
    refetch: fetchChargePoints,
    sendCommand
  };
}
