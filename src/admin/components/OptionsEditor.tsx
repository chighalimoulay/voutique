import { Plus, X } from 'lucide-react';
import type { OptionDraft } from '../productFormUtils';

interface OptionsEditorProps {
  options: OptionDraft[];
  onChange: (options: OptionDraft[]) => void;
  disabled?: boolean;
}

const SUGGESTED_LABELS = ['الحجم', 'اللون', 'المقاس'];

/**
 * خيارات تختار منها العميلة (الحجم، اللون…) وتُرسل ضمن رسالة واتساب.
 * لا تؤثر على السعر — السعر واحد للمنتج.
 */
export function OptionsEditor({ options, onChange, disabled }: OptionsEditorProps) {
  function update(index: number, patch: Partial<OptionDraft>) {
    onChange(options.map((option, i) => (i === index ? { ...option, ...patch } : option)));
  }

  function add() {
    const used = new Set(options.map((option) => option.label));
    const label = SUGGESTED_LABELS.find((candidate) => !used.has(candidate)) ?? '';
    onChange([...options, { label, values: '' }]);
  }

  return (
    <div className="space-y-3">
      <datalist id="option-labels">
        {SUGGESTED_LABELS.map((label) => (
          <option key={label} value={label} />
        ))}
      </datalist>

      {options.map((option, index) => (
        <div key={index} className="rounded-2xl border border-mauve-100 bg-cream/60 p-3">
          <div className="flex items-center gap-2">
            <input
              list="option-labels"
              value={option.label}
              onChange={(event) => update(index, { label: event.target.value })}
              placeholder="اسم الخيار (مثل: الحجم)"
              aria-label="اسم الخيار"
              disabled={disabled}
              className="field-input flex-1"
            />
            <button
              type="button"
              onClick={() => onChange(options.filter((_, i) => i !== index))}
              aria-label="حذف هذا الخيار"
              disabled={disabled}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <input
            value={option.values}
            onChange={(event) => update(index, { values: event.target.value })}
            placeholder="القيم مفصولة بفاصلة: 50 مل، 100 مل"
            aria-label="قيم الخيار"
            disabled={disabled}
            className="field-input mt-2"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-full border border-mauve-200 px-4 py-2 text-sm text-mauve-600 transition-colors hover:border-mauve-400 hover:bg-mauve-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        إضافة خيار (حجم / لون / مقاس)
      </button>
    </div>
  );
}
