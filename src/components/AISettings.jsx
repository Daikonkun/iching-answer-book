import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PROVIDERS = [
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'openai', name: 'OpenAI (ChatGPT)' },
    { id: 'grok', name: 'xAI (Grok)' }
];

const AISettings = ({ config, onSave, onClose }) => {
    const { t } = useLanguage();
    const [provider, setProvider] = useState(config.provider || 'gemini');
    const [apiKey, setApiKey] = useState(config.apiKey || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        onSave({ provider, apiKey });
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            if (onClose) onClose();
        }, 1000);
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal fade-in">
                <div className="modal-header">
                    <h3>{t.settings.title}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="form-group">
                    <label>{t.settings.provider}</label>
                    <div className="provider-options">
                        {PROVIDERS.map(p => (
                            <button
                                key={p.id}
                                className={`provider-btn ${provider === p.id ? 'active' : ''}`}
                                onClick={() => setProvider(p.id)}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>{t.settings.apiKey}</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t.settings.placeholderKey}
                        className="api-input"
                    />
                </div>

                <div className="form-actions">
                    <button className="save-btn" onClick={handleSave}>
                        {isSaved ? t.settings.saved : t.settings.save}
                    </button>
                </div>
            </div>

            <style>{`
                .settings-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }
                .settings-modal {
                    background: var(--color-bg-secondary);
                    padding: 2rem;
                    border-radius: 12px;
                    border: 1px solid var(--color-accent);
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--color-text-secondary);
                    padding: 0;
                    width: 30px;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                    text-align: left;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                }
                .provider-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .provider-btn {
                    padding: 0.8rem;
                    text-align: left;
                    border: 1px solid var(--color-text-secondary);
                    opacity: 0.6;
                }
                .provider-btn.active {
                    opacity: 1;
                    border-color: var(--color-accent);
                    background: rgba(212, 175, 55, 0.1);
                }
                .api-input {
                    width: 100%;
                    padding: 0.8rem;
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-text-secondary);
                    color: white;
                    border-radius: 4px;
                    box-sizing: border-box; /* Fix padding expanding width */
                }
                .api-input:focus {
                    border-color: var(--color-accent);
                    outline: none;
                }
                .save-btn {
                    width: 100%;
                    background: var(--color-accent);
                    color: var(--color-bg-primary);
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default AISettings;
