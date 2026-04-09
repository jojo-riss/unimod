import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await request.json()
    const { firstName, lastName, email, organization, interest, message } = body

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Unimod Motors <onboarding@resend.dev>',
      to: 'matthewborner@yahoo.com',
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}${interest ? ` — ${interest}` : ''}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        organization ? `Organization: ${organization}` : null,
        interest ? `Interest: ${interest}` : null,
        '',
        'Message:',
        message,
      ].filter(Boolean).join('\n'),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
