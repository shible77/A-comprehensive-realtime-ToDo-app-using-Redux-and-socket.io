import { mysqlTable, int, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
});

export const todos = mysqlTable('todos', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    completed: boolean('completed').notNull().default(false),
});

export const otp = mysqlTable('otp', {
    id: int('id').primaryKey().autoincrement(),
    token : varchar('token', {length: 6}).notNull(),
    userId: int('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})