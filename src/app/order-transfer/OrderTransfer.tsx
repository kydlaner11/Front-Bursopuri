'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Routes } from '../../routes';
import { stores } from '../../stores';
import { components } from '../../components';
import { formatToIDRCurrency } from '../../utils/currencyFormatter';
import { Spin, Modal, message } from 'antd';
import { QrcodeOutlined, BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Api from '../../api';
import useSnap from '../../hooks/useSnap';

// Interface untuk response payment gateway (sesuai dengan backend)
interface MidtransPaymentResponse {
  token: string;
  redirect_url?: string;
}

// Interface untuk payment request (sesuai dengan backend)
interface PaymentRequest {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

type QueueNumberCardProps = {
  queueNumber: string | number;
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
        Pilih metode pembayaran digital
      </p>
    </div>
  );
};

// Terms and Conditions Modal
const TermsModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InfoCircleOutlined style={{ marginRight: 8, color: 'var(--main-turquoise)' }} />
          Syarat & Ketentuan
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          style={{
            padding: '8px 24px',
            backgroundColor: 'var(--main-turquoise)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Mengerti
        </button>
      ]}
      width={400}
    >
      <div style={{ lineHeight: '1.6' }}>
        <h4 style={{ color: '#333', marginBottom: 12 }}>Ketentuan Pembayaran Digital:</h4>
        <ul style={{ paddingLeft: 20, color: '#666' }}>
          <li style={{ marginBottom: 8 }}>Pembayaran harus diselesaikan dalam waktu 10 menit</li>
          <li style={{ marginBottom: 8 }}>Pastikan nominal transfer sesuai dengan total pesanan</li>
          <li style={{ marginBottom: 8 }}>Simpan bukti pembayaran hingga pesanan selesai</li>
          <li style={{ marginBottom: 8 }}>Pesanan akan otomatis dibatalkan jika pembayaran tidak berhasil</li>
          <li style={{ marginBottom: 8 }}>Untuk kendala pembayaran, hubungi kasir</li>
        </ul>
        
        <h4 style={{ color: '#333', marginBottom: 12, marginTop: 20 }}>Informasi Tambahan:</h4>
        <ul style={{ paddingLeft: 20, color: '#666' }}>
          <li style={{ marginBottom: 8 }}>Tidak ada biaya tambahan untuk pembayaran digital</li>
          <li style={{ marginBottom: 8 }}>Refund hanya berlaku untuk pembayaran yang berhasil namun pesanan dibatalkan oleh restoran</li>
        </ul>
      </div>
    </Modal>
  );
};

// Payment Method Button Component
interface PaymentMethodButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  indicatorColor: string;
}

const PaymentMethodButton: React.FC<PaymentMethodButtonProps> = ({
  icon,
  title,
  description,
  onClick,
  disabled,
  indicatorColor
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '16px 20px',
        marginBottom: 12,
        border: '2px solid #e2e8f0',
        borderRadius: 12,
        backgroundColor: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--main-turquoise)';
          e.currentTarget.style.backgroundColor = 'rgba(252, 0, 0, 0.08)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <div style={{ textAlign: 'left' }}>
          <p style={{ 
            margin: 0, 
            fontSize: 16, 
            fontWeight: '600', 
            color: '#1e293b' 
          }}>
            {title}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: 13, 
            color: '#64748b' 
          }}>
            {description}
          </p>
        </div>
      </div>
      <div style={{
        width: 8,
        height: 8,
        backgroundColor: indicatorColor,
        borderRadius: '50%',
      }} />
    </button>
  );
};

