import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { NavigableSection } from '@/components/NavigableSection'
import { MenuPageSkeleton, FooterSkeleton } from '@/components/Skeletons'
import MenuPageHero from '@/components/menu/MenuPageHero'
import { getMenuCategories, getSiteSettings } from '@/lib/queries'
import { buildPageMetadata } from '@/lib/metadata'
import type { MenuCategory } from '@/data/events'
import type { SanityMenuCategory } from '@/lib/types'

const MenuPageContent = dynamic(
  () => import('@/components/menu/MenuPageContent'),
  { loading: () => <MenuPageSkeleton /> }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  { loading: () => <FooterSkeleton /> }
)

const MENU_DEFAULTS = {
  title: 'Menu \u2014 Rack N Roll',
  description:
    'Full menu at Rack N Roll in Erie, PA. Burgers, wings, appetizers, nachos, salads, and sweet treats. Kitchen opens at 4 PM.',
  ogDescription:
    'Full menu at Rack N Roll in Erie, PA. Burgers, wings, appetizers, and more.',
} as const

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildPageMetadata(settings?.menuSeo, settings, MENU_DEFAULTS)
}

function toLocalMenu(sanity: SanityMenuCategory[]): MenuCategory[] {
  return sanity.map((c) => ({
    category: c.category,
    items: (c.items ?? []).map((item) => ({
      name: item.name,
      price: item.price,
      description: item.description,
    })),
  }))
}

export default async function MenuPage() {
  const [sanityMenu, siteSettings] = await Promise.all([
    getMenuCategories(),
    getSiteSettings(),
  ])

  const menuData = sanityMenu.length > 0 ? toLocalMenu(sanityMenu) : undefined

  return (
    <main id="main-content">
      <Header />
      <div className="pt-16">
        <NavigableSection id="menu-hero" label="Menu">
          <MenuPageHero />
        </NavigableSection>
        <NavigableSection id="menu-content" label="Menu Items">
          <MenuPageContent menuData={menuData} />
        </NavigableSection>
        <NavigableSection id="footer" label="Footer" excludeFromScrollSpy>
          <Footer siteSettings={siteSettings} />
        </NavigableSection>
      </div>
    </main>
  )
}
