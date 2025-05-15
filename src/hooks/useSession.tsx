'use client';

import { useEffect } from 'react';
import { useTableStore } from '../stores/useTableStore';
import { getOrCreateSessionId } from '@/utils/sessionsId';

/**
 * Hook untuk mengambil/membuat sessionId dan table dari URL, lalu menyimpannya ke store
 */
export const useSession = () => {
  const setSessionId = useTableStore(state => state.setSessionId);
  const sessionId = useTableStore(state => state.sessionId);

  useEffect(() => {
    // Ambil atau buat sessionId, lalu simpan ke store jika belum ada
    if (!sessionId) {
      const newSessionId = getOrCreateSessionId();
      setSessionId(newSessionId);
    }
  }, [setSessionId, sessionId]);

  return { sessionId: sessionId ?? getOrCreateSessionId() };
};