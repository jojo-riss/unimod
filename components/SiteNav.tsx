'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SiteNav() {
  const pathname = usePathname()
  const onHome = pathname === '/'

  const sections = [
    { label: 'How It Works', hash: 'how-it-works' },
    { label: 'Technology', hash: 'technology' },
    { label: 'Applications', hash: 'applications' },
    { label: 'Company', hash: 'company' },
  ]

  function scrollTo(hash: string) {
    const el = document.getElementById(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[101] flex items-center justify-between px-10 py-5 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-[#2a2a2a]">
      <Link href="/" className="flex items-center gap-2 font-bold text-[1.1rem] tracking-tight no-underline text-[#f0ede8]">
        <span className="w-2 h-2 rounded-full bg-[#e85d2f] inline-block" />
        Unimod Motors
      </Link>
      <ul className="hidden md:flex gap-8 list-none">
        {sections.map(({ label, hash }) => (
          <li key={hash}>
            {onHome ? (
              <button
                onClick={() => scrollTo(hash)}
                className="text-[#888] text-sm hover:text-[#f0ede8] transition-colors cursor-pointer bg-transparent border-none font-inherit"
              >
                {label}
              </button>
            ) : (
              <Link href={`/#${hash}`} className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">
                {label}
              </Link>
            )}
          </li>
        ))}
        <li><Link href="/investors" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Investors</Link></li>
        <li><Link href="/column" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">News</Link></li>
        <li>
          {onHome ? (
            <button
              onClick={() => scrollTo('contact')}
              className="bg-[#e85d2f] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#f0923a] transition-colors cursor-pointer border-none"
            >
              Contact Us
            </button>
          ) : (
            <Link href="/#contact" className="bg-[#e85d2f] text-white text-xs font-semibold px-4 py-2 rounded-md no-underline hover:bg-[#f0923a] transition-colors">
              Contact Us
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}
