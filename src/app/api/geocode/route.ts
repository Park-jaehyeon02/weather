import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "도시 검색에 실패했습니다" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
