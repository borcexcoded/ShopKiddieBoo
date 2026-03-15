-- Seed products
INSERT INTO products (name, description, price, sale_price, category, image_url, sizes, colors, in_stock, featured) VALUES
('Rainbow Stripe Dress', 'Adorable cotton dress with playful rainbow stripes. Perfect for sunny days and special occasions.', 34.99, NULL, 'Dresses', '/images/products/dress-1.jpg', ARRAY['2T','3T','4T','5','6'], ARRAY['Rainbow','Pink','Blue'], true, true),
('Denim Overalls Set', 'Classic denim overalls with a soft cotton tee. Durable and stylish for everyday adventures.', 42.99, 35.99, 'Sets', '/images/products/overalls-1.jpg', ARRAY['2T','3T','4T','5','6'], ARRAY['Blue','Light Wash'], true, true),
('Cozy Bear Hoodie', 'Ultra-soft fleece hoodie with adorable bear ears. Keeps little ones warm and cuddly.', 28.99, NULL, 'Tops', '/images/products/hoodie-1.jpg', ARRAY['2T','3T','4T','5','6','7'], ARRAY['Brown','Grey','Cream'], true, true),
('Floral Summer Top', 'Light and breezy floral top perfect for warm weather. Made with breathable organic cotton.', 22.99, 18.99, 'Tops', '/images/products/top-1.jpg', ARRAY['3T','4T','5','6'], ARRAY['Floral Pink','Floral Blue'], true, true),
('Dinosaur Print Joggers', 'Fun dinosaur print joggers with elastic waist. Comfortable for play and easy to pull on.', 24.99, NULL, 'Bottoms', '/images/products/joggers-1.jpg', ARRAY['2T','3T','4T','5','6','7'], ARRAY['Green','Navy','Grey'], true, true),
('Sparkle Tutu Skirt', 'Magical sparkle tutu skirt with satin waistband. Every little princess needs one!', 26.99, NULL, 'Bottoms', '/images/products/tutu-1.jpg', ARRAY['2T','3T','4T','5','6'], ARRAY['Pink','Purple','Gold'], true, true),
('Safari Adventure Set', 'Complete safari-themed outfit with shorts, tee, and hat. Ready for wild adventures!', 48.99, 39.99, 'Sets', '/images/products/safari-1.jpg', ARRAY['3T','4T','5','6'], ARRAY['Khaki','Olive'], true, true),
('Starry Night Pajamas', 'Cozy pajama set with glow-in-the-dark stars. Sweet dreams guaranteed!', 32.99, NULL, 'Sleepwear', '/images/products/pjs-1.jpg', ARRAY['2T','3T','4T','5','6','7'], ARRAY['Navy','Dark Blue'], true, false),
('Butterfly Wings Cardigan', 'Delicate knit cardigan with butterfly applique details. Perfect layering piece.', 36.99, 29.99, 'Tops', '/images/products/cardigan-1.jpg', ARRAY['3T','4T','5','6'], ARRAY['Lavender','White','Pink'], true, false),
('Athletic Shorts Pack', 'Set of 3 comfortable athletic shorts in fun colors. Great for active kids.', 38.99, NULL, 'Bottoms', '/images/products/shorts-1.jpg', ARRAY['3T','4T','5','6','7','8'], ARRAY['Multi-color'], true, false),
('Polka Dot Rain Coat', 'Water-resistant rain coat with cheerful polka dots. Keeps kids dry and happy!', 44.99, NULL, 'Outerwear', '/images/products/raincoat-1.jpg', ARRAY['2T','3T','4T','5','6'], ARRAY['Yellow','Red','Blue'], true, true),
('Organic Cotton Onesie', 'Super soft organic cotton onesie for babies. Gentle on sensitive skin.', 19.99, 15.99, 'Baby', '/images/products/onesie-1.jpg', ARRAY['0-3M','3-6M','6-9M','9-12M'], ARRAY['White','Mint','Peach'], true, true);

-- Seed testimonials
INSERT INTO testimonials (name, image_url, rating, review, product_name) VALUES
('Sarah M.', '/images/testimonials/t1.jpg', 5, 'Absolutely love the quality! My daughter wears the rainbow dress everywhere. The colors stay vibrant even after many washes.', 'Rainbow Stripe Dress'),
('Jessica L.', '/images/testimonials/t2.jpg', 5, 'The denim overalls are so cute and durable. My son plays rough and they still look great. Will definitely order more!', 'Denim Overalls Set'),
('Amanda K.', '/images/testimonials/t3.jpg', 5, 'Best kids clothing store ever! The bear hoodie is the softest thing. My toddler refuses to take it off.', 'Cozy Bear Hoodie'),
('Rachel T.', '/images/testimonials/t4.jpg', 4, 'Great selection and fast shipping. The floral top is beautiful and the fabric is so breathable for summer.', 'Floral Summer Top'),
('Michelle D.', '/images/testimonials/t5.jpg', 5, 'The safari set was a huge hit at my sons birthday party. Everyone wanted to know where I got it!', 'Safari Adventure Set'),
('Lauren B.', '/images/testimonials/t6.jpg', 5, 'My daughter is obsessed with the sparkle tutu. She wears it every day and twirls around the house. So magical!', 'Sparkle Tutu Skirt');

-- Seed sample orders for tracking demo
INSERT INTO orders (order_number, customer_email, customer_name, status, items, total, shipping_address, tracking_number) VALUES
('KB-2024-001', 'demo@kiddieboo.com', 'Demo Customer', 'shipped', '[{"name": "Rainbow Stripe Dress", "size": "4T", "qty": 1, "price": 34.99}, {"name": "Cozy Bear Hoodie", "size": "4T", "qty": 1, "price": 28.99}]', 63.98, '{"street": "123 Main St", "city": "Lagos", "state": "Lagos", "zip": "100001"}', 'TRK-KB-123456'),
('KB-2024-002', 'demo@kiddieboo.com', 'Demo Customer', 'processing', '[{"name": "Denim Overalls Set", "size": "3T", "qty": 1, "price": 35.99}]', 35.99, '{"street": "456 Oak Ave", "city": "Abuja", "state": "FCT", "zip": "900001"}', NULL);
