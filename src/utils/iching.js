/**
 * I Ching Logic Utility
 */

import { hexagrams } from '../data/hexagrams';

// Coin values: Head = 3, Tail = 2
// Sums:
// 6 = 2+2+2 = Old Yin (Changing to Yang) --x--
// 7 = 3+2+2 or 2+3+2 or 2+2+3 = Young Yang -----
// 8 = 3+3+2 or ... = Young Yin -- --
// 9 = 3+3+3 = Old Yang (Changing to Yin) --o--

export const COIN_VALUE_HEAD = 3;
export const COIN_VALUE_TAIL = 2;

export const LINE_TYPE = {
    OLD_YIN: 6,
    YOUNG_YANG: 7,
    YOUNG_YIN: 8,
    OLD_YANG: 9
};

/**
 * Simulates a single coin toss
 * @returns {number} 2 or 3
 */
const tossOneCoin = () => {
    return Math.random() < 0.5 ? COIN_VALUE_TAIL : COIN_VALUE_HEAD;
};

/**
 * Simulates tossing 3 coins
 * @returns {object} result with total value and individual coins
 */
export const tossLine = () => {
    const coins = [tossOneCoin(), tossOneCoin(), tossOneCoin()];
    const total = coins.reduce((a, b) => a + b, 0);
    return {
        total, // 6, 7, 8, 9
        coins,  // [3, 2, 2] etc
        isChanging: total === 6 || total === 9
    };
};

// Trigram Data (Bottom -> Top binary)
// 1=Yang, 0=Yin
export const TRIGRAMS = {
    "111": { key: "qian", name: "Qian", nature: "Heaven", zh: "乾", natureZh: "天" },
    "110": { key: "dui", name: "Dui", nature: "Lake", zh: "兑", natureZh: "泽" },
    "101": { key: "li", name: "Li", nature: "Fire", zh: "离", natureZh: "火" },
    "100": { key: "zhen", name: "Zhen", nature: "Thunder", zh: "震", natureZh: "雷" },
    "011": { key: "xun", name: "Xun", nature: "Wind", zh: "巽", natureZh: "风" },
    "010": { key: "kan", name: "Kan", nature: "Water", zh: "坎", natureZh: "水" },
    "001": { key: "gen", name: "Gen", nature: "Mountain", zh: "艮", natureZh: "山" },
    "000": { key: "kun", name: "Kun", nature: "Earth", zh: "坤", natureZh: "地" }
};

/**
 * Identify Trigram from 3 lines
 * @param {Array} lines Array of 3 lines (objects or numbers)
 */
export const getTrigram = (lines) => {
    if (lines.length !== 3) return null;
    const key = getHexagramKey(lines);
    return TRIGRAMS[key];
};

/**
 * Convert 6 lines (bottom to top) to a binary string key.
 * 0 for Yin (8, 6), 1 for Yang (7, 9).
 * Note: This finds the "Original" Hexagram.
 * @param {Array} lines Array of 6 line objects/numbers
 * @returns {string} Key like "111111"
 */
export const getHexagramKey = (lines) => {
    // lines[0] is bottom
    return lines.map(line => {
        const val = typeof line === 'object' ? line.total : line;
        return (val % 2 !== 0) ? '1' : '0'; // 7,9 are Odd (Yang=1), 6,8 are Even (Yin=0)
    }).join('');
};

/**
 * Find Hexagram data by lines
 * @param {Array} lines 
 */
export const lookupHexagram = (lines) => {
    const key = getHexagramKey(lines);
    return hexagrams.find(h => h.binary === key) || null;
};
