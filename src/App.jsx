import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './styles/theme.css';
import QuestionInput from './components/QuestionInput';
import CoinToss from './components/CoinToss';
import ResultView from './components/ResultView';
import HexagramDisplay from './components/HexagramDisplay';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const STEP_QUESTION = 0;
const STEP_TOSS = 1;
const STEP_RESULT = 2;

import AISettings from './components/AISettings';

function AppContent() {
  const [step, setStep] = useState(STEP_QUESTION);
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState([]);
  const { t, lang, switchLanguage } = useLanguage();

  // AI Config State
  const [aiConfig, setAiConfig] = useState({ provider: 'gemini', apiKey: '' });
  const [showSettings, setShowSettings] = useState(false);

  const handleQuestionConfirm = (q) => {
    setQuestion(q);
    setStep(STEP_TOSS);
    setLines([]);
  };

  const handleTossComplete = (lineResult) => {
    const newLines = [...lines, lineResult];
    setLines(newLines);
    if (newLines.length >= 6) {
      setStep(STEP_RESULT);
    }
  };

  const handleReset = () => {
    setStep(STEP_QUESTION);
    setQuestion('');
    setLines([]);
  };

  return (
    <div className="container">
      <header>
        <h1>{t.appTitle}</h1>
        <div className="header-controls">
          <div className="lang-toggle">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLanguage('en')}>EN</button>
            <button className={lang === 'zh' ? 'active' : ''} onClick={() => switchLanguage('zh')}>中文</button>
          </div>

          {step === STEP_QUESTION && (
            <div className="ai-mode-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showSettings || (aiConfig.apiKey !== '')} // Simple heuristic: if key exists, it's effectively "Custom Mode". Or track explicit mode.
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowSettings(true);
                    } else {
                      // Turn off custom mode -> Clear key or just unset mode?
                      // Let's just unset the key for now to signify "Default"
                      setAiConfig({ ...aiConfig, apiKey: '' });
                    }
                  }}
                />
                <span className="slider round"></span>
              </label>
              <span className="switch-label" onClick={() => setShowSettings(true)}>
                {t.settings.useCustom}
              </span>
            </div>
          )}
        </div>
      </header>

      <main>
        {step === STEP_QUESTION && (
          <QuestionInput onConfirm={handleQuestionConfirm} />
        )}

        {step === STEP_TOSS && (
          <div className="toss-flow">
            <HexagramDisplay lines={lines} />
            <CoinToss onTossComplete={handleTossComplete} step={lines.length + 1} />
          </div>
        )}

        {step === STEP_RESULT && (
          <ResultView question={question} lines={lines} onReset={handleReset} aiConfig={aiConfig} />
        )}
      </main>

      {showSettings && (
        <AISettings
          config={aiConfig}
          onSave={(newConfig) => {
            setAiConfig(newConfig);
            // Keep modal open or close? Usually close on save.
            // If they cancel/close without save, and key was empty, unchecked.
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      <footer>
        <p>&copy; {new Date().getFullYear()} Mystical AI</p>
      </footer>

      <Analytics />

      <style>{`
        header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            position: relative;
        }
        .header-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .lang-toggle {
            display: flex;
            gap: 10px;
        }
        .lang-toggle button {
            padding: 5px 10px;
            font-size: 0.8rem;
            opacity: 0.5;
            border-color: transparent;
        }
        .lang-toggle button.active {
            opacity: 1;
            border-color: var(--color-accent);
            text-decoration: underline;
        }
        
        /* Switch Toggle Styles */
        .ai-mode-switch {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--color-bg-secondary);
            border: 1px solid var(--color-text-secondary);
            transition: .4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 2px;
            background-color: var(--color-text-secondary);
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: var(--color-accent);
            border-color: var(--color-accent);
        }
        input:checked + .slider:before {
            transform: translateX(18px);
            background-color: var(--color-bg-primary);
        }
        .switch-label {
            cursor: pointer;
            border-bottom: 1px dashed transparent;
        }
        .switch-label:hover {
            border-bottom-color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
