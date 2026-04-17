export default function TableSelector({ tables, selected, onSelect }) {
  return (
    <select
      value={selected?.id || ''}
      onChange={(e) => {
        const table = tables.find(t => t.id === parseInt(e.target.value));
        onSelect(table);
      }}
      className="table-selector"
    >
      <option value="">-- Select a table --</option>
      {tables.map(t => (
        <option key={t.id} value={t.id}>
          Table {t.number}
        </option>
      ))}
    </select>
  );
}
