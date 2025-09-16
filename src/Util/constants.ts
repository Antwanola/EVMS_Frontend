import { ChargePointStatus, ConnectorStatus, TransactionStatus, OCPPCommand } from '@/types/ocpp';

export const OCPP_STATUS = ChargePointStatus;
export const CONNECTOR_STATUS = ConnectorStatus;  
export const TRANSACTION_STATUS = TransactionStatus;
export const OCPP_COMMANDS = OCPPCommand;

export const STATUS_COLORS = {
  [ChargePointStatus.AVAILABLE]: 'green',
  [ChargePointStatus.CHARGING]: 'blue',
  [ChargePointStatus.FAULTED]: 'red',
  [ChargePointStatus.UNAVAILABLE]: 'gray',
  [ChargePointStatus.PREPARING]: 'yellow',
  [ChargePointStatus.SUSPENDED_EVSE]: 'orange',
  [ChargePointStatus.SUSPENDED_EV]: 'orange',
  [ChargePointStatus.FINISHING]: 'purple',
  [ChargePointStatus.RESERVED]: 'indigo'
} as const;

export const REFRESH_INTERVALS = {
  FAST: 5000,
  NORMAL: 30000,
  SLOW: 60000
} as const;