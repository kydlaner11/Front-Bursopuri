import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Spin} from 'antd';

// import {svg} from '../svg';
import {Routes} from '../routes';
// import {stores} from '../stores';
import {DishType} from '../types';
import { formatToIDRCurrency } from '@/utils/currencyFormatter';
import { useRouter } from 'next/navigation';

type Props = {
  dish: DishType;
  isLast: boolean;
  isLoading?: boolean;
  setLoadingDishId?: (id: string | null) => void;
};

// const PlusSvg = () => {
//   return (
//     <svg
//       xmlns='http://www.w3.org/2000/svg'
//       width={21}
//       height={21}
//       fill='none'
//     >
//       <rect
//         width={21}
//         height={21}
//         fill='#E6F3F8'
//         rx={10.5}
//       />
//       <path
//         stroke='#0C1D2E'
//         strokeLinecap='round'
//         strokeLinejoin='round'
//         strokeWidth={1.2}
//         d='M10.5 6.125v8.75M6.125 10.5h8.75'
//       />
//     </svg>
//   );
// };

export const MenuListItem: React.FC<Props> = ({dish, isLast, isLoading = false, setLoadingDishId}) => {
  // const {list: cart} = stores.useCartStore();
  const router = useRouter();
  const formattedPrice = formatToIDRCurrency(Number(dish.price));
  // const {
  //   list: wishlist,
  //   addToWishlist,
  //   removeFromWishlist,
  // } = stores.useWishlistStore();

  // const qty = cart.find((item) => item.id === dish.id)?.quantity ?? 0;
  // const ifInWishlist = wishlist.find((item) => item.id === dish.id);

  return (
    <li
      style={{
        borderRadius: 10,
        padding: '14px 14px',
        backgroundColor: 'var(--white-color)',
        marginBottom: isLast ? 0 : 14,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Link href={`${Routes.MENU_ITEM}/${dish.id}`}>
        <Image
          src={dish.image}
          alt={dish.name}
          width={0}
          height={0}
          sizes='100vw'
          style={{
            width: 117,
            height: 'auto',
            borderRadius: 10,
            marginRight: 10,
          }}
        />
      </Link>

      {dish.isHot && (
        <Image
          src={'/icons/15.png'}
          alt='Hot'
          width={18}
          height={18}
          style={{
            left: 0,
            top: 0,
            marginLeft: 14,
            marginTop: 14,
            position: 'absolute',
          }}
        />
      )}
      {dish.isNew && (
        <Image
          src={'/icons/14.png'}
          alt='New'
          width={34}
          height={34}
          style={{margin: 14, left: 0, top: 0, position: 'absolute'}}
        />
      )}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span
          className='t14'
          style={{
            marginBottom: 4,
            display: 'block',
            color: 'var(--main-dark)',
            textTransform: 'capitalize',
          }}
        >
          {dish.name}
        </span>
        <p
          className='number-of-lines-2 t10'
          style={{
            fontSize: 10,
            color: 'var(--text-color)',
            lineHeight: 1.5,
            marginBottom: 4,
          }}
        >
          {dish.description}
        </p>
        {/* <span
          className='t10'
          style={{marginBottom: 8}}
        >
          {dish.kcal} kcal - {dish.weight}g
        </span> */}
        <span
          className='t14'
          style={{
            color: 'var(--main-dark)',
          }}
        >
          {formattedPrice}
        </span>
      </div>
      {/* <button
        style={{
          padding: 14,
          position: 'absolute',
          right: 0,
          top: 0,
          borderRadius: 4,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (ifInWishlist) {
            removeFromWishlist(dish);
          } else {
            addToWishlist(dish);
          }
        }}
      >
        <svg.HeartSvg dish={dish} />
      </button> */}
      <button
        style={{
          position: 'absolute',
          right: 5,
          bottom: 10,
          padding: '10px 18px',
          borderRadius: 8,
          backgroundColor: isLoading ? 'var(--text-color)' : 'var(--main-turquoise)',
          color: 'var(--white-color)',
          border: 'none',
          fontWeight: 600,  
          fontSize: 12,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'background 0.2s',
          opacity: isLoading ? 0.7 : 1,
        }}
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (isLoading || !setLoadingDishId) return;
          
          setLoadingDishId(dish.id);
          try {
            await router.push(Routes.MENU_ITEM + `/${dish.id}`);
          } finally {
            setLoadingDishId(null);
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spin size="small" style={{ color: 'white' }} />
        ) : (
          'Tambah Pesanan'
        )}
      </button>
    </li>
  );
};
