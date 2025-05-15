import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {DishType} from '../types';
import {
  isSameOptions,
  getSelectedOptionsPrice,
} from '../utils/selectedOptions';


export type CartStateType = {
  total: number;
  delivery: number;
  discount: number;
  subtotal: number;
  promoCode: string;
  list: DishType[];
  discountAmount: number;
  quantity: number;
  orderType: string;
  table: string | null;
  addToCart: (dish: DishType) => void;
  removeFromCart: (dish: DishType) => void;
  setDiscount: (discount: number) => void;
  resetCart: () => void;
  setPromoCode: (promoCode: string) => void;
  setOrderType: (orderType: string) => void;
  setTableNumber: (table: string | null) => void;
};

const initialState: Omit<
  CartStateType,
  'addToCart' | 'removeFromCart' | 'setDiscount' | 'resetCart' | 'setPromoCode' | 'setOrderType' | 'setTableNumber'
> = {
  total: 0,
  list: [],
  delivery: 0,
  discount: 0,
  subtotal: 0,
  promoCode: '',
  discountAmount: 0,
  quantity: 0,
  orderType: 'Dine in',
  table: null,
};

export const useCartStore = create<CartStateType>()(
  persist(
    (set) => ({
      ...initialState,
      addToCart: (dish) => {
        set((state) => {
          const inCart = state.list.find(
            (item) =>
              item.id === dish.id &&
              item.notes === dish.notes &&
              isSameOptions(item.selectedOptions, dish.selectedOptions)
          );
      
          if (inCart) {
            state.list = state.list.map((item) => {
              if (
                item.id === dish.id &&
                item.notes === dish.notes &&
                isSameOptions(item.selectedOptions, dish.selectedOptions)
              ) {
                return {
                  ...item,
                  quantity: (item.quantity ?? 0) + (dish.quantity ?? 1),
                };
              }
              return item;
            });
          } else {
            state.list.push({
              ...dish,
              quantity: dish.quantity || 1,
            });
          }
      
            const extra = getSelectedOptionsPrice(dish.selectedOptions || []);
            const itemTotalPrice = (Number(dish.price) + extra) * (dish.quantity ?? 1);
            
            state.subtotal += itemTotalPrice;
            state.total = state.subtotal * (1 - state.discount / 100);
            state.discountAmount = state.subtotal - state.total;
            state.quantity += dish.quantity ?? 1;
        
            dish.notes = '';
      
          return { ...state };
        });
      },
      
      removeFromCart: (dish) => {
        set((state) => {  
          const inCart = state.list.find(
            (item) =>
              item.id === dish.id &&
              item.notes === dish.notes &&
              isSameOptions(item.selectedOptions, dish.selectedOptions)
          );
      
          if (inCart) {
            state.list = state.list.reduce((acc, item) => {
              if (
                item.id === dish.id &&
                item.notes === dish.notes &&
                isSameOptions(item.selectedOptions, dish.selectedOptions)
              ) {
                if (item.quantity && item.quantity > 1) {
                  item.quantity -= 1;
                  acc.push(item);
                }
              } else {
                acc.push(item);
              }
              return acc;
            }, [] as DishType[]);
            state.subtotal -= Number(dish.price);
            state.discountAmount = Number(
              (state.subtotal - state.total).toFixed(2),
            );
            state.total -= Number(dish.price) * (1 - state.discount / 100);

            if (state.list.length === 0) {
              state.subtotal = 0;
              state.total = 0;
              state.discountAmount = 0;
              state.discount = 0;
              state.promoCode = '';
              state.quantity = 0;
            }
          }
      
          return { ...state };
        });
      },
      
      setDiscount: (discount) => {
        set((state) => {
          state.discount = discount;
          state.total = state.subtotal * (1 - discount / 100);
          state.discountAmount = state.subtotal - state.total;
          return {...state};
        });
      },
      resetCart: () => {
        set(() => {
          return {
            ...initialState,
          };
        });
      },
      setPromoCode: (promoCode) => {
        set((state) => {
          state.promoCode = promoCode;
          return {...state};
        });
      },
      setOrderType: (orderType) => {
        set((state) => {
          state.orderType = orderType;
          return {...state};
        });
      },
      setTableNumber: (table) => {
        // fungsi baru untuk mengatur nomor meja
        set((state) => {
          state.table = table;
          return {...state};
        });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
