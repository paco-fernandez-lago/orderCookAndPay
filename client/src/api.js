const API_BASE = '/api';

export const getTables = async () => {
  const res = await fetch(`${API_BASE}/tables`);
  return res.json();
};

export const getMenuItems = async () => {
  const res = await fetch(`${API_BASE}/menu-items`);
  return res.json();
};

export const createOrder = async (table_id, items, notes) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table_id, items, notes }),
  });
  return res.json();
};

export const getPendingOrders = async () => {
  const res = await fetch(`${API_BASE}/orders/pending`);
  return res.json();
};

export const getTableOrders = async (tableId) => {
  const res = await fetch(`${API_BASE}/orders/table/${tableId}`);
  return res.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const getBill = async (tableId) => {
  const res = await fetch(`${API_BASE}/bills/table/${tableId}`);
  return res.json();
};
