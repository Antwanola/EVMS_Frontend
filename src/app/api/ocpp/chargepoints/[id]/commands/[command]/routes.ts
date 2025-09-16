import { NextRequest, NextResponse } from 'next/server';
import { OCPPCommand, OCPPCommandPayload } from "../../../../../../types/ocpp"
import { ApiResponse, ApiError } from '../../../../../../types/ocpp';

const BACKEND_URL = process.env.OCPP_BACKEND_URL || 'http://localhost:3001';

interface CommandParams {
  params: {
    id: string;
    command: OCPPCommand;
  };
}

export async function POST(
  request: NextRequest, 
  { params }: CommandParams
): Promise<NextResponse<ApiResponse<any> | ApiError>> {
  try {
    const { id, command } = params;
    const body: OCPPCommandPayload[OCPPCommand] = await request.json();
    
    const response = await fetch(
      `${BACKEND_URL}/chargepoints/${id}/commands/${command}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    
    if (!response.ok) {
      return NextResponse.json<ApiError>(
        { error: `Command failed: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json<ApiResponse<any>>({
      data,
      success: true
    });
  } catch (error) {
    console.error('Command Error:', error);
    return NextResponse.json<ApiError>(
      { 
        error: 'Failed to send command', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}