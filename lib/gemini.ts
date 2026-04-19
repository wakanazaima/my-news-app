const GEMINI_API_KEY = process.env.GEMINI_API_KEY

async function callGemini(prompt: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )
    const data = await res.json()
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
  }
  return ''
}

export async function summarizeArticle(title: string, content: string): Promise<string> {
  const prompt = `以下のニュース記事を日本語で3行の箇条書きで要約してください。
前置きや説明は不要です。箇条書きの内容だけ出力してください。

タイトル: ${title}
内容: ${content}`

  return callGemini(prompt) || '要約できませんでした'
}

export async function explainArticle(title: string, content: string): Promise<string> {
  const prompt = `以下のニュース記事の背景・文脈・重要性を日本語で説明してください。
専門用語はわかりやすく解説し、3〜5文程度でまとめてください。
前置きや説明は不要です。解説の内容だけ出力してください。

タイトル: ${title}
内容: ${content}`

  return callGemini(prompt) || '解説できませんでした'
}

export async function generateReactions(title: string, content: string): Promise<string> {
  const prompt = `以下のニュース記事に対して、一般の読者が持ちそうな反応・意見・感想を日本語で3つ生成してください。
賛成・反対・驚きなど異なる視点から書いてください。
前置きや説明は不要です。以下の形式で出力してください：

・[反応1]
・[反応2]
・[反応3]

タイトル: ${title}
内容: ${content}`

  return callGemini(prompt) || '反応を生成できませんでした'
}