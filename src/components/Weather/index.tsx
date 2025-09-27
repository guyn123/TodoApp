"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Button, Typography, Spin, message, Input } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.scss";

import { fetchWeather, IWeather } from "@/api/weatherApi";
import {
    fetchProvinces,
    fetchDistricts,
    fetchWards,
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

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    const fetchWeatherByAddress = async (address: string) => {
        if (!address) return;
        setLoading(true);
        try {
            const data = await geocodeAddress(address);
            if (!data.results?.length) {
                message.error("Không tìm thấy tọa độ địa điểm");
                setLoading(false);
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


    const handleGetCurrentLocation = async () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                try {
                    const data = await reverseGeocode(lat, lng);
                    const fullAddress = data.results?.[0]?.formatted_address || "Vị trí hiện tại";
                    const weatherData = await fetchWeather(lat, lng, fullAddress);
                    setWeather(weatherData);
                    setSelectedProvince(null);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                    setDistricts([]);
                    setWards([]);
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

    // tinh
    const handleProvinceChange = async (provinceCode: string | null) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        if (!provinceCode) {
            handleGetCurrentLocation();
            return;
        }

        try {
            const districtsData = await fetchDistricts(provinceCode);
            setDistricts(districtsData);

            const provinceName = provinces.find((p) => p.value === provinceCode)?.label || "";
            fetchWeatherByAddress(provinceName);
        } catch {
            message.error("Không thể tải danh sách quận/huyện");
        }
    };

    // Cquanuận
    const handleDistrictChange = async (districtCode: string | null) => {
        setSelectedDistrict(districtCode);
        setSelectedWard(null);
        setWards([]);

        if (!districtCode) {
            const provinceName = provinces.find((p) => p.value === selectedProvince)?.label || "";
            fetchWeatherByAddress(provinceName);
            return;
        }

        try {
            const wardsData = await fetchWards(districtCode);
            setWards(wardsData);

            const districtName = districts.find((d) => d.value === districtCode)?.label || "";
            const provinceName = provinces.find((p) => p.value === selectedProvince)?.label || "";
            fetchWeatherByAddress(`${districtName}, ${provinceName}`);
        } catch {
            message.error("Không thể tải danh sách phường/xã");
        }
    };

    // phường
    const handleWardChange = (wardCode: string | null) => {
        setSelectedWard(wardCode);

        const districtName = districts.find((d) => d.value === selectedDistrict)?.label || "";
        const provinceName = provinces.find((p) => p.value === selectedProvince)?.label || "";

        if (!wardCode) {
            fetchWeatherByAddress([districtName, provinceName].filter(Boolean).join(", "));
            return;
        }

        const wardName = wards.find((w) => w.value === wardCode)?.label || "";
        fetchWeatherByAddress([wardName, districtName, provinceName].filter(Boolean).join(", "));
    };


    const handleSearchLocation = async (value: string) => {
        const address = value.trim();
        if (!address) return;
        try {
            await fetchWeatherByAddress(address);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm địa điểm:", err);
        }
    };

    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                const provincesData = await fetchProvinces();
                setProvinces(provincesData);
            } catch {
                message.error("Không thể tải danh sách tỉnh");
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
                    allowClear
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
                    allowClear
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
                    allowClear
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
