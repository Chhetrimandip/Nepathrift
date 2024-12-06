import { pgTable, serial, varchar, decimal, text, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  condition: varchar('condition', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  size: varchar('size', { length: 20 }),
  brand: varchar('brand', { length: 100 }),
  imageUrl: varchar('image_url', { length: 255 }),
  sellerId: varchar('seller_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).default('available'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sellers = pgTable('sellers', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  shopName: varchar('shop_name', { length: 100 }),
  bio: text('bio'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  totalSales: serial('total_sales'),
  createdAt: timestamp('created_at').defaultNow(),
}); 