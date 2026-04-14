import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  let query = supabase
    .from('articles')
    .select('*')
    .order('fetched_at', { ascending: false })
    .limit(20)

  if (category) {
    query = query.eq('category', category)
  }

  const { data: articles } = await query

  return NextResponse.json({ articles })
}