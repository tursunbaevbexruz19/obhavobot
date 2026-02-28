import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export interface WeatherData {
    city: string;
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
}

export interface ForecastData {
    list: {
        dt: number;
        main: { temp: number };
        weather: { description: string; icon: string }[];
    }[];
}

const getConditionEmoji = (icon: string) => {
    if (icon.startsWith('01')) return '☀️'; // clear sky
    if (icon.startsWith('02')) return '⛅'; // few clouds
    if (icon.startsWith('03') || icon.startsWith('04')) return '☁️'; // clouds
    if (icon.startsWith('09') || icon.startsWith('10')) return '🌧️'; // rain
    if (icon.startsWith('11')) return '⛈️'; // thunderstorm
    if (icon.startsWith('13')) return '❄️'; // snow
    if (icon.startsWith('50')) return '🌫️'; // mist
    return '🌡️';
};

export const getCurrentWeatherByCity = async (city: string, lang = 'uz'): Promise<WeatherData | null> => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                lang,
            },
        });

        return {
            city: res.data.name,
            temp: res.data.main.temp,
            condition: res.data.weather[0].description,
            humidity: res.data.main.humidity,
            windSpeed: res.data.wind.speed,
            icon: getConditionEmoji(res.data.weather[0].icon),
        };
    } catch (error) {
        console.error("OpenWeather error:", error);
        return null;
    }
};

export const getCurrentWeatherByCoords = async (lat: number, lon: number, lang = 'uz'): Promise<WeatherData | null> => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric',
                lang,
            },
        });

        return {
            city: res.data.name,
            temp: res.data.main.temp,
            condition: res.data.weather[0].description,
            humidity: res.data.main.humidity,
            windSpeed: res.data.wind.speed,
            icon: getConditionEmoji(res.data.weather[0].icon),
        };
    } catch (error) {
        console.error("OpenWeather error:", error);
        return null;
    }
};

// Returns a simple 3-day forecast summary
export const getForecast = async (lat: number, lon: number, lang = 'uz'): Promise<string | null> => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric', lang }
        });

        // OpenWeather forecast gives data every 3 hours. (8 items = 1 day)
        const dailyData = [];
        for (let i = 0; i < res.data.list.length; i += 8) {
            dailyData.push(res.data.list[i]);
        }

        let forecastText = lang === 'uz' ? `📅 <b>Kelgusi kunlar ob-havosi:</b>\n\n` : `📅 <b>Forecast:</b>\n\n`;

        dailyData.slice(1, 4).forEach((day) => {
            const date = new Date(day.dt * 1000).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const emoji = getConditionEmoji(day.weather[0].icon);
            forecastText += `📆 ${date}\n${emoji} ${day.weather[0].description}, ${Math.round(day.main.temp)}°C\n\n`;
        });

        return forecastText;

    } catch (err) {
        console.error(err);
        return null;
    }
}
