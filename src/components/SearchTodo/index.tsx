"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
interface SearchTodoProps {
    onSearch: (term: string) => void;
}

export default function SearchTodo({ onSearch }: SearchTodoProps) {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setValue(text);
        onSearch(text.trim()); // gọi realtime khi gõ
    };

    return (
        <div className="search-wrapper">
            <Input
                className="search-input"
                placeholder="Nhập từ khóa để tìm..."
                value={value}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: 16, borderRadius: 10 }}
                allowClear
                prefix={<SearchOutlined style={{ color: "#9b0b0bff" }} />} // icon tìm kiếm
            />
        </div>
    );
}
