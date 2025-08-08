"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = exports.todos = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.users = (0, mysql_core_1.mysqlTable)('users', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    username: (0, mysql_core_1.varchar)('username', { length: 255 }).notNull().unique(),
    email: (0, mysql_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)('password', { length: 255 }).notNull(),
});
exports.todos = (0, mysql_core_1.mysqlTable)('todos', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)('user_id').notNull(),
    title: (0, mysql_core_1.varchar)('title', { length: 255 }).notNull(),
    completed: (0, mysql_core_1.boolean)('completed').notNull().default(false),
});
exports.otp = (0, mysql_core_1.mysqlTable)('otp', {
    id: (0, mysql_core_1.int)('id').primaryKey().autoincrement(),
    token: (0, mysql_core_1.varchar)('token', { length: 6 }).notNull(),
    userId: (0, mysql_core_1.int)('user_id').references(() => exports.users.id).notNull(),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull()
});
