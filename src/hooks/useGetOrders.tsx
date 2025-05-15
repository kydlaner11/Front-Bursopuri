import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '../config';
import {OrderType} from '../types';
import {stores} from '../stores';

export const useGetOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const {sessionId} = stores.useTableStore();

  const getOrders = async () => {
    setOrdersLoading(true);

    try {
      const url = `${URLS.GET_ORDERS}/${sessionId}`;
      const response = await axios.get(url);
      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return {orders, ordersLoading};
};
