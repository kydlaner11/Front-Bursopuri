import React from 'react';
import {formatToIDRCurrency} from '../utils/currencyFormatter';

import type {DishType} from '../types';

type Props = {dish: DishType};

export const DishPrice: React.FC<Props> = ({dish}) => {
  const formattedPrice = formatToIDRCurrency(Number(dish.price));

  return (
    <div style={{gap: 7, display: 'flex', alignItems: 'center'}}>
      <span
        className='t14'
        style={{fontWeight: 500, color: 'var(--main-dark)'}}
      >
        {formattedPrice}
      </span>
      {/* <div style={{width: 1, height: 10, backgroundColor: '#D5DCE3'}} />
      <span className='t14'>{dish.weight}g</span> */}
    </div>
  );
};
