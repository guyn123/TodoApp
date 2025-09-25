"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Button, Typography, Spin, message, Input } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.scss";

import { fetchWeather, IWeather } from "@/api/weatherApi";
import {
    fetchAdministrativeData,
    geocodeAddress,
    reverseGeocode,
} from "@/api/locationApi";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function Weather() {
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [weather, setWeather] = useState<IWeather | null>(null);

    // Data toàn bộ
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    // State chọn
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    // Hàm gọi API thời tiết từ địa chỉ
    const fetchWeatherByAddress = async (address: string) => {
        if (!address) return;
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
            message.error("Lỗi khi lấy thời tiết cho địa điểm");
        } finally {
            setLoading(false);
        }
    };

    // Tìm kiếm địa điểm
    const handleSearchLocation = async (value: string) => {
        if (!value.trim()) return;
        fetchWeatherByAddress(value);
    };

    // Chọn Tỉnh/Thành phố
    const handleProvinceChange = (provinceName: string) => {
        setSelectedProvince(provinceName);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setWards([]);
        const province = provinces.find((p) => p.label === provinceName);
        if (province) {
            setDistricts(province.children || []);
        }
        fetchWeatherByAddress(provinceName);
    };

    // Chọn Quận/Huyện
    const handleDistrictChange = (districtName: string) => {
        setSelectedDistrict(districtName);
        setSelectedWard(null);
        const district = districts.find((d) => d.label === districtName);
        if (district) {
            setWards(district.children || []);
        }
        const address = [districtName, selectedProvince].filter(Boolean).join(", ");
        fetchWeatherByAddress(address);
    };

    // Chọn Phường/Xã
    const handleWardChange = (wardName: string) => {
        setSelectedWard(wardName);
        const address = [wardName, selectedDistrict, selectedProvince]
            .filter(Boolean)
            .join(", ");
        fetchWeatherByAddress(address);
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

    // Fetch danh sách tỉnh thành + load vị trí ban đầu
    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                const data = await fetchAdministrativeData();
                setProvinces(data);
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
                <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    style={{ width: 180, marginRight: 8 }}
                    onChange={handleProvinceChange}
                    loading={loadingLocation}
                    value={selectedProvince || undefined}
                >
                    {provinces.map((p) => (
                        <Option key={p.value} value={p.value}>
                            {p.label}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Chọn Quận/Huyện"
                    style={{ width: 180, marginRight: 8 }}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince}
                    value={selectedDistrict || undefined}
                >
                    {districts.map((d) => (
                        <Option key={d.value} value={d.value}>
                            {d.label}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Chọn Phường/Xã"
                    style={{ width: 180, marginRight: 8 }}
                    onChange={handleWardChange}
                    disabled={!selectedDistrict}
                    value={selectedWard || undefined}
                >
                    {wards.map((w) => (
                        <Option key={w.value} value={w.value}>
                            {w.label}
                        </Option>
                    ))}
                </Select>

                <Button icon={<EnvironmentOutlined />} onClick={handleGetCurrentLocation}>
                    Vị trí hiện tại
                </Button>
            </div>

            <div className="weather-search" style={{ marginBottom: 16, textAlign: "center" }}>
                <Search
                    placeholder="Nhập địa điểm cần tìm"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={handleSearchLocation}
                    style={{ maxWidth: 400, width: "100%" }}
                />
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
                                {Math.round(weather.temp)}°C
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
