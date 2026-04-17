export default function OrderCard({ order, onStatusChange, nextStatuses }) {
  const createdAt = new Date(order.created_at);
  const elapsedTime = Math.floor((Date.now() - createdAt) / 60000);

  const items = order.items && order.items.filter(i => i.menu_item_id);

  return (
    <div className={`order-card status-${order.status}`}>
      <div className="card-header">
        <h3>Table {order.table_id}</h3>
        <span className="status-badge">{order.status}</span>
      </div>

      <div className="card-time">
        {elapsedTime > 0 ? `${elapsedTime}m ago` : 'Just now'}
      </div>

      <div className="card-items">
        {items && items.map((item, idx) => (
          <div key={idx} className="item">
            <span className="qty">{item.quantity}×</span>
            <span className="name">{item.name}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="card-notes">
          <strong>Notes:</strong> {order.notes}
        </div>
      )}

      <div className="card-actions">
        {nextStatuses.map(status => (
          <button
            key={status}
            className={`status-btn status-${status}`}
            onClick={() => onStatusChange(order.id, status)}
          >
            → {status}
          </button>
        ))}
      </div>
    </div>
  );
}
