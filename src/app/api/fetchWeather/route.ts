import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json({ error: "City parameter is required." });
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API}&units=metric}`
    );

    if (!res.ok) {
      console.error(`OPENWEATHER API error: ${res.status}`);
      return NextResponse.json({
        error: `OPENWEATHER API: Error fetching data: ${res.statusText}`,
      });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 }); // Return a 500 Interna  }
  }
}
