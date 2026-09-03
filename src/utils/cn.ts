type ClassValue = string | number | null | undefined | false | ClassValue[];

/** دمج أسماء الأصناف مع تجاهل القيم الفارغة — بديل خفيف عن clsx. */
export function cn(...values: ClassValue[]): string {
  const output: string[] = [];

  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) output.push(nested);
    } else {
      output.push(String(value));
    }
  }

  return output.join(' ');
}
