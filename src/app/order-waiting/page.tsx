import type {Metadata} from 'next';

import {OrderWaiting} from './OrderWaiting';

export const metadata: Metadata = {
  title: 'Order Successful',
  description: 'Your order has been successful.',
};

export default function NewPasswordPage() {
  return <OrderWaiting />;
}
