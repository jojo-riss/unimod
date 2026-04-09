import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { sanityWriteClient } from '../../../lib/sanity-server'

export const dynamic = 'force-dynamic'

function setNestedValue(obj: Record<string, unknown>, path: string, value: string) {
  // Handle paths like "techFeatures[0].title" or simple "heroTitle"
  const match = path.match(/^(\w+)\[(\d+)\]\.(\w+)$/)
  if (match) {
    const [, arrayField, indexStr, prop] = match
    const index = parseInt(indexStr)
    const arr = obj[arrayField] as Record<string, unknown>[] | undefined
    if (arr && arr[index]) {
      arr[index][prop] = value
    }
  } else {
    obj[path] = value
  }
}

export async function POST(request: Request) {
  const { edits } = await request.json() as {
    edits: { field: string; value: string }[]
  }

  if (!edits || edits.length === 0) {
    return NextResponse.json({ error: 'No edits' }, { status: 400 })
  }

  try {
    // Fetch current document
    const doc = await sanityWriteClient.fetch(`*[_type == "siteContent" && _id == "siteContent"][0]`)
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if any edits target array fields
    const hasArrayEdits = edits.some(e => e.field.includes('['))
    const simpleEdits = edits.filter(e => !e.field.includes('['))
    const arrayEdits = edits.filter(e => e.field.includes('['))

    // Apply simple edits directly via patch
    if (simpleEdits.length > 0 && !hasArrayEdits) {
      let patch = sanityWriteClient.patch('siteContent')
      for (const edit of simpleEdits) {
        patch = patch.set({ [edit.field]: edit.value })
      }
      await patch.commit()
    }

    // For array edits, modify the doc in memory and replace the array fields
    if (arrayEdits.length > 0) {
      // Apply all edits to the doc copy
      for (const edit of edits) {
        setNestedValue(doc, edit.field, edit.value)
      }

      // Find which array fields were modified
      const modifiedArrays = new Set<string>()
      for (const edit of arrayEdits) {
        const match = edit.field.match(/^(\w+)\[/)
        if (match) modifiedArrays.add(match[1])
      }

      // Patch each modified array + any simple edits
      let patch = sanityWriteClient.patch('siteContent')
      for (const arrayField of modifiedArrays) {
        patch = patch.set({ [arrayField]: doc[arrayField] })
      }
      for (const edit of simpleEdits) {
        patch = patch.set({ [edit.field]: edit.value })
      }
      await patch.commit()
    }

    // Revalidate all pages so changes show immediately
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, count: edits.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
