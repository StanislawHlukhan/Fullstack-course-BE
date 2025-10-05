"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookEventTable = exports.pricingPlanTable = exports.subscriptionTable = exports.archiveTable = exports.tagToPostTable = exports.tagTable = exports.profileTable = exports.commentTable = exports.postTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.postTable = (0, pg_core_1.pgTable)('posts', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    title: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    description: (0, pg_core_1.varchar)({ length: 255 }),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().$onUpdate(() => new Date()),
    createdBy: (0, pg_core_1.uuid)().references(() => exports.profileTable.id),
    deletedAt: (0, pg_core_1.timestamp)()
});
exports.commentTable = (0, pg_core_1.pgTable)('comments', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    postId: (0, pg_core_1.uuid)().references(() => exports.postTable.id, { onDelete: 'cascade' }),
    text: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().$onUpdate(() => new Date()),
    createdBy: (0, pg_core_1.uuid)().references(() => exports.profileTable.id),
    deletedAt: (0, pg_core_1.timestamp)()
});
exports.profileTable = (0, pg_core_1.pgTable)('profiles', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    subId: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    stripeCustomerId: (0, pg_core_1.varchar)({ length: 255 }),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().$onUpdate(() => new Date()),
    dickSize: (0, pg_core_1.integer)().notNull().default(1),
    systemRole: (0, pg_core_1.varchar)({ length: 255 }).default('user'),
    activatedAt: (0, pg_core_1.timestamp)(),
    deletedAt: (0, pg_core_1.timestamp)()
});
exports.tagTable = (0, pg_core_1.pgTable)('tags', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().$onUpdate(() => new Date())
});
exports.tagToPostTable = (0, pg_core_1.pgTable)('tag_to_posts', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    tagId: (0, pg_core_1.uuid)().references(() => exports.tagTable.id),
    postId: (0, pg_core_1.uuid)().references(() => exports.postTable.id),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().$onUpdate(() => new Date())
});
exports.archiveTable = (0, pg_core_1.pgTable)('archives', {
    id: (0, pg_core_1.uuid)().primaryKey().default((0, drizzle_orm_1.sql) `uuid_generate_v4()`),
    archivedUserId: (0, pg_core_1.uuid)().notNull(),
    archivedAt: (0, pg_core_1.timestamp)().defaultNow(),
    userData: (0, pg_core_1.jsonb)('user_data'),
    postsData: (0, pg_core_1.jsonb)('posts_data'),
    commentsData: (0, pg_core_1.jsonb)('comments_data'),
    tagsData: (0, pg_core_1.jsonb)('tags_data'),
    createdAt: (0, pg_core_1.timestamp)().defaultNow()
});
exports.subscriptionTable = (0, pg_core_1.pgTable)('subscriptions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.profileTable.id),
    stripeSubscriptionId: (0, pg_core_1.varchar)('stripe_subscription_id').unique(),
    stripeCustomerId: (0, pg_core_1.varchar)('stripe_customer_id'),
    stripePriceId: (0, pg_core_1.varchar)('stripe_price_id'),
    status: (0, pg_core_1.varchar)({ length: 255 }),
    name: (0, pg_core_1.varchar)({ length: 255 }),
    currentPeriodStart: (0, pg_core_1.timestamp)('current_period_start'),
    currentPeriodEnd: (0, pg_core_1.timestamp)('current_period_end'),
    cancelAtPeriodEnd: (0, pg_core_1.boolean)('cancel_at_period_end').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.pricingPlanTable = (0, pg_core_1.pgTable)('pricing_plans', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    stripePriceId: (0, pg_core_1.varchar)('stripe_price_id').unique().notNull(),
    stripeProductId: (0, pg_core_1.varchar)('stripe_product_id').notNull(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.varchar)('currency').default('usd'),
    interval: (0, pg_core_1.varchar)('interval').notNull(),
    features: (0, pg_core_1.varchar)('features').array(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.webhookEventTable = (0, pg_core_1.pgTable)('webhook_events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    eventId: (0, pg_core_1.varchar)('event_id').unique(),
    eventType: (0, pg_core_1.varchar)('event_type'),
    data: (0, pg_core_1.jsonb)('data'),
    processed: (0, pg_core_1.boolean)('processed').default(false),
    processedAt: (0, pg_core_1.timestamp)('processed_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
