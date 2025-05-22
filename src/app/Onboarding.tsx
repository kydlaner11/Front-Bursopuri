'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import PuffLoader from 'react-spinners/PuffLoader';
import { useTableNumber } from '../hooks/useTableNumber';
import { useRouter } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import Image from 'next/image';

import { hooks } from '../hooks';
import { Routes } from '../routes';
import { components } from '../components';
import { useSession } from '../hooks/useSession';

// Loading component that will be used as fallback
const LoadingSpinner = () => {
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

// Content component that uses the hooks requiring Suspense
const OnboardingContent: React.FC = () => {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { tableNumber } = useTableNumber();
  const { sessionId } = useSession();
  const { onboarding: onboardingData, onboardingLoading } =
    hooks.useGetOnboarding();

  const renderCarousel = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Swiper
          onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
        >
          {onboardingData.map((item) => (
            <SwiperSlide
              key={item.id}
              style={{ width: '100%', height: 'auto' }}
            >
              <Image
                src={item.image}
                alt='Onboarding'
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                style={{ width: '90%', height: 'auto', margin: '0 auto', borderRadius: 10 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderDots = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        className='container'
        style={{
          gap: 8,
          marginBottom: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {onboardingData.map((item, index) => (
          <div
            key={item.id}
            style={{
              width: 8,
              height: currentSlideIndex === index ? 20 : 8,
              borderRadius: '4px',
              backgroundColor:
                currentSlideIndex === index ? '#7C0000' : '#ACE3E6',
            }}
          />
        ))}
      </section>
    );
  };

  const renderDescription = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    const currentItem = onboardingData[currentSlideIndex];
    return (
      <section
        className='container'
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            paddingTop: '10%',
            paddingBottom: '10%',
          }}
        >
          <h1 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
            {currentItem.title1}
          </h1>
          <h1 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
            {currentItem.title2}
          </h1>
          <p
            className='t16'
            style={{ marginTop: '14px', color: '#B4B4C6', textAlign: 'center' }}
          >
            {currentItem.description1} <br />
            {currentItem.description2}
          </p>
        </div>
      </section>
    );
  };

  const renderButton = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        className='container'
        style={{ padding: '0 20px 20px 20px' }}
      >
        <components.Button
          label='Get Started'
          onClick={() => {
            router.push(Routes.TAB_NAVIGATOR);
            {sessionId}
          }}
        />
      </section>
    );
  };

  const renderLoader = () => {
    if (!onboardingLoading) return null;

    return <LoadingSpinner />;
  };

  const renderTableInfo = () => {
    if (tableNumber) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#7C0000',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 'bold',
            zIndex: 10
          }}
        >
          Meja #{tableNumber}
        </div>
      );
    }
    return null;
  };

  return (
    <components.Screen>
      {renderTableInfo()}
      {renderCarousel()}
      {renderDots()}
      {renderDescription()}
      {renderButton()}
      {renderLoader()}
    </components.Screen>
  );
};

// Main component with Suspense boundary
export const Onboarding: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingContent />
    </Suspense>
  );
};