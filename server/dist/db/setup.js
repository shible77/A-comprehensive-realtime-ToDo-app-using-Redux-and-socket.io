"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = require("drizzle-orm/mysql2");
const mysql2_2 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
if (!process.env.DB_URL) {
    throw new Error("DB credentials error");
}
const connection = mysql2_2.default.createConnection({
    uri: process.env.DB_URL,
    ssl: {
        ca: fs_1.default.readFileSync(path_1.default.resolve(__dirname, './ca.pem')),
    },
});
exports.db = (0, mysql2_1.drizzle)(connection);
