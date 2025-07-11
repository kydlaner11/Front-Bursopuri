import React, { useState } from 'react';
// import Link from 'next/link';
import Image from 'next/image';

// import {Routes} from '../routes';
import {stores} from '../stores';
import {dish as dishItem} from '../dish';
import { FormOutlined, UpOutlined, DownOutlined  } from '@ant-design/icons';
import { formatToIDRCurrency } from '../utils/currencyFormatter';
import {getSelectedOptionsPrice} from '../utils/selectedOptions';
import { message } from 'antd';

import type {DishType} from '../types';

type Props = {dish: DishType; isLast: boolean};

const MinusSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
    >
      <rect
        width={21}
        height={21}
        fill='#E6F3F8'
        rx={10.5}
      />
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.125 10.5h8.75'
      />
    </svg>
  );
};

const PlusSvg: React.FC<{disabled?: boolean}> = ({disabled = false}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={21}
      height={21}
      fill='none'
    >
      <rect
        width={21}
        height={21}
        fill={disabled ? '#F0F0F0' : '#E6F3F8'}
        rx={10.5}
      />
      <path
        stroke={disabled ? '#CCCCCC' : '#0C1D2E'}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M10.5 6.125v8.75M6.125 10.5h8.75'
      />
    </svg>
  );
};

export const OrderItem: React.FC<Props> = ({dish, isLast}) => {
  const {addToCart, removeFromCart} = stores.useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, contextHolder] = message.useMessage();
  const extra = getSelectedOptionsPrice(dish.selectedOptions || []);

  // Stock-related logic
  const hasStock = dish?.stock !== null && dish?.stock !== undefined;
  const stockCount = dish?.stock || 0;
  const currentQuantity = dish.quantity || 1;
  
  // Check if we can add more items
  const isAtMaxStock = hasStock && currentQuantity >= stockCount;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isAtMaxStock) {
      messages.warning(`Stok tersedia hanya ${stockCount}`);
      return;
    }
    
    addToCart({
      ...dish,
      quantity: 1,
    });
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    removeFromCart(dish);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        padding: 12,
        marginBottom: isLast ? 0 : 16,
      }}
    >
      {contextHolder}
      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <Image
          src={dish.image}
          alt={'dish'}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: '20%',
            height: 'auto',
            borderRadius: 10,
            marginRight: 4,
            marginLeft: 4,
          }}
        />
        <div style={{flex: 1}}>
          <dishItem.DishName dish={dish} style={{marginBottom: 4, color: 'var(--main-dark', fontWeight: 600}} />
          <div style={{gap: 7, display: 'flex', alignItems: 'center'}}>
            <span
              className='t14'
              style={{fontWeight: 500, color: 'var(--main-dark)'}}
            >
            {formatToIDRCurrency((Number(dish.price) + extra) * (dish.quantity || 1))}
            </span>
            {/* <div style={{width: 1, height: 10, backgroundColor: '#D5DCE3'}} />
            <span className='t14'>{dish.weight}g</span> */}
          </div>
          
          {/* Stock information
          {hasStock && stockCount < 5 && (
            <div style={{ marginTop: 4 }}>
              <span style={{ 
                color: '#ff6b6b', 
                fontSize: '12px', 
                fontWeight: 500 
              }}>
                Sisa stok = {stockCount}
              </span>
            </div>
          )} */}
          
          {/* Max stock reached warning */}
          {isAtMaxStock && (
            <div style={{ marginTop: 4 }}>
              <span style={{ 
                color: '#ff6b6b', 
                fontSize: '12px', 
                fontWeight: 500 
              }}>
                Maksimal {stockCount} item
              </span>
            </div>
          )}
          
          <button
            className='t12'
            style={{
              background: 'none',
              border: 'none',
              color: '#0C1D2E',
              marginTop: 8,
              alignSelf: 'flex-start',
              cursor: 'pointer',
            }}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <span style={{ color: 'var(--secondary-text-color)', gap: 10, display: 'flex', alignItems: 'center'}}>
                Hide Details <UpOutlined />
              </span>
            ) : (
              <span style={{ color: 'var(--secondary-text-color)', gap: 10, display: 'flex', alignItems: 'center'}}>
                View Details <DownOutlined />
              </span>
            )}
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={handleRemoveFromCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <MinusSvg />
          </button>
          <span className="t12" style={{ margin: '8px 0' }}>{dish.quantity}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAtMaxStock}
            style={{
              background: 'none',
              border: 'none',
              cursor: isAtMaxStock ? 'not-allowed' : 'pointer',
              padding: 0,
              opacity: isAtMaxStock ? 0.5 : 1,
            }}
          >
            <PlusSvg disabled={isAtMaxStock} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
          }}
        >
          {dish.selectedOptions && dish.selectedOptions.length > 0 && (
            <ul style={{marginTop: 5, borderTop: '1px solid #E6E6E6'}}>
              {dish.selectedOptions.map((option, idx) => (
                <li key={idx} style={{marginTop: 10}}> 
                  <p className='t14' style={{ color: '#555'}}>
                    {option.name}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className='t14' style={{ color: 'var(--main-dark)', fontWeight: 500 }}>
                      {option.selected.map((selectedItem) => selectedItem.name).join(', ')}
                    </p>
                    <p className='t14' style={{ color: '#555', marginLeft: 10 }}>
                      {option.selected.map((selectedItem) => formatToIDRCurrency(selectedItem.price)).join(', ')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {dish.notes && (
            <p style={{marginTop: 10}}>
              <FormOutlined /> {dish.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};