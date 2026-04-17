INSERT INTO menu_items (name, description, price, category, available) VALUES
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.99, 'Salads', TRUE),
('Grilled Salmon', 'Atlantic salmon with lemon butter sauce', 18.99, 'Main Courses', TRUE),
('Spaghetti Carbonara', 'Classic Italian pasta with bacon and cream', 14.99, 'Pasta', TRUE),
('Margherita Pizza', 'Fresh mozzarella, basil, and tomato', 12.99, 'Pizza', TRUE),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 6.99, 'Desserts', TRUE),
('Iced Tea', 'Freshly brewed iced tea', 2.99, 'Beverages', TRUE),
('Hamburger', 'Grass-fed beef patty with lettuce and tomato', 11.99, 'Main Courses', TRUE),
('Tiramisu', 'Traditional Italian dessert with mascarpone', 5.99, 'Desserts', TRUE)
ON CONFLICT DO NOTHING;
