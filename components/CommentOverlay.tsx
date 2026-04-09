'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'

type Message = {
  _key: string
  author: string
  text: string
  createdAt: string
}

type Comment = {
  _id: string
  xPercent: number
  yPixel: number
  resolved: boolean
  messages: Message[]
}

const AUTHOR_COLORS: Record<string, string> = {
  'Matthew': '#3a8ef0',
  'Matt': '#3a8ef0',
  'matthew': '#3a8ef0',
  'matt': '#3a8ef0',
  'Jojo': '#a855f7',
  'jojo': '#a855f7',
}
const fallbackPalette = ['#22c55e', '#eab308', '#ec4899', '#06b6d4', '#f97316']
let fallbackIdx = 0

function getColor(name: string) {
  const lower = name.toLowerCase()
  for (const [key, color] of Object.entries(AUTHOR_COLORS)) {
    if (lower === key.toLowerCase() || lower.startsWith(key.toLowerCase())) return color
  }
  if (!AUTHOR_COLORS[name]) {
    AUTHOR_COLORS[name] = fallbackPalette[fallbackIdx % fallbackPalette.length]
    fallbackIdx++
  }
  return AUTHOR_COLORS[name]
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function CommentOverlay() {
  const [enabled, setEnabled] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [author, setAuthor] = useState('')
  const [showResolved, setShowResolved] = useState(false)
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null)
  const [newText, setNewText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [showList, setShowList] = useState(false)
  const [listTab, setListTab] = useState<'open' | 'resolved'>('open')
  const [allComments, setAllComments] = useState<Comment[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const fetchComments = useCallback(async () => {
    const page = encodeURIComponent(pathname)
    const [res, resAll] = await Promise.all([
      fetch(`/api/comments?page=${page}&showResolved=${showResolved}`),
      fetch(`/api/comments?page=${page}&showResolved=true`),
    ])
    if (res.ok) setComments(await res.json())
    if (resAll.ok) setAllComments(await resAll.json())
  }, [showResolved])

  useEffect(() => {
    if (!enabled) return
    fetchComments()
    const interval = setInterval(fetchComments, 5000)
    return () => clearInterval(interval)
  }, [enabled, fetchComments])

  useEffect(() => {
    // Check URL param first (?user=Matthew)
    const params = new URLSearchParams(window.location.search)
    const userParam = params.get('user')
    if (userParam) {
      saveAuthor(userParam)
      // Clean the URL
      const url = new URL(window.location.href)
      url.searchParams.delete('user')
      window.history.replaceState({}, '', url.toString())
      return
    }
    const stored = localStorage.getItem('comment-author')
    if (stored) setAuthor(stored)
  }, [])

  function saveAuthor(name: string) {
    setAuthor(name)
    localStorage.setItem('comment-author', name)
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (!placing) return
    if ((e.target as HTMLElement).closest('[data-comment-ui]')) return

    const rect = overlayRef.current!.getBoundingClientRect()
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100
    const yPixel = e.clientY + window.scrollY

    setPendingPos({ x: xPercent, y: yPixel })
    setPlacing(false)
    setNewText('')
  }

  async function submitNew() {
    if (!newText.trim() || !author.trim()) return
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        xPercent: pendingPos!.x,
        yPixel: pendingPos!.y,
        page: pathname,
        author: author.trim(),
        text: newText.trim(),
      }),
    })
    setPendingPos(null)
    setNewText('')
    fetchComments()
  }

  async function submitReply(commentId: string) {
    if (!replyText.trim() || !author.trim()) return
    await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, action: 'reply', author: author.trim(), text: replyText.trim() }),
    })
    setReplyText('')
    fetchComments()
  }

  async function resolveComment(commentId: string) {
    await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, action: 'resolve' }),
    })
    setActiveId(null)
    fetchComments()
  }

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        className="fixed bottom-6 right-6 z-[200] h-11 px-4 rounded-full bg-white text-[#0a0a0a] flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] transition-all hover:scale-105 cursor-pointer text-sm font-semibold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comments
      </button>
    )
  }

  return (
    <>
      {/* Comments mode border */}
      <div className="fixed inset-0 z-[99] pointer-events-none border-[3px] border-[#3a8ef0]" style={{ borderRadius: 0 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#3a8ef0] text-white text-xs font-bold px-4 py-1 rounded-b-lg tracking-wide">
          COMMENTS MODE
        </div>
      </div>

      {/* Overlay layer for click-to-place */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-[100]"
        style={{
          pointerEvents: placing ? 'auto' : 'none',
          cursor: placing ? 'crosshair' : 'default',
        }}
      >
        {placing && (
          <div className="fixed inset-x-0 top-0 z-[201] bg-[#3a8ef0] text-white text-center py-2.5 text-sm font-semibold shadow-lg">
            Click anywhere to leave a comment — press Esc to cancel
          </div>
        )}

        {/* Existing comment pins */}
        {comments.map((c, i) => {
          const firstAuthor = c.messages[0]?.author || '?'
          const pinColor = getColor(firstAuthor)
          return (
            <div
              key={c._id}
              data-comment-ui
              className="absolute group"
              style={{
                left: `${c.xPercent}%`,
                top: c.yPixel,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                zIndex: activeId === c._id ? 150 : 110,
              }}
            >
              {/* Pin — colored by who started the thread */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveId(activeId === c._id ? null : c._id)
                  setReplyText('')
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all hover:scale-110 cursor-pointer border-2 ${
                  c.resolved
                    ? 'bg-[#2a2a2a] border-[#555] text-[#888]'
                    : 'border-white text-white'
                }`}
                style={!c.resolved ? { background: pinColor } : undefined}
              >
                {i + 1}
              </button>

              {/* Author tooltip on hover */}
              {activeId !== c._id && (
                <div className="absolute left-10 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1 shadow-lg">
                  <span className="text-xs font-semibold" style={{ color: pinColor }}>{firstAuthor}</span>
                  <span className="text-[10px] text-[#555] ml-1.5">{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Expanded thread */}
              {activeId === c._id && (
                <div
                  data-comment-ui
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-10 top-0 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden"
                  style={{ zIndex: 160 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2a2a2a] bg-[#111]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: pinColor }}
                      >
                        {getInitials(firstAuthor)}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: pinColor }}>{firstAuthor}</span>
                      <span className="text-[10px] text-[#555]">&middot; {c.messages.length} message{c.messages.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex gap-1">
                      {!c.resolved && (
                        <button
                          onClick={() => resolveComment(c._id)}
                          className="text-xs text-[#22c55e] hover:text-[#4ade80] px-2 py-0.5 rounded hover:bg-[#22c55e]/10 transition cursor-pointer"
                        >
                          ✓ Resolve
                        </button>
                      )}
                      <button
                        onClick={() => setActiveId(null)}
                        className="text-[#888] hover:text-white px-1 cursor-pointer text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="max-h-72 overflow-y-auto">
                    {c.messages.map((msg) => {
                      const msgColor = getColor(msg.author)
                      return (
                        <div key={msg._key} className="px-3 py-3 border-b border-[#2a2a2a]/50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                              style={{ background: msgColor }}
                            >
                              {getInitials(msg.author)}
                            </div>
                            <span className="text-xs font-bold" style={{ color: msgColor }}>{msg.author}</span>
                            <span className="text-[10px] text-[#555]">{timeAgo(msg.createdAt)}</span>
                          </div>
                          <p className="text-sm text-[#ddd] leading-relaxed pl-8">{msg.text}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* Reply box with author indicator */}
                  {!c.resolved && (
                    <div className="p-2.5 border-t border-[#2a2a2a]">
                      <div className="flex items-start gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1.5"
                          style={{ background: getColor(author || '?') }}
                        >
                          {author ? getInitials(author) : '?'}
                        </div>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              submitReply(c._id)
                            }
                          }}
                          placeholder={`Reply as ${author || 'anonymous'}… (Enter to send)`}
                          rows={2}
                          className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Pending new comment */}
        {pendingPos && (
          <div
            data-comment-ui
            className="absolute"
            style={{
              left: `${pendingPos.x}%`,
              top: pendingPos.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              zIndex: 160,
            }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse"
              style={{ background: getColor(author || '?') }}
            >
              +
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-10 top-0 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="px-3 py-2.5 border-b border-[#2a2a2a] bg-[#111] flex items-center gap-2">
                {author && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: getColor(author) }}
                  >
                    {getInitials(author)}
                  </div>
                )}
                <span className="text-xs text-[#888]">{author ? `New comment as ${author}` : 'New comment'}</span>
              </div>
              {!author && (
                <div className="p-3">
                  <input
                    type="text"
                    placeholder="Your name (e.g. Matthew, Jojo)"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        saveAuthor((e.target as HTMLInputElement).value.trim())
                      }
                    }}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)]"
                  />
                  <p className="text-[10px] text-[#555] mt-1.5">Press Enter to continue</p>
                </div>
              )}
              {author && (
                <div className="p-2.5">
                  <div className="flex items-start gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1.5"
                      style={{ background: getColor(author) }}
                    >
                      {getInitials(author)}
                    </div>
                    <textarea
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          submitNew()
                        }
                        if (e.key === 'Escape') setPendingPos(null)
                      }}
                      autoFocus
                      placeholder="Leave a comment… (Enter to send)"
                      rows={3}
                      className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0ede8] placeholder-[#555] outline-none focus:border-[rgba(255,255,255,0.3)] resize-none"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between px-3 pb-2.5">
                {author && (
                  <button
                    onClick={() => { saveAuthor(''); localStorage.removeItem('comment-author') }}
                    className="text-[10px] text-[#555] hover:text-[#888] cursor-pointer"
                  >
                    Not {author}?
                  </button>
                )}
                <button
                  onClick={() => setPendingPos(null)}
                  className="text-xs text-[#888] hover:text-white px-2 py-1 cursor-pointer ml-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List view panel */}
      {showList && (() => {
        const openComments = allComments.filter(c => !c.resolved)
        const resolvedComments = allComments.filter(c => c.resolved)
        const filteredList = listTab === 'open' ? openComments : resolvedComments

        return (
          <div
            data-comment-ui
            className="fixed top-0 right-0 bottom-0 w-96 z-[180] bg-[#111] border-l border-[#2a2a2a] shadow-2xl flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
              <h3 className="text-sm font-bold text-[#f0ede8]">Comments</h3>
              <button
                onClick={() => setShowList(false)}
                className="text-[#888] hover:text-white cursor-pointer text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2a2a2a]">
              <button
                onClick={() => setListTab('open')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center transition cursor-pointer ${
                  listTab === 'open'
                    ? 'text-[#f0ede8] border-b-2 border-[#3a8ef0]'
                    : 'text-[#555] hover:text-[#888]'
                }`}
              >
                Open ({openComments.length})
              </button>
              <button
                onClick={() => setListTab('resolved')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center transition cursor-pointer ${
                  listTab === 'resolved'
                    ? 'text-[#22c55e] border-b-2 border-[#22c55e]'
                    : 'text-[#555] hover:text-[#888]'
                }`}
              >
                Resolved ({resolvedComments.length})
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto">
              {filteredList.length === 0 && (
                <div className="p-6 text-center text-sm text-[#555]">
                  {listTab === 'open' ? 'No open comments' : 'No resolved comments'}
                </div>
              )}
              {filteredList.map((c) => {
                const globalIdx = allComments.findIndex(a => a._id === c._id)
                const firstAuthor = c.messages[0]?.author || '?'
                const pinColor = getColor(firstAuthor)
                const lastMsg = c.messages[c.messages.length - 1]
                return (
                  <button
                    key={c._id}
                    onClick={() => {
                      setShowList(false)
                      setActiveId(c._id)
                      if (!showResolved && c.resolved) setShowResolved(true)
                      window.scrollTo({ top: c.yPixel - 200, behavior: 'smooth' })
                    }}
                    className="w-full text-left px-4 py-3 border-b border-[#2a2a2a]/50 hover:bg-[#1a1a1a] transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
                          c.resolved ? 'bg-[#2a2a2a]' : ''
                        }`}
                        style={!c.resolved ? { background: pinColor } : undefined}
                      >
                        {globalIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                            style={{ background: pinColor }}
                          >
                            {getInitials(firstAuthor)}
                          </div>
                          <span className="text-xs font-bold" style={{ color: pinColor }}>{firstAuthor}</span>
                          <span className="text-[10px] text-[#555] ml-auto shrink-0">{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-xs text-[#999] truncate pl-6">{c.messages[0]?.text}</p>
                        {c.messages.length > 1 && lastMsg && (
                          <div className="flex items-center gap-1.5 mt-1.5 pl-6">
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                              style={{ background: getColor(lastMsg.author) }}
                            >
                              {getInitials(lastMsg.author)}
                            </div>
                            <p className="text-[11px] text-[#666] truncate">{lastMsg.author}: {lastMsg.text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Toolbar docked at bottom of list */}
            <div className="px-3 py-3 border-t border-[#2a2a2a] bg-[#0a0a0a] flex items-center gap-2 flex-wrap">
              {author && (
                <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-2.5 py-1">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: getColor(author) }}
                  >
                    {getInitials(author)}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: getColor(author) }}>{author}</span>
                </div>
              )}
              <div className="flex-1" />
              <button
                onClick={() => { setPlacing(true); setActiveId(null); setPendingPos(null); setShowList(false) }}
                className="h-9 px-3.5 rounded-full bg-white text-[#0a0a0a] text-xs font-semibold flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>+</span> Leave a comment
              </button>
              <button
                onClick={() => { setEnabled(false); setPlacing(false); setActiveId(null); setPendingPos(null); setShowList(false) }}
                className="w-9 h-9 rounded-full bg-[#2a2a2a] text-[#888] flex items-center justify-center hover:text-white transition cursor-pointer text-base"
                title="Close comments"
              >
                ×
              </button>
            </div>
          </div>
        )
      })()}

      {/* Toolbar — only show floating when list is closed */}
      {!showList && (
        <div data-comment-ui className="fixed bottom-6 right-6 z-[200] flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
          {author && (
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: getColor(author) }}
              >
                {getInitials(author)}
              </div>
              <span className="text-[11px] font-medium" style={{ color: getColor(author) }}>{author}</span>
            </div>
          )}

          <label className="flex items-center gap-1.5 text-[11px] text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="accent-[#22c55e]"
            />
            Show resolved
          </label>

          <button
            onClick={() => setShowList(true)}
            className="h-10 px-3 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            List
          </button>

          <button
            onClick={() => { setPlacing(true); setActiveId(null); setPendingPos(null); setShowList(false) }}
            className="h-10 px-4 rounded-full bg-white text-[#0a0a0a] text-sm font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
          >
            <span>+</span> Leave a comment
          </button>

          <button
            onClick={() => { setEnabled(false); setPlacing(false); setActiveId(null); setPendingPos(null); setShowList(false) }}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] text-[#888] flex items-center justify-center hover:text-white transition cursor-pointer text-lg"
            title="Close comments"
          >
            ×
          </button>
        </div>
      )}

      {/* Esc handler */}
      <EscHandler onEsc={() => { setPlacing(false); setPendingPos(null); setActiveId(null); setShowList(false) }} />
    </>
  )
}

function EscHandler({ onEsc }: { onEsc: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onEsc() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEsc])
  return null
}
