// src/server/index.ts
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// THE GUARDIAN & THE CTO: Observability and Structured Logging
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'omni-core-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
          return `[${timestamp}] ${level}: ${message} ${stack || ''}`;
        })
      )
    })
  ]
});

// Resiliency: Catch unhandled promises and exceptions
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception', err);
});
process.on('unhandledRejection', (reason) => {
  logger.error('CRITICAL: Unhandled Rejection', reason);
});

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // THE CONFIGURATOR: Extreme Optimization
  app.use(compression({ level: 6, threshold: 100 * 1024 }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    message: { error: 'Rate limit exceeded' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', apiLimiter);

  // THE ARCHITECT: Health Check Endpoint for Load Balancers
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'OPERATIONAL',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Provide a default setup for vite serving if in dev, or static files if prod
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const distPath = path.join(process.cwd(), "dist/client");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  } else {
    // Use Vite middleware in development
    try {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      logger.error("Failed to initialize Vite", err);
    }
  }

  const server = app.listen(port, () => {
    logger.info(`[SYSTEM] CORE ENGINE ONLINE - PORT: ${port}`);
  });

  // THE GUARDIAN: Graceful Shutdown
  const gracefulShutdown = () => {
    logger.info('[SYSTEM] Initiating Graceful Shutdown sequence...');
    server.close(() => {
      logger.info('[SYSTEM] Connections closed cleanly. Terminating process.');
      process.exit(0);
    });
    
    setTimeout(() => {
      logger.error('[SYSTEM] Clean shutdown timeout. Forcing termination.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer();
