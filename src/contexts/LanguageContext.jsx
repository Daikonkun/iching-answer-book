import React, { createContext, useContext, useState } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('zh'); // Default Chinese

    const t = translations[lang];

    const switchLanguage = (code) => {
        if (translations[code]) {
            setLang(code);
        }
    };

    return (
        <LanguageContext.Provider value={{ lang, t, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
