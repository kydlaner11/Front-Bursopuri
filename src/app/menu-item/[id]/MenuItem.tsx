'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

// import {svg} from '../../../svg';
import {hooks} from '../../../hooks';
// import {Routes} from '../../../routes';
import {stores} from '../../../stores';
import {components} from '../../../components';
import {Checkbox, Typography, message} from 'antd';
import {formatToIDRCurrency} from '../../../utils/currencyFormatter';
import PuffLoader from 'react-spinners/PuffLoader';
import { handleOptionSelect } from '../../../utils/optionsSelected';
import { Routes, TabScreens } from '@/routes';

type Props = {
  menuItemId: string;
};

const MinusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
    >
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M2.898 7h8.114'
      />
    </svg>
  );
};

const PlusSvg = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={14}
      height={14}
      fill='none'
    >
      <path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.955 2.917v8.166M2.898 7h8.114'
      />
    </svg>
  );
};

const {Title} = Typography;

export const MenuItem: React.FC<Props> = ({menuItemId}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setScreen } = stores.useTabStore(); 
  const [messages, contextHolder] = message.useMessage();
  const {dishes, dishesLoading} = hooks.useGetDishes();
  const {list: cart, addToCart} = stores.useCartStore();
  const [notes, setNotes] = React.useState('');
  const initialQuantity = cart.find((item) => 
    item.id === menuItemId && 
    (!item.selectedOptions || item.selectedOptions.length === 0)
  )?.quantity ?? 1;
  const [localQuantity, setLocalQuantity] =  React.useState(initialQuantity);;
  const isLoading = dishesLoading;
  const [selectedOptions, setSelectedOptions] = React.useState<{
    [key: string]: { name: string; price: number }[];
  }>({});

  const dish = dishes.find((dish) => dish.id === menuItemId);
  const options = dish?.option || {}; // Use options from the API response

  // Stock-related logic
  const hasStock = dish?.stock !== null && dish?.stock !== undefined;
  const stockCount = dish?.stock || 0;
  const isLowStock = hasStock && stockCount < 5;
  const maxQuantity = hasStock ? stockCount : Infinity;

  const onSelect = (category: keyof typeof options, choice: string) => {
    const categoryOptions = options[category];
    if (!categoryOptions) return;

    const selectedChoice = categoryOptions.choices.find(c => c.name === choice);
    const price = selectedChoice ? selectedChoice.price : 0;

    setSelectedOptions((prev) =>
      handleOptionSelect(prev, category, { name: choice, price }, options)
    );
  };

    const handleQuantityChange = (newQuantity: number) => {
      // Ensure quantity doesn't exceed stock limit
      const limitedQuantity = hasStock ? Math.min(newQuantity, maxQuantity) : newQuantity;
      setLocalQuantity(limitedQuantity);
    };
   

  if (!dish) {
    if (dishesLoading) return null;

    return (
      <section>
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          inset: 0,
          height: '100%',
        }}
        className='flex-center'
      >
        <PuffLoader
          size={40}
          color={'#455A81'}
          aria-label='Loading Spinner'
          data-testid='loader'
          speedMultiplier={1}
        />
      </div>
      </section>
    );
  }

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showBasket={true}
      />
    );
  };

  const renderImage = () => {
    return (
      <section
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--white-color)',
        }}
        className='flex-center'
      >
        <Image
          src={dish?.image ?? ''}
          alt={'Dish'}
          width={0}
          height={0}
          sizes='100vw'
          style={{width: '70%', height: 'auto'}}
        />
        {dish.isNew && (
          <Image
            alt={dish.name}
            width={58.09}
            height={50}
            src={'/assets/icons/14.png'}
            style={{position: 'absolute', top: 21, left: 20}}
          />
        )}
        {dish.isHot && (
          <Image
            alt='Hot'
            src={'/assets/icons/15.png'}
            priority={true}
            width={24}
            height={44}
            style={{
              left: 0,
              top: 0,
              marginLeft: 20,
              marginTop: 20,
              height: 'auto',
              position: 'absolute',
            }}
          />
        )}
        {/* <button
          style={{
            position: 'absolute',
            top: 25,
            right: 23,
            borderRadius: 2,
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
          <svg.HeartBigSvg dish={dish} />
        </button> */}
      </section>
    );
  };

  const renderNote = () => {
    return (
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <Title level={5}>Pesan</Title>
          <p className="option-subtext">Opsional</p>
        </div>
        <components.Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='Contoh: Tanpa Bawang, Pedas'
          rows={4}
          style={{borderRadius: 10, marginBottom: 20}}
        />
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <section
        className='container'
        style={{marginBottom: 20, marginTop: 30}}
      >
        <div
          style={{
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            className='number-of-lines-1'
            style={{textTransform: 'capitalize'}}
          >
            {dish?.name}
          </h3>
          {/* <span
            className='t16'
            style={{marginLeft: 14, whiteSpace: 'nowrap'}}
          >
            {dish?.kcal} kcal - {dish?.weight}g
          </span> */}
        </div>
        <p className='t16'>{dish?.description}</p>
        
        {/* Stock information */}
        {isLowStock && (
          <div style={{ marginTop: 10 }}>
            <span style={{ 
              color: '#ff6b6b', 
              fontSize: '14px', 
              fontWeight: 'var(--fw-medium)' 
            }}>
              Sisa stok = {stockCount}
            </span>
          </div>
        )}
      </section>
    );
  };

  const renderOptions = () => {
    return Object.entries(options).map(([category, optionData]) => (
      <div 
        key={category}
        className='container option-group' 
        style={{ marginBottom: 20 }}>
        <div className="option-header">
          <Title level={5}>{category}</Title>
          <p className="option-subtext">
            {optionData.optional 
              ? `Optional - Pilih maks. ${optionData.max}` 
              : (
                <span>
                  <span style={{ color: 'var(--main-turquoise)' }}>Harus dipilih</span> - Pilih {optionData.max}
                </span>
              )}
          </p>
        </div>
        <div className="option-list">
          {optionData.choices.map((choice) => {
            const selected = selectedOptions[category]?.some(opt => opt.name === choice.name);
            const disabled =
              !selected &&
              (selectedOptions[category]?.length || 0) >= optionData.max;

            return (
              <div
                key={choice.name}
                className={`option-item ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && onSelect(category, choice.name)}
              >
                <Checkbox checked={selected} disabled={disabled}>
                  {choice.name} - Rp {choice.price}
                </Checkbox>
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const renderPriceWithCounter = () => {
    const handleIncrease = () => {
      const newQuantity = localQuantity + 1;
      if (hasStock && newQuantity > maxQuantity) {
        messages.warning(`Stok tersedia hanya ${maxQuantity}`);
        return;
      }
      handleQuantityChange(newQuantity);
    };

    const handleDecrease = () => {
      handleQuantityChange(localQuantity > 1 ? localQuantity - 1 : 1);
    };

    // Check if increase button should be disabled
    const isIncreaseDisabled = hasStock && localQuantity >= maxQuantity;

    return (
      <section className='container'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--white-color)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <div
            style={{
              paddingTop: '14px',
              paddingBottom: '14px',
              paddingLeft: '20px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 'var(--fw-bold)',
                fontFamily: 'DM Sans',
              }}
            >
              {formatToIDRCurrency((Number(dish.price) || 0) * localQuantity)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button
              style={{
                padding: '20px',
                opacity: localQuantity <= 1 ? 0.5 : 1,
              }}
              onClick={handleDecrease}
              disabled={localQuantity <= 1}
            >
              <MinusSvg />
            </button>

            <span className='t14'>{localQuantity}</span>

            <button
              style={{
                padding: '20px',
                opacity: isIncreaseDisabled ? 0.5 : 1,
              }}
              onClick={handleIncrease}
              disabled={isIncreaseDisabled}
            >
              <PlusSvg />
            </button>
          </div>
        </div>
      </section>
    );
  };

  const validateOptions = () => {
    for (const [category, optionData] of Object.entries(options)) {
      if (!optionData.optional) {
        const selected = selectedOptions[category] || [];
        if (selected.length < optionData.max) {
          return false; // Validation fails if required options are not fully selected
        }
      }
    }
    return true; // Validation passes
  };

  const renderButton = () => {
    // Check if item is out of stock
    const isOutOfStock = hasStock && stockCount === 0;
    
    return (
      <section
        className='container'
        style={{paddingTop: 10, paddingBottom: 20}}
      >
        <components.Button
          label={isOutOfStock ? 'Stok Habis' : 'Tambahkan ke Keranjang'}
          onClick={() => {
            if (isOutOfStock) {
              messages.error('Stok habis, tidak bisa menambahkan ke keranjang');
              return;
            }
            
            if (!validateOptions()) {
              messages.info('Pilih mau di-custom seperti apa');
              return;
            }
            
            addToCart({
              ...dish,
              quantity: localQuantity,
              notes,
              selectedOptions: Object.entries(selectedOptions).map(([name, selected]) => ({
                name,
                selected,
                price: selected.length * 5000, // Example price calculation
              })),
            });
            setScreen(TabScreens.ORDER);
            if (pathname !== Routes.TAB_NAVIGATOR) {
              router.push(Routes.TAB_NAVIGATOR);
            }
          }}
          containerStyle={{
            marginBottom: 10,
            opacity: isOutOfStock ? 0.5 : 1,
          }}
          disabled={isOutOfStock}
        />
      </section>
    );
  };

  const renderContent = () => {
    if (isLoading) return null;
    return (
      
      <div
        className='scrollable'
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {contextHolder}
        {renderImage()}
        {renderDetails()}
        {renderOptions()}
        {renderNote()}
      </div>
    );
  };

  const renderLoader = () => {
    if (!isLoading) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          inset: 0,
          height: '100%',
        }}
        className='flex-center'
      >
        <PuffLoader
          size={40}
          color={'#455A81'}
          aria-label='Loading Spinner'
          data-testid='loader'
          speedMultiplier={1}
        />
      </div>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderLoader()}
      {renderPriceWithCounter()}
      {renderButton()}
    </components.Screen>
  );
};