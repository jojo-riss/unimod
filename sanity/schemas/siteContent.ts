export default {
  name: 'siteContent',
  title: 'Site Content',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'howItWorks', title: 'How It Works' },
    { name: 'technology', title: 'Technology' },
    { name: 'applications', title: 'Applications' },
    { name: 'company', title: 'Company' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    // ── HERO ──
    {
      name: 'heroBadge',
      title: 'Badge Text',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroHeadlineAccent',
      title: 'Headline Accent (gradient part)',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroSubtext',
      title: 'Subtext',
      type: 'text',
      rows: 3,
      group: 'hero',
    },
    {
      name: 'heroStats',
      title: 'Stats',
      type: 'array',
      group: 'hero',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', title: 'Value', type: 'string' },
          { name: 'label', title: 'Label', type: 'string' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }],
    },

    // ── HOW IT WORKS ──
    {
      name: 'howTitle',
      title: 'Title',
      type: 'string',
      group: 'howItWorks',
    },
    {
      name: 'howDescription',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'howItWorks',
    },
    {
      name: 'howPoints',
      title: 'Key Points',
      type: 'array',
      group: 'howItWorks',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 3 },
        ],
        preview: { select: { title: 'title' } },
      }],
    },

    // ── TECHNOLOGY ──
    {
      name: 'techTitle',
      title: 'Title',
      type: 'string',
      group: 'technology',
    },
    {
      name: 'techSubtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'technology',
    },
    {
      name: 'techFeatures',
      title: 'Features',
      type: 'array',
      group: 'technology',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon', title: 'Icon (emoji)', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 3 },
        ],
        preview: { select: { title: 'title', subtitle: 'icon' } },
      }],
    },

    // ── APPLICATIONS ──
    {
      name: 'appsTitle',
      title: 'Title',
      type: 'string',
      group: 'applications',
    },
    {
      name: 'appsSubtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'applications',
    },
    {
      name: 'applications',
      title: 'Applications',
      type: 'array',
      group: 'applications',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 4 },
          { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
        ],
        preview: { select: { title: 'title' } },
      }],
    },

    // ── COMPANY ──
    {
      name: 'companyTitle',
      title: 'Title',
      type: 'string',
      group: 'company',
    },
    {
      name: 'companyDescription',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'company',
    },
    {
      name: 'companyLocation',
      title: 'Location Description',
      type: 'text',
      rows: 3,
      group: 'company',
    },
    {
      name: 'companyQuote',
      title: 'Founder Quote',
      type: 'text',
      rows: 3,
      group: 'company',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'company',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'initials', title: 'Initials', type: 'string' },
        ],
        preview: { select: { title: 'name', subtitle: 'role' } },
      }],
    },

    // ── CONTACT ──
    {
      name: 'contactTitle',
      title: 'Title',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'contactSubtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
      group: 'contact',
    },
    {
      name: 'contactLocation',
      title: 'Location',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'contactPhone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'contactNames',
      title: 'Key Contacts',
      type: 'string',
      group: 'contact',
    },
  ],
}
