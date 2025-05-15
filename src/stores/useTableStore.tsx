import {create} from 'zustand';
import {persist} from 'zustand/middleware';


export type TableStateType = {
  table: string | null;
  sessionId: string | null;
  setTableNumber: (table: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  resetTable: () => void;
};

const initialState: Omit<TableStateType, 'setTableNumber' | 'setSessionId' | 'resetTable'> = {
  table: null,
  sessionId: null,
};

export const useTableStore = create<TableStateType>()(
  persist(
    (set) => ({
      ...initialState,
      setTableNumber: (table: string | null) => set({ table }),
      setSessionId: (sessionId: string | null) => set({ sessionId }),
      resetTable: () => set({ table: null, sessionId: null }),
    }),
    {
      name: 'table-storage',
    },
  ),
);
