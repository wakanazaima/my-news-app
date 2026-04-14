import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: Request) {
  const { articleId, messages } = await req.json()

  const { data: article } = await supabase
    .from('articles')
    .select('title, content, summary_ai')
    .eq('id', articleId)
    .single()

  const systemPrompt = `あなたはニュース解説AIです。以下の記事についてユーザーの質問に日本語でわかりやすく答えてください。

【記事タイトル】
${article?.title}

【記事内容】
${article?.content}

【AI要約】
${article?.summary_ai}`

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'わかりました。この記事について質問にお答えします。' }] },
    ...messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  ]

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    }
  )

  const data = await res.json()
  console.log('Gemini chat response:', JSON.stringify(data))
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '回答できませんでした'

  return NextResponse.json({ reply })
}