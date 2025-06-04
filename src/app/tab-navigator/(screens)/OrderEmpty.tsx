import React from 'react';
import Image from 'next/image';

import {URLS} from '../../../config';
import {Routes} from '../../../routes';
import {components} from '../../../components';

export const OrderEmpty: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        user={true}
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
            src={`${URLS.URL_HELP}/assets/images/02.jpg`}
            alt='profile'
            width={290}
            height={290}
            style={{
              maxWidth: 290,
              width: '100%',
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
            Belum Ada Pesanan
          </h2>
          <p
            style={{textAlign: 'center'}}
            className='t16'
          >
            Silakan pilih menu yang ingin Anda pesan. <br/> Anda dapat melihat pesanan Anda di sini.
          </p>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: '10px 20px 0 20px'}}>
        <components.Button
          href={`${Routes.MENU_LIST}/all`}
          label='Pesan Sekarang'
        />
      </section>
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
      {renderButton()}
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
