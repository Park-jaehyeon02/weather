import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat, lon 파라미터가 필요합니다" },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  const response = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "예보 정보를 가져오는데 실패했습니다" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
