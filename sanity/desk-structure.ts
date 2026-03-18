import type { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Rack N Roll')
    .items([
      // Site Settings — singleton
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(),

      // What's On — group
      S.listItem()
        .title("What's On")
        .icon(() => '🎤')
        .child(
          S.list()
            .title("What's On")
            .items([
              S.listItem()
                .title('Daily Specials')
                .icon(() => '📅')
                .child(
                  S.documentTypeList('dailySpecial')
                    .title('Daily Specials')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Calendar Events')
                .icon(() => '🗓️')
                .child(
                  S.documentTypeList('calendarEvent')
                    .title('Calendar Events')
                    .defaultOrdering([{ field: 'date', direction: 'asc' }])
                ),
              S.listItem()
                .title('Flyers & Promos')
                .icon(() => '🖼️')
                .child(
                  S.documentTypeList('flyer')
                    .title('Flyers & Promos')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // Menu
      S.listItem()
        .title('Menu')
        .icon(() => '🍔')
        .child(
          S.documentTypeList('menuCategory')
            .title('Menu Categories')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
        ),

      S.divider(),

      // Gallery
      S.listItem()
        .title('Gallery')
        .icon(() => '📸')
        .child(
          S.documentTypeList('galleryImage')
            .title('Gallery Images')
            .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
        ),
    ])
