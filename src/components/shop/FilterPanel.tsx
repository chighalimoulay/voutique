import { RotateCcw } from 'lucide-react';
import { categories } from '@/data/categories';
import { MAX_PRODUCT_PRICE } from '@/data/products';
import type { ShopFilters } from '@/types';
import { formatPrice } from '@/utils/format';
import { GENDER_OPTIONS } from '@/utils/search';

interface FilterPanelProps {
  filters: ShopFilters;
  onChange: (patch: Partial<ShopFilters>) => void;
  onReset: () => void;
  /** إخفاء مرشّح التصنيف داخل صفحة تصنيف محدّد. */
  hideCategory?: boolean;
}

const PRICE_STEP = 500;

export function FilterPanel({ filters, onChange, onReset, hideCategory }: FilterPanelProps) {
  const maxPrice = filters.maxPrice ?? MAX_PRODUCT_PRICE;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">تصفية النتائج</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-mauve-600"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          إعادة ضبط
        </button>
      </div>

      {!hideCategory && (
        <fieldset>
          <legend className="field-label">التصنيف</legend>
          <div className="space-y-1.5">
            <RadioRow
              name="category"
              label="كل التصنيفات"
              checked={filters.category === 'all'}
              onSelect={() => onChange({ category: 'all' })}
            />
            {categories.map((category) => (
              <RadioRow
                key={category.slug}
                name="category"
                label={category.name}
                checked={filters.category === category.slug}
                onSelect={() => onChange({ category: category.slug })}
              />
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="field-label">الجنس</legend>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ gender: option.value })}
              aria-pressed={filters.gender === option.value}
              className={
                filters.gender === option.value
                  ? 'rounded-full bg-mauve-500 px-4 py-1.5 text-sm text-white'
                  : 'rounded-full border border-mauve-200 px-4 py-1.5 text-sm text-ink-soft transition-colors hover:border-mauve-400 hover:text-ink'
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="max-price" className="field-label">
          أقصى سعر: <span className="num font-semibold text-mauve-600">{formatPrice(maxPrice)}</span>
        </label>
        <input
          id="max-price"
          type="range"
          min={0}
          max={MAX_PRODUCT_PRICE}
          step={PRICE_STEP}
          value={maxPrice}
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange({ maxPrice: value >= MAX_PRODUCT_PRICE ? null : value });
          }}
          className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-mauve-100 accent-mauve-500"
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-muted">
          <span className="num">{formatPrice(0)}</span>
          <span className="num">{formatPrice(MAX_PRODUCT_PRICE)}</span>
        </div>
      </div>

      <fieldset className="space-y-2.5">
        <legend className="field-label">خيارات إضافية</legend>

        <CheckRow
          label="المتوفر فقط"
          checked={filters.availableOnly}
          onToggle={() => onChange({ availableOnly: !filters.availableOnly })}
        />
        <CheckRow
          label="العروض والخصومات"
          checked={filters.onSaleOnly}
          onToggle={() => onChange({ onSaleOnly: !filters.onSaleOnly })}
        />
      </fieldset>
    </div>
  );
}

function RadioRow({
  name,
  label,
  checked,
  onSelect,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 accent-mauve-500"
      />
      {label}
    </label>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 rounded accent-mauve-500"
      />
      {label}
    </label>
  );
}
