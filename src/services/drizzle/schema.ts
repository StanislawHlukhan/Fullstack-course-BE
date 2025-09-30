import { uuid, pgTable, varchar, timestamp, integer, jsonb, boolean, text, decimal } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const postTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid().references(() => profileTable.id),
  deletedAt: timestamp()
});

export const commentTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  postId: uuid().references(() => postTable.id, { onDelete: 'cascade' }),
  text: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid().references(() => profileTable.id),
  deletedAt: timestamp()
});

export const profileTable = pgTable('profiles', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  subId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  stripeCustomerId: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  dickSize: integer().notNull().default(1),
  systemRole: varchar({ length: 255 }).default('user'),
  activatedAt: timestamp(),
  deletedAt: timestamp()
});

export const tagTable = pgTable('tags', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

export const tagToPostTable = pgTable('tag_to_posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  tagId: uuid().references(() => tagTable.id),
  postId: uuid().references(() => postTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

export const archiveTable = pgTable('archives', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  archivedUserId: uuid().notNull(),
  archivedAt: timestamp().defaultNow(),
  userData: jsonb('user_data'),
  postsData: jsonb('posts_data'),
  commentsData: jsonb('comments_data'),
  tagsData: jsonb('tags_data'),
  createdAt: timestamp().defaultNow()
});

export const subscriptionTable = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profileTable.id),
  stripeSubscriptionId: varchar('stripe_subscription_id').unique(),
  stripeCustomerId: varchar('stripe_customer_id'),
  stripePriceId: varchar('stripe_price_id'),
  status: varchar({ length: 255 }),
  name: varchar({ length: 255 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const pricingPlanTable = pgTable('pricing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripePriceId: varchar('stripe_price_id').unique().notNull(),
  stripeProductId: varchar('stripe_product_id').notNull(),
  name: varchar('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency').default('usd'),
  interval: varchar('interval').notNull(),
  features: varchar('features').array(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const webhookEventTable = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: varchar('event_id').unique(),
  eventType: varchar('event_type'),
  data: jsonb('data'),
  processed: boolean('processed').default(false),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow()
});
