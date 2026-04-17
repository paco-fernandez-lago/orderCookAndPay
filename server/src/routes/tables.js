import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM restaurant_tables ORDER BY number');
  res.json(result.rows);
});

export default router;
