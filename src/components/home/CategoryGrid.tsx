import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { resolveCategoryIcon } from '@/data/categoryIcons';
import { getByCategory } from '@/data/products';

export function CategoryGrid() {
  return (
    <section className="container-page py-14 sm:py-16" aria-labelledby="categories-title">
      <div className="mb-8 text-center">
        <h2 id="categories-title" className="section-title">
          تسوّقي حسب التصنيف
        </h2>
        <p className="mt-3 text-sm text-ink-soft">
          اختاري القسم الذي يناسبك واكتشفي مختاراتنا فيه.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = resolveCategoryIcon(category.icon);
          const count = getByCategory(category.slug).length;

          return (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-mauve-100 bg-white shadow-soft transition-all duration-500 ease-silk hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-110"
                />
                <span className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-mauve-600 shadow-soft backdrop-blur">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold text-ink transition-colors group-hover:text-mauve-600">
                  {category.name}
                </h3>
                <p className="num mt-1 text-xs text-ink-muted">{count} منتج</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
