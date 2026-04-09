import { getSiteContent } from '../lib/sanity'
import { defaultContent } from '../lib/defaults'
import SiteNav from '../components/SiteNav'
import HomeContent from '../components/HomeContent'

export const revalidate = 60

export default async function Home() {
  const raw = await getSiteContent().catch(() => null)
  const c = { ...defaultContent, ...raw }

  return (
    <main className="bg-[#0a0a0a] text-[#f0ede8] font-sans antialiased">
      <SiteNav />
      <HomeContent originalContent={c} />
    </main>
  )
}
