
// Basic AI Service wrapper
export async function getAIInterpretation(provider, apiKey, question, hexagram, lang = 'en') {
    const prompt = lang === 'zh'
        ? `我正在诚心诚意地寻求周易的指引。
           问题：${question}
           卦象：#${hexagram.number} ${hexagram.name}
           卦辞：${hexagram.description_zh || hexagram.description}

           请你扮演一位精通易经的大师，根据卦象的深层含义（包括卦德、爻位、五行等），针对我的问题给出**直击要害、具体且富有洞见**的解读。
           不要给模棱两可的“场面话”，要像命运的预言一样深刻。如果卦象显示有风险，请直言不讳地警示；如果卦象吉利，请明确指引行动方向。
           请用优美、深邃但易懂的中文回答。
           
           **最后，请务必单独提供一段100字以内的“精炼总结”，用于社交分享卡片。请以“### 总结”作为这段的开头。内容纯粹为总结，不要包含“字数统计”或任何其他元数据。**`
        : `I am sincerely consulting the I Ching.
           Question: ${question}
           Hexagram: #${hexagram.number} ${hexagram.name} (${hexagram.english}).
           Judgment: ${hexagram.description}.

           Please act as an I Ching master. Provide a **direct, specific, and insightful** interpretation based on the deep meaning of the hexagram specifically for my question.
           Avoid vague or overly cautious advice. Speak like a true oracle. If the omen is difficult, warn me clearly; if auspicious, guide me specifically.
           Answer in profound yet accessible English.
           
           **Finally, strictly provide a concise summary (under 100 words) for a social share card. Label this section clearly with "### Summary". Do not include word counts or metadata.**`;

    if (provider === 'gemini') {
        return callGemini(apiKey, prompt);
    } else if (provider === 'openai') {
        return callOpenAI(apiKey, prompt);
    } else if (provider === 'grok') {
        // Grok API is compatible with OpenAI SDK but let's do fetch
        return callGrok(apiKey, prompt);
    } else {
        return "Unknown provider";
    }
}

async function callGemini(apiKey, prompt) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error calling Gemini API: " + error.message;
    }
}

async function callOpenAI(apiKey, prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // or gpt-4
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return "Error calling OpenAI API: " + error.message;
    }
}

async function callGrok(apiKey, prompt) {
    try {
        // Grok usually uses xAI endpoint compatible with OpenAI
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "grok-4-1-fast-non-reasoning", // Cheapest option per user request: $0.20/$0.50
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Grok API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Grok API Error:", error);
        return "Error calling Grok API: " + error.message;
    }
}
