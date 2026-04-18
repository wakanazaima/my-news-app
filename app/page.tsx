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

  useEffect(() => {
    fetch('/api/articles' + (selected !== 'all' ? `?category=${selected}` : ''))
      .then(r => r.json())
      .then(data => setArticles(data.articles ?? []))
  }, [selected])

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem' }}>
        My News
      </h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelected(cat.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid',
              fontSize: '13px',
              cursor: 'pointer',
              background: selected === cat.key ? '#6366f1' : 'transparent',
              color: selected === cat.key ? '#fff' : '#6b7280',
              borderColor: selected === cat.key ? '#6366f1' : '#e5e7eb',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {articles.map((article: any) => (
          <div key={article.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              {article.source_name}
            </p>
            <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
              {article.title}
            </h2>
            {article.summary_ai && article.summary_ai !== '要約できませんでした' ? (
              <div style={{ background: '#f5f3ff', borderRadius: '6px', padding: '8px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: '500', color: '#6d28d9', marginBottom: '4px' }}>
                  AI要約
                </p>
                <p style={{ fontSize: '13px', color: '#4c1d95', whiteSpace: 'pre-line' }}>
                  {article.summary_ai}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                {article.content}
              </p>
            )}
            <a href={`/articles/${article.id}`} style={{ fontSize: '13px', color: '#6366f1' }}>
              詳細を見る
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}