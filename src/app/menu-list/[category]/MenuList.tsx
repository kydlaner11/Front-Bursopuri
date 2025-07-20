'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {svg} from '../../../svg';
import {items} from '../../../items';
import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';
import type {DishType} from '../../../types';
import Loading from '@/app/tab-navigator/loading';

type Props = {
  category: string;
};

export const MenuList: React.FC<Props> = ({category}) => {
  const {dishes, dishesLoading} = hooks.useGetDishes();
  const exists: DishType[] = dishes.filter((dish) =>
    dish.menu.includes(category),
  );
  const list = category === 'all' ? dishes : exists;
  const [search, setSearch] = useState('');
  const [loadingDishId, setLoadingDishId] = useState<string | null>(null);
  
  // Filter dishes based on search
  const filteredDishes = list.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort dishes: available dishes first, then unavailable dishes
  const sortedDishes = filteredDishes.sort((a, b) => {
    // Sort by availability: available items first (true comes before false)
    const aAvailable = a.tersedia !== false; // Default to true if undefined
    const bAvailable = b.tersedia !== false; // Default to true if undefined
    
    if (aAvailable === bAvailable) return 0;
    return aAvailable ? -1 : 1;
  });

  const renderHeader = () => {
    return (
      <components.Header
        title='Menu'
        showGoBack={true}
        showBasket={true}
      />
    );
  };

  const renderSearch = () => {
    if (dishesLoading) return null;
    return (
      <section
        className='row-center container'
        style={{
          gap: 5,
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <components.InputField
          inputType='search'
          placeholder='Cari Menu ...'
          containerStyle={{flex: 1, backgroundColor: 'var(--white-color)'}}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          href={Routes.FILTER}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className='center'
        >
          <svg.FilterSvg />
        </Link>
      </section>
    );
  };

  const renderDishes = () => {
    if (dishesLoading) return null;
    
    if (sortedDishes.length === 0) {
      return (
        <section
          className='container'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <span className='t16'>No dishes found</span>
        </section>
      );
    }

    return (
      <section>
        <ul>
          {sortedDishes.map((dish, index, array) => {
            const isLast = index === array.length - 1;
            const isAvailable = dish.tersedia !== false; // Default to true if undefined
            
            return (
              <div key={dish.id} style={{ position: 'relative', listStyle: 'none' }}>
                <div
                  style={{
                    opacity: isAvailable ? 1 : 0.6,
                    pointerEvents: isAvailable ? 'auto' : 'none',
                    position: 'relative'
                  }}
                >
                  <items.MenuListItem
                    dish={dish}
                    isLast={isLast}
                    isLoading={loadingDishId === dish.id}
                    setLoadingDishId={setLoadingDishId}
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
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: '14px',
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
                </div>
              </div>
            );
          })}
        </ul>
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main
        className='container scrollable'
        style={{paddingBottom: 20}}
      >
        {renderDishes()}
      </main>
    );
  };
  
  const renderLoader = () => {
    if (!dishesLoading) return null;
    return <Loading />;
  }

  return (
    <components.Screen>
      {renderHeader()}
      {renderSearch()}
      {renderContent()}
      {renderLoader()}
    </components.Screen>
  );
};