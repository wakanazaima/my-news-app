'use client'
import { useState, use, useEffect } from 'react'

interface Message {
  role: string
  content: string
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [article, setArticle] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'chat' | 'explain' | 'reactions'>('chat')

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(r => r.json())
      .then(data => setArticle(data.article))
  }, [id])

  async function sendMessage() {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: id, messages: newMessages }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  const explanation = article?.explanation_ai?.split('\n\n---reactions---\n')[0] ?? ''
  const reactions = article?.explanation_ai?.split('\n\n---reactions---\n')[1] ?? ''

  const tabs = [
    { key: 'chat', label: '深掘りチャット' },
    { key: 'explain', label: '背景解説' },
    { key: 'reactions', label: '読者の反応' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', fontFamily: '-apple-system, sans-serif' }}>
      <aside style={{ width: '180px', background: '#0a0a0a', borderRight: '1px solid #1f1f1f', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1f1f1f', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            My<span style={{ color: '#558aff' }}>News</span>
          </span>
        </div>
        <a href="/" style={{ display: 'block', padding: '9px 16px', fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>一覧へ戻る</a>
      </aside>

      <main style={{ flex: 1, padding: '24px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {article && (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>{article.source_name}</div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f1f1', marginBottom: '10px', lineHeight: '1.4' }}>
              {article.title}
            </h1>
            {article.summary_ai && article.summary_ai !== '要約できませんでした' && (
              <div style={{ background: '#0d0d2b', borderLeft: '3px solid #558aff', borderRadius: '0 6px 6px 0', padding: '10px 12px' }}>
                <div style={{ fontSize: '10px', color: '#558aff', marginBottom: '4px', fontWeight: 500 }}>AI要約</div>
                <div style={{ fontSize: '12px', color: '#a5b4fc', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{article.summary_ai}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #2a2a2a', paddingBottom: '0' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #558aff' : '2px solid transparent',
                color: tab === t.key ? '#fff' : '#6b7280',
                cursor: 'pointer',
                fontWeight: tab === t.key ? 500 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'chat' && (
          <>
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', flex: 1, minHeight: '300px' }}>
              {messages.length === 0 && (
                <p style={{ color: '#4b5563', fontSize: '14px' }}>この記事について何でも質問してください</p>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    background: m.role === 'user' ? '#1e3a8a' : '#222',
                    color: m.role === 'user' ? '#93c5fd' : '#e5e7eb',
                    whiteSpace: 'pre-line',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <p style={{ color: '#4b5563', fontSize: '14px' }}>考え中...</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="質問を入力..."
                style={{ flex: 1, padding: '12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '14px', color: '#f1f1f1', outline: 'none' }}
              />
              <button
                onClick={sendMessage}
                style={{ padding: '12px 20px', background: '#558aff', color: '#fff', borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                送信
              </button>
            </div>
          </>
        )}

        {tab === 'explain' && (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '20px' }}>
            {explanation ? (
              <p style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{explanation}</p>
            ) : (
              <p style={{ color: '#4b5563', fontSize: '14px' }}>解説データがありません。記事を再取得してください。</p>
            )}
          </div>
        )}

        {tab === 'reactions' && (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '20px' }}>
            {reactions ? (
              <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{reactions}</div>
            ) : (
              <p style={{ color: '#4b5563', fontSize: '14px' }}>反応データがありません。記事を再取得してください。</p>
            )}
          </div>
        )}

      </main>
    </div>
  )
}