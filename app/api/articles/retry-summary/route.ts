import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { summarizeArticle } from '@/lib/gemini'

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .or('summary_ai.eq.要約できませんでした,summary_ai.is.null')

  if (!articles || articles.length === 0) {
    return NextResponse.json({ message: '再試行対象の記事はありません' })
  }

  let successCount = 0
  for (const article of articles) {
    const summary = await summarizeArticle(article.title ?? '', article.content ?? '')
    if (summary !== '要約できませんでした') {
      await supabase
        .from('articles')
        .update({ summary_ai: summary })
        .eq('id', article.id)
      successCount++
    }
    await wait(5000)
  }

  return NextResponse.json({ success: true, updated: successCount, total: articles.length })
}