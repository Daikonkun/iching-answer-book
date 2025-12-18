import React, { useEffect, useState, useRef } from 'react';
import HexagramDisplay from './HexagramDisplay';
import { lookupHexagram, getHexagramKey } from '../utils/iching';
import { useLanguage } from '../contexts/LanguageContext';
import html2canvas from 'html2canvas';
import ShareCard from './ShareCard';
import ReactMarkdown from 'react-markdown';
import { getAIInterpretation } from '../utils/ai';

const ResultView = ({ question, lines, onReset, aiConfig }) => {
    const [hexagram, setHexagram] = useState(null);
    const [aiResponse, setAiResponse] = useState('');
    const [summary, setSummary] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const { t, lang } = useLanguage();

    // Ref for the Share Card
    const shareCardRef = useRef(null);

    useEffect(() => {
        const h = lookupHexagram(lines);
        setHexagram(h);
    }, [lines]);

    useEffect(() => {
        if (hexagram) {
            // Determine effective config
            const effectiveProvider = aiConfig && aiConfig.apiKey ? aiConfig.provider : import.meta.env.VITE_DEFAULT_AI_PROVIDER;
            const effectiveKey = aiConfig && aiConfig.apiKey ? aiConfig.apiKey : import.meta.env.VITE_DEFAULT_API_KEY;

            if (effectiveKey) {
                setLoadingAI(true);
                getAIInterpretation(effectiveProvider, effectiveKey, question, hexagram, lang)
                    .then(text => {
                        // Split text to find Summary
                        // Look for "### Summary" or "### 总结"
                        const parts = text.split(/###\s*(Summary|总结|精炼总结)/i);
                        if (parts.length > 2) {
                            // part[2] is the actual summary
                            // Force cleaning of metadata like (120字) or (45 words)
                            let cleanSummary = parts[2].trim();
                            cleanSummary = cleanSummary.replace(/（\d+字）/g, '').replace(/\(\d+字\)/g, '').replace(/\(\d+\s*words\)/i, '');
                            setAiResponse(parts[0].trim());
                            setSummary(cleanSummary);
                        } else {
                            setAiResponse(text);
                            // Fallback summary if not found: take first 100 chars? Or just blank.
                            setSummary(text.substring(0, 100) + "...");
                        }
                    })
                    .catch(err => setAiResponse("AI Interpretation Error: " + err.message))
                    .finally(() => setLoadingAI(false));
            }
        }
    }, [hexagram, aiConfig, question, lang]);

    const handleShare = async () => {
        if (!shareCardRef.current) return;
        try {
            const canvas = await html2canvas(shareCardRef.current, {
                backgroundColor: null,
                scale: 2 // High res
            });
            const image = canvas.toDataURL("image/png");

            // Create link to download
            const link = document.createElement('a');
            link.href = image;
            link.download = `ZhouYi_Divination_${new Date().getTime()}.png`;
            link.click();
        } catch (err) {
            console.error("Share failed:", err);
            alert("Failed to generate share image.");
        }
    };

    if (!hexagram) {
        return (
            <div className="result-container">
                <HexagramDisplay lines={lines} />
                <h2>{t.result.unknown}</h2>
                <p>{t.result.binaryKey}: {getHexagramKey(lines)}</p>
                <p>{t.result.pattern}: {lines.map(l => (l.total % 2 !== 0 ? '1' : '0')).reverse().join('')}</p>
                <p>{t.result.rawValues}: {lines.map(l => l.total).join(', ')}</p>
                <div style={{ marginTop: '2rem' }}>
                    <button onClick={onReset}>{t.result.tryAgain}</button>
                </div>
            </div>
        );
    }

    // Simple token replacement for interpolation
    const formatAI = (str, replacements) => {
        return str.replace(/{(\w+)}/g, (match, key) => {
            return replacements[key] || match;
        });
    };

    return (
        <div className="result-container fade-in">
            <h2>{t.result.title}</h2>
            <div className="question-display">"{question}"</div>

            <div className="hex-display-wrapper">
                <HexagramDisplay lines={lines} />
                <div className="hex-info">
                    <h1>#{hexagram.number} {hexagram.name}</h1>
                    {lang === 'en' && <h3>{hexagram.english}</h3>}
                    <p className="description">
                        {lang === 'zh' ? (hexagram.description_zh || hexagram.description) : hexagram.description}
                    </p>
                </div>
            </div>

            <div className="ai-analysis-section">
                <h3>{t.result.aisection}</h3>
                <div className="ai-response-box">
                    {loadingAI ? (
                        <div className="loading-spinner">{t.toss.controls.divining}</div>
                    ) : (
                        <div className="ai-markdown-content">
                            <ReactMarkdown>
                                {aiResponse || formatAI(t.result.aiPlaceholder, { hexName: hexagram.name, question: question })}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Share Control */}
            <div className="action-buttons">
                <button className="share-btn" onClick={handleShare} disabled={loadingAI}>
                    {lang === 'zh' ? '分享结果 (生成图片)' : 'Share Result (Image)'}
                </button>
                <button className="reset-btn" onClick={onReset}>{t.result.askAnother}</button>
            </div>

            {/* Hidden Share Card for Capture */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                {hexagram && (
                    <ShareCard
                        innerRef={shareCardRef}
                        question={question}
                        lines={lines}
                        hexagram={hexagram}
                        summary={summary || aiResponse.substring(0, 150) + "..."}
                        t={t}
                        lang={lang}
                    />
                )}
            </div>

            <style>{`
                .result-container {
                    text-align: left;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .question-display {
                    font-size: 1.2rem;
                    color: var(--color-text-secondary);
                    margin-bottom: 2rem;
                    border-left: 4px solid var(--color-accent);
                    padding-left: 1rem;
                }
                .hex-display-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .hex-info {
                    flex: 1;
                    min-width: 250px;
                }
                .ai-analysis-section {
                    background: var(--color-bg-secondary);
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-top: 2rem;
                    border: 1px solid var(--color-accent-glow);
                }
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    width: 100%;
                }
                .reset-btn, .share-btn {
                    flex: 1;
                    padding: 0.8rem;
                    cursor: pointer;
                    font-size: 1rem;
                    border-radius: 4px;
                }
                .share-btn {
                    background: transparent;
                    border: 1px solid var(--color-accent);
                    color: var(--color-accent);
                }
                .share-btn:hover {
                    background: var(--color-accent);
                    color: var(--color-bg-primary);
                }
                .reset-btn {
                    background: var(--color-text-primary);
                    color: var(--color-bg-primary);
                    border: none;
                }
                .loading-spinner {
                    color: var(--color-accent);
                    font-style: italic;
                    animation: pulse 1.5s infinite;
                }
                .ai-markdown-content {
                    line-height: 1.6;
                    font-size: 0.95rem;
                }
                .ai-markdown-content h3, .ai-markdown-content h4 {
                    color: var(--color-accent);
                    margin-top: 1.2rem;
                    margin-bottom: 0.5rem;
                }
                .ai-markdown-content p {
                    margin-bottom: 0.8rem;
                }
                .ai-markdown-content ul {
                    padding-left: 1.5rem;
                    margin-bottom: 0.8rem;
                }
                .ai-markdown-content li {
                    margin-bottom: 0.4rem;
                }
                .ai-markdown-content strong {
                    color: var(--color-accent-glow); 
                    font-weight: bold;
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default ResultView;
