import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteNav from '../../../components/SiteNav'
import SiteFooter from '../../../components/SiteFooter'
import { articles, getArticleBySlug } from '../../../lib/articles'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — Unimod Motors`,
    description: article.content[0]?.slice(0, 160),
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const currentIdx = articles.findIndex(a => a.slug === article.slug)
  const prev = currentIdx > 0 ? articles[currentIdx - 1] : null
  const next = currentIdx < articles.length - 1 ? articles[currentIdx + 1] : null

  return (
    <main className="bg-[#0a0a0a] text-[#f0ede8] font-sans antialiased min-h-screen">
      <SiteNav />

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/column" className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-[#f0ede8] no-underline transition-colors mb-8">
            ← Back to Column
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[rgba(232,93,47,0.1)] border border-[rgba(232,93,47,0.2)] text-[#f0923a]">
              {article.category}
            </span>
            {article.featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[rgba(234,179,8,0.1)] border border-[rgba(234,179,8,0.2)] text-[#eab308]">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-4">{article.title}</h1>

          <div className="flex items-center gap-3 text-sm text-[#888] mb-10 pb-8 border-b border-[#2a2a2a]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3a8ef0] to-[#5fb4f5] flex items-center justify-center text-xs font-bold text-white">
              {article.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-[#f0ede8]">{article.author}</span>
            <span className="text-[#555]">·</span>
            <span>{article.date}</span>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-[#ccc] leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {article.externalUrl && (
            <div className="mt-8 p-4 bg-[#111] border border-[#2a2a2a] rounded-xl">
              <p className="text-sm text-[#888]">
                Read the full story at{' '}
                <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className="text-[#e85d2f] hover:text-[#f0923a] underline">
                  the original source →
                </a>
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-start mt-16 pt-8 border-t border-[#2a2a2a] gap-4">
            {prev ? (
              <Link href={`/column/${prev.slug}`} className="text-sm text-[#888] hover:text-[#f0ede8] no-underline transition-colors">
                <span className="text-[10px] uppercase tracking-wider text-[#555] block mb-1">Previous</span>
                ← {prev.title}
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/column/${next.slug}`} className="text-sm text-[#888] hover:text-[#f0ede8] no-underline transition-colors text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#555] block mb-1">Next</span>
                {next.title} →
              </Link>
            ) : <div />}
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  )
}
