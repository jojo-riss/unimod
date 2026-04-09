'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

// ── Types ──
type PendingEdit = { field: string; value: string }
type Message = { _key: string; author: string; text: string; createdAt: string }
type Comment = { _id: string; xPercent: number; yPixel: number; resolved: boolean; messages: Message[] }

// ── Author colors ──
const AUTHOR_COLORS: Record<string, string> = {
  matthew: '#3a8ef0', matt: '#3a8ef0', jojo: '#a855f7',
}
const fallbackPalette = ['#22c55e', '#eab308', '#ec4899', '#06b6d4', '#f97316']
let fallbackIdx = 0
function getColor(name: string) {
  const lower = name.toLowerCase()
  for (const [key, color] of Object.entries(AUTHOR_COLORS)) {
    if (lower === key || lower.startsWith(key)) return color
  }
  if (!AUTHOR_COLORS[lower]) { AUTHOR_COLORS[lower] = fallbackPalette[fallbackIdx++ % fallbackPalette.length] }
  return AUTHOR_COLORS[lower]
}
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}
function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function InlineEditor() {
  // ── Shared state ──
  const [active, setActive] = useState(false)
  const [tab, setTab] = useState<'edit' | 'comment'>('edit')
  const pathname = usePathname()

  // ── Edit state ──
  const [edits, setEdits] = useState<PendingEdit[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // ── Comment state ──
  const [comments, setComments] = useState<Comment[]>([])
  const [allComments, setAllComments] = useState<Comment[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [author, setAuthor] = useState('')
  const [showList, setShowList] = useState(false)
  const [listTab, setListTab] = useState<'open' | 'resolved'>('open')
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null)
  const [newText, setNewText] = useState('')
  const [replyText, setReplyText] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const [docHeight, setDocHeight] = useState(0)

  // ── Track document height for comment overlay ──
  useEffect(() => {
    if (!active || tab !== 'comment') return
    const update = () => setDocHeight(document.documentElement.scrollHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    window.addEventListener('resize', update)
    return () => { observer.disconnect(); window.removeEventListener('resize', update) }
  }, [active, tab])

  // ── URL params ──
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('edit') === 'true') { setActive(true); setTab('edit') }
    if (p.get('user')) { saveAuthor(p.get('user')!) }
    const url = new URL(window.location.href)
    url.searchParams.delete('edit')
    url.searchParams.delete('user')
    if (url.toString() !== window.location.href) window.history.replaceState({}, '', url.toString())
    const stored = localStorage.getItem('comment-author')
    if (stored && !p.get('user')) setAuthor(stored)
  }, [])

  function saveAuthor(name: string) { setAuthor(name); localStorage.setItem('comment-author', name) }

  // ── Edit: enable/disable contentEditable ──
  const originalValues = useRef<Record<string, string>>({})

  const enableEditing = useCallback(() => {
    document.querySelectorAll('[data-field]').forEach((el) => {
      const h = el as HTMLElement
      if (h.contentEditable === 'true') return
      // Store original value
      const field = h.dataset.field!
      originalValues.current[field] = h.innerText.trim()
      h.contentEditable = 'true'
      h.style.outline = 'none'
      h.style.cursor = 'text'
      h.addEventListener('focus', () => { h.style.boxShadow = '0 0 0 2px rgba(34,197,94,0.5)'; h.style.borderRadius = '4px'; h.style.padding = '2px 4px'; h.style.margin = '-2px -4px' })
      h.addEventListener('blur', () => {
        h.style.boxShadow = ''; h.style.padding = ''; h.style.margin = ''
        const f = h.dataset.field!, v = h.innerText.trim()
        const original = originalValues.current[f]
        // Only register a change if text actually changed
        if (v === original) return
        setEdits(prev => {
          const i = prev.findIndex(e => e.field === f)
          if (i >= 0) { const u = [...prev]; u[i] = { field: f, value: v }; return u }
          return [...prev, { field: f, value: v }]
        })
        setSaved(false)
      })
    })
  }, [])

  const disableEditing = useCallback(() => {
    document.querySelectorAll('[data-field]').forEach((el) => {
      const h = el as HTMLElement
      h.contentEditable = 'false'; h.style.cursor = ''; h.style.boxShadow = ''; h.style.padding = ''; h.style.margin = ''
    })
  }, [])

  useEffect(() => {
    if (active && tab === 'edit') { const t = setTimeout(enableEditing, 300); return () => clearTimeout(t) }
    else { disableEditing() }
  }, [active, tab, enableEditing, disableEditing])

  // ── Edit: block nav in edit tab ──
  useEffect(() => {
    if (!active || tab !== 'edit') return
    function block(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (t.closest('[data-field]') || t.closest('[data-edit-toolbar]')) return
      const link = t.closest('a, button')
      if (link && !link.closest('[data-edit-toolbar]')) { e.preventDefault(); e.stopPropagation() }
    }
    document.addEventListener('click', block, true)
    return () => document.removeEventListener('click', block, true)
  }, [active, tab])

  // ── Edit: save ──
  async function saveEdits() {
    if (edits.length === 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ edits }) })
      if (res.ok) { setSaved(true); setEdits([]) }
    } catch { alert('Failed to save.') }
    finally { setSaving(false) }
  }

  // ── Comments: fetch ──
  const fetchComments = useCallback(async () => {
    const page = encodeURIComponent(pathname)
    const [r1, r2] = await Promise.all([
      fetch(`/api/comments?page=${page}&showResolved=false`),
      fetch(`/api/comments?page=${page}&showResolved=true`),
    ])
    if (r1.ok) setComments(await r1.json())
    if (r2.ok) setAllComments(await r2.json())
  }, [pathname])

  useEffect(() => {
    if (!active || tab !== 'comment') return
    fetchComments()
    const i = setInterval(fetchComments, 5000)
    return () => clearInterval(i)
  }, [active, tab, fetchComments])

  // ── Comments: actions ──
  function handleOverlayClick(e: React.MouseEvent) {
    if (!placing) return
    if ((e.target as HTMLElement).closest('[data-edit-toolbar]') || (e.target as HTMLElement).closest('[data-comment-ui]')) return
    const rect = overlayRef.current!.getBoundingClientRect()
    setPendingPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: e.clientY + window.scrollY })
    setPlacing(false); setNewText('')
  }

  async function submitNew() {
    if (!newText.trim() || !author.trim()) return
    await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ xPercent: pendingPos!.x, yPixel: pendingPos!.y, page: pathname, author: author.trim(), text: newText.trim() }) })
    setPendingPos(null); setNewText(''); fetchComments()
  }

  async function submitReply(id: string) {
    if (!replyText.trim() || !author.trim()) return
    await fetch('/api/comments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: id, action: 'reply', author: author.trim(), text: replyText.trim() }) })
    setReplyText(''); fetchComments()
  }

  async function resolveComment(id: string) {
    await fetch('/api/comments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commentId: id, action: 'resolve' }) })
    setActiveId(null); fetchComments()
  }

  // ── Exit ──
  function exitEditMode() {
    if (edits.length > 0 && !confirm('You have unsaved changes. Exit anyway?')) return
    setActive(false); setEdits([]); setSaved(false); setPlacing(false); setActiveId(null); setPendingPos(null); setShowList(false)
  }

  // ── Esc handler ──
  useEffect(() => {
    if (!active) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') { setPlacing(false); setPendingPos(null); setActiveId(null); setShowList(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active])

  // ══════════════════════════════════════
  //  INACTIVE — just show the toggle button
  // ══════════════════════════════════════
  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="fixed bottom-6 right-6 z-[200] h-11 px-4 rounded-full bg-white text-[#0a0a0a] flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] transition-all hover:scale-105 cursor-pointer text-sm font-semibold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit Mode
      </button>
    )
  }

  // ══════════════════════════════════════
  //  ACTIVE
  // ══════════════════════════════════════
  const openComments = allComments.filter(c => !c.resolved)
  const resolvedComments = allComments.filter(c => c.resolved)
  const filteredList = listTab === 'open' ? openComments : resolvedComments

  return (
    <>
      {/* ── Border ── */}
      <div className={`fixed inset-0 z-[200] pointer-events-none border-[3px] ${tab === 'edit' ? 'border-[#22c55e]' : 'border-[#3a8ef0]'}`}>
        <div className={`absolute top-[68px] left-1/2 -translate-x-1/2 text-white text-xs font-bold px-5 py-1.5 rounded-b-lg tracking-wide shadow-lg ${tab === 'edit' ? 'bg-[#22c55e]' : 'bg-[#3a8ef0]'}`}>
          {tab === 'edit' ? 'EDIT TEXT MODE — Click any text to edit' : 'COMMENTS MODE — Leave feedback on the page'}
        </div>
      </div>

      {/* ── Comment overlay (only in comment tab) ── */}
      {tab === 'comment' && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="absolute top-0 left-0 w-full z-[100]"
          style={{ pointerEvents: placing ? 'auto' : 'none', cursor: placing ? 'crosshair' : 'default', height: `${docHeight}px` }}
        >
          {placing && (
            <div className="fixed inset-x-0 top-0 z-[201] bg-[#3a8ef0] text-white text-center py-2.5 text-sm font-semibold shadow-lg">
              Click anywhere to leave a comment — press Esc to cancel
            </div>
          )}

          {/* Pins */}
          {comments.map((c, i) => {
            const firstAuthor = c.messages[0]?.author || '?'
            const pinColor = getColor(firstAuthor)
            return (
              <div key={c._id} data-comment-ui className="absolute group" style={{ left: `${c.xPercent}%`, top: c.yPixel, transform: 'translate(-50%, -50%)', pointerEvents: 'auto', zIndex: activeId === c._id ? 150 : 110 }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveId(activeId === c._id ? null : c._id); setReplyText('') }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all hover:scale-110 cursor-pointer border-2 ${c.resolved ? 'bg-[#2a2a2a] border-[#555] text-[#888]' : 'border-white text-white'}`}
                  style={!c.resolved ? { background: pinColor } : undefined}>{i + 1}</button>

                {/* Hover tooltip */}
                {activeId !== c._id && (
                  <div className="absolute left-10 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1 shadow-lg">
                    <span className="text-xs font-semibold" style={{ color: pinColor }}>{firstAuthor}</span>
                    <span className="text-[10px] text-[#555] ml-1.5">{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Thread */}
                {activeId === c._id && (
                  <div data-comment-ui onClick={(e) => e.stopPropagation()} className="absolute left-10 top-0 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden" style={{ zIndex: 160 }}>
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2a2a2a] bg-[#111]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: pinColor }}>{getInitials(firstAuthor)}</div>
                        <span className="text-xs font-semibold" style={{ color: pinColor }}>{firstAuthor}</span>
                        <span className="text-[10px] text-[#555]">&middot; {c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex gap-1">
                        {!c.resolved && <button onClick={() => resolveComment(c._id)} className="text-xs text-[#22c55e] hover:text-[#4ade80] px-2 py-0.5 rounded hover:bg-[#22c55e]/10 transition cursor-pointer">Resolve</button>}
                        <button onClick={() => setActiveId(null)} className="text-[#888] hover:text-white px-1 cursor-pointer text-lg leading-none">&times;</button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {c.messages.map((msg) => {
                        const mc = getColor(msg.author)
                        return (
                          <div key={msg._key} className="px-3 py-3 border-b border-[#2a2a2a]/50">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: mc }}>{getInitials(msg.author)}</div>
                              <span className="text-xs font-bold" style={{ color: mc }}>{msg.author}</span>
                              <span className="text-[10px] text-[#555]">{timeAgo(msg.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[#ddd] leading-relaxed pl-8">{msg.text}</p>
                          </div>
                        )
                      })}
                    </div>
                    {!c.resolved && (
                      <div className="p-2.5 border-t border-[#2a2a2a]">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1.5" style={{ background: getColor(author || '?') }}>{author ? getInitials(author) : '?'}</div>
                          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(c._id) } }} placeholder={`Reply as ${author || 'anonymous'}…`} rows={2} className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)] resize-none" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* New comment pending */}
          {pendingPos && (
            <div data-comment-ui className="absolute" style={{ left: `${pendingPos.x}%`, top: pendingPos.y, transform: 'translate(-50%, -50%)', pointerEvents: 'auto', zIndex: 160 }}>
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse" style={{ background: getColor(author || '?') }}>+</div>
              <div onClick={(e) => e.stopPropagation()} className="absolute left-10 top-0 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden">
                <div className="px-3 py-2.5 border-b border-[#2a2a2a] bg-[#111] flex items-center gap-2">
                  {author && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: getColor(author) }}>{getInitials(author)}</div>}
                  <span className="text-xs text-[#888]">{author ? `Comment as ${author}` : 'New comment'}</span>
                </div>
                {!author ? (
                  <div className="p-3">
                    <input type="text" placeholder="Your name (e.g. Matthew, Jojo)" autoFocus onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) saveAuthor((e.target as HTMLInputElement).value.trim()) }} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)]" />
                    <p className="text-[10px] text-[#555] mt-1.5">Press Enter to continue</p>
                  </div>
                ) : (
                  <div className="p-2.5">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1.5" style={{ background: getColor(author) }}>{getInitials(author)}</div>
                      <textarea value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitNew() }; if (e.key === 'Escape') setPendingPos(null) }} autoFocus placeholder="Leave a comment… (Enter to send)" rows={3} className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)] resize-none" />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between px-3 pb-2.5">
                  {author && <button onClick={() => { saveAuthor(''); localStorage.removeItem('comment-author') }} className="text-[10px] text-[#555] hover:text-[#888] cursor-pointer">Not {author}?</button>}
                  <button onClick={() => setPendingPos(null)} className="text-xs text-[#888] hover:text-white px-2 py-1 cursor-pointer ml-auto">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── List panel (comment tab) ── */}
      {tab === 'comment' && showList && (
        <div data-edit-toolbar className="fixed top-0 right-0 bottom-0 w-96 z-[180] bg-[#111] border-l border-[#2a2a2a] shadow-2xl flex flex-col" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
            <h3 className="text-sm font-bold text-[#f0ede8]">Comments</h3>
            <button onClick={() => setShowList(false)} className="text-[#888] hover:text-white cursor-pointer text-lg leading-none">&times;</button>
          </div>
          <div className="flex border-b border-[#2a2a2a]">
            <button onClick={() => setListTab('open')} className={`flex-1 py-2.5 text-xs font-semibold text-center transition cursor-pointer ${listTab === 'open' ? 'text-[#f0ede8] border-b-2 border-[#3a8ef0]' : 'text-[#555] hover:text-[#888]'}`}>Open ({openComments.length})</button>
            <button onClick={() => setListTab('resolved')} className={`flex-1 py-2.5 text-xs font-semibold text-center transition cursor-pointer ${listTab === 'resolved' ? 'text-[#22c55e] border-b-2 border-[#22c55e]' : 'text-[#555] hover:text-[#888]'}`}>Resolved ({resolvedComments.length})</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredList.length === 0 && <div className="p-6 text-center text-sm text-[#555]">{listTab === 'open' ? 'No open comments' : 'No resolved comments'}</div>}
            {filteredList.map((c) => {
              const idx = allComments.findIndex(a => a._id === c._id)
              const fa = c.messages[0]?.author || '?'
              const pc = getColor(fa)
              const last = c.messages[c.messages.length - 1]
              return (
                <button key={c._id} onClick={() => { setShowList(false); setActiveId(c._id); window.scrollTo({ top: c.yPixel - 200, behavior: 'smooth' }) }} className="w-full text-left px-4 py-3 border-b border-[#2a2a2a]/50 hover:bg-[#1a1a1a] transition cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${c.resolved ? 'bg-[#2a2a2a]' : ''}`} style={!c.resolved ? { background: pc } : undefined}>{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: pc }}>{getInitials(fa)}</div>
                        <span className="text-xs font-bold" style={{ color: pc }}>{fa}</span>
                        <span className="text-[10px] text-[#555] ml-auto shrink-0">{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-xs text-[#999] truncate pl-6">{c.messages[0]?.text}</p>
                      {c.messages.length > 1 && last && (
                        <div className="flex items-center gap-1.5 mt-1.5 pl-6">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: getColor(last.author) }}>{getInitials(last.author)}</div>
                          <p className="text-[11px] text-[#666] truncate">{last.author}: {last.text}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Bottom toolbar ── */}
      <div data-edit-toolbar className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl px-3 py-2 flex items-center gap-2 shadow-2xl">
          {/* Tab switcher */}
          <div className="flex bg-[#0a0a0a] rounded-lg p-0.5">
            <button onClick={() => { setTab('edit'); setPlacing(false); setActiveId(null); setPendingPos(null) }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${tab === 'edit' ? 'bg-[#22c55e] text-white' : 'text-[#888] hover:text-white'}`}>
              Edit Text
            </button>
            <button onClick={() => { setTab('comment'); disableEditing() }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${tab === 'comment' ? 'bg-[#3a8ef0] text-white' : 'text-[#888] hover:text-white'}`}>
              Comments{allComments.filter(c => !c.resolved).length > 0 ? ` (${allComments.filter(c => !c.resolved).length})` : ''}
            </button>
          </div>

          <div className="w-px h-6 bg-[#2a2a2a]" />

          {/* Edit tab controls */}
          {tab === 'edit' && (
            <>
              {edits.length > 0 ? (
                <span className="text-[11px] text-[#f0923a] font-medium">{edits.length} change{edits.length !== 1 ? 's' : ''}</span>
              ) : saved ? (
                <span className="text-[11px] text-[#22c55e] font-medium">Saved</span>
              ) : (
                <span className="text-[11px] text-[#555]">Click text to edit</span>
              )}
              <button onClick={saveEdits} disabled={edits.length === 0 || saving}
                className={`h-8 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${saved && edits.length === 0 ? 'bg-[#22c55e] text-white' : edits.length === 0 ? 'bg-[#2a2a2a] text-[#555] cursor-default' : saving ? 'bg-[#888] text-white cursor-wait' : 'bg-white text-[#0a0a0a]'}`}>
                {saved && edits.length === 0 ? 'Saved' : saving ? 'Saving...' : `Save${edits.length > 0 ? ` (${edits.length})` : ''}`}
              </button>
            </>
          )}

          {/* Comment tab controls */}
          {tab === 'comment' && (
            <>
              {author && (
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: getColor(author) }}>{getInitials(author)}</div>
                  <span className="text-[11px] font-medium" style={{ color: getColor(author) }}>{author}</span>
                </div>
              )}
              <button onClick={() => setShowList(!showList)}
                className={`h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${showList ? 'bg-[#3a8ef0] text-white' : 'bg-[#2a2a2a] text-[#888] hover:text-white'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                List
              </button>
              <button onClick={() => { setPlacing(true); setActiveId(null); setPendingPos(null); setShowList(false) }}
                className="h-8 px-3 rounded-full bg-white text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 shadow-lg cursor-pointer">
                + Comment
              </button>
            </>
          )}

          <div className="w-px h-6 bg-[#2a2a2a]" />

          <button onClick={exitEditMode} className="h-8 px-3 rounded-full text-xs font-semibold text-[#888] hover:text-white hover:bg-[#2a2a2a] transition cursor-pointer">Exit</button>
        </div>
      </div>

      {/* ── Edit mode styles ── */}
      {tab === 'edit' && (
        <style>{`
          [data-field] { position: relative; transition: box-shadow 0.15s ease; }
          [data-field]:hover { box-shadow: 0 0 0 1px rgba(34,197,94,0.3) !important; border-radius: 4px !important; }
          [data-field]::after { content: attr(data-field); position: absolute; top: -18px; left: 0; font-size: 9px; font-weight: 700; color: #22c55e; opacity: 0; pointer-events: none; transition: opacity 0.15s; text-transform: uppercase; letter-spacing: 0.05em; }
          [data-field]:hover::after { opacity: 0.6; }
        `}</style>
      )}
    </>
  )
}
