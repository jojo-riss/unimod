import { NextResponse } from 'next/server'
import { sanityWriteClient } from '../../../lib/sanity-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '/'
  const showResolved = searchParams.get('showResolved') === 'true'

  const filter = showResolved
    ? `_type == "comment" && page == $page`
    : `_type == "comment" && page == $page && resolved != true`

  const comments = await sanityWriteClient.fetch(
    `*[${filter}] | order(_createdAt asc) { _id, xPercent, yPixel, page, resolved, messages }`,
    { page }
  )

  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { xPercent, yPixel, page, author, text } = body

  if (!author || !text) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const doc = await sanityWriteClient.create({
    _type: 'comment',
    xPercent,
    yPixel,
    page: page || '/',
    resolved: false,
    messages: [
      {
        _key: crypto.randomUUID(),
        author,
        text,
        createdAt: new Date().toISOString(),
      },
    ],
  })

  return NextResponse.json(doc)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { commentId, action, author, text } = body

  if (action === 'reply') {
    if (!author || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const updated = await sanityWriteClient
      .patch(commentId)
      .setIfMissing({ messages: [] })
      .append('messages', [
        {
          _key: crypto.randomUUID(),
          author,
          text,
          createdAt: new Date().toISOString(),
        },
      ])
      .commit()

    return NextResponse.json(updated)
  }

  if (action === 'resolve') {
    const updated = await sanityWriteClient
      .patch(commentId)
      .set({ resolved: true })
      .commit()

    return NextResponse.json(updated)
  }

  if (action === 'reopen') {
    const updated = await sanityWriteClient
      .patch(commentId)
      .set({ resolved: false })
      .commit()

    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
