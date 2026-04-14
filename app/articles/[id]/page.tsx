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
      <a href="/" style={{ fontSize: '13px', color: '#6366f1' }}>
        一覧へ戻る
      </a>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '1rem 0 4px' }}>
        {article.source_name}
      </p>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.4' }}>
        {article.title}
      </h1>
      {article.summary_ai && article.summary_ai !== '要約できませんでした' && (
        <div style={{ background: '#f5f3ff', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', color: '#6d28d9', marginBottom: '6px' }}>
            AI要約
          </p>
          <p style={{ fontSize: '14px', color: '#4c1d95', whiteSpace: 'pre-line', lineHeight: '1.7' }}>
            {article.summary_ai}
          </p>
        </div>
      )}
      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginBottom: '1.5rem' }}>
        {article.content}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <a href={article.url} target="_blank" style={{ fontSize: '13px', padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '6px', color: '#374151' }}>
          元記事を読む
        </a>
        <a href={`/articles/${article.id}/chat`} style={{ fontSize: '13px', padding: '8px 16px', background: '#6366f1', borderRadius: '6px', color: '#fff' }}>
          深掘りチャット
        </a>
      </div>
    </main>
  )
}