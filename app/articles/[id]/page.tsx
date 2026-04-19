import { supabase } from '@/lib/supabase'

export default async function ArticlePage({ params }: any) {
  const { id } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) return <div>記事が見つかりません</div>

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <a href="/" style={{ fontSize: '13px', color: '#558aff' }}>一覧へ戻る</a>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '1rem 0 4px' }}>{article.source_name}</p>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.4', color: '#f1f1f1' }}>
        {article.title}
      </h1>
      {article.summary_ai && article.summary_ai !== '要約できませんでした' && (
        <div style={{ background: '#0d0d2b', borderLeft: '3px solid #558aff', borderRadius: '0 6px 6px 0', padding: '10px 12px', marginBottom: '1rem' }}>
          <div style={{ fontSize: '10px', color: '#558aff', marginBottom: '4px', fontWeight: 500 }}>AI要約</div>
          <div style={{ fontSize: '13px', color: '#a5b4fc', whiteSpace: 'pre-line', lineHeight: '1.7' }}>{article.summary_ai}</div>
        </div>
      )}
      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginBottom: '1.5rem' }}>{article.content}</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={article.url} target="_blank" style={{ fontSize: '13px', padding: '8px 16px', border: '1px solid #3a3a3a', borderRadius: '6px', color: '#9ca3af', background: '#222', textDecoration: 'none' }}>元記事を読む</a>
        <a href={`/articles/${article.id}/chat`} style={{ fontSize: '13px', padding: '8px 16px', background: '#1e3a8a', borderRadius: '6px', color: '#93c5fd', border: '1px solid #1e40af', textDecoration: 'none' }}>深掘りチャット</a>
      </div>
    </main>
  )
}