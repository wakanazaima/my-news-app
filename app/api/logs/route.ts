import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { articleId } = await req.json()

  const { error } = await supabase
    .from('article_logs')
    .insert({ article_id: articleId })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const { data: logs } = await supabase
    .from('article_logs')
    .select('article_id, viewed_at, articles(id, title, category)')
    .order('viewed_at', { ascending: false })
    .limit(10)

  return NextResponse.json({ logs })
}