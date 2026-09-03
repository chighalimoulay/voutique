import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ExternalOrderBanner } from '@/components/home/ExternalOrderBanner';
import { FeatureStrip } from '@/components/home/FeatureStrip';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Seo } from '@/components/Seo';
import { storeConfig } from '@/config/store';
import { getBestSellers, getByCategory, getFeaturedProducts } from '@/data/products';

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const bestSellers = getBestSellers(4);
  const perfumes = [...getByCategory('perfumes'), ...getByCategory('perfumes-men')].slice(0, 4);
  const gifts = getByCategory('gifts').slice(0, 4);

  return (
    <>
      <Seo
        title={`${storeConfig.name} — عطور ومستحضرات تجميل وعناية`}
        description={storeConfig.description}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: storeConfig.name,
          description: storeConfig.description,
          address: {
            '@type': 'PostalAddress',
            addressLocality: storeConfig.address,
            addressCountry: 'MR',
          },
          currenciesAccepted: storeConfig.currency,
        }}
      />

      <HeroSection />
      <FeatureStrip />
      <CategoryGrid />

      <ProductShowcase
        title="منتجات مختارة لكِ"
        subtitle="مختارات VOUTIQUE من العطور والجمال والعناية."
        products={featured}
        viewAllTo="/shop"
      />

      <div className="surface-blush py-2">
        <ProductShowcase
          title="الأكثر مبيعًا"
          subtitle="ما تختاره عميلاتنا أكثر من غيره."
          products={bestSellers}
          viewAllTo="/shop?sort=featured"
          layout="carousel"
        />
      </div>

      <ProductShowcase
        title="عالم العطور"
        subtitle="عطور نسائية ورجالية وللجنسين."
        products={perfumes}
        viewAllTo="/category/perfumes"
      />

      <ExternalOrderBanner />

      <ProductShowcase
        title="هدايا تختارينها بحب"
        subtitle="مجموعات جاهزة ومغلّفة بعناية."
        products={gifts}
        viewAllTo="/category/gifts"
      />
    </>
  );
}
