import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM menu_items WHERE available = TRUE ORDER BY category, name');
  res.json(result.rows);
});

export default router;
