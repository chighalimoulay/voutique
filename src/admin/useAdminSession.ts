import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from './adminApi';

export type AdminAuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  /** مسجّلة دخولها لكن الحساب ليس في قائمة المديرين. */
  | { status: 'notAdmin'; email: string }
  /** تعذّر التحقق (انقطاع الإنترنت مثلًا). */
  | { status: 'error'; email: string }
  | { status: 'admin'; email: string };

/**
 * حالة دخول لوحة الإدارة.
 * لا يكفي وجود جلسة: نتحقق من الخادم أن الحساب ضمن public.admins.
 */
export function useAdminSession(): { auth: AdminAuthState; recheck: () => void } {
  const [auth, setAuth] = useState<AdminAuthState>({ status: 'loading' });
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }

    // يُطلق فورًا بالجلسة الحالية (INITIAL_SESSION)، ثم عند كل دخول أو خروج
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'TOKEN_REFRESHED') return;
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    if (!session) {
      setAuth({ status: 'signedOut' });
      return;
    }

    let cancelled = false;
    const email = session.user.email ?? '';
    setAuth({ status: 'loading' });

    checkIsAdmin()
      .then((isAdmin) => {
        if (!cancelled) setAuth(isAdmin ? { status: 'admin', email } : { status: 'notAdmin', email });
      })
      .catch(() => {
        if (!cancelled) setAuth({ status: 'error', email });
      });

    return () => {
      cancelled = true;
    };
  }, [session, attempt]);

  const recheck = useCallback(() => setAttempt((value) => value + 1), []);

  return { auth, recheck };
}
