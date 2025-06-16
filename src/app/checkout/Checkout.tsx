'use client';

import React from 'react';

// import {svg} from '../../svg';
import {useRouter} from 'next/navigation'
import {Routes} from '../../routes';
import {stores} from '../../stores';
import {components} from '../../components';
import { FormOutlined, DownOutlined, UpOutlined   } from '@ant-design/icons';
import { formatToIDRCurrency } from '@/utils/currencyFormatter';
import { message, Form, Input } from 'antd';
import PuffLoader from 'react-spinners/PuffLoader';
import Api from '../../api'; // tambahkan import Api
import {svg} from '../../svg';


export const Checkout: React.FC = () => {
  const router = useRouter();
  const [messages, contextHolder] = message.useMessage();
  const {table, sessionId} = stores.useTableStore();
  const {total, subtotal, list, orderType} = stores.useCartStore();
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);
  const [isOrderExpanded, setIsOrderExpanded] = React.useState(false);
  const [paymentMethod] = React.useState<'CASH' | 'QRIS'>('CASH');
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true); // Start loader
      // Get form data
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      const customerName = (form.elements.namedItem('customerName') as HTMLInputElement).value;
      const customerPhone = (form.elements.namedItem('customerPhone') as HTMLInputElement).value;

      if (!customerName || !customerPhone ) {
        messages.error('Please fill in all required fields');
        setIsLoading(false); // Stop loader
        return;
      }
      
      // Format items with proper structure
      const items = list.map((dish) => ({
        menuId: dish.id, // Assuming dish object has an id property
        name: dish.name,
        quantity: dish.quantity,
        price: dish.price,
        notes: dish.notes || "",
        options: dish.selectedOptions?.map(option => ({
          optionName: option.name,
          choiceName: option.selected.map(selectedItem => selectedItem.name).join(', '),
          choicePrice: option.selected.map(selectedItem => selectedItem.price).join(', '),
        })) || []
      }));
  
      // Construct the order payload
      const orderPayload = {
        orderType: orderType,
        sessionId: sessionId,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        total: total,
        tableNumber: Number(table),
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        items: items
      };
  
      console.log('Sending order to API:', orderPayload);
      
      // Send the order to the API
      const response = await Api.post('/bursopuri/order', orderPayload); // gunakan Api
  
      const responseData = response.data.data;
      console.log('Order successfully placed:', responseData);
      
      const orderId = responseData?.id   || 'defaultOrderId'; 
      const queueNumber = responseData?.queueNumber || 'defaultQueue'; 
      const totalOrder = responseData?.total || total; // Use the total from the response or fallback to the passed total
      router.push(
        `${Routes.ORDER_WAITING}?orderId=${orderId}&queue=${queueNumber}&total=${totalOrder}`
      );
    } catch (error) {
      console.error('Error confirming order:', error);
      messages.error('Failed to place the order. Please try again.');
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

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
        {contextHolder}
        {<div style={{marginBottom: 10}}>
          <components.Tag
            label='Tipe Pesanan'
            value={orderType} // Display the current order type
          />
        </div>}
        {/* PAYMENT */}
        <section
          className='container'
          style={{
            padding: 10,
            borderRadius: 10,
            marginBottom: 14,
            backgroundColor: 'var(--white-color)',
          }}
        >
          <span
            style={{
              display: 'flex',
              flex: 1,
              padding: 15,
              borderRadius: 5,
              border: `1px solid var(--main-turquoise)`,
              backgroundColor:  'transparent',
              color:  'var(--main-turquoise)',
            }}
          >
            Bayar di Kasir
          </span>
          {/* <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setPaymentMethod('cash')}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 5,
                border: `1px solid var(--main-turquoise)`,
                backgroundColor:  'transparent',
                color:  'var(--main-turquoise)',
                cursor: 'pointer',
              }}
            >
              Pay at cashier
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 5,
                border: `1px solid ${paymentMethod === 'card' ? 'var(--main-dark)' : 'var(--border-color)'}`,
                backgroundColor: paymentMethod === 'card' ? 'var(--main-dark)' : 'transparent',
                color: paymentMethod === 'card' ? 'var(--white-color)' : 'var(--main-dark)',
                cursor: 'pointer',
              }}
            >
              Pay with card
            </button>
          </div> */}
        </section>
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
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
             onClick={() => setIsOrderExpanded((prev) => !prev)}
            >
            <span
              className='t18'
              style={{color: 'var(--main-dark)', textTransform: 'capitalize', gap: 10, display: 'flex', alignItems: 'center'}}
            >
              Pesanan Saya <span style={{ fontSize: '12px' }}>{isOrderExpanded ? <UpOutlined /> : <DownOutlined />}</span>
            </span>
            </button>
            <span
              className='t18'
              style={{color: 'var(--main-dark)'}}
            >
             {formatToIDRCurrency(total)}
            </span>
          </div>
          {isOrderExpanded && (
            <ul style={{paddingTop:20, marginBottom: 20, }}>
              {list.map((dish, index) => {
                const formattedPrice = formatToIDRCurrency(Number(dish.price));
                return (
                  <li
                    key={`${dish.id}-${dish.notes ?? ''}-${index}`}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: '1px solid var(--border-color)',
                    }}
                  >
                    <div
                      style={{
                        paddingTop: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        
                      }}
                    >
                      <span className='t14' style={{ color: 'var(--secondary-text-color)', }}>{dish.name}</span>
                      <span className='t14'>
                        {dish.quantity} x {formattedPrice}
                      </span>
                    </div>
                    {dish.notes && (
                      <span
                        className='t14'
                        style={{
                          marginTop: 0,
                          fontStyle: 'italic'
                        }}
                      >
                        <FormOutlined style={{ color:'var(--secondary-text-color)' }}/> {dish.notes}
                      </span>
                    )}
                    <button
                      className='t12'
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--secondary-text-color)',
                        marginTop: 8,
                        alignSelf: 'flex-start',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                    >
                      {expandedItem === index ? (
                        <span style={{ color: 'var(--secondary-text-color)', gap: 10, display: 'flex', alignItems: 'center'}}>
                          Sembunyikan <UpOutlined />
                        </span>
                      ) : (
                        <span style={{ color: 'var(--secondary-text-color)', gap: 10, display: 'flex', alignItems: 'center'}}>
                          Lihat Detail <DownOutlined />
                        </span>
                      )}
                    </button>
                    {expandedItem === index && (
                      <div
                      style={{
                        padding: 10,
                      }}
                    >
                      {dish.selectedOptions && dish.selectedOptions.length > 0 && (
                        <ul style={{marginTop: 5, borderTop: '1px solid #E6E6E6'}}>
                          {dish.selectedOptions.map((option, idx) => (
                            <li key={idx} style={{marginTop: 10}}> 
                              <p className='t14' style={{ color: '#555'}}>
                                {option.name}
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p className='t14' style={{ color: 'var(--main-dark)', fontWeight: 500 }}>
                                  {option.selected.map((selectedItem) => selectedItem.name).join(', ')}
                                </p>
                                <p className='t14' style={{ color: '#555', marginLeft: 10 }}>
                                  {option.selected.map((selectedItem) => formatToIDRCurrency(selectedItem.price)).join(', ')}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    )}
                  </li>
                );
                
              })}
              
            </ul>
          )}
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
            width: '100%', 
          }}
          className='clickable'
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%', 
            }}
          >
            <span
              className='t14 number-of-lines-1'
              style={{
                fontWeight: 500,
                marginBottom: 2,
                color: 'var(--main-dark)',
                textTransform: 'capitalize',
              }}
            >
              Informasi Pembayaran
            </span>
            <span className='t12'>
              Data ini digunakan untuk proses pemesanan. Pastikan Anda memasukkan data yang valid.
            </span>
             <Form
              id="checkout-form"
              layout="vertical"
              style={{
                width: '100%',
                marginTop: 10,
              }}
            >
              <Form.Item name="customerName">
                <Input 
                  size="large" 
                  placeholder="Nama Lengkap" 
                />
              </Form.Item>
              
              <Form.Item name="customerPhone">
                <Input 
                  size="large" 
                  placeholder="Nomor Telepon" 
                />
              </Form.Item>
              
              <Form.Item name="tableNumber">
                <Input 
                  size="large" 
                  defaultValue={table ?? 1}
                  readOnly 
                  disabled 
                  prefix={<svg.TableSvg />}
                />
              </Form.Item>
            </Form>
          </div>
        </section>      
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='Confirm order'
          onClick={handleConfirmOrder}
          disabled={isLoading} // Disable button while loading
        />
      </section>
    );
  };

  

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
       {isLoading && (
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
      )}
    </components.Screen>
  );
};



