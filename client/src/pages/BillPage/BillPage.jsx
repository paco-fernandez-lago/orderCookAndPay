import { useState, useEffect } from 'react';
import { getTables, getBill } from '../../api';
import './BillPage.css';

export default function BillPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTables().then(setTables);
  }, []);

  const handleViewBill = async () => {
    if (!selectedTable) return;

    setLoading(true);
    try {
      const data = await getBill(selectedTable.id);
      setBill(data);
    } catch (err) {
      alert('Error loading bill');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bill-page">
      <div className="bill-container">
        <div className="bill-selector">
          <h2>Select Table for Bill</h2>
          <select
            value={selectedTable?.id || ''}
            onChange={(e) => {
              const table = tables.find(t => t.id === parseInt(e.target.value));
              setSelectedTable(table);
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

          <button
            className="view-btn"
            onClick={handleViewBill}
            disabled={!selectedTable || loading}
          >
            {loading ? 'Loading...' : 'View Bill'}
          </button>
        </div>

        {bill && (
          <div className="bill-section">
            <div className="bill-display">
              <h2>Bill - Table {bill.table_id}</h2>

              <table className="bill-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td className="qty">{item.quantity}</td>
                      <td className="price">${item.unit_price.toFixed(2)}</td>
                      <td className="price">${item.line_total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bill-total">
                <strong>Total: ${bill.total}</strong>
              </div>

              <button className="print-btn" onClick={handlePrint}>
                Print Bill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
