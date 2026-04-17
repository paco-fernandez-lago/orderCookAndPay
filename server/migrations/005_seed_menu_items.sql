TRUNCATE menu_items RESTART IDENTITY CASCADE;

INSERT INTO menu_items (name, description, price, category, available) VALUES
('Pimientos de Padrón', 'Pimientos frescos de Padrón fritos con sal grosa', 7.50, 'Tapas', TRUE),
('Empanada', 'Empanada galega do día, masa caseira', 9.00, 'Tapas', TRUE),
('Tortilla', 'Tortilla de patacas caseira, con ou sen cebola', 8.00, 'Tapas', TRUE),
('Orella', 'Orella de porco á prancha con pemento e aceite', 9.50, 'Tapas', TRUE),
('Lacón', 'Lacón galego con grelos, cachelos e pemento', 13.50, 'Tapas', TRUE),
('Pulpo á Feira', 'Polbo á feira con cachelos, aceite e pemento picante', 16.00, 'Tapas', TRUE),
('Guiso de Lentellas', 'Lentellas guisadas con chorizo e verduras da tempada', 10.00, 'Menú Fora de Carta', TRUE),
('Cocido Galego', 'Cocido tradicional galego con grelos, cachelos e carnes', 14.00, 'Menú Fora de Carta', TRUE),
('Carne o Caldeiro', 'Carne de tenreira cocida en caldo con cachelos e pemento', 13.00, 'Menú Fora de Carta', TRUE),
('Flan', 'Flan caseiro de ovo con caramelo', 4.00, 'Postres', TRUE),
('Arroz con Leite', 'Arroz con leite cremoso con canela e azucre queimado', 4.50, 'Postres', TRUE),
('Tarta da Avoa', 'Tarta de queixo caseira da avoa', 5.00, 'Postres', TRUE),
('Membrillo con Queixo', 'Membrillo artesán con queixo do país', 4.50, 'Postres', TRUE);
