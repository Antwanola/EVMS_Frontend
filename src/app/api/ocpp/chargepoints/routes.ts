import { NextRequest, NextResponse } from 'next/server';
import { ChargePoint } from '../../../types/ocpp';
import { ApiResponse, ApiError } from '../../../types/ocpp';

const BACKEND_URL = process.env.OCPP_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ChargePoint[]> | ApiError>> {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/chargepoints${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json<ApiError>(
        { error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data: ChargePoint[] = await response.json();
    return NextResponse.json<ApiResponse<ChargePoint[]>>({
      data,
      success: true
    });
  } catch (error) {
    console.error('OCPP API Error:', error);
    return NextResponse.json<ApiError>(
      { 
        error: 'Failed to fetch charge points', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ChargePoint> | ApiError>> {
  try {
    const body: Partial<ChargePoint> = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/chargepoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      return NextResponse.json<ApiError>(
        { error: `Failed to create charge point: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data: ChargePoint = await response.json();
    return NextResponse.json<ApiResponse<ChargePoint>>({
      data,
      success: true
    });
  } catch (error) {
    console.error('OCPP API Error:', error);
    return NextResponse.json<ApiError>(
      { error: 'Failed to create charge point' },
      { status: 500 }
    );
  }
}