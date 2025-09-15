"use client";

import React, { useEffect, useState } from "react";
import { Card, Input, Button, Space, Typography, Spin, message } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.scss";

const { Title, Text } = Typography;

// 🔑 API keys
const OPENWEATHER_KEY = "a387c92784a152466bdb4c5eab9cb7e6";
const GOONG_KEY = "GoUF6A5PwA0LIhYqcWAvySAJqCRunrGrptDW1iQB";

interface IWeatherData {
    temp: number;
    description: string;
    icon: string;
    location: string;
}

export default function Weather() {
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState<IWeatherData | null>(null);

    // 📌 Lấy dữ liệu thời tiết theo lat/lon
    const fetchWeather = async (lat: number, lon: number, locationName?: string) => {
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
            });
        } catch (err) {
            message.error("❌ Không lấy được dữ liệu thời tiết");
        } finally {
            setLoading(false);
        }
    };

    // vị trí hiện tại
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            message.error("Trình duyệt không hỗ trợ định vị!");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchWeather(pos.coords.latitude, pos.coords.longitude, "Vị trí của bạn");
            },
            () => {
                message.error("Không thể lấy vị trí hiện tại");
            }
        );
    };

    // Vị trí timf
    const handleSearchCity = async () => {
        if (!city.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(
                `https://rsapi.goong.io/geocode?address=${encodeURIComponent(city)}&api_key=${GOONG_KEY}`
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

    useEffect(() => {
        handleGetCurrentLocation();
    }, [])

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

            {/* Nội dung hiển thị */}
            {loading ? (
                <div className="weather-loading">
                    <Spin />
                </div>
            ) : weather ? (
                <div className="weather-result">
                    <Title level={4}>{weather.location}</Title>
                    <img src={weather.icon} alt="weather" className="weather-icon" />
                    <Text strong className="weather-temp">
                        {weather.temp}°C
                    </Text>
                    <div>
                        <Text>{weather.description}</Text>
                    </div>
                </div>
            ) : (
                <Text>Không có dữ liệu</Text>
            )}
        </Card>
    );
}
