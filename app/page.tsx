'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { key: 'all', label: 'すべて' },
  { key: 'world', label: '国際' },
  { key: 'business', label: 'ビジネス' },
  { key: 'technology', label: 'テクノロジー' },
  { key: 'science', label: 'サイエンス' },
  { key: 'health', label: '健康' },
  { key: 'ai', label: 'AI' },
]

export default function Home() {
  const [articles, setArticles] = useState<any[]>([])
  const [selected, setSelected] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/articles' + (selected !== 'all' ? `?category=${selected}` : ''))
      .then(r => r.json())
      .then(data => { setArticles(data.articles ?? []); setLoading(false) })
  }, [selected])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', fontFamily: '-apple-system, sans-serif' }}>
      <aside style={{ width: '180px', background: '#0a0a0a', borderRight: '1px solid #1f1f1f', padding: '20px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1f1f1f', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            My<span style={{ color: '#558aff' }}>News</span>
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#4b5563', padding: '0 16px', marginBottom: '8px', letterSpacing: '0.08em' }}>
          カテゴリ
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            style={{
              width: '100%',
              padding: '9px 16px',
              fontSize: '13px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: selected === cat.key ? '#1a1a2e' : 'transparent',
              color: selected === cat.key ? '#fff' : '#6b7280',
              border: 'none',
              borderRight: selected === cat.key ? '2px solid #558aff' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', flexShrink: 0, display: 'inline-block' }} />
            {cat.label}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '24px', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
          最新ニュース
        </h1>
        {loading ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>読み込み中...</p>
        ) : articles.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>記事がありません</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.map((article: any) => (
              <div key={article.id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{article.source_name}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#1a1a2e', color: '#818cf8' }}>
                    {CATEGORIES.find(c => c.key === article.category)?.label ?? article.category}
                  </span>
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f1f1', marginBottom: '10px', lineHeight: '1.4' }}>
                  {article.title}
                </h2>
                {article.summary_ai && article.summary_ai !== '要約できませんでした' && (
                  <div style={{ background: '#0d0d2b', borderLeft: '3px solid #558aff', borderRadius: '0 6px 6px 0', padding: '10px 12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#558aff', marginBottom: '4px', fontWeight: 500 }}>AI要約</div>
                    <div style={{ fontSize: '12px', color: '#a5b4fc', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {article.summary_ai}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  
                  <a href={article.url} target="_blank" style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #3a3a3a', color: '#9ca3af', background: '#222', textDecoration: 'none' }}>元記事を読む</a>
                  
                 <a href={`/articles/${article.id}/chat`} style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '6px', background: '#1e3a8a', color: '#93c5fd', border: '1px solid #1e40af', textDecoration: 'none' }}>深掘りチャット</a>              </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}