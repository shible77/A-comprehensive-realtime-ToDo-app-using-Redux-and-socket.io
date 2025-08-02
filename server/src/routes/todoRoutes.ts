import express from "express";
import { createTodos, getTodos, updateTodos, deleteTodos } from "../controllers/todoControllers"
import  verifySession  from "../middlewares/verifySession";


const todoRoutes = express.Router();

todoRoutes.post("/create", verifySession, createTodos);
todoRoutes.get("/get", verifySession, getTodos);
todoRoutes.put("/update/:id", verifySession, updateTodos);
todoRoutes.delete("/delete/:id", verifySession, deleteTodos);

export default todoRoutes;
