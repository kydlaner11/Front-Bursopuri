import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {dish} from '../dish';

// import {svg} from '../svg';
// import {stores} from '../stores';
import {Routes} from '../routes';

import type {DishType} from '../types';
import { Spin } from 'antd';

type Props = {
  item: DishType;
  style?: React.CSSProperties;
  loading?: boolean;
  onButtonClick?: () => void;
};

const PlusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={25}
      height={25}
      fill='none'
    >
      <rect
        width={25}
        height={25}
        fill='var(--main-turquoise)'
        rx={12.5}
      />
      <path
        stroke='#FFFFFF'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.6}
        d='M12.5 7.5v10M7.5 12.5h10'
      />
    </svg>
  );
};

export const RecommendedItem: React.FC<Props> = ({item, style, loading = false, onButtonClick}) => {
  // const {addToCart} = stores.useCartStore();
  const router = useRouter();
  // const {
  //   list: wishlist,
  //   addToWishlist,
  //   removeFromWishlist,
  // } = stores.useWishlistStore();

  // const dishId = item.id;

  // const ifInWishlist = wishlist.find((item) => item.id === dishId);

  const isAvailable = item.tersedia !== false; // Default to true if tersedia is undefined
  
  // Stock logic: show stock info only if stock is a number and less than 5
  const shouldShowStock = typeof item.stock === 'number' && item.stock < 5;

  return (
    <Link
      className='column clickable'
      href={`${Routes.MENU_ITEM}/${item.id}`}
      style={{
        backgroundColor: 'var(--white-color)',
        borderRadius: '10px',
        position: 'relative',
        border: '1px solid var(--border-color)',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        opacity: isAvailable ? 1 : 0.6,
        pointerEvents: isAvailable ? 'auto' : 'none',
        ...style, // Allow custom styles to override defaults
      }}
    >
      <div style={{ position: 'relative' }}>
        <Image
          src={item.image}
          alt='Dish'
          width={0}
          height={0}
          sizes='100vw'
          priority={true}
          style={{
            width: '100%', 
            height: 'auto', 
            borderRadius: '10px 10px 0 0',
            filter: isAvailable ? 'none' : 'grayscale(50%)'
          }}
        />
        {!isAvailable && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 0, 0, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              zIndex: 2,
              whiteSpace: 'nowrap',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            STOK HABIS
          </div>
        )}
        
        {/* Stock indicator for low stock */}
        {shouldShowStock && isAvailable && (
          <div
            style={{
              position: 'absolute',
              bottom : '4px',
              left: '7px',
              color: 'red',
              padding: '4px 8px',
              fontWeight: 'bold',
              textAlign: 'center',
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}
            className='t14 number-of-lines-1'
          >
            Sisa stok = {item.stock}
          </div>
        )}
      </div>
      
      {/* <button
        style={{
          position: 'absolute',
          right: 0,
          bottom: 72 - 15,
          padding: 15,
          borderRadius: 10,
        }}
        // onClick={(e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   addToWishlist(item);
        // }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (ifInWishlist) {
            removeFromWishlist(item);
          } else {
            addToWishlist(item);
          }
        }}
      >
        <svg.HeartSvg dish={item} />
      </button> */}
      
      <div
        className='column'
        style={{padding: '14px'}}
      >
        <dish.DishName
          dish={item}
          style={{
            marginBottom: 3,
            color: isAvailable ? 'inherit' : 'var(--gray-color)'
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <dish.DishPrice 
            dish={item} 
            style={{
              color: isAvailable ? 'inherit' : 'var(--gray-color)'
            }}
          />
          <button
            style={{
              position: 'absolute',
              padding: '14px',
              right: 0,
              bottom: 0,
            }}
            disabled={loading || !isAvailable}
            onClick={async (e) => {
              if (!isAvailable) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              if (onButtonClick) {
                await onButtonClick();
              }
              // router.push logic tetap bisa di sini jika tidak ingin handle di parent
              if (!loading) {
                router.push(`${Routes.MENU_ITEM}/${item.id}`);
              }
            }}
          >
            {loading ? (
              <Spin size="small" />
            ) : (
              <PlusSvg />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};