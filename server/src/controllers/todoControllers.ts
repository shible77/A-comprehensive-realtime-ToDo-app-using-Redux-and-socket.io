import { Response } from "express";
import { db } from "../db/setup";
import { todos } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { SessionRequest } from "../middlewares/verifySession";
import z from "zod";
import { id } from "zod/v4/locales/index.cjs";

const createTodosBody = z.object({
    title: z.string(),
})
export const createTodos = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { title } = createTodosBody.parse(req.body);
        const [userTodos] = await db.insert(todos).values({
            userId: userId!,
            title: title,
        }).$returningId();
        const fullTodo = {...userTodos, userId: userId!, title : title, completed : false }; // Ensure userId is included in the response
        req.io.emit("todo:created", fullTodo); // Emit the new todo to all connected clients
        return res.status(201).json({status:"success", message: "Todo created successfully", todoId: userTodos.id });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTodos = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.userId;
        const userTodos = await db.select().from(todos).where(eq(todos.userId, userId!));
        if (userTodos.length === 0) {
            return res.status(200).json({ status: "failed", message: "No todos found for this user" });
        }
        return res.status(200).json({ status: "success", todos: userTodos });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

const updateTodosBody = z.object({
    title: z.string().optional(),
    completed: z.boolean().optional(),
})
export const updateTodos = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.userId;
        const todoId = z.coerce.number().parse(req.params.id);
        const { title, completed } = updateTodosBody.parse(req.body);
        const updateData: Partial<typeof todos.$inferInsert> = {};
        if (title !== undefined) updateData.title = title;
        if (completed !== undefined) updateData.completed = completed;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({status:"failed", message: "No valid fields to update" });
        }
        const updateTodos =await db.update(todos).set(updateData).where(and(eq(todos.id, todoId), eq(todos.userId, userId!)));
        if (updateTodos[0].affectedRows === 0) {
            return res.status(404).json({status:"failed", message: "Todo not found or you do not have permission to update it" });
        }
        const updatedTodo = await db.select().from(todos).where(and(eq(todos.id, todoId), eq(todos.userId, userId!))).then(rows => rows[0]);
        req.io.emit("todo:updated", updatedTodo); // Emit the updated todo to all connected clients
        return res.status(200).json({status:"success", message: "Todo updated successfully" });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(e.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTodos = async (req: SessionRequest, res: Response) => {
    try{
        const userId = req.userId;
        const todoId = z.coerce.number().parse(req.params.id);
        const [deleted] = await db.select().from(todos).where(and(eq(todos.id, todoId), eq(todos.userId, userId!)));
        const deletedTodos = await db.delete(todos).where(and(eq(todos.id, todoId), eq(todos.userId, userId!)));
        if (deletedTodos[0].affectedRows === 0) {
            return res.status(404).json({status:"failed", message: "Todo not found or you do not have permission to delete it" });
        }
        req.io.emit("todo:deleted", deleted);
        return res.status(200).json({status:"success", message: "Todo deleted successfully" });
    }catch ( e ){
        if (e instanceof z.ZodError) {
            return res.status(400).json({ name: "Invalid data type", error: JSON.parse(e.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
