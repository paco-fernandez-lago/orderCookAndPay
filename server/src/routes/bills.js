import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/table/:tableId', async (req, res) => {
  const { tableId } = req.params;

  const result = await query(
    `SELECT
      o.id as order_id,
      o.created_at,
      oi.menu_item_id,
      m.name,
      oi.quantity,
      oi.unit_price,
      (oi.quantity * oi.unit_price) as line_total
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
    WHERE o.table_id = $1 AND o.status != 'delivered'
    ORDER BY o.created_at, oi.id`,
    [tableId]
  );

  const items = result.rows.filter(row => row.menu_item_id !== null);
  const total = items.reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0);

  res.json({
    table_id: parseInt(tableId),
    items,
    total: total.toFixed(2),
  });
});

export default router;
