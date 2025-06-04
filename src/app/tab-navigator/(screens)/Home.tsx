'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import PuffLoader from 'react-spinners/PuffLoader';
import { Spin } from 'antd';

import {svg} from '../../../svg';
import {items} from '../../../items';
import {hooks} from '../../../hooks';
import {Routes} from '../../../routes';
import {components} from '../../../components';
import {stores} from '../../../stores';

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [recommendLoadingId, setRecommendLoadingId] = useState<string | null>(null);

  const {menu, menuLoading} = hooks.useGetMenu();
  const {dishes, dishesLoading} = hooks.useGetDishes();
  // const {reviews, reviewsLoading} = hooks.useGetReviews();
  const {carousel, carouselLoading} = hooks.useGetCarousel();

  const isLoading =
    menuLoading || dishesLoading  || carouselLoading;

  const handleSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
  };

  const {setOrderType, orderType} = stores.useCartStore(); // Retrieve orderType from the store

  const handleOrderTypeChange = (type: string) => {
    setOrderType(type); // Use setOrderType directly
    setShowModal(false);
  };

  const renderHeader = () => {
    return (
      <components.Header
        user={true}
        userName={true}
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
        <Link
         href={`${Routes.MENU_LIST}/all`}
         className='clickable'
          style={{flex: 1}}
        >
          <components.InputField
            inputType='search'
            placeholder='Cari Menu ...'
            containerStyle={{flex: 1, backgroundColor: 'var(--white-color)'}}
          />
        </Link>
        {/* <Link
          href={`${Routes.MENU_LIST}/all`}
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
        </Link> */}
      </section>
    );
  };

  const renderCategories = () => {
    return (
      <section style={{marginBottom: 30}}>
        <components.BlockHeading
          title=''
          className='container'
          containerStyle={{marginBottom: 14}}
        />
        <Swiper
          spaceBetween={10}
          slidesPerView={3.5}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {menu.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <Link
                  href={`${Routes.MENU_LIST}/all`}
                  className='clickable'
                  style={{position: 'relative'}}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    sizes='100vw'
                    priority={true}
                    style={{width: '100%', height: '100%', borderRadius: 10, border: '1px solid var(--border-color)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'}}  
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 15,
                      textAlign: 'center',
                      backgroundColor: 'var(--white-color)',
                      borderRadius: '0 0 10px 10px',
                      color: 'var(--main-dark)',
                    }}
                    className='t10 number-of-lines-1'
                  >
                    {item.name}
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  const renderOrdertype = () => {
    return (
      <>
        <section
          className='container'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
            position: 'relative',
            zIndex: 2,
            
          }}
        >
          <div
            className='clickable'
            style={{
              flex: 1,
              backgroundColor: 'var(--white-color)',
              padding: '20px 40px',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'black',
              border: '2px solid var(--border-color)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => setShowModal(true)}
          >
            <span className='h6'>Tipe Pesanan</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '10px 20px',
                borderRadius: 10,
                border: '2px solid var(--border-color)',
              }}
            >
              <span className='h6'>{orderType}</span> {/* Use orderType here */}
              <svg.ArrowDownSvg />
            </div>
          </div>
        </section>
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 3,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                backgroundColor: 'var(--white-color)',
                borderRadius: 10,
                padding: 20,
                width: '80%',
                maxWidth: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{marginBottom: 20}}>Tipe Pesanan</h3>
              <div
                className='clickable'
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  marginBottom: 10,
                  backgroundColor: orderType === 'Dine in' ? 'var(--light-gray)' : 'var(--white-color)',
                  border: orderType === 'Dine in' ? '1px solid var(--main-turquoise)' : '1px solid var(--light-gray)',
                  textAlign: 'center',
                }}
                onClick={() => handleOrderTypeChange('Dine in')}
              >
                Dine in
              </div>
              <div
                className='clickable'
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  backgroundColor: orderType === 'Take Away' ? 'var(--light-gray)' : 'var(--white-color)',
                  border: orderType === 'Take Away' ? '1px solid var(--main-turquoise)' : '1px solid var(--light-gray)',
                  textAlign: 'center',
                }}
                onClick={() => handleOrderTypeChange('Take Away')}
              >
                Take Away
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderCarousel = () => {
    return (
      <section style={{marginBottom: 30, position: 'relative'}}>
        <Swiper
          slidesPerView={'auto'}
          pagination={{clickable: true}}
          navigation={true}
          mousewheel={true}
          onSlideChange={handleSlideChange}
        >
          {carousel.map((banner, index) => {
            return (
              <SwiperSlide key={banner.id}>
                <Link href={`${Routes.MENU_ITEM}/${dishes[index].id}`}>
                  <Image
                    src={banner.banner}
                    alt='Banner'
                    width={0}
                    height={0}
                    sizes='100vw'
                    priority={true}
                    className='clickable'
                    style={{width: '100%', height: 'auto'}}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 27,
            zIndex: 1,
            width: '100%',
            gap: 6,
          }}
        >
          {carousel.map((_, index) => {
            return (
              <div
                key={_.id}
                style={{
                  width: 8,
                  height: activeSlide === index ? 20 : 8,
                  borderRadius: 10,
                  backgroundColor:
                    activeSlide === index
                      ? 'var(--white-color)'
                      : `rgba(255, 255, 255, 0.5)`,
                }}
              />
            );
          })}
        </div>
      </section>
    );
  };

  const renderRecommendedDishes = () => {
    // Sorting dishes: available dishes first, then unavailable dishes
    const sortedRecommendedDishes = dishes
      .filter((dish) => dish.isRecommended)
      .sort((a, b) => {
        // Sort by availability: available items first (true comes before false)
        if (a.tersedia === b.tersedia) return 0;
        return a.tersedia ? -1 : 1;
      });

    return (
      <section style={{marginBottom: 30}}>
        <components.BlockHeading
          title='Rekomendasi untuk Anda'
          className='container'
          containerStyle={{marginBottom: 14}}
        />
        <Swiper
          spaceBetween={14}
          slidesPerView={1.6}
          onSlideChange={() => {}}
          onSwiper={(swiper) => {}}
          style={{padding: '0 20px'}}
        >
          {sortedRecommendedDishes.map((dish) => {
            return (
              <SwiperSlide key={dish.id}>
                <items.RecommendedItem
                  item={dish}
                  loading={recommendLoadingId === dish.id}
                  onButtonClick={async () => {
                    setRecommendLoadingId(dish.id);
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    );
  };

  // const renderReviews = () => {
  //   return (
  //     <section style={{marginBottom: 20}}>
  //       <components.BlockHeading
  //         href={Routes.REVIEWS}
  //         title='Our Happy clients say'
  //         containerStyle={{marginLeft: 20, marginRight: 20, marginBottom: 14}}
  //       />
  //       <Swiper
  //         spaceBetween={14}
  //         slidesPerView={1.2}
  //         pagination={{clickable: true}}
  //         navigation={true}
  //         mousewheel={true}
  //         style={{padding: '0 20px'}}
  //       >
  //         {reviews.map((review: any) => {
  //           return (
  //             <SwiperSlide key={review.id}>
  //               <items.ReviewItem review={review} />
  //             </SwiperSlide>
  //           );
  //         })}
  //       </Swiper>
  //     </section>
  //   );
  // };

  const renderContent = () => {
    if (isLoading) return null;
    return (
      <main
        className='scrollable'
        style={{paddingTop: 10, height: '100%'}}
      >
        {renderSearch()}
        {renderCarousel()}
        {renderOrdertype()}
        {renderCategories()}
        {renderRecommendedDishes()}
        {/* {renderReviews()} */}
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
       {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin percent="auto" size="large" fullscreen/>
      </div>
      )}
    </components.Screen>
  );
};