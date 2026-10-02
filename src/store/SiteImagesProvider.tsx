import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';
import { fetchSiteImages, type SiteImageMap } from '@/services/siteImagesApi';
import { SiteImagesContext, type SiteImagesContextValue } from './site-images-context';

const CACHE_KEY = 'voutique:site-images:v1';
/** بعد هذه المدة نعرض الصور الأصلية بدل الانتظار. */
const FETCH_TIMEOUT_MS = 5000;

function isStringMap(value: unknown): value is SiteImageMap {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === 'string')
  );
}

function readCache(): SiteImageMap | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStringMap(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(images: SiteImageMap) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(images));
  } catch {
    // التخزين معطّل — الصور تبقى في الذاكرة
  }
}

interface State {
  images: SiteImageMap;
  ready: boolean;
}

function initialState(): State {
  if (!isSupabaseConfigured) return { images: {}, ready: true };
  const cached = readCache();
  return cached ? { images: cached, ready: true } : { images: {}, ready: false };
}

/**
 * صور واجهة المتجر المخصّصة (Hero والفئات).
 * أي فشل في الجلب = تبقى الصور الأصلية من public/images.
 */
export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const images = await fetchSiteImages(controller.signal);
      setState({ images, ready: true });
      writeCache(images);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[site-images] تعذّر الجلب — نعرض الصور المحفوظة أو الأصلية.', error);
      }
      setState((previous) => ({ ...previous, ready: true }));
    } finally {
      window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<SiteImagesContextValue>(
    () => ({ images: state.images, ready: state.ready, refresh }),
    [state.images, state.ready, refresh],
  );

  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}
