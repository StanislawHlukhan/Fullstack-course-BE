import { uuid, pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const postTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid().references(() => profileTable.id)
});

export const commentTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  postId: uuid().references(() => postTable.id, { onDelete: 'cascade' }),
  text: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid().references(() => profileTable.id)
});

export const profileTable = pgTable('profiles', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  subId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  dickSize: integer().notNull().default(1),
  systemRole: varchar({ length: 255 }).default('user'),
  activatedAt: timestamp()
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
