import { ChargePoint, Transaction, OCPPCommand, OCPPCommandPayload, userObject } from '@/app/types/ocpp';
import { ApiResponse, ApiError, SystemStatus } from '@/app/types/ocpp';

class ApiClient {
  constructor(private baseURL: string = 'https://evms.folti.io') { }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${config.method || 'GET'} ${url}):`, error);
      throw error;
    }
  }

  async signin<T>(email: string, password: string): Promise<T> {
    return this.post<T>("/api/v1/auth/login", { email, password });
  }

  async signout<T>(): Promise<T> {
    return this.post<T>("/api/v1/auth/logout");
  }

  async getCurrentUser<T>(): Promise<T> {
    return this.get<T>("/api/v1/auth/me");
  }


  async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const searchParams = new URLSearchParams(params).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }


}

export const apiClient = new ApiClient();

// OCPP-specific API methods with strong typing
export const ocppApi = {
  // Charge Points
  getChargePoints: (params: Record<string, string> = {}): Promise<ApiResponse<ChargePoint[]>> =>
    apiClient.get('/api/v1/charge-points', params),

  getChargePoint: (): Promise<ApiResponse<ChargePoint>> =>
    apiClient.get(`/api/v1/charge-points`),

  getSingleChargePoint: (id: string): Promise<ApiResponse<ChargePoint>> => apiClient.get(`/api/v1/charge-points/${id}`),

  addChargePoint: (data: Partial<ChargePoint>): Promise<ApiResponse<ChargePoint>> =>
    apiClient.post('/api/v1/charge-points', data),

  // Remote Commands with type safety
  sendCommand: <T extends OCPPCommand>(
    chargePointId: string,
    command: T,
    params: OCPPCommandPayload[T]
  ): Promise<ApiResponse<any>> => apiClient.post(`/api/v1/charge-points/${chargePointId}/commands/${command}`, params),

  // Transactions
  getTransactions: (filters: Record<string, string> = {}): Promise<ApiResponse<Transaction[]>> =>
    apiClient.get('/api/v1/transactions', filters),

  getTransaction: (id: string): Promise<ApiResponse<Transaction>> =>
    apiClient.get(`/api/v1/transactions/${id}`),

  // System
  getSystemStatus: (): Promise<ApiResponse<SystemStatus>> =>
    apiClient.get('/api/v1/status'),
};


export const authApi = {
  signin: (email: string, password: string) =>
    apiClient.signin<{ success: boolean; data:{token: string, user: userObject} }>(email, password),

  signout: () =>
    apiClient.signout<{ success: boolean }>(),

  getCurrentUser: () =>
    apiClient.getCurrentUser<{ user: any }>(),
};
