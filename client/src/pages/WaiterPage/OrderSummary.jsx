export default function OrderSummary({ items, onUpdateQuantity, onRemove, onSubmit, loading, disabled }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="order-summary">
      {items.length === 0 ? (
        <p className="empty">No items in cart</p>
      ) : (
        <>
          <div className="items-list">
            {items.map(item => (
              <div key={item.menu_item_id} className="cart-item">
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity - 1)}>−</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.menu_item_id, parseInt(e.target.value) || 0)}
                    min="1"
                  />
                  <button onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove" onClick={() => onRemove(item.menu_item_id)}>×</button>
              </div>
            ))}
          </div>

          <div className="total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>

          <button
            className="submit-btn"
            onClick={onSubmit}
            disabled={disabled || loading}
          >
            {loading ? 'Submitting...' : 'Submit Order'}
          </button>
        </>
      )}
    </div>
  );
}
