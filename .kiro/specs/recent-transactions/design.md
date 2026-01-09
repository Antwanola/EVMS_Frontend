# Recent Transactions Feature Design

## Overview

The Recent Transactions feature provides a streamlined API endpoint and dashboard widget to display the 5 most recent charging transactions in the EV charging management system. This feature enhances user experience by offering immediate visibility into recent charging activities without requiring navigation through paginated transaction lists.

The feature consists of two main components:
1. A backend API endpoint that efficiently retrieves the 5 most recent transactions
2. A frontend dashboard widget that displays these transactions with automatic refresh capabilities

## Architecture

The feature follows the existing system architecture patterns:

```
Frontend (React/Next.js)
├── RecentTransactionsWidget (Dashboard Component)
├── API Client (Extended ocppApi)
└── Types (Extended Transaction interfaces)

Backend API
├── GET /api/v1/transactions/recent
├── Transaction Service Layer
└── Database Query Layer
```

The implementation leverages the existing `ocppApi` client pattern and extends the current transaction management system with a specialized endpoint optimized for recent transaction retrieval.

## Components and Interfaces

### API Layer

**New API Endpoint:**
- `GET /api/v1/transactions/recent`
- Returns: `ApiResponse<RecentTransaction[]>`
- Query Parameters: None (always returns exactly 5 most recent)
- Authentication: Required (existing Bearer token system)

**Extended API Client:**
```typescript
// Addition to existing ocppApi in src/app/lib/api.ts
getRecentTransactions: (): Promise<ApiResponse<RecentTransaction[]>> =>
  apiClient.get('/api/v1/transactions/recent')
```

### Frontend Components

**RecentTransactionsWidget:**
- Location: `src/app/components/RecentTransactionsWidget.tsx`
- Props: `{ refreshInterval?: number, onError?: (error: Error) => void }`
- Integrates into existing dashboard layout
- Auto-refresh every 30 seconds
- Error handling with retry mechanism

**Dashboard Integration:**
- Replaces the hardcoded "Recent Activity" section in `src/app/dashboard/page.tsx`
- Maintains existing visual design patterns
- Responsive layout consistent with current dashboard components

## Data Models

### RecentTransaction Interface

```typescript
interface RecentTransaction {
  id: string;
  transactionId: number;
  chargePointId: string;
  idTag: string;
  startTimestamp: string;
  stopTimestamp: string | null;
  meterStart: number;
  meterStop: number | null;
  energy: number; // Calculated kWh
  duration: string; // Formatted duration string
  status: "Completed" | "In Progress" | "Failed";
}
```

This interface extends the existing Transaction type with computed fields (energy, duration, status) that are calculated server-side for optimal performance.

### API Response Structure

```typescript
interface RecentTransactionsResponse {
  data: RecentTransaction[];
  success: boolean;
  message?: string;
  timestamp: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Recent transactions ordering and count**
*For any* database state with 5 or more transactions, the Recent_Transactions_API should return exactly 5 transactions ordered by start timestamp in descending order
**Validates: Requirements 1.1**

**Property 2: Response structure completeness**
*For any* valid API response, each transaction should include transaction ID, charge point ID, start timestamp, status, and energy consumption fields
**Validates: Requirements 1.4**

**Property 3: Widget auto-fetch behavior**
*For any* Dashboard_Widget initialization, the widget should automatically trigger a fetch request to the Recent_Transactions_API
**Validates: Requirements 2.1**

**Property 4: Widget display completeness**
*For any* transaction data received by the Dashboard_Widget, all required fields (transaction ID, charge point, start time, status, energy) should be rendered in the UI
**Validates: Requirements 2.2**

**Property 5: Auto-refresh mechanism**
*For any* Dashboard_Widget instance, the refresh timer should be configured to trigger API calls every 30 seconds
**Validates: Requirements 2.5**

## Error Handling

The feature implements comprehensive error handling at multiple layers:

### API Layer Error Handling
- **Database Unavailable (503)**: Returns service unavailable with retry-after header
- **Authentication Failure (401)**: Returns unauthorized with clear error message
- **Malformed Requests (400)**: Returns bad request with validation details
- **Internal Errors (500)**: Returns generic error message while logging detailed error information

### Frontend Error Handling
- **Network Failures**: Display connection error with retry button
- **API Errors**: Show user-friendly error messages based on status codes
- **Loading States**: Display loading indicators during API calls
- **Fallback UI**: Show empty state when no data is available

### Error Recovery
- Automatic retry mechanism with exponential backoff
- Manual retry option for users
- Graceful degradation when API is unavailable
- Error logging for debugging and monitoring

## Testing Strategy

The testing approach combines unit tests for specific scenarios and property-based tests for universal behaviors:

### Unit Testing
- **Specific Examples**: Test empty database response, in-progress transaction display, specific error conditions
- **Edge Cases**: Test scenarios with fewer than 5 transactions, authentication failures, network errors
- **Integration Points**: Test API client integration, component mounting, error boundary behavior

### Property-Based Testing
- **Library**: fast-check (JavaScript/TypeScript property testing library)
- **Configuration**: Minimum 100 iterations per property test
- **Universal Properties**: Test ordering behavior, response structure, auto-refresh mechanism across all valid inputs
- **Generators**: Create smart generators for transaction data, API responses, and component states

**Property-Based Test Requirements:**
- Each property test must run a minimum of 100 iterations
- Each test must be tagged with format: `**Feature: recent-transactions, Property {number}: {property_text}**`
- Tests must validate real functionality without mocks where possible
- Property tests complement unit tests by verifying behavior across many inputs

### Test Organization
- Unit tests: Co-located with source files using `.test.ts` suffix
- Property tests: Separate files using `.property.test.ts` suffix
- Integration tests: Test full API-to-UI data flow
- Error scenario tests: Verify all error handling paths

The dual testing approach ensures both concrete bug detection (unit tests) and general correctness verification (property tests), providing comprehensive coverage of the recent transactions feature.