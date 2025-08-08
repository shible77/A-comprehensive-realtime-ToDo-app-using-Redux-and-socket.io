"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoControllers_1 = require("../controllers/todoControllers");
const verifySession_1 = __importDefault(require("../middlewares/verifySession"));
const todoRoutes = express_1.default.Router();
todoRoutes.post("/create", verifySession_1.default, todoControllers_1.createTodos);
todoRoutes.get("/get", verifySession_1.default, todoControllers_1.getTodos);
todoRoutes.put("/update/:id", verifySession_1.default, todoControllers_1.updateTodos);
todoRoutes.delete("/delete/:id", verifySession_1.default, todoControllers_1.deleteTodos);
exports.default = todoRoutes;
