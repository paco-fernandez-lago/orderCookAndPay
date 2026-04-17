import { useState, useEffect } from 'react';
import { getPendingOrders, updateOrderStatus } from '../../api';
import { getSocket } from '../../socket';
import OrderCard from './OrderCard';
import './KitchenPage.css';

const ORDER_STATUSES = ['pending', 'in_progress', 'ready', 'delivered'];

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getPendingOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    const socket = getSocket();

    const handleOrderNew = (order) => {
      setOrders(prev => [order, ...prev]);
    };

    const handleStatusChanged = (update) => {
      setOrders(prev => {
        if (update.status === 'delivered') {
          return prev.filter(o => o.id !== update.id);
        }
        return prev.map(o =>
          o.id === update.id ? { ...o, status: update.status, updated_at: update.updated_at } : o
        );
      });
    };

    socket.on('order:new', handleOrderNew);
    socket.on('order:status_changed', handleStatusChanged);

    return () => {
      socket.off('order:new', handleOrderNew);
      socket.off('order:status_changed', handleStatusChanged);
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return <div className="kitchen-page"><p>Loading orders...</p></div>;
  }

  return (
    <div className="kitchen-page">
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders">No pending orders</div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              nextStatuses={ORDER_STATUSES.slice(ORDER_STATUSES.indexOf(order.status) + 1)}
            />
          ))
        )}
      </div>
    </div>
  );
}
