export enum ChargePointStatus {
  AVAILABLE = 'Available',
  PREPARING = 'Preparing',
  CHARGING = 'Charging',
  SUSPENDED_EVSE = 'SuspendedEVSE',
  SUSPENDED_EV = 'SuspendedEV',
  FINISHING = 'Finishing',
  RESERVED = 'Reserved',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted'
}

export enum IsConnected {
  CONNECTED = "true",
  OFFLINE = "false"
}

export enum ConnectorStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  RESERVED = 'Reserved',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted'
}

export enum TransactionStatus {
  CHARGING = 'Charging',
  STOPPED = 'Stopped',
  SUSPENDED = 'Suspended'
}

export enum OCPPCommand {
  UNLOCK_CONNECTOR = 'UnlockConnector',
  RESET = 'Reset',
  REMOTE_START_TRANSACTION = 'RemoteStartTransaction',
  REMOTE_STOP_TRANSACTION = 'RemoteStopTransaction',
  GET_CONFIGURATION = 'GetConfiguration',
  CHANGE_CONFIGURATION = 'ChangeConfiguration',
  CLEAR_CACHE = 'ClearCache'
}

export interface ChargePoint {
  id: string;
  status: ChargePointStatus;
  connectorStatus: ConnectorStatus;
  location: string;
  lastHeartbeat: string;
  isOnline: boolean;
  currentPower: number;
  totalEnergy: number;
  connectorId?: number;
  vendorId?: string;
  model?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  isConnected?: boolean
}

export interface Transaction {
  id: string;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  startTime: string;
  stopTime?: string;
  meterStart: number;
  meterStop?: number;
  meterNow?: number;
  status: TransactionStatus;
  reason?: string;
  reservationId?: number;
}

export interface OCPPCommandPayload {
  [OCPPCommand.UNLOCK_CONNECTOR]: {
    connectorId: number;
  };
  [OCPPCommand.RESET]: {
    type: 'Hard' | 'Soft';
  };
  [OCPPCommand.REMOTE_START_TRANSACTION]: {
    connectorId?: number;
    idTag: string;
    chargingProfile?: ChargingProfile;
  };
  [OCPPCommand.REMOTE_STOP_TRANSACTION]: {
    transactionId: number;
  };
  [OCPPCommand.GET_CONFIGURATION]: {
    key?: string[];
  };
  [OCPPCommand.CHANGE_CONFIGURATION]: {
    key: string;
    value: string;
  };
  [OCPPCommand.CLEAR_CACHE]: Record<string, never>;
}

export interface ChargingProfile {
  chargingProfileId: number;
  stackLevel: number;
  chargingProfilePurpose: 'ChargePointMaxProfile' | 'TxDefaultProfile' | 'TxProfile';
  chargingProfileKind: 'Absolute' | 'Recurring' | 'Relative';
  recurrencyKind?: 'Daily' | 'Weekly';
  validFrom?: string;
  validTo?: string;
  chargingSchedule: ChargingSchedule;
}

export interface ChargingSchedule {
  duration?: number;
  startSchedule?: string;
  chargingRateUnit: 'W' | 'A';
  chargingSchedulePeriod: ChargingSchedulePeriod[];
}

export interface ChargingSchedulePeriod {
  startPeriod: number;
  limit: number;
  numberPhases?: number;
}

// ---

// src/types/api.ts - API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SystemStatus {
  websocketServer: 'online' | 'offline';
  database: 'connected' | 'disconnected';
  apiServer: 'running' | 'stopped';
  connectedChargePoints: number;
  lastUpdated: string;
}
