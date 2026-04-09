export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'xPercent',
      title: 'X Position (%)',
      type: 'number',
    },
    {
      name: 'yPixel',
      title: 'Y Position (px from top)',
      type: 'number',
    },
    {
      name: 'page',
      title: 'Page',
      type: 'string',
    },
    {
      name: 'resolved',
      title: 'Resolved',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'author', title: 'Author', type: 'string' },
            { name: 'text', title: 'Text', type: 'text', rows: 3 },
            { name: 'createdAt', title: 'Created At', type: 'datetime' },
          ],
          preview: {
            select: { title: 'author', subtitle: 'text' },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      messages: 'messages',
      resolved: 'resolved',
    },
    prepare({ messages, resolved }: { messages?: { author: string; text: string }[]; resolved?: boolean }) {
      const first = messages?.[0]
      return {
        title: first ? `${first.author}: ${first.text.slice(0, 50)}` : 'Empty comment',
        subtitle: resolved ? '✓ Resolved' : `${messages?.length || 0} message(s)`,
      }
    },
  },
}