const OrderTransferContent = () => {
  const { orderType } = stores.useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [midtransLoaded, setMidtransLoaded] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string>('');

  const orderId = searchParams.get('orderId');
  const queueNumber = searchParams.get('queue');
  const total = searchParams.get('total');

  // Use the useSnap hook for payment handling with popup mode
  useSnap({
    token: paymentToken,
    mode: 'popup',
    onSuccess: (result: any) => {
      console.log('Payment success:', result);
      message.success('Pembayaran berhasil!');
      setPaymentToken(''); // Reset token after use
      router.push(Routes.ORDER_SUCCESSFUL);
    },
    onPending: (result: any) => {
      console.log('Payment pending:', result);
      message.info('Pembayaran sedang diproses.');
      setPaymentToken(''); // Reset token after use
    },
    onError: (result: any) => {
      console.log('Payment error:', result);
      message.error('Pembayaran gagal. Silakan coba lagi.');
      setPaymentToken(''); // Reset token after use
      router.push(Routes.ORDER_FAILED);
    },
    onClose: () => {
      console.log('Payment popup closed');
      message.warning('Pembayaran dibatalkan');
      setPaymentToken(''); // Reset token after use
      router.push(Routes.ORDER_FAILED);
    }
  });

  if (!orderId || !queueNumber || !total) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  // Load Midtrans Snap script
  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    if (!clientKey) {
      console.error('Midtrans client key not found');
      message.error('Konfigurasi pembayaran tidak ditemukan. Silakan hubungi administrator.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    script.onload = () => {
      // Wait a bit for snap to be fully loaded
      setTimeout(() => {
        if (window.snap && typeof window.snap.pay === 'function') {
          setMidtransLoaded(true);
          console.log('Midtrans Snap loaded successfully');
        } else {
          console.error('Midtrans Snap object not found after script load');
          message.error('Gagal memuat sistem pembayaran. Silakan refresh halaman.');
        }
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Midtrans Snap');
      message.error('Gagal memuat sistem pembayaran. Silakan refresh halaman.');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Monitor payment status
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const response = await Api.get(`/bursopuri/order/${orderId}/status`);
        const status = response.data?.data?.status;

        console.log('Current order status:', status);

        if (status === 'IN_PROGRESS') {
          clearInterval(interval);
          message.success('Pembayaran berhasil! Pesanan Anda sedang diproses.');
          router.push(Routes.ORDER_SUCCESSFUL);
        }
      } catch (error) {
        console.error('Error checking order status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  // Handle Midtrans payment
  // const handleMidtransPayment = async () => {
  //   if (!midtransLoaded) {
  //     message.error('Sistem pembayaran belum siap. Silakan tunggu sebentar.');
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
      
  //     // Request payment token from backend
  //     const paymentData: PaymentRequest = {
  //       orderId: orderId,
  //       amount: Number(total),
  //       customerDetails: {
  //         first_name: "Customer", // Bisa diambil dari store atau form
  //         last_name: "",
  //         email: "customer@example.com", // Optional
  //         phone: "" // Optional
  //       }
  //     };

  //     const response = await Api.post('bursopuri/payment', paymentData);', paymentData);
  //     const { token } = response.data.data as MidtransPaymentResponse;

  //     if (!token) {
  //       throw new Error('Payment token not received');
  //     }

  //     console.log('Midtrans token received:', token);

  //     // Open Midtrans Snap payment popup
  //     window.snap.pay(token, {
  //       onSuccess: function(result) {
  //         console.log('Payment success:', result);
  //         message.success('Pembayaran berhasil!');
          
  //         // Update order status or redirect
  //         router.push(Routes.ORDER_SUCCESSFUL);
  //       },
  //       onPending: function(result) {
  //         console.log('Payment pending:', result);
  //         message.info('Pembayaran sedang diproses. Silakan tunggu konfirmasi.');
          
  //         // Bisa tetap di halaman ini atau redirect ke halaman pending
  //       },
  //       onError: function(result) {
  //         console.log('Payment error:', result);
  //         message.error('Pembayaran gagal. Silakan coba lagi.');
  //       },
  //       onClose: function() {
  //         console.log('Payment popup closed');
  //         message.warning('Pembayaran dibatalkan');
  //       }
  //     });

  //   } catch (error) {
  //     console.error('Error initiating payment:', error);
  //     message.error('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Handle specific payment methods - refactored to use useSnap
  const handleSpecificPayment = async (paymentType: 'QRIS' | 'OTHER') => {
    if (!midtransLoaded) {
      message.error('Sistem pembayaran belum siap. Silakan tunggu sebentar.');
      return;
    }

    try {
      setIsLoading(true);
      
      const paymentData: PaymentRequest = {
        orderId: orderId,
        amount: Number(total),
        customerDetails: {
          first_name: "Customer", // Bisa diambil dari store atau form
          last_name: "",
          email: "customer@example.com", // Optional
          phone: "" // Optional
        }
      };

      const response = await Api.post('bursopuri/payment', paymentData);
      const { token, redirect_url } = response.data.data as MidtransPaymentResponse;

      console.log(`Payment token for ${paymentType}:`, token);

      if (redirect_url) {
        // If redirect URL is provided, redirect directly
        window.location.href = redirect_url;
      } else if (token) {
        // Set the token to trigger useSnap hook
        setPaymentToken(token);
      } else {
        throw new Error('No payment token or redirect URL received');
      }

    } catch (error) {
      console.error(`Error with ${paymentType} payment:`, error);
      message.error('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Pilih Metode Pembayaran'
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

          {/* Queue Number Card */}
          <QueueNumberCard queueNumber={queueNumber} />

          <div style={{ marginBottom: 20 }}>
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

          {/* Payment Method Selection */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 'bold',
              margin: '0 0 16px 0',
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
              Pilih Metode Pembayaran
            </h3>

            {/* All Payment Methods Button */}
            {/* <PaymentMethodButton
              icon={<CreditCardOutlined style={{ 
                fontSize: 24, 
                color: 'var(--main-turquoise)', 
                marginRight: 16 
              }} />}
              title="Semua Metode Pembayaran"
              description="Kartu kredit, debit, e-wallet, dan bank transfer"
              onClick={handleMidtransPayment}
              disabled={isLoading || !midtransLoaded}
              indicatorColor="#8b5cf6"
            /> */}

            {/* QRIS Payment Button */}
            <PaymentMethodButton
              icon={<QrcodeOutlined style={{ 
                fontSize: 24, 
                color: 'var(--main-turquoise)', 
                marginRight: 16 
              }} />}
              title="QRIS"
              description="Scan QR Code untuk bayar dengan e-wallet"
              onClick={() => handleSpecificPayment('QRIS')}
              disabled={isLoading || !midtransLoaded}
              indicatorColor="#22c55e"
            />

            {/* Bank Transfer Payment Button */}
            <PaymentMethodButton
              icon={<BankOutlined style={{ 
                fontSize: 24, 
                color: 'var(--main-turquoise)', 
                marginRight: 16 
              }} />}
              title="Transfer Bank"
              description="Transfer melalui ATM, mobile banking, atau internet banking"
              onClick={() => handleSpecificPayment('OTHER')}
              disabled={isLoading || !midtransLoaded}
              indicatorColor="#3b82f6"
            />
          </div>

          {/* Midtrans Loading Status */}
          {!midtransLoaded && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
            }}>
              <Spin size="small" style={{ marginRight: 12 }} />
              <p style={{
                margin: 0,
                fontSize: 14,
                color: '#92400e',
              }}>
                Memuat sistem pembayaran...
              </p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <InfoCircleOutlined style={{ 
                color: 'var(--main-turquoise)', 
                fontSize: 16, 
                marginRight: 12,
                marginTop: 2
              }} />
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#1e293b',
                }}>
                  Syarat & Ketentuan
                </p>
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: 13,
                  color: '#64748b',
                  lineHeight: '1.4',
                }}>
                  Dengan melanjutkan pembayaran, Anda menyetujui syarat dan ketentuan yang berlaku.
                </p>
                <button
                  onClick={() => setShowTerms(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--main-turquoise)',
                    fontSize: 13,
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: 16,
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
                  Selesaikan pembayaran dalam 10 menit. Pesanan akan dibatalkan otomatis jika pembayaran tidak berhasil.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Modal */}
        <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />

        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Spin size="large" />
              <p style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
                Memproses pembayaran...
              </p>
            </div>
          </div>
        )}

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
  return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
};

export const OrderTransfer: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderTransferContent />
    </Suspense>
  );
};