import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { summarizeArticle } from '@/lib/gemini'

const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const CATEGORIES = ['business', 'science', 'health']

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST() {
  try {
    const articles = []

    for (const category of CATEGORIES) {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=3&apiKey=${NEWSAPI_KEY}`
      )
      const data = await res.json()
      if (data.articles) {
        for (const a of data.articles) {
          const summary = await summarizeArticle(
            a.title ?? '',
            a.description ?? ''
          )
 articles.push({
  title: a.title,
  url: a.url,
  source_name: a.source?.name,
  content: a.description,
  summary_ai: summary,
  image_url: a.urlToImage,
  published_at: a.publishedAt,
  category: category,
})
          await wait(5000)
        }
      }
    }

    const { error } = await supabase
      .from('articles')
      .upsert(articles, { onConflict: 'url', ignoreDuplicates: true })

    if (error) throw error

    return NextResponse.json({ success: true, count: articles.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}