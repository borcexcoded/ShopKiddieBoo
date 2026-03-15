-- Allow authenticated users to insert/update/delete products (admin only enforced at middleware level)
CREATE POLICY "products_insert_auth" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update_auth" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "products_delete_auth" ON products FOR DELETE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to update orders
CREATE POLICY "orders_update_auth" ON orders FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "orders_insert_auth" ON orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to select/update/delete contact messages  
CREATE POLICY "messages_select_auth" ON contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "messages_update_auth" ON contact_messages FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "messages_delete_auth" ON contact_messages FOR DELETE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert testimonials
CREATE POLICY "testimonials_insert_auth" ON testimonials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "testimonials_update_auth" ON testimonials FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "testimonials_delete_auth" ON testimonials FOR DELETE USING (auth.uid() IS NOT NULL);
