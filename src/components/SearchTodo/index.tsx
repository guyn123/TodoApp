"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SearchTodoProps {
    onSearch: (term: string) => void;
}

export default function SearchTodo({ onSearch }: SearchTodoProps) {
    const [value, setValue] = useState("");
    const { t } = useTranslation();

    const debouncedSearch = useMemo(
        () => debounce((term: string) => onSearch(term), 1000),
        [onSearch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setValue(text);
        debouncedSearch(text.trim());
    };

    return (
        <div className="search-wrapper">
            <Input
                className="search-input"
                placeholder={t("search.placeholder")}
                value={value}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: 16, borderRadius: 10 }}
                allowClear
                prefix={<SearchOutlined style={{ color: "#9b0b0bff" }} />}
            />
        </div>
    );
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
