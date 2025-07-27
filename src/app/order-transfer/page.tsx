import type {Metadata} from 'next';

import {OrderTransfer} from './OrderTransfer';

export const metadata: Metadata = {
  title: 'Order Successful',
  description: 'Your order has been successful.',
};

export default function NewPasswordPage() {
  return <OrderTransfer />;
}
