-- Users table
-- CREATE TABLE IF NOT EXISTS users (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   email TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   role TEXT DEFAULT 'customer',
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -- Products table
-- CREATE TABLE IF NOT EXISTS products (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   description TEXT,
--   price NUMERIC(10,2) NOT NULL,
--   original_price NUMERIC(10,2),
--   image_url TEXT,
--   category TEXT,
--   stock INTEGER DEFAULT 100,
--   rating NUMERIC(2,1) DEFAULT 4.5,
--   reviews_count INTEGER DEFAULT 0,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 4.5;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Cart items table
-- CREATE TABLE IF NOT EXISTS cart_items (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
--   quantity INTEGER DEFAULT 1,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(user_id, product_id)
-- );
-- ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS product_id UUID;
-- ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
-- ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Wishlist table
-- CREATE TABLE IF NOT EXISTS wishlist (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(user_id, product_id)
-- );
-- ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS product_id UUID;
-- ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Orders table
-- CREATE TABLE IF NOT EXISTS orders (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES users(id) ON DELETE SET NULL,
--   total NUMERIC(10,2) NOT NULL,
--   status TEXT DEFAULT 'pending',
--   shipping_address JSONB,
--   payment_status TEXT DEFAULT 'pending',
--   payment_method TEXT,
--   tracking_number TEXT,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC(10,2);
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -- Order items table
-- CREATE TABLE IF NOT EXISTS order_items (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
--   product_id UUID REFERENCES products(id) ON DELETE SET NULL,
--   quantity INTEGER NOT NULL,
--   price NUMERIC(10,2) NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_id UUID;
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id UUID;
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER;
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
-- ALTER TABLE order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Reviews table
-- CREATE TABLE IF NOT EXISTS reviews (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
--   rating INTEGER CHECK (rating >= 1 AND rating <= 5),
--   comment TEXT,
--   is_verified BOOLEAN DEFAULT false,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(user_id, product_id)
-- );
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_id UUID;
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER;
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS comment TEXT;
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
-- ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Coupons table
-- CREATE TABLE IF NOT EXISTS coupons (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   code TEXT UNIQUE NOT NULL,
--   discount NUMERIC(5,2) NOT NULL,
--   discount_type TEXT DEFAULT 'percentage',
--   min_order NUMERIC(10,2) DEFAULT 0,
--   max_uses INTEGER,
--   uses_count INTEGER DEFAULT 0,
--   is_active BOOLEAN DEFAULT true,
--   expiry_date TIMESTAMPTZ,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS code TEXT;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount NUMERIC(5,2);
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS min_order NUMERIC(10,2) DEFAULT 0;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses INTEGER;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS uses_count INTEGER DEFAULT 0;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;
-- ALTER TABLE coupons ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Addresses table
-- CREATE TABLE IF NOT EXISTS addresses (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   label TEXT DEFAULT 'Home',
--   full_name TEXT NOT NULL,
--   phone TEXT NOT NULL,
--   address_line1 TEXT NOT NULL,
--   address_line2 TEXT,
--   city TEXT NOT NULL,
--   state TEXT NOT NULL,
--   postal_code TEXT NOT NULL,
--   is_default BOOLEAN DEFAULT false,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS user_id UUID;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS label TEXT DEFAULT 'Home';
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS full_name TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS phone TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS address_line1 TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS address_line2 TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS city TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS state TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS postal_code TEXT;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
-- ALTER TABLE addresses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- -- Insert default coupons
-- INSERT INTO coupons (code, discount, discount_type, min_order, expiry_date, is_active) 
-- VALUES 
--   ('GROSGO15', 15, 'percentage', 200, NOW() + INTERVAL '30 days', true),
--   ('SAVE8', 8, 'percentage', 100, NOW() + INTERVAL '30 days', true),
--   ('FLASH5', 5, 'percentage', 0, NOW() + INTERVAL '7 days', true),
--   ('WELCOME10', 10, 'percentage', 150, NOW() + INTERVAL '60 days', true)
-- ON CONFLICT (code) DO NOTHING;

-- -- Insert sample products
-- INSERT INTO products (name, description, price, original_price, image_url, category, rating, reviews_count) VALUES
--   ('Fresh Milk', 'Pure and fresh dairy milk, 1 liter', 58, 65, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', 'Dairy', 4.8, 245),
--   ('Fresh Tomatoes', 'Farm-fresh red tomatoes, 1 kg', 40, 50, 'https://images.unsplash.com/photo-1546470427-227c7369a9b0?w=400&h=400&fit=crop', 'Vegetables', 4.6, 189),
--   ('Red Onions', 'Premium quality onions, 1 kg', 35, 45, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop', 'Vegetables', 4.5, 156),
--   ('Tata Salt', 'Iodized table salt, 1 kg', 28, 30, 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=400&fit=crop', 'Essentials', 4.9, 523),
--   ('White Sugar', 'Premium refined sugar, 1 kg', 55, 60, 'https://images.unsplash.com/photo-1581268216259-dc5b5db4d4c6?w=400&h=400&fit=crop', 'Essentials', 4.7, 312),
--   ('Garam Masala', 'Authentic Indian spice blend, 100g', 120, 150, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop', 'Spices', 4.9, 478),
--   ('Basmati Rice', 'Long grain premium rice, 1 kg', 180, 220, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', 'Grains', 4.8, 567),
--   ('Turmeric Powder', 'Pure organic turmeric, 200g', 85, 100, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop', 'Spices', 4.7, 234)
-- ON CONFLICT DO NOTHING;
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",       
  user: "root",            
  password: "Honey@010", 
  database: "grosgo_db",   
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
