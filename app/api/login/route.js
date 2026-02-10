import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Replace this with your actual database/store logic
    if (email === "admin@news.com" && password === "password123") {
      // In a real app, generate your JWT here
      const token = "mock-jwt-token-123";

      return NextResponse.json(
        {
          success: true,
          token: token,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    );
  }
}
