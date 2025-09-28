'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/translation.json';
import vi from './vi/translation.json';

const resources = {
    vi: { translation: vi },
    en: { translation: en },
};

// // lấy ngôn ngữ đã lưu trong localStorage (nếu có), mặc định là 'vi'
// const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi',
        // lng: savedLang || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
