"use client";

interface WeatherData {
  weather: {
    main: {
      description: string;
    };
  };
  main: {
    temp: number;
  };
  sys: {
    country: string;
  };
}

import { useState, useEffect } from "react";
export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/fetchWeather?city=${city}`);
        if (!res.ok) {
          setError(`HTTP error! Status: ${res.status}`);
        } else {
          const data = await res.json();
          setWeatherData(data);
          console.log(data);
        }
      } catch (error) {
        setError(`Couldn't fetch data. Error message: ${error}`);
      }
    };
    fetchWeather();
  }, [city]);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    event.target.value.length >= 3 ? setCity(event.target.value) : "";
    console.log(city);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col  text-left p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          TypeScript Weather App
        </h2>
        <div className="w-full">
          <div className="mb-4">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Enter city"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Results</p>
          {error && (
            <p className="text-red-500 font-medium mb-4">Error: {error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
