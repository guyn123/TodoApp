"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Button, Typography, Spin, message, Input } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

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
                messageApi.error(t("weather.errors.notFound"));
                setLoading(false);
                return;
            }
            const { lat, lng } = data.results[0].geometry.location;
            const weatherData = await fetchWeather(lat, lng, address);
            setWeather(weatherData);
        } catch {
            messageApi.error(t("weather.errors.fetchError"));
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
                    const fullAddress =
                        data.results?.[0]?.formatted_address || t("weather.currentLocation");
                    const weatherData = await fetchWeather(lat, lng, fullAddress);
                    setWeather(weatherData);
                    setSelectedProvince(null);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                    setDistricts([]);
                    setWards([]);
                } catch {
                    messageApi.error(t("weather.errors.locationName"));
                    const weatherData = await fetchWeather(lat, lng);
                    setWeather(weatherData);
                }
            },
            () => {
                messageApi.error(t("weather.errors.getLocation"));
            }
        );
    };

    // tỉnh
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

            const provinceName =
                provinces.find((p) => p.value === provinceCode)?.label || "";
            fetchWeatherByAddress(provinceName);
        } catch {
            messageApi.error(t("weather.errors.districts"));
        }
    };

    // huyện
    const handleDistrictChange = async (districtCode: string | null) => {
        setSelectedDistrict(districtCode);
        setSelectedWard(null);
        setWards([]);

        if (!districtCode) {
            const provinceName =
                provinces.find((p) => p.value === selectedProvince)?.label || "";
            fetchWeatherByAddress(provinceName);
            return;
        }

        try {
            const wardsData = await fetchWards(districtCode);
            setWards(wardsData);

            const districtName =
                districts.find((d) => d.value === districtCode)?.label || "";
            const provinceName =
                provinces.find((p) => p.value === selectedProvince)?.label || "";
            fetchWeatherByAddress(`${districtName}, ${provinceName}`);
        } catch {
            messageApi.error(t("weather.errors.wards"));
        }
    };

    // phường
    const handleWardChange = (wardCode: string | null) => {
        setSelectedWard(wardCode);

        const districtName =
            districts.find((d) => d.value === selectedDistrict)?.label || "";
        const provinceName =
            provinces.find((p) => p.value === selectedProvince)?.label || "";

        if (!wardCode) {
            fetchWeatherByAddress(
                [districtName, provinceName].filter(Boolean).join(", ")
            );
            return;
        }

        const wardName = wards.find((w) => w.value === wardCode)?.label || "";
        fetchWeatherByAddress(
            [wardName, districtName, provinceName].filter(Boolean).join(", ")
        );
    };

    const handleSearchLocation = async (value: string) => {
        let address = value.trim();

        if (!address) {
            messageApi.warning(t("weather.errors.emptyInput"));
            return;
        }

        if (address.length < 2) {
            messageApi.warning(t("weather.errors.tooShort"));
            return;
        }

        const validPattern = /^[\p{L}\p{N}\s-]+$/u;
        if (!validPattern.test(address)) {
            messageApi.warning(
                t("weather.errors.invalidChars"));
            return;
        }

        try {
            await fetchWeatherByAddress(address);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm địa điểm:", err);
            messageApi.error(t("weather.errors.fetchError"));
        }
    };

    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                const provincesData = await fetchProvinces();
                setProvinces(provincesData);
            } catch {
                messageApi.error(t("weather.errors.provinces"));
            } finally {
                setLoadingLocation(false);
            }
        })();

        handleGetCurrentLocation();
    }, []);

    return (
        <Card title={t("weather.title")} className="weather-card">

            {contextHolder}

            <div className="weather-actions" style={{ marginBottom: 16 }}>
                <Select
                    placeholder={t("weather.selectProvince")}
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
                    placeholder={t("weather.selectDistrict")}
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
                    placeholder={t("weather.selectWard")}
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
                    {t("weather.currentLocation")}
                </Button>
            </div>

            <div className="weather-search" style={{ marginBottom: 16, textAlign: "center" }}>
                <Search
                    placeholder={t("weather.searchPlaceholder")}
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
                                <Text>💧 {t("weather.humidity")}: {weather.humidity}%</Text>
                            </div>
                            <div>
                                <Text>🌬️ {t("weather.wind")}: {weather.wind} m/s</Text>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Text>{t("weather.noData")}</Text>
            )}
        </Card>
    );
}
