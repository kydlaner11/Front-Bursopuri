type ProductType = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type OrderStatus = 'in_progress' | 'done' | 'cancelled';

export type OrderType = {
  id: number;
  date: string;
  time: string;
  queueNumber: number;
  status: OrderStatus;
  total: number;
  discount: number;
  delivery: number;
  products: ProductType[];
};
