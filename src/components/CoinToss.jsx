import React, { useState, useEffect } from 'react';
import { COIN_VALUE_HEAD, COIN_VALUE_TAIL } from '../utils/iching';
import { useLanguage } from '../contexts/LanguageContext';

const Coin = ({ value, animating, t }) => {
    const isHead = value === COIN_VALUE_HEAD;
    const text = t
        ? (isHead ? t.toss.coin.side.head : t.toss.coin.side.tail)
        : (isHead ? 'Heads' : 'Tails');

    return (
        <div className={`coin ${animating ? 'spinning' : ''} ${isHead ? 'head' : 'tail'}`}>
            <span className="coin-text">{text}</span>

            <style>{`
                .coin {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 4px solid var(--color-accent);
                    background: var(--color-bg-secondary);
                    color: var(--color-accent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    position: relative;
                    transition: transform 0.1s;
                }
                 /* This is a simplified 2D representation. 3D flip would be better but keeping it simple for now */
                .head {
                    background: var(--color-accent);
                    color: var(--color-bg-primary);
                }
                .tail {
                    background: var(--color-bg-secondary);
                }
                .spinning {
                    animation: spin 0.5s infinite linear;
                }

                @keyframes spin {
                    0% { transform: rotateY(0deg) scale(1); }
                    50% { transform: rotateY(180deg) scale(1.1); }
                    100% { transform: rotateY(360deg) scale(1); }
                }
            `}</style>
        </div>
    );
};

const CoinToss = ({ onTossComplete, step }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [coins, setCoins] = useState([0, 0, 0]); // 0 = hidden/initial
    const { t } = useLanguage();

    const handleToss = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Audio effect could go here

        setTimeout(() => {
            // Logic handled by parent, but we need to show the result here?
            // Actually parent should call the logic, but we can do it here and pass result up.
            // Let's assume parent passed a function that returns the result OR we call onTossComplete
            // But for animation sync, we generate it here?
            // Better: `onTossComplete` is called after animation, passing the result.

            // Randomize for visual only?
            // No, consistency. Let parent handle logic? 
            // Let's implement logic call inside.

            // Wait, we need the result to display.
            // Let's pass the result calculation to the parent via callback?
            // Or import the util here.

            import('../utils/iching').then(({ tossLine }) => {
                const result = tossLine();
                setCoins(result.coins);
                setIsAnimating(false);

                // Small delay to let user see coins before line appears?
                setTimeout(() => {
                    onTossComplete(result);
                }, 1000);
            });

        }, 1500); // Animation duration
    };

    return (
        <div className="toss-container">
            <h3>{t.toss.line.replace('{n}', step)}</h3>
            <div className="coins-area">
                {coins.map((c, i) => (
                    <Coin key={i} value={c} animating={isAnimating} t={t} />
                ))}
            </div>

            <div className="controls">
                <button onClick={handleToss} disabled={isAnimating}>
                    {isAnimating ? t.toss.controls.divining : t.toss.controls.toss}
                </button>
            </div>

            <style>{`
                .toss-container {
                    text-align: center;
                }
                .coins-area {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin: 2rem 0;
                    height: 100px; /* fixed height */
                }
            `}</style>
        </div>
    );
};

export default CoinToss;
