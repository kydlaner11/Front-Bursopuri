'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PuffLoader from 'react-spinners/PuffLoader';

import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';

export const Menu: React.FC = () => {
  const {menu, menuLoading} = hooks.useGetMenu();
  const isLoading = menuLoading;


  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        userName={true}
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
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
          }}
        >
          {menu.map((item) => {
            const category = item.name.replace(' ', '-');
            return (
              <li key={item.id}>
                <Link
                  href={`${Routes.MENU_LIST}/${category}`}
                  style={{position: 'relative'}}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    sizes='100vw'
                    priority={true}
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                  />
                  <div style={{position: 'absolute', left: 15, bottom: 10}}>
                    <span
                      className='t16 number-of-lines-1'
                      style={{color: 'var(--main-dark)'}}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
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
      {renderModal()}
      {renderLoader()}
      {renderBottomTabBar()}
    </components.Screen>
  );
};
