"use client";

import React, { useEffect, useState } from "react";
import { Card, Cascader, Button, Typography, Spin, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./index.scss";

import { fetchWeather, IWeather } from "@/api/weatherApi";
import {
    fetchAdministrativeData,
    geocodeAddress,
    reverseGeocode,
} from "@/api/locationApi";

const { Title, Text } = Typography;

export default function Weather() {
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [weather, setWeather] = useState<IWeather | null>(null);
    const [options, setOptions] = useState<any[]>([]);

    const handleLocationChange = async (value: string[]) => {
        const address = [...value].reverse().join(", ");
        setLoading(true);
        try {
            const data = await geocodeAddress(address);
            if (!data.results?.length) {
                message.error("Không tìm thấy tọa độ địa điểm");
                return;
            }
            const { lat, lng } = data.results[0].geometry.location;
            const weatherData = await fetchWeather(lat, lng, address);
            setWeather(weatherData);
        } catch {
            message.error("Lỗi khi tìm địa điểm");
        } finally {
            setLoading(false);
        }
    };

    // Lấy vị trí hiện tại
    const handleGetCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                try {
                    const data = await reverseGeocode(lat, lng);
                    const fullAddress =
                        data.results?.[0]?.formatted_address || "Vị trí hiện tại";
                    const weatherData = await fetchWeather(lat, lng, fullAddress);
                    setWeather(weatherData);
                } catch {
                    message.error("Không thể lấy tên địa điểm hiện tại");
                    const weatherData = await fetchWeather(lat, lng);
                    setWeather(weatherData);
                }
            },
            () => {
                message.error("Không thể lấy vị trí hiện tại");
            }
        );
    };

    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                const data = await fetchAdministrativeData();
                setOptions(data);
            } catch {
                message.error("Không thể tải dữ liệu địa phương");
            } finally {
                setLoadingLocation(false);
            }
        })();

        handleGetCurrentLocation();
    }, []);

    return (
        <Card title="🌦️ Thời tiết" className="weather-card">
            <div className="weather-actions" style={{ marginBottom: 16 }}>
                <Cascader
                    options={options}
                    onChange={handleLocationChange}
                    placeholder="Chọn tỉnh → quận → phường"
                    showSearch
                    loading={loadingLocation}
                    style={{ width: 300, marginRight: 8 }}
                />
                <Button icon={<EnvironmentOutlined />} onClick={handleGetCurrentLocation}>
                    Vị trí hiện tại
                </Button>
            </div>

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
                            <div>
                                <Text>{weather.description}</Text>
                            </div>
                        </div>
                        <div className="weather-right">
                            <Text strong className="weather-temp">
                                {weather.temp}°C
                            </Text>
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
