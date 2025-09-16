import { ChargePoint, Transaction } from '@/app/types/ocpp';

export function formatEnergy(kWh: number): string {
  return `${kWh.toFixed(1)} kWh`;
}

export function formatPower(kW: number): string {
  return `${kW.toFixed(1)} kW`;
}

export function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'charging':
      return 'bg-blue-100 text-blue-800';
    case 'faulted':
      return 'bg-red-100 text-red-800';
    case 'unavailable':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}