import * as React from 'react';

import {stores} from '../stores';
import {DishType} from '../types';

type Props = {
  dish: DishType;
};

export const HeartBigSvg: React.FC<Props> = ({dish}) => {
  const {list} = stores.useWishlistStore();
  const ifInWishlist = list.find((item) => item.id === dish.id);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={27}
      fill='none'
    >
      <path
        fill={ifInWishlist ? 'var(--accent-color)' : 'transparent'}
        stroke={ifInWishlist ? 'var(--accent-color)' : 'var(--text-color)'}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M20.84 5.064a5.495 5.495 0 0 0-1.785-1.299 5.113 5.113 0 0 0-2.105-.456c-.723 0-1.438.155-2.105.456a5.495 5.495 0 0 0-1.785 1.3L12 6.217l-1.06-1.154C9.908 3.941 8.509 3.31 7.05 3.31s-2.858.63-3.89 1.754S1.549 7.711 1.549 9.3s.58 3.112 1.611 4.236l1.06 1.154L12 23.162l7.78-8.472 1.06-1.154a6.048 6.048 0 0 0 1.193-1.944 6.453 6.453 0 0 0 .419-2.292c0-.787-.143-1.566-.42-2.293a6.048 6.048 0 0 0-1.192-1.943v0Z'
      />
    </svg>
  );
};
