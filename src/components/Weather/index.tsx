"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    Input,
    Button,
    Space,
    Typography,
    Spin,
    message,
} from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.scss";

const { Title, Text } = Typography;

const OPENWEATHER_KEY = "a387c92784a152466bdb4c5eab9cb7e6";
const GOONG_KEY = "GoUF6A5PwA0LIhYqcWAvySAJqCRunrGrptDW1iQB";

interface IWeather {
    temp: number;
    description: string;
    icon: string;
    location: string;
    humidity: number;
    wind: number;
}

export default function Weather() {
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<IWeather | null>(null);

    // Lấy dữ liệu thời tiết theo lat(vĩ độ)/lon(kinh độ)
    const fetchWeather = async (
        lat: number,
        lon: number,
        locationName?: string
    ) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=vi`
            );
            const data = await res.json();
            if (data.cod !== 200) throw new Error(data.message);

            setWeather({
                temp: data.main.temp,
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                location: locationName || data.name,
                humidity: data.main.humidity,
                wind: data.wind.speed,
            });
        } catch (err) {
            message.error("Không lấy được dữ liệu thời tiết");
        } finally {
            setLoading(false);
        }
    };

    const handleGetCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchWeather(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    "Vị trí của bạn"
                );
            },
            () => {
                message.error("Không thể lấy vị trí hiện tại");
            }
        );
    };

    const handleSearchCity = async () => {
        if (!city.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
                    city
                )}&api_key=${GOONG_KEY}`
            );
            const data = await res.json();
            if (!data.results?.length) {
                message.error("Không tìm thấy địa điểm");
                return;
            }
            const { lat, lng } = data.results[0].geometry.location;
            await fetchWeather(lat, lng, data.results[0].formatted_address);
        } catch (err) {
            message.error("Lỗi khi tìm địa điểm");
        } finally {
            setLoading(false);
        }
    };



    return (
        <Card title="🌦️ Thời tiết" className="weather-card">
            <Space className="weather-actions">
                <Input
                    placeholder="Nhập địa điểm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="weather-input"
                />
                <Button icon={<SearchOutlined />} onClick={handleSearchCity}>
                    Tìm kiếm
                </Button>
                <Button icon={<EnvironmentOutlined />} onClick={handleGetCurrentLocation}>
                    Vị trí hiện tại
                </Button>
            </Space>

            {loading ? (
                <div className="weather-loading">
                    <Spin />
                </div>
            ) : weather ? (
                <div className="weather-result">
                    <div className="weather-row">
                        <div className="weather-left">
                            <Title level={4}>{weather.location}</Title>
                            <img src={weather.icon} alt="weather" className="weather-icon" />
                        </div>
                        <div className="weather-right">
                            <Text strong className="weather-temp">
                                {weather.temp}°C
                            </Text>
                            <div>
                                <Text>{weather.description}</Text>
                            </div>
                            <div>
                                <Text>💧 Độ ẩm: {weather.humidity}%</Text>
                            </div>
                            <div>
                                <Text>🌬️ Gió: {weather.wind} m/s</Text>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <Text>Không có dữ liệu</Text>
            )}
        </Card>
    );
}
