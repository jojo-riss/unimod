import { createClient } from '@sanity/client'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('Missing SANITY_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: 'meqk7z80',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

console.log('Fetching current content...')
const doc = await client.fetch(`*[_type == "siteContent" && _id == "siteContent"][0]`)

// 1. Badge text: "Universal Modular Power System · Patent Pending"
doc.heroBadge = 'Universal Modular Power System · Patent Pending'

// 2. Headline: "One System," + "Endless Possibilities."
doc.heroHeadline = 'One System,'
doc.heroHeadlineAccent = 'Endless Possibilities.'

// 3. Stats updates
doc.heroStats = [
  { _key: 'stat1', value: '100%', label: 'Hydraulic Output' },
  { _key: 'stat2', value: 'Multi-Fuel', label: 'On The Fly' },
  { _key: 'stat3', value: 'HCCI', label: 'Combustion Mode' },
  { _key: 'stat4', value: 'CHP', label: 'Combined Heat & Power' },
]

console.log('Applying edits...')
await client.patch('siteContent')
  .set({
    heroBadge: doc.heroBadge,
    heroHeadline: doc.heroHeadline,
    heroHeadlineAccent: doc.heroHeadlineAccent,
    heroStats: doc.heroStats,
  })
  .commit()

console.log('Done! Changes applied:')
console.log('  - Badge: "Universal Modular Power System · Patent Pending"')
console.log('  - Headline: "One System, Endless Possibilities."')
console.log('  - Stat 1: 100% Hydraulic Output')
console.log('  - Stat 2: Multi-Fuel, On The Fly')
console.log('  - Stat 4: CHP, Combined Heat & Power')
console.log('')
console.log('STILL NEEDS Matthew\'s input:')
console.log('  - "See How It Works" button → needs CAD animation URL')
