import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { summarizeArticle, explainArticle, generateReactions } from '@/lib/gemini'
import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'

const parser = new Parser()

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST() {
  try {
    const articles = []

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url)
        const items = feed.items.slice(0, 2)

        for (const item of items) {
          const title = item.title ?? ''
          const content = item.contentSnippet ?? item.content ?? ''

          const summary = await summarizeArticle(title, content)
          await wait(8000)
          const explanation = await explainArticle(title, content)
          await wait(8000)
          const reactions = await generateReactions(title, content)
          await wait(8000)

          articles.push({
            title,
            url: item.link ?? '',
            source_name: source.label,
            content,
            summary_ai: summary,
            explanation_ai: explanation + '\n\n---reactions---\n' + reactions,
            image_url: null,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
            category: source.category,
          })
        }
      } catch (e) {
        console.error(`Failed to fetch ${source.url}:`, e)
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