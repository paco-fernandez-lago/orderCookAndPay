import express from 'express';
import { query, getClient } from '../db.js';
import { getIO } from '../socket.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { table_id, items, notes } = req.body;
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (table_id, status, notes) VALUES ($1, $2, $3) RETURNING *',
      [table_id, 'pending', notes || null]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      const menuItemResult = await client.query(
        'SELECT price FROM menu_items WHERE id = $1',
        [item.menu_item_id]
      );
      const unit_price = menuItemResult.rows[0].price;

      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [order.id, item.menu_item_id, item.quantity, unit_price]
      );
    }

    await client.query('COMMIT');

    const fullOrder = await query(
      `SELECT o.*, json_agg(json_build_object('menu_item_id', oi.menu_item_id, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'name', m.name))
       AS items FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN menu_items m ON oi.menu_item_id = m.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [order.id]
    );

    const io = getIO();
    io.emit('order:new', fullOrder.rows[0]);

    res.status(201).json(fullOrder.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

router.get('/pending', async (req, res) => {
  const result = await query(
    `SELECT o.*, json_agg(json_build_object('menu_item_id', oi.menu_item_id, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'name', m.name))
     AS items FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN menu_items m ON oi.menu_item_id = m.id
     WHERE o.status IN ('pending', 'in_progress')
     GROUP BY o.id
     ORDER BY o.created_at`
  );
  res.json(result.rows);
});

router.get('/table/:tableId', async (req, res) => {
  const { tableId } = req.params;
  const result = await query(
    `SELECT o.*, json_agg(json_build_object('menu_item_id', oi.menu_item_id, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'name', m.name))
     AS items FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN menu_items m ON oi.menu_item_id = m.id
     WHERE o.table_id = $1 AND o.status != 'delivered'
     GROUP BY o.id
     ORDER BY o.created_at`,
    [tableId]
  );
  res.json(result.rows);
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updatedOrder = result.rows[0];
  const io = getIO();
  io.emit('order:status_changed', {
    id: updatedOrder.id,
    status: updatedOrder.status,
    updated_at: updatedOrder.updated_at,
    table_id: updatedOrder.table_id,
  });

  res.json(updatedOrder);
});

export default router;
