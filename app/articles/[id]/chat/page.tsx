'use client'
import { useState, use } from 'react'

export default function ChatPage({ params }: any) {
  const { id } = use(params)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: id,
        messages: newMessages,
      }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <a href={`/articles/${id}`} style={{ fontSize: '13px', color: '#6366f1' }}>
        記事へ戻る
      </a>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '1rem 0' }}>
        深掘りチャット
      </h1>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', minHeight: '400px', marginBottom: '1rem' }}>
        {messages.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            この記事について何でも質問してください
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px',
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#6366f1' : '#f3f4f6',
              color: m.role === 'user' ? '#fff' : '#111827',
              whiteSpace: 'pre-line',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>考え中...</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="質問を入力..."
          style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', borderRadius: '6px', fontSize: '14px', border: 'none', cursor: 'pointer' }}
        >
          送信
        </button>
      </div>
    </main>
  )
}