import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity'

export default defineConfig({
  name: 'unimod-motors',
  title: 'Unimod Motors',
  projectId: 'meqk7z80',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Content')
              .id('siteContent')
              .child(
                S.document()
                  .schemaType('siteContent')
                  .documentId('siteContent')
              ),
          ]),
    }),
  ],
  schema,
})
