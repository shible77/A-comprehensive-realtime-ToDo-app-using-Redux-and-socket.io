import { mysqlTable, int, varchar, boolean, timestamp, index } from 'drizzle-orm/mysql-core';
import { email } from 'zod';

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
}, (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
}));

export const todos = mysqlTable('todos', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    completed: boolean('completed').notNull().default(false),
}, (table) => ({
    userIdIdx: index('todos_user_id_idx').on(table.userId),
}));

export const otp = mysqlTable('otp', {
    id: int('id').primaryKey().autoincrement(),
    token : varchar('token', {length: 6}).notNull(),
    userId: int('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})
