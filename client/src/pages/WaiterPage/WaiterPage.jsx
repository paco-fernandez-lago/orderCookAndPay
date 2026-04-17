import { useState, useEffect } from 'react';
import { getTables, getMenuItems, createOrder } from '../../api';
import TableSelector from './TableSelector';
import MenuGrid from './MenuGrid';
import OrderSummary from './OrderSummary';
import './WaiterPage.css';

export default function WaiterPage() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getTables(), getMenuItems()]).then(([t, m]) => {
      setTables(t);
      setMenuItems(m);
    });
  }, []);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menu_item_id === item.id);
      if (existing) {
        return prev.map(i =>
          i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: parseFloat(item.price), quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.menu_item_id !== itemId));
    } else {
      setCart(prev =>
        prev.map(i =>
          i.menu_item_id === itemId ? { ...i, quantity } : i
        )
      );
    }
  };

  const handleRemove = (itemId) => {
    setCart(prev => prev.filter(i => i.menu_item_id !== itemId));
  };

  const handleSubmit = async () => {
    if (!selectedTable || cart.length === 0) return;

    setLoading(true);
    try {
      await createOrder(selectedTable.id, cart.map(({ menu_item_id, quantity }) => ({ menu_item_id, quantity })), notes);
      setCart([]);
      setNotes('');
      alert('Order submitted!');
    } catch (err) {
      alert('Error submitting order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waiter-page">
      <div className="waiter-container">
        <div className="left-panel">
          <h2>Select Table</h2>
          <TableSelector tables={tables} selected={selectedTable} onSelect={setSelectedTable} />

          <div className="notes-section">
            <label>Special Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No onions, allergies..."
            />
          </div>
        </div>

        <div className="middle-panel">
          <h2>Menu</h2>
          <MenuGrid items={menuItems} onAdd={handleAddToCart} />
        </div>

        <div className="right-panel">
          <h2>Order Summary</h2>
          <OrderSummary
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onSubmit={handleSubmit}
            loading={loading}
            disabled={!selectedTable || cart.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
