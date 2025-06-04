'use client';

import React from 'react';

import {items} from '../../../items';
import {stores} from '../../../stores';
import {Routes} from '../../../routes';
import {components} from '../../../components';
import {formatToIDRCurrency} from '../../../utils/currencyFormatter';

export const Order: React.FC = () => {
  const {list, subtotal, total, orderType, quantity} = stores.useCartStore();

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        title='Pesanan'
        showBasket={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        {/* Order Type */}
        <div style={{marginBottom: 30, marginTop: 10}}>
          <components.Tag
            label='Tipe Pesanan'
            value={orderType} // Display the current order type
          />
        </div>
        {/* DISHES */}
        <section style={{marginBottom: 20}}>
          <ul>
            {list.map((dish, index, array) => {
              const isLast = index === array.length - 1;
              console.log(dish)
              console.log(array)
              return (
                <items.OrderItem
                  dish={dish}
                  key={`${dish.id}-${dish.notes ?? ''}-${index}`}
                  isLast={isLast}
                />
              );
            })}
          </ul>
        </section>
        {/* APPLES PROMOCODE */}
        <section style={{marginBottom: '10%'}}>
          {/* <button>
            <svg.ApplyPromocodeSvg />
          </button> */}
        </section>
      </main>
    );
  };

  const renderStickySections = () => {

    return (
      <menu
      className='container'
        style={{
          position: 'sticky',
          bottom: 0,
          // backgroundColor: 'white',
          zIndex: 10,
        }}
      >
        {/* Payment Details */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            border: '1px solid var(--main-turquoise)',
            marginBottom: 10,
          }}
        >
          <ul>
            {/* SUBTOTAL */}
            <li
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 14,
                marginBottom: 20,
              }}
            >
              <span
                className='t16'
                style={{color: 'var(--main-dark)', fontWeight: 800}}
              >
                Detail Pembayaran
              </span>
            </li>
            <li
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 14,
                marginBottom: 20,
                borderBottom: '1px solid #DBE9F5',
              }}
            >
              <span
                className='t14'
                style={{color: 'var(--main-dark)', fontWeight: 500}}
              >
                Subtotal ({quantity} Menu)
              </span>
              <span
                className='t14'
                style={{color: 'var(--main-dark)'}}
              >
                {formatToIDRCurrency(subtotal)}
              </span>
            </li>
            {/* TOTAL */}
            <li
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h4>Total</h4>
              <h4>{formatToIDRCurrency(total)}</h4>
            </li>
          </ul>
        </section>
        {/* Button */}
        <section>
          <components.Button
            label='Checkout'
            href={Routes.CHECKOUT}
          />
        </section>
      </menu>
    );
  };

  const renderModal = () => {
    return <components.Modal />;
  };

  const renderBottomTabBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderStickySections()}
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
