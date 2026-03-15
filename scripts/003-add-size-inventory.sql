-- Add size_inventory column to products table for tracking quantity per size
-- Format: {"S": 10, "M": 5, "L": 3}

ALTER TABLE products ADD COLUMN IF NOT EXISTS size_inventory jsonb DEFAULT '{}';

-- Update existing products to have default inventory for their sizes
UPDATE products 
SET size_inventory = (
  SELECT jsonb_object_agg(size, 10)
  FROM unnest(sizes) AS size
)
WHERE sizes IS NOT NULL AND array_length(sizes, 1) > 0;

-- Create a function to reduce inventory after purchase
CREATE OR REPLACE FUNCTION reduce_product_inventory(
  p_product_id uuid,
  p_size text,
  p_quantity integer
) RETURNS boolean AS $$
DECLARE
  current_stock integer;
BEGIN
  -- Get current stock for the size
  SELECT (size_inventory->>p_size)::integer INTO current_stock
  FROM products WHERE id = p_product_id;
  
  -- If no stock info or insufficient stock, return false
  IF current_stock IS NULL OR current_stock < p_quantity THEN
    RETURN false;
  END IF;
  
  -- Reduce inventory
  UPDATE products 
  SET size_inventory = jsonb_set(
    COALESCE(size_inventory, '{}'),
    ARRAY[p_size],
    to_jsonb(current_stock - p_quantity)
  )
  WHERE id = p_product_id;
  
  -- Remove size from sizes array if stock is 0
  IF current_stock - p_quantity <= 0 THEN
    UPDATE products
    SET sizes = array_remove(sizes, p_size)
    WHERE id = p_product_id;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
