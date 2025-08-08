"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodos = exports.updateTodos = exports.getTodos = exports.createTodos = void 0;
const setup_1 = require("../db/setup");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = __importDefault(require("zod"));
const createTodosBody = zod_1.default.object({
    title: zod_1.default.string(),
});
const createTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { title } = createTodosBody.parse(req.body);
        const [userTodos] = yield setup_1.db.insert(schema_1.todos).values({
            userId: userId,
            title: title,
        }).$returningId();
        const fullTodo = Object.assign(Object.assign({}, userTodos), { userId: userId, title: title, completed: false }); // Ensure userId is included in the response
        req.io.emit("todo:created", fullTodo); // Emit the new todo to all connected clients
        return res.status(201).json({ status: "success", message: "Todo created successfully", todoId: userTodos.id });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createTodos = createTodos;
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const userTodos = yield setup_1.db.select().from(schema_1.todos).where((0, drizzle_orm_1.eq)(schema_1.todos.userId, userId));
        if (userTodos.length === 0) {
            return res.status(200).json({ status: "failed", message: "No todos found for this user" });
        }
        return res.status(200).json({ status: "success", todos: userTodos });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTodos = getTodos;
const updateTodosBody = zod_1.default.object({
    title: zod_1.default.string().optional(),
    completed: zod_1.default.boolean().optional(),
});
const updateTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const todoId = zod_1.default.coerce.number().parse(req.params.id);
        const { title, completed } = updateTodosBody.parse(req.body);
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (completed !== undefined)
            updateData.completed = completed;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ status: "failed", message: "No valid fields to update" });
        }
        const updateTodos = yield setup_1.db.update(schema_1.todos).set(updateData).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.todos.id, todoId), (0, drizzle_orm_1.eq)(schema_1.todos.userId, userId)));
        if (updateTodos[0].affectedRows === 0) {
            return res.status(404).json({ status: "failed", message: "Todo not found or you do not have permission to update it" });
        }
        const updatedTodo = yield setup_1.db.select().from(schema_1.todos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.todos.id, todoId), (0, drizzle_orm_1.eq)(schema_1.todos.userId, userId))).then(rows => rows[0]);
        req.io.emit("todo:updated", updatedTodo); // Emit the updated todo to all connected clients
        return res.status(200).json({ status: "success", message: "Todo updated successfully" });
    }
    catch (e) {
        if (e instanceof zod_1.default.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(e.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateTodos = updateTodos;
const deleteTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const todoId = zod_1.default.coerce.number().parse(req.params.id);
        const [deleted] = yield setup_1.db.select().from(schema_1.todos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.todos.id, todoId), (0, drizzle_orm_1.eq)(schema_1.todos.userId, userId)));
        const deletedTodos = yield setup_1.db.delete(schema_1.todos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.todos.id, todoId), (0, drizzle_orm_1.eq)(schema_1.todos.userId, userId)));
        if (deletedTodos[0].affectedRows === 0) {
            return res.status(404).json({ status: "failed", message: "Todo not found or you do not have permission to delete it" });
        }
        req.io.emit("todo:deleted", deleted);
        return res.status(200).json({ status: "success", message: "Todo deleted successfully" });
    }
    catch (e) {
        if (e instanceof zod_1.default.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(e.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteTodos = deleteTodos;
