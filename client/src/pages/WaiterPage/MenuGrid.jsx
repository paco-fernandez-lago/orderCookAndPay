export default function MenuGrid({ items, onAdd }) {
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="menu-grid">
      {categories.map(category => (
        <div key={category} className="category">
          <h3>{category}</h3>
          <div className="items">
            {items.filter(i => i.category === category).map(item => (
              <button
                key={item.id}
                className="menu-item"
                onClick={() => onAdd(item)}
              >
                <div className="name">{item.name}</div>
                <div className="price">${item.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
