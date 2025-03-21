"use client";

import { useState, useEffect, FormEvent } from "react";

interface WeatherData {
  weather: [
    {
      main: string;
      description: string;
    }
  ];
  main: {
    temp: number;
  };
  sys: {
    country: string;
  };
  name: string;
}

interface DataItem {
  id: number;
  name: string;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<DataItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  // Fetch cities data on component mount
  useEffect(() => {
    fetch("/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        const newCities = jsonData.map(
          (res: DataItem): DataItem => ({
            id: res.id,
            name: res.name,
          })
        );
        setCities(newCities);
        console.log("Cities loaded:", newCities);
      })
      .catch((error) => {
        console.error("Error fetching cities data:", error);
      });
  }, []);

  // Fetch weather data function
  const fetchWeather = async (cityName: string) => {
    if (!cityName || cityName.length < 3) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/fetchWeather?city=${encodeURIComponent(cityName)}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data.main) {
        setWeatherData(data);
        setNotFound(false);
      } else if (data.error) {
        setWeatherData(null);
        setNotFound(true);
      }

      console.log("Weather data fetched:", data);
    } catch (error) {
      setError(
        `Couldn't fetch weather data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = event.target.value;
    setCity(inputVal);
  };

  // Handle form submission
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (city.trim().length >= 3) {
      fetchWeather(city);
    }
  };

  // Setup debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length >= 3) {
        fetchWeather(city);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 pb-20 sm:p-20 font-sans ">
      <main className="w-full  mx-auto  rounded-lg shadow-lg p-6 text-left bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          TypeScript Weather App
        </h2>

        <div className="w-full">
          <div className="mb-6">
            <form onSubmit={handleSubmit}>
              <input
                name="city"
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter city (min 3 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
              />
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Get Weather
              </button>
            </form>
          </div>

          <p className="text-lg font-semibold text-gray-700 mb-4">Results</p>

          {isLoading && (
            <p className="text-gray-500 font-medium mb-6">
              Loading weather data...
            </p>
          )}

          {error && (
            <p className="text-red-500 font-medium mb-6">Error: {error}</p>
          )}

          {notFound && (
            <div className="p-4 bg-red-100 rounded-lg mb-6">
              <p className="text-red-500 font-bold mb-2 text-lg">
                Ooops: City Not Found
              </p>
              <p className="text-red-500 font-medium">
                Kindly check the name and try again...
              </p>
            </div>
          )}

          {weatherData && (
            <div className="bg-gray-50 p-6 rounded-md text-gray-700">
              <p className="text-xl font-bold mb-4">
                {weatherData.name}, {weatherData.sys.country} -{" "}
                {weatherData.weather[0].main}
              </p>
              <p className="text-base mb-2">
                Temperature: {(weatherData.main.temp - 273.15).toFixed(1)}°C
              </p>
              <p className="text-base">
                Weather: {weatherData.weather[0].main} -{" "}
                {weatherData.weather[0].description}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
