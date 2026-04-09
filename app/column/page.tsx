import Link from 'next/link'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import PageHeader from '../../components/PageHeader'
import { articles } from '../../lib/articles'

export const metadata = {
  title: 'Column — Unimod Motors',
  description: 'Articles, videos, and education about engine technology, hydraulics, and the UniMod engine.',
}

const categories = ['All', 'Energy', 'Industry', 'Education', 'Videos', 'Automotive']

export default function ColumnPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f0ede8] font-sans antialiased min-h-screen">
      <SiteNav />
      <PageHeader
        label="Column"
        title="Articles & Updates"
        subtitle="Industry insights, education, and development updates from the Unimod Motors team."
      />

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#111] border border-[#2a2a2a] text-[#888] cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured articles */}
          {(() => {
            const featured = articles.filter(a => a.featured)
            if (featured.length === 0) return null
            return (
              <div className="mb-12">
                <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-[#e85d2f] mb-5">Featured</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {featured.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/column/${article.slug}`}
                      className="block border border-[#2a2a2a] rounded-2xl p-8 bg-[#111] relative overflow-hidden group hover:border-[rgba(232,93,47,0.4)] transition-colors no-underline"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#e85d2f] to-[#f0923a] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#e85d2f]">{article.category}</span>
                      <h3 className="text-lg font-bold tracking-tight mt-2 mb-2 text-[#f0ede8]">{article.title}</h3>
                      <p className="text-sm text-[#888] leading-relaxed line-clamp-2">{article.content[0]}</p>
                      <div className="mt-4 text-xs text-[#555]">{article.author} · {article.date}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* All articles */}
          <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-[#888] mb-5">All Articles</h2>
          <div className="flex flex-col">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/column/${article.slug}`}
                className="flex items-start gap-4 py-5 border-b border-[#2a2a2a]/50 hover:bg-[#111]/50 transition-colors no-underline px-2 -mx-2 rounded-lg"
              >
                <div className="shrink-0 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(232,93,47,0.1)] border border-[rgba(232,93,47,0.2)] text-[#f0923a]">
                    {article.category}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#f0ede8] mb-1">{article.title}</h3>
                  <p className="text-sm text-[#888] truncate">{article.content[0]}</p>
                </div>
                <div className="text-xs text-[#555] shrink-0 mt-1">{article.date}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
