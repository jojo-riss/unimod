'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SmoothScroll() {
  const pathname = usePathname()

  // Handle hash on page load / route change (e.g. navigating from /investors to /#how-it-works)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    // Small delay to let the page render
    const timer = setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  // Handle clicks on same-page anchor links
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || !href.includes('#')) return

      const hash = href.split('#')[1]
      if (!hash) return

      const linkPath = href.split('#')[0]
      const onHomepage = pathname === '/'

      // Same page — smooth scroll directly
      if (onHomepage && (!linkPath || linkPath === '/')) {
        const el = document.getElementById(hash)
        if (el) {
          e.preventDefault()
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return null
}
