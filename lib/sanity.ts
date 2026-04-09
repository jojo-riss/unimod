import { createClient } from 'next-sanity'

export const projectId = 'meqk7z80'
export const dataset = 'production'
export const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export async function getSiteContent() {
  return client.fetch(`*[_type == "siteContent"][0]`)
}
