export interface IWeather {
    temp: number;
    description: string;
    icon: string;
    location: string;
    humidity: number;
    wind: number;
}

export const fetchWeather = async (
    lat: number,
    lon: number,
    locationName?: string
): Promise<IWeather> => {
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=vi`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error(data.message);

    return {
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        location: locationName || data.name,
        humidity: data.main.humidity,
        wind: data.wind.speed,
    };
};
