import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './sanity'

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
