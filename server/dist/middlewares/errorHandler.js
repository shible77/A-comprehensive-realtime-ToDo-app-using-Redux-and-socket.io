"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    if (err.message === "VALIDATION_ERROR") {
        return res.status(400).json({
            status: false,
            message: "Invalid request data",
            errors: err.issues,
        });
    }
    if (err.message === "UNAUTHORIZED") {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }
    if (err.message === "Invalid or expired token") {
        return res.status(401).json({ status: false, message: "Invalid or expired token" });
    }
    // Will implement more specific error handling later
    if (err.message === "Internal server error") {
        return res.status(500).json({ status: false, message: err.message });
    }
    return res.status(500).json({ status: false, message: "Internal server error" });
}
