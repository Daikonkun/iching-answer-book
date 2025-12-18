import React, { useState } from 'react';
import '../styles/theme.css';
import { useLanguage } from '../contexts/LanguageContext';

const QuestionInput = ({ onConfirm }) => {
    const [question, setQuestion] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            onConfirm(question);
        }
    };

    return (
        <div className="question-input-container fade-in">
            <h2>{t.question.title}</h2>
            <p>{t.question.subtitle}</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.question.placeholder}
                    className="question-input"
                    autoFocus
                />

                <div className="suggestions">
                    {t.question.suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            className="suggestion-btn"
                            onClick={() => setQuestion(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" disabled={!question.trim()}>
                        {t.question.submit}
                    </button>
                </div>
            </form>

            <style>{`
                .question-input-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    animation: fadeIn 1s ease;
                }
                .question-input {
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid var(--color-accent);
                    color: var(--color-text-primary);
                    font-size: 1.5rem;
                    width: 100%;
                    padding: 0.5rem;
                    text-align: center;
                    outline: none;
                    transition: border-color 0.3s;
                }
                .question-input:focus {
                    border-bottom-color: var(--color-yang);
                }
                .suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin-top: 1rem;
                }
                .suggestion-btn {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default QuestionInput;
