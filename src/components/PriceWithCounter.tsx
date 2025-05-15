'use client';

import React from 'react';

type Props = {
  price: string;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  // dish?: DishType; // Optional dish prop for context
};

export const PriceWithCounter: React.FC<Props> = ({ price, quantity, onIncrement, onDecrement }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        border: '1px solid var(--border-color)',
        borderRadius: 5,
        backgroundColor: 'var(--white-color)',
      }}
    >
      <span
        className="t16"
        style={{ fontWeight: 500, color: 'var(--main-dark)' }}
      >
        Rp {price}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={onDecrement}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--white-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          -
        </button>
        <span className="t16" style={{ fontWeight: 500 }}>
          {quantity}
        </span>
        <button
          onClick={onIncrement}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--white-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};
