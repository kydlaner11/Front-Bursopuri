'use client';

import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation'; // Tambahkan impor useRouter

import {URLS} from '../../config';
import {Routes} from '../../routes';
import {stores} from '../../stores';
import {components} from '../../components';

export const OrderSuccessful: React.FC = () => {
  const {resetCart} = stores.useCartStore();
  const router = useRouter(); // Inisialisasi router

  const renderHeader = () => {
      return (
        <components.Header
          title='Payment'
          showGoBack={false}

        />
      );
    };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10}}
      >
        <section
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            placeItems: 'center',
            flexDirection: 'column',
            backgroundColor: 'var(--white-color)',
          }}
        >
          <Image
            src={`${URLS.URL_HELP}/assets/images/03.jpg`}
            alt='profile'
            width={0}
            height={0}
            sizes='100vw'
            style={{
              width: '70%',
              height: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 14,
            }}
          />
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 14,
              textTransform: 'capitalize',
            }}
          >
            Thank you for <br /> your order!
          </h2>
          <p
            style={{textAlign: 'center'}}
            className='t16'
          >
            Your order will be delivered on time. <br /> Thank you!
          </p>
        </section>
      </main>
    );
  };

  const renderButtons = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='New order'
          containerStyle={{marginBottom: 14}}
          onClick={() => {
            resetCart();
            router.push(Routes.TAB_NAVIGATOR); // Gunakan router.push untuk navigasi
          }}
        />
        <components.Button
          onClick={() => {
            resetCart();
            router.push(Routes.ORDER_HISTORY); 
          }}
          label='View orders'
          colorScheme='secondary'
        />
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButtons()}
    </components.Screen>
  );
};
