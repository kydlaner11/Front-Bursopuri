'use client';

import React, { Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Routes } from '../../routes';
import { stores } from '../../stores';
import { components } from '../../components';
import { formatToIDRCurrency } from '../../utils/currencyFormatter';
import { Spin } from 'antd';
import Api from '../../api';

// Improved step component with better visual hierarchy
interface PaymentStepProps {
  stepNumber: number;
  title: string;
  description: string;
  isHighlight?: boolean;
}

type QueueNumberCardProps = {
  queueNumber: string | number;
};

const PaymentStep: React.FC<PaymentStepProps> = ({ stepNumber, title, description, isHighlight = false }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: 16,
      padding: isHighlight ? '12px' : '8px 0',
      backgroundColor: isHighlight ? '#f0f9ff' : 'transparent',
      borderRadius: isHighlight ? '8px' : '0',
      border: isHighlight ? '1px solid #0ea5e9' : 'none',
    }}>
      {/* Step number circle */}
      <div style={{
        minWidth: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: isHighlight ? '#0ea5e9' : 'var(--main-turquoise)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 12,
        marginTop: 2,
      }}>
        {stepNumber}
      </div>
      
      {/* Step content */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 15,
          fontWeight: '600',
          margin: '0 0 4px 0',
          color: isHighlight ? '#0c4a6e' : '#333',
        }}>
          {title}
        </p>
        <p style={{
          fontSize: 14,
          color: '#666',
          margin: 0,
          lineHeight: '1.4',
        }}>
          {description}
        </p>
      </div>
    </div>
  );
};


const QueueNumberCard = ({ queueNumber }: QueueNumberCardProps) => {
  return (
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
        <p style={{ margin: 0, fontSize: 14 }}>Nomor antrian anda</p>
      </div>
      <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>{queueNumber}</p>
    </div>
  );
};

// Status indicator component
const StatusIndicator = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px',
      backgroundColor: '#fef3c7',
      borderRadius: 8,
      marginBottom: 20,
      border: '1px solid #f59e0b',
    }}>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#f59e0b',
        marginRight: 8,
        animation: 'pulse 2s infinite',
      }} />
      <p style={{
        color: '#92400e',
        fontSize: 14,
        fontWeight: '500',
        margin: 0,
      }}>
        Menunggu pembayaran di kasir
      </p>
    </div>
  );
};

const OrderWaitingContent = () => {
  const { orderType } = stores.useCartStore();
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
        const response = await Api.get(`/bursopuri/order/${orderId}/status`);
        const status = response.data?.data?.status;

        console.log('Current status:', status);

        if (status === 'IN_PROGRESS') {
          clearInterval(interval);
          router.push(Routes.ORDER_SUCCESSFUL);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  const renderHeader = () => {
    return (
      <components.Header
        title='Menunggu Pembayaran'
      />
    );
  };

  const renderContent = () => {
    return (
      <main className='scrollable container' style={{ paddingTop: 10 }}>
        <section style={{
          backgroundColor: 'var(--white-color)',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}>
          {/* Status Indicator */}
          <StatusIndicator />

          {/* Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Image
              src="/assets/icons/cashier.png"
              alt="cash register"
              width={200}
              height={200}
            />
          </div>

          {/* Queue Number Card */}
          <QueueNumberCard queueNumber={queueNumber} />

          <div style={{ marginBottom: 10 }}>
          <components.Tag
            label='Tipe Pesanan'
            value={orderType === 'dine_in' ? 'Dine in' : orderType}
          />
        </div>
          
          {/* Total Payment */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderRadius: 10,
            marginBottom: 24,
            border: '1px solid #e2e8f0',
          }}>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: 15,
              fontWeight: '500',
            }}>
              Total Pembayaran
            </p>
            <p style={{
              fontWeight: 'bold',
              margin: 0,
              color: '#0f172a',
              fontSize: 18,
            }}>
              {formatToIDRCurrency(Number(total))}
            </p>
          </div>

          {/* Instructions Title */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 'bold',
              margin: 0,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{
                width: 4,
                height: 20,
                backgroundColor: 'var(--main-turquoise)',
                borderRadius: 2,
                marginRight: 12,
              }} />
              Cara Pembayaran
            </h3>
          </div>

          {/* Payment Steps */}
          <div style={{ marginBottom: 20 }}>
            <PaymentStep
              stepNumber={1}
              title="Datang ke Kasir"
              description="Pergi ke counter kasir dengan membawa handphone Anda"
            />
            
            <PaymentStep
              stepNumber={2}
              title="Tunjukkan Nomor Antrian"
              description="Sampaikan nomor antrian di atas atau sebutkan nama pemesan"
              isHighlight={true}
            />
            
            <PaymentStep
              stepNumber={3}
              title="Lakukan Pembayaran"
              description="Bayar sesuai total yang ditampilkan (pembayaran tunai saja)"
            />
            
            <PaymentStep
              stepNumber={4}
              title="Ambil Struk & Tunggu"
              description="Ambil struk pembayaran, lalu tunggu pesanan dipanggil"
            />
          </div>

          {/* Important Note */}
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: 16,
            marginTop: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#dc2626',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                minWidth: 20,
                marginTop: 2,
              }}>
                <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>!</span>
              </div>
              <div>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#991b1b',
                }}>
                  Penting!
                </p>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#7f1d1d',
                  lineHeight: '1.4',
                }}>
                  Pembayaran hanya dapat dilakukan di kasir. Pastikan Anda membawa uang pas atau lebih.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Add some bottom spacing */}
        <div style={{ height: 20 }} />
      </main>
    );
  };

  return (
    <components.Screen>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};

const LoadingFallback = () => {
  return <Spin size="large" fullscreen />;
};

export const OrderWaiting: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderWaitingContent />
    </Suspense>
  );
};