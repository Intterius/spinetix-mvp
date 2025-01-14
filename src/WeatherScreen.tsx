/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  city: string;
  daily: {
    temp: number;
    date: string;
    weather: string;
    icon: string;
  }[];
}

const WeatherScreen = () => {
  const [city, setCity] = useState('Zurich');
  const [isEditing, setIsEditing] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First get coordinates for the city
        const geoResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );

        if (geoResponse.data.length > 0) {
          const { lat, lon } = geoResponse.data[0];

          // Then get weather data
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
          );

          // Format the data
          const formattedData: WeatherData = {
            city,
            daily: weatherResponse.data.daily.slice(0, 5).map((day: any) => ({
              temp: Math.round(day.temp.day),
              date: new Date(day.dt * 1000)
                .toLocaleDateString('en-US', { weekday: 'short' })
                .toUpperCase(),
              weather: day.weather[0].main,
              icon: day.weather[0].icon,
            })),
          };

          setWeatherData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [city, API_KEY]);

  return (
    <div className='relative w-[1920px] h-[1080px] overflow-hidden'>
      {/* Background Image */}
      <img
        src={`/images/${city.toLowerCase()}.jpg`}
        alt={city}
        className='absolute w-full h-full object-cover'
      />

      {/* Weather Overlay */}
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-8'>
        {/* City Name */}
        <div className='mb-6'>
          {isEditing ? (
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className='text-4xl bg-transparent border-b border-white text-white'
              autoFocus
            />
          ) : (
            <h1
              className='text-4xl text-white cursor-pointer hover:opacity-80'
              onClick={() => setIsEditing(true)}
            >
              {city}
            </h1>
          )}
        </div>

        {/* Weather Forecast Strip */}
        <div className='flex gap-8'>
          {weatherData?.daily.map((day) => (
            <div key={day.date} className='text-white text-center'>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.weather}
                className='w-16 h-16'
              />
              <div className='text-xl'>{day.date}</div>
              <div className='text-2xl'>{day.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherScreen;
