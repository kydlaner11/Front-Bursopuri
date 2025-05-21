'use client';

import React, { Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

import { Routes } from '../../routes';
import { stores } from '../../stores';
import { components } from '../../components';
import { formatToIDRCurrency } from '../../utils/currencyFormatter';
import { Spin } from 'antd';
import Api from '../../api'; // tambahkan import Api

// Create a separate component to use search params
const OrderWaitingContent = () => {
  const { resetCart, orderType } = stores.useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const queueNumber = searchParams.get('queue');
  const total = searchParams.get('total');

  if (!orderId || !queueNumber || !total) {
    return <Spin size="large" fullscreen />;
  }

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const response = await Api.get(`/bursopuri/order/${orderId}/status`); // gunakan Api
        const status = response.data?.data?.status;

        console.log('Current status:', status);

        if (status === 'IN_PROGRESS') {
          clearInterval(interval); // Stop polling
          router.push(Routes.ORDER_SUCCESSFUL);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [orderId, router]);

  const renderHeader = () => {
    return (
      <components.Header
        title='Waiting Payment'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{ paddingTop: 10 }}
      >
        <div style={{ marginBottom: 10 }}>
          <components.Tag
            label='Order Type'
            value={orderType === 'dine_in' ? 'Dine in' : orderType}
          />
        </div>
        <section
          style={{
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          {/* Icon and Payment Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Image
              src="/assets/icons/cashier.png"
              alt="cash register"
              width={250}
              height={250}
              style={{ marginBottom: 16 }}
            />
          </div>
          
          {/* Total Payment */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 20,
          }}>
            <p className="t16" style={{ margin: 0, color: '#333' }}>Total Payment</p>
            <p className="t18" style={{ fontWeight: 'bold', margin: 0, color: 'black' }}>
              {formatToIDRCurrency(Number(total))}
            </p>
          </div>

          {/* Payment Methods Title */}
          <div style={{ marginBottom: 10 }}>
            <p className="t16" style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>Payment Methods</p>
          </div>

          {/* Queue Number Box */}
          <div
            style={{
              border: '1px dashed #ccc',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%', 
                backgroundColor: '#f8d7da', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginRight: 10
              }}>
                <span style={{ color: '#721c24', fontSize: 12 }}>!</span>
              </div>
              <p style={{ margin: 0, fontSize: 14 }}>Your queue number is</p>
            </div>
            <p style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{queueNumber}</p>
          </div>

          {/* Payment Methods Title (Repeated in Figma) */}
          <div style={{ marginBottom: 10 }}>
            <p className="t16" style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>Payment instructions</p>
          </div>

          {/* Payment Instructions */}
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Datang ke kasir untuk melakukan pembayaran.
            </p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Sampaikan nomor pesanan atau nama Anda ke kasir.
            </p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Bayar sesuai total yang ditampilkan (hanya tunai).
            </p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Tunggu konfirmasi pembayaran dari kasir.
            </p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Ambil struk atau nomor antrian jika diberikan.
            </p>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
              Duduk dan tunggu notifikasi pesanan siap.
            </p>
          </div>
        </section>
      </main>
    );
  };

  const renderButtons = () => {
    return (
      <section style={{ padding: 20 }}> {/* Hidden in Figma design */}
        <components.Button
          onClick={() => {
            resetCart();
            router.push(Routes.ORDER_HISTORY); 
          }}
          label='Edit orders'
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

// Loading fallback component
const LoadingFallback = () => {
  return <Spin size="large" fullscreen />;
};

// Main component that uses Suspense
export const OrderWaiting: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderWaitingContent />
    </Suspense>
  );
};