import React from 'react';
import HexagramDisplay from './HexagramDisplay';

const ShareCard = ({ question, lines, hexagram, summary, t, lang, innerRef }) => {
    // We assume this component is rendered off-screen or in a hidden container
    // but visible to html2canvas. 
    // It's designed for iPhone 17 dimensions roughly (e.g. 1179 x 2556 pixels, or aspect ratio 9:19.5).
    // But for a share card, a standard 9:16 vertical ratio is good, or just auto height.
    // Let's go with a focused "Card" look.

    return (
        <div ref={innerRef} className="share-card-container">
            <div className="share-card-content">
                <header className="share-header">
                    <h1>{t ? t.appTitle : 'Zhou Yi'}</h1>
                    <div className="watermark">Mystical AI</div>
                </header>

                <div className="share-body">
                    <div className="share-section question-section">
                        <div className="label">{t ? t.question.title : 'Question'}</div>
                        <div className="value">"{question}"</div>
                    </div>

                    <div className="share-section hex-section">
                        <div className="hex-info-main">
                            <h2>#{hexagram.number} {hexagram.name}</h2>
                            <p className="hex-desc">
                                {lang === 'zh' ? (hexagram.description_zh || hexagram.description) : hexagram.description}
                            </p>
                        </div>
                        <div className="hex-graphic">
                            <HexagramDisplay lines={lines} />
                        </div>
                    </div>

                    {summary && (
                        <div className="share-section summary-section">
                            <div className="label">{t ? t.result.aisection : 'Interpretation'}</div>
                            <div className="summary-text">
                                {summary.replace(/###\s*(Summary|总结)/i, '').trim()}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="share-footer">
                    <div className="qr-placeholder">
                        {/* QR Code could go here */}
                        <div className="qr-box"></div>
                        <span>Scan to Ask</span>
                    </div>
                    <div className="date">{new Date().toLocaleDateString()}</div>
                </footer>
            </div>

            <style>{`
                .share-card-container {
                    width: 390px; /* iPhone width approx */
                    min-height: 844px; /* iPhone height approx */
                    background: #1a1a1a;
                    color: #fff;
                    font-family: 'Cinzel', serif; /* Inherit or force font */
                    padding: 40px 30px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Centered content */
                    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                    border: 2px solid #D4AF37; /* Gold border */
                    position: relative;
                }
                .share-card-content {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .share-header {
                    text-align: center;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .share-header h1 {
                    font-size: 2rem;
                    color: #D4AF37;
                    margin: 0;
                    letter-spacing: 2px;
                }
                .watermark {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.3);
                    margin-top: 5px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }

                .share-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .share-section .label {
                    font-size: 0.8rem;
                    color: #D4AF37;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    opacity: 0.8;
                }

                .question-section .value {
                    font-size: 1.2rem;
                    font-style: italic;
                    line-height: 1.4;
                    color: #f0f0f0;
                }

                .hex-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(255,255,255,0.03);
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }
                .hex-info-main {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .hex-info-main h2 {
                    font-size: 1.8rem;
                    color: #D4AF37;
                    margin: 0 0 10px 0;
                }
                .hex-desc {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    margin: 0;
                }
                /* Scale down hex graphic slightly */
                .hex-graphic {
                    transform: scale(0.9);
                }

                .summary-section {
                    background: rgba(212, 175, 55, 0.05); /* Slight gold tint */
                    padding: 20px;
                    border-left: 3px solid #D4AF37;
                    border-radius: 0 8px 8px 0;
                }
                .summary-text {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    text-align: justify;
                }

                .share-footer {
                    margin-top: 40px;
                    border-top: 1px solid rgba(212, 175, 55, 0.3);
                    padding-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.4);
                }
                .qr-placeholder {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .qr-box {
                    width: 40px;
                    height: 40px;
                    background: #fff; /* Placeholder for actual QR code */
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
};

export default ShareCard;
