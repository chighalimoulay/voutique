import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductVisual } from '@/components/product/ProductVisual';
import { getCategoryName } from '@/data/categories';
import { products } from '@/data/products';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useDebounce } from '@/hooks/useDebounce';
import { searchProducts } from '@/utils/search';
import { formatPrice } from '@/utils/format';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, 180);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setTerm('');
      return;
    }

    // تأخير بسيط حتى تنتهي حركة الفتح قبل التركيز
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (debounced.trim().length < 2) return [];
    return searchProducts(products, debounced).slice(0, 6);
  }, [debounced]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="البحث في المتجر">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-16 w-full max-w-2xl px-4 sm:mt-24"
          >
            <form onSubmit={submit} className="rounded-2xl bg-white p-2 shadow-lift" role="search">
              <div className="flex items-center gap-2">
                <Search className="mr-2 h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />

                <input
                  ref={inputRef}
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="ابحثي عن عطر أو منتج عناية…"
                  aria-label="نص البحث"
                  className="h-11 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted"
                />

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق البحث"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-cream hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            {debounced.trim().length >= 2 && (
              <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-lift">
                {results.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-ink-soft">
                    لم نجد منتجات مطابقة لبحثك.
                  </p>
                ) : (
                  <ul className="divide-y divide-mauve-100">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-mauve-50"
                        >
                          <ProductVisual
                            src={product.image}
                            alt={product.name}
                            className="h-14 w-14 shrink-0 rounded-xl"
                          />

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {product.name}
                            </span>
                            <span className="block text-xs text-ink-muted">
                              {getCategoryName(product.category)}
                            </span>
                          </span>

                          <span className="num shrink-0 text-sm font-semibold text-mauve-600">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {results.length > 0 && (
                  <button
                    type="button"
                    onClick={submit}
                    className="w-full border-t border-mauve-100 bg-cream px-4 py-3 text-sm font-medium text-mauve-600 transition-colors hover:bg-mauve-50"
                  >
                    عرض كل النتائج
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
