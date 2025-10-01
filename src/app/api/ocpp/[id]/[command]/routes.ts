import { NextRequest, NextResponse } from "next/server";
import { OCPPCommand, OCPPCommandPayload } from "@/types/ocpp";
import { ApiResponse, ApiError } from "@/types/ocpp";

const BACKEND_URL = process.env.OCPP_BACKEND_URL || "http://localhost:3001";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; command: OCPPCommand } }
): Promise<NextResponse<ApiResponse<any> | ApiError>> {
  try {
    const { id, command } = params;

    // Validate command
    if (!id || !command) {
      return NextResponse.json<ApiError>(
        { error: "Invalid request: missing id or command" },
        { status: 400 }
      );
    }

    // Read body
    const body: OCPPCommandPayload[OCPPCommand] = await request.json();
    console.log("Sending command:", { id, command, body });

    // Proxy to backend
    const response = await fetch(
      `${BACKEND_URL}/charge-points/${id}/${command}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      success: true,
      data,
    });
  } catch (error) {
    console.error("Command Error:", error);

    return NextResponse.json<ApiError>(
      {
        error: "Failed to send command",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
