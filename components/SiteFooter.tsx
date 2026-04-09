import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="px-10 py-10 border-t border-[#2a2a2a] flex items-center justify-between flex-wrap gap-6">
      <div>
        <div className="font-bold tracking-tight">Unimod Motors</div>
        <div className="text-xs text-[#888] mt-0.5">Mount Tremper, NY · (203) 858-1620</div>
      </div>
      <ul className="flex gap-7 list-none flex-wrap">
        <li><Link href="/#how-it-works" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">How It Works</Link></li>
        <li><Link href="/#technology" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Technology</Link></li>
        <li><Link href="/#applications" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Applications</Link></li>
        <li><Link href="/#company" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Company</Link></li>
        <li><Link href="/investors" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Investors</Link></li>
        <li><Link href="/column" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">News</Link></li>
        <li><Link href="/#contact" className="text-[#888] text-sm no-underline hover:text-[#f0ede8] transition-colors">Contact</Link></li>
      </ul>
      <div className="text-xs text-[#888]">© 1994–2026 Unimod Motors. Patent 8,671,681 B1. All rights reserved.</div>
    </footer>
  )
}
