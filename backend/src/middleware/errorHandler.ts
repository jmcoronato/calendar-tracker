import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    // Log completo solo en desarrollo, en producción log básico sin stack trace
    if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    } else {
        // En producción, log mínimo sin información sensible
        console.error('Error occurred:', {
            message: err.message || 'Unknown error',
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }

    if (res.headersSent) return;

    // En desarrollo, proporcionar más detalles del error
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
            stack: err.stack
        });
    } else {
        // En producción, respuesta genérica sin filtrar información
        res.status(500).json({ error: "Internal Server Error" });
    }
}


