'use client';

import React from 'react';

// import {svg} from '../../svg';
import {Routes} from '../../routes';
import {stores} from '../../stores';
import {components} from '../../components';

export const Checkout: React.FC = () => {
  const {total, discount, delivery, list} = stores.useCartStore();

  const renderHeader = () => {
    return (
      <components.Header
        title='Checkout'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        {<div style={{marginBottom: 10}}>
          <components.Tag
            label='Order Type'
            value= 'Dine in'
          />
        </div>}
        {/* SUMMARY */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            backgroundColor: 'var(--white-color)',
          }}
        >
          <div
            style={{
              paddingBottom: 20,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span
              className='t18'
              style={{color: 'var(--main-dark)', textTransform: 'capitalize'}}
            >
              My order
            </span>
            <span
              className='t18'
              style={{color: 'var(--main-dark)'}}
            >
              Rp {total}
            </span>
          </div>
          <ul>
            {list.map((dish) => {
              return (
                <li
                  key={dish.id}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className='t14'>{dish.name}</span>
                  <span className='t14'>
                    {dish.quantity} x Rp {dish.price}
                  </span>
                </li>
              );
            })}
          </ul>
          <div
            style={{
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className='t14'>Discount</span>
            <span className='t14'>- Rp {discount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className='t14'>Delivery</span>
            <span className='t14'>Rp {delivery}</span>
          </div>
        </section>

        {/* SHIPPING DETAILS */}
        <section
          style={{
            padding: 20,
            borderRadius: 10,
            marginBottom: 14,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--white-color)',
          }}
          className='clickable'
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span
              className='t14 number-of-lines-1'
              style={{
                fontWeight: 500,
                marginBottom: 2,
                color: 'var(--main-dark)',
                textTransform: 'capitalize',
              }}
            >
              Payment Information
            </span>
            <span className='t12'>
             The data is used for order process. Make sure you enter a valis data.
            </span>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 10,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
              }}
            >
              <input
                type='text'
                placeholder='Full Name'
                style={{
                  padding: 10,
                  borderRadius: 5,
                  border: '1px solid var(--border-color)',
                  marginBottom: 10,
                }}
              />
              <input
                type='text'
                placeholder='Phone Number'
                style={{
                  padding: 10,
                  borderRadius: 5,
                  border: '1px solid var(--border-color)',
                  marginBottom: 10,
                }}
              />
              <input
                type='text'
                placeholder='Table Number'
                style={{
                  padding: 10,
                  borderRadius: 5,
                  border: '1px solid var(--border-color)',
                }}
              />
            </form>
          </div>
        </section>

        {/* PAYMENT METHOD */}
        {/* <section
          style={{
            padding: 20,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--white-color)',
          }}
          className='clickable'
        >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span
              className='t14 number-of-lines-1'
              style={{
                fontWeight: 500,
                marginBottom: 8,
                color: 'var(--main-dark)',
                textTransform: 'capitalize',
              }}
            >
              Payment method
            </span>
            <span className='t12 number-of-lines-1'>4947 **** **** 3157</span>
          </div>
          <svg.RightArrowSvg />
        </section> */}
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='Confirm order'
          href={Routes.ORDER_SUCCESSFUL}
        />
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </components.Screen>
  );
};
