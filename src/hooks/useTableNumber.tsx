
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import { useCartStore } from '../stores/useCartStore';
import { useTableStore } from '../stores/useTableStore';

/**
 * Hook untuk mengambil parameter table dari URL dan menyimpannya ke CartStore
 */
export const useTableNumber = () => {
  const searchParams = useSearchParams();
  const setTableNumber = useTableStore(state => state.setTableNumber);
  const tableNumber = useTableStore(state => state.table);
  
  useEffect(() => {
    // Hanya set table number jika belum ada di store atau jika ada parameter baru di URL
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams, setTableNumber]);

  return { tableNumber };
};