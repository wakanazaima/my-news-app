'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { key: 'all', label: 'すべて' },
  { key: 'world', label: '国際情勢' },
  { key: 'business', label: '経済・企業' },
  { key: 'beauty', label: '化粧品・美容' },
  { key: 'technology', label: 'テクノロジー' },
  { key: 'science', label: 'サイエンス' },
  { key: 'health', label: '健康' },
]
export default function Home() {
  const [articles, setArticles] = useState<any[]>([])
  const [selected, setSelected] = useState('all')
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<any[]>([])
  const [updating, setUpdating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(1)
  }, [selected])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selected !== 'all') params.set('category', selected)
    params.set('page', String(page))
    fetch('/api/articles?' + params.toString())
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles ?? [])
        setTotalPages(data.totalPages ?? 1)
        setLoading(false)
      })
  }, [selected, page])

  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(data => setLogs(data.logs ?? []))
  }, [])

  async function fetchArticles() {
    setUpdating(true)
    fetch('/api/articles/fetch', { method: 'POST' }).then(() => {
      const params = new URLSearchParams()
      if (selected !== 'all') params.set('category', selected)
      params.set('page', '1')
      fetch('/api/articles?' + params.toString())
        .then(r => r.json())
        .then(data => {
          setArticles(data.articles ?? [])
          setTotalPages(data.totalPages ?? 1)
        })
    })
    setTimeout(() => setUpdating(false), 3000)
  }

  async function logView(articleId: string) {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f0f', fontFamily: '-apple-system, sans-serif' }}>
      {!isMobile && (
        <aside style={{ width: '180px', background: '#0a0a0a', borderRight: '1px solid #1f1f1f', padding: '20px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1f1f1f', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
              My<span style={{ color: '#558aff' }}>News</span>
            </span>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <button
              onClick={fetchArticles}
              disabled={updating}
              style={{ width: '100%', padding: '8px', background: updating ? '#1a1a2e' : '#558aff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: updating ? 'not-allowed' : 'pointer', fontWeight: 500 }}
            >
              {updating ? '更新中...' : '記事を更新'}
            </button>
          </div>
          <div style={{ fontSize: '10px', color: '#4b5563', padding: '0 16px', marginBottom: '8px', letterSpacing: '0.08em' }}>カテゴリ</div>
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
          <div style={{ marginTop: '24px', borderTop: '1px solid #1f1f1f', paddingTop: '16px' }}>
            <div style={{ fontSize: '10px', color: '#4b5563', padding: '0 16px', marginBottom: '8px', letterSpacing: '0.08em' }}>最近読んだ記事</div>
            {logs.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#4b5563', padding: '0 16px' }}>まだありません</div>
            ) : (
              logs.map((log: any, i: number) => (
                <a key={i} href={`/articles/${log.article_id}/chat`} style={{ display: 'block', padding: '8px 16px', fontSize: '12px', color: '#6b7280', textDecoration: 'none', lineHeight: '1.4' }}>{log.articles?.title?.slice(0, 30)}...</a>
              ))
            )}
          </div>
        </aside>
      )}

      <main style={{ flex: 1, padding: isMobile ? '16px' : '24px', maxWidth: '800px' }}>
        {isMobile && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
                My<span style={{ color: '#558aff' }}>News</span>
              </span>
              <button
                onClick={fetchArticles}
                disabled={updating}
                style={{ padding: '6px 12px', background: updating ? '#1a1a2e' : '#558aff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: updating ? 'not-allowed' : 'pointer', fontWeight: 500 }}
              >
                {updating ? '更新中...' : '記事を更新'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelected(cat.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: selected === cat.key ? '#558aff' : 'transparent',
                    color: selected === cat.key ? '#fff' : '#6b7280',
                    borderColor: selected === cat.key ? '#558aff' : '#2a2a2a',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isMobile && (
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>最新ニュース</h1>
        )}

        {loading ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>読み込み中...</p>
        ) : articles.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>記事がありません</p>
        ) : (
          <>
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
                    <a href={article.url} target="_blank" onClick={() => logView(article.id)} style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '6px', border: '1px solid #3a3a3a', color: '#9ca3af', background: '#222', textDecoration: 'none' }}>元記事を読む</a>
                    <a href={`/articles/${article.id}/chat`} onClick={() => logView(article.id)} style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '6px', background: '#1e3a8a', color: '#93c5fd', border: '1px solid #1e40af', textDecoration: 'none' }}>詳細を見る</a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '8px 16px', background: page === 1 ? '#1a1a1a' : '#222', color: page === 1 ? '#4b5563' : '#9ca3af', border: '1px solid #2a2a2a', borderRadius: '6px', fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                前のページ
              </button>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: '8px 16px', background: page === totalPages ? '#1a1a1a' : '#222', color: page === totalPages ? '#4b5563' : '#9ca3af', border: '1px solid #2a2a2a', borderRadius: '6px', fontSize: '13px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                次のページ
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}