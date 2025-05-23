'use client';

import React from 'react';
import Link from 'next/link';
import {UrlObject} from 'url';

type Props = {
  href?: string | UrlObject;
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  colorScheme?: 'primary' | 'secondary';
  containerStyle?: React.CSSProperties;
  disabled?: boolean; // Add disabled prop
};

export const Button: React.FC<Props> = ({
  label,
  style,
  onClick,
  href = '#',
  containerStyle,
  colorScheme = 'primary',
  disabled = false, // Default to false
}) => {
  if (href && !onClick) {
    return (
      <div style={{...containerStyle}}>
        <Link
          href={href ?? '#'}
          style={{
            width: '100%',
            height: 50,
            borderRadius: 10,
            color:
              colorScheme === 'primary'
                ? 'var(--white-color)'
                : 'var(--main-turquoise)',
            textTransform: 'capitalize',
            fontWeight: 'var(--fw-bold)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 14,
            border: '1px solid var(--main-turquoise)',
            background:
              colorScheme === 'primary'
                ? 'var(--main-turquoise)'
                : 'transparent',
            opacity: disabled ? 0.6 : 1, // Adjust opacity when disabled
            pointerEvents: disabled ? 'none' : 'auto', // Disable interaction
            ...style,
          }}
        >
          {label}
        </Link>
      </div>
    );
  }

  return (
    <div style={{...containerStyle}}>
      <button
        onClick={onClick}
        disabled={disabled} // Apply disabled attribute
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color:
            colorScheme === 'primary'
              ? 'var(--white-color)'
              : 'var(--main-turquoise)',
          textTransform: 'capitalize',
          fontWeight: 'var(--fw-semibold)',
          border: '1px solid var(--main-turquoise)',
          background:
            colorScheme === 'primary' ? 'var(--main-turquoise)' : 'transparent',
          opacity: disabled ? 0.6 : 1, // Adjust opacity when disabled
          pointerEvents: disabled ? 'none' : 'auto', // Disable interaction
          ...style,
        }}
        className='flex-center t16'
      >
        {label}
      </button>
    </div>
  );
};
