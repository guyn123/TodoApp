'use client';

import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const { Option } = Select;

export default function LanguageSwitch() {
    const { i18n: i18next } = useTranslation();

    const handleChange = (value: string) => {
        i18n.changeLanguage(value);
        // localStorage.setItem('lang', value); 
    };

    return (
        <Select
            value={i18next.language}
            style={{ width: 120 }}
            onChange={handleChange}
        >
            <Option value="vi">Tiếng Việt</Option>
            <Option value="en">English</Option>
            <Option value="th">ไทย (Thai)</Option>
            <Option value="ja">日本語 (Japanese)</Option>
        </Select>
    );
}
