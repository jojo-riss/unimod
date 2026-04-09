import { createClient } from '@sanity/client'

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('Missing SANITY_TOKEN. Run: SANITY_TOKEN=your_token node scripts/seed.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: 'meqk7z80',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const content = {
  _id: 'siteContent',
  _type: 'siteContent',
  heroBadge: 'Universal Modular Engine · Patent Pending',
  heroHeadline: 'One Engine,',
  heroHeadlineAccent: 'Two Solutions.',
  heroSubtext: 'A complete rethink of internal combustion — delivering both vehicle propulsion and building energy from a single, multi-fuel opposed-piston platform.',
  heroStats: [
    { _key: 'stat1', value: '90%', label: 'Hydraulic Output' },
    { _key: 'stat2', value: '3×', label: 'Fuel Versatility' },
    { _key: 'stat3', value: 'HCCI', label: 'Combustion Mode' },
    { _key: 'stat4', value: '0', label: 'Conventional Crankshaft' },
  ],
  howTitle: 'An engine designed from first principles',
  howDescription: 'The UniMod uses an opposed-piston configuration — two pistons per cylinder moving in opposite directions — eliminating cylinder heads and dramatically reducing heat loss. The result: higher thermal efficiency and fewer moving parts.',
  howPoints: [
    { _key: 'hw1', title: 'Opposed-Piston Architecture', description: 'Two pistons share a single combustion chamber, reducing surface area and thermal losses vs. conventional engines.' },
    { _key: 'hw2', title: 'HCCI Combustion', description: 'Homogeneous Charge Compression Ignition achieves diesel-like efficiency on gasoline — with significantly lower NOx emissions.' },
    { _key: 'hw3', title: 'Hydraulic Power Output', description: '90% of output delivered as hydraulic pressure — ideal for both vehicle drive systems and stationary power generation.' },
  ],
  techTitle: 'Technology Breakthroughs',
  techSubtitle: 'Built for a world that demands more from every drop of fuel',
  techFeatures: [
    { _key: 'tf1', icon: '⚡', title: 'Smart 90/10 Power Split', description: 'Outputs 90% of power hydraulically and 10% electrically — optimized for hybrid drivetrain and stationary applications simultaneously.' },
    { _key: 'tf2', icon: '🔄', title: 'Regenerative Hydraulics', description: 'Hydraulic accumulator captures braking energy and stores it for later release, delivering regenerative braking without complex electrical inverters.' },
    { _key: 'tf3', icon: '🎚️', title: 'Variable Compression Ratio', description: 'Dynamically adjusts compression to match fuel quality and load conditions — enabling multi-fuel operation with peak efficiency across the board.' },
    { _key: 'tf4', icon: '⛽', title: 'Multi-Fuel Versatility', description: 'Runs on natural gas, gasoline, or diesel without hardware changes. Future-proof against fuel availability and price volatility.' },
    { _key: 'tf5', icon: '🏗️', title: 'Modular Design', description: 'Scalable and stackable architecture. From light vehicles to industrial buildings, the same core engine scales to meet any power demand.' },
    { _key: 'tf6', icon: '🌿', title: 'Lower Emissions', description: 'HCCI combustion produces dramatically lower NOx and particulates vs. conventional spark-ignition engines at equivalent power output.' },
  ],
  appsTitle: 'One platform, two markets',
  appsSubtitle: "The UniMod's modular architecture makes it equally at home under the hood of a work vehicle or powering a commercial building.",
  applications: [
    {
      _key: 'app1',
      title: 'Vehicle Propulsion',
      description: 'Drop-in hydraulic hybrid drivetrain for trucks, buses, and off-road equipment. Hydraulic accumulators replace complex battery packs for regenerative braking — delivering commercial-grade durability with zero battery degradation.',
      tags: ['Trucks', 'Buses', 'Off-Road', 'Fleet'],
    },
    {
      _key: 'app2',
      title: 'Building Energy Systems',
      description: 'Simultaneous electrical and mechanical power for HVAC, lighting, and process loads. On-site generation with multi-fuel flexibility makes it ideal for hospitals, data centers, and microgrids needing resilient power.',
      tags: ['Microgrids', 'Data Centers', 'HVAC', 'Hospitals'],
    },
  ],
  companyTitle: 'Founded on a fundamental question',
  companyDescription: "Paul and Matthew Borner founded Unimod Motors with a single goal: to ask whether the internal combustion engine's fundamental architecture was actually optimal — or just inherited.",
  companyLocation: 'Based in Mount Tremper, NY, the team combines decades of mechanical engineering, thermodynamics, and manufacturing experience to bring the UniMod from concept to commercially viable product.',
  companyQuote: "We didn't set out to build a better engine. We set out to ask whether the engine itself was built right in the first place.",
  teamMembers: [
    { _key: 'tm1', name: 'Paul Borner', role: 'Co-founder & Chief Engineer', initials: 'PB' },
    { _key: 'tm2', name: 'Matthew Borner', role: 'Co-founder & Chief Technology Officer', initials: 'MB' },
  ],
  contactTitle: "Let's talk about what UniMod can do for you",
  contactSubtext: "Whether you're an investor, engineer, or fleet operator — we'd love to hear from you.",
  contactLocation: 'Mount Tremper, NY 12457',
  contactPhone: '(203) 858-1620',
  contactNames: 'Paul & Matthew Borner',
}

console.log('Seeding Sanity content...')
await client.createOrReplace(content)
console.log('Done! Content is live in Sanity.')
