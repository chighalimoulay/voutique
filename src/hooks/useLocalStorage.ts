import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * حالة محفوظة في localStorage.
 *
 * مصمّمة لتتحمّل الحالات الواقعية:
 *  - المتصفح في وضع خاص يمنع التخزين → نعمل بالذاكرة فقط بلا انهيار.
 *  - بيانات قديمة أو تالفة → نتجاهلها ونعود للقيمة الافتراضية.
 *  - تبويب آخر يعدّل نفس المفتاح → نتزامن معه.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const validateRef = useRef(validate);
  validateRef.current = validate;

  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;

      const parsed: unknown = JSON.parse(raw);
      if (validateRef.current && !validateRef.current(parsed)) return initialValue;
      return parsed as T;
    } catch {
      // تخزين معطّل أو JSON تالف — نبدأ نظيفين
      return initialValue;
    }
  }, [key, initialValue]);

  const [value, setValue] = useState<T>(read);

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved =
          typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // الكتابة قد تفشل (وضع خاص / امتلاء المساحة) — الحالة تبقى في الذاكرة
        }

        return resolved;
      });
    },
    [key],
  );

  // مزامنة بين تبويبات المتصفح المفتوحة على نفس الموقع
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return;
      setValue(read());
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, read]);

  return [value, update];
}
