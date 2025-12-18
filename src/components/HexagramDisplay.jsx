import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTrigram } from '../utils/iching';

// Line types: 6(Old Yin), 7(Young Yang), 8(Young Yin), 9(Old Yang)
const Line = ({ value, isOld }) => {
    // Odd = Yang, Even = Yin
    const isYang = value % 2 !== 0;

    return (
        <div className={`hex-line ${isOld ? 'changing' : ''} ${isYang ? 'yang' : 'yin'}`}>
            {isYang ? (
                <div className="bar yang-bar"></div>
            ) : (
                <div className="yin-bar-group">
                    <div className="bar yin-part"></div>
                    <div className="yin-gap"></div>
                    <div className="bar yin-part"></div>
                </div>
            )}

            <style>{`
                .hex-line {
                    width: 200px;
                    height: 24px;
                    margin: 8px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .bar {
                    height: 100%;
                    background-color: var(--color-text-primary);
                    border-radius: 2px;
                    transition: all 0.5s ease;
                }
                .yang-bar {
                    width: 100%;
                }
                .yin-bar-group {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                }
                .yin-part {
                    width: 42%;
                }
                .yin-gap {
                    width: 16%;
                }
                .changing .bar {
                    background-color: var(--color-accent);
                    box-shadow: 0 0 8px var(--color-accent-glow);
                }
            `}</style>
        </div>
    );
};

const TrigramBlock = ({ lines, trigram, isUpper, t, lang }) => {
    // Render lines in reverse (top to bottom of this block)
    const renderLines = [...lines].reverse();

    // Trigram Display Name
    const triName = trigram ? (lang === 'zh' ? trigram.zh : trigram.name) : '';
    const triNature = trigram ? (lang === 'zh' ? trigram.natureZh : trigram.nature) : '';
    const label = trigram
        ? `${isUpper ? t.hexParts.upper : t.hexParts.lower}: ${triName} (${triNature})`
        : '';

    return (
        <div className="trigram-block">
            <div className="lines-stack">
                {renderLines.map((line, idx) => (
                    <div key={idx} className="hex-line-row">
                        <Line value={line.total} isOld={line.isChanging} />
                        <span className="line-label">
                            {t && t.lineTypes && t.lineTypes[line.total]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Display Trigram Label if we have a full trigram (3 lines) */}
            {lines.length === 3 && trigram && (
                <div className="trigram-label fade-in">
                    {label}
                </div>
            )}

            <style>{`
                .trigram-block {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 15px; 
                    position: relative;
                }
                .lines-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .trigram-label {
                    position: absolute;
                    left: 100%; /* Right side of the block */
                    margin-left: 20px;
                    width: 200px;
                    text-align: left;
                    font-size: 1rem;
                    color: var(--color-accent);
                    border-left: 2px solid var(--color-accent);
                    padding-left: 10px;
                    display: flex;
                    align-items: center;
                    height: 80%; /* Vertical bracket effect */
                    top: 10%;
                }
                .hex-line-row {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .line-label {
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                    min-width: 100px; 
                    text-align: left;
                }
            `}</style>
        </div>
    );
};

const HexagramDisplay = ({ lines }) => {
    const { t, lang } = useLanguage();

    const lowerLines = lines.slice(0, 3);
    const upperLines = lines.slice(3);

    const lowerTrigram = getTrigram(lowerLines);
    const upperTrigram = getTrigram(upperLines);

    return (
        <div className="hexagram-container">
            {/* Upper Section first (visually on top) */}
            {upperLines.length > 0 && (
                <TrigramBlock
                    lines={upperLines}
                    trigram={upperTrigram}
                    isUpper={true}
                    t={t}
                    lang={lang}
                />
            )}

            {/* Gap between trigrams if both exist */}
            {upperLines.length > 0 && lowerLines.length > 0 && <div className="trigram-gap"></div>}

            {/* Lower Section */}
            {lowerLines.length > 0 && (
                <TrigramBlock
                    lines={lowerLines}
                    trigram={lowerTrigram}
                    isUpper={false}
                    t={t}
                    lang={lang}
                />
            )}

            {lines.length === 0 && <div className="placeholder-text">The hexagram forms...</div>}

            <style>{`
                .hexagram-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 2rem 0;
                    min-height: 200px;
                    justify-content: center;
                }
                .trigram-gap {
                    height: 30px; /* Distinct separation between Upper and Lower */
                }
                .placeholder-text {
                    color: var(--color-text-secondary);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default HexagramDisplay;
