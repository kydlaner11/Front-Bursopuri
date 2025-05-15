import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {TabScreens} from '../routes';

type TabStateType = {
  screen: string;
  setScreen: (screen: string) => void;
};

const initialState: Omit<TabStateType, 'setScreen'> = {
  screen: TabScreens.HOME,
};

export const useTabStore = create<TabStateType>()(
  persist(
    (set, get) => ({
      ...initialState,
      setScreen: (screen: string) => set({screen}),
      // Reset screen to HOME on initialization
      hydrate: () => {
        if (get().screen !== TabScreens.HOME) {
          set({screen: TabScreens.HOME});
        }
      },
    }),
    {
      name: 'tab-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.screen !== TabScreens.HOME) {
          if (state) {
            state.screen = TabScreens.HOME;
          }
        }
      },
    },
  ),
);
