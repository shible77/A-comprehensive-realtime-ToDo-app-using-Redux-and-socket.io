import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core';

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