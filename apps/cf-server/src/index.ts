import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { requestId } from "hono/request-id";

interface CloudflareBindings {
  ENVIRONMENT?: string;
  API_VERSION?: string;
  API_BASE_URL?: string;
  LOG_LEVEL?: string;
  ENABLE_DETAILED_LOGGING?: string;
  ENABLE_PERFORMANCE_MONITORING?: string;
  // Add other environment variables as needed
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  requestId: string;
}

const app = new Hono<{ Bindings: CloudflareBindings }>();
const startTime = Date.now();

// Essential security headers only (production optimized)
app.use('*', secureHeaders({
  crossOriginResourcePolicy: 'cross-origin',
  referrerPolicy: 'no-referrer',
  strictTransportSecurity: 'max-age=31536000',
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
}));

// Request ID for tracking
app.use('*', requestId());

// CORS with optimized config
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://zero-day-web.ghost-server.workers.dev"
    ];
    return !origin || allowedOrigins.includes(origin) ? (origin || "*") : "";
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH','PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400, // 24 hours
  credentials: true
}));

// Conditional logging (dev only)
app.use('*', async (c, next) => {
  const isDev = c.env?.ENVIRONMENT === 'development';
  const enableLogging = c.env?.ENABLE_DETAILED_LOGGING === 'true';
  
  if (isDev && enableLogging) {
    const requestId = c.get('requestId');
    const start = Date.now();
    
    console.log(`[${new Date().toISOString()}] [${requestId}] --> ${c.req.method} ${c.req.url}`);
    
    await next();
    
    const duration = Date.now() - start;
    const status = c.res.status;
    const emoji = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';
    
    console.log(`[${new Date().toISOString()}] [${requestId}] <-- ${emoji} ${status} ${duration}ms`);
  } else {
    await next();
  }
});

// Lightweight error handler
app.onError((err, c) => {
  const requestId = c.get('requestId');
  const timestamp = new Date().toISOString();
  
  // Log errors in production for monitoring
  console.error(`[${timestamp}] [${requestId}] ERROR: ${err.message}`);
  
  return c.json({
    error: 'Internal Server Error',
    requestId,
    timestamp
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    requestId: c.get('requestId'),
    timestamp: new Date().toISOString()
  }, 404);
});

// Health check - essential for monitoring
app.get("/health", (c) => {
  const requestId = c.get('requestId');
  const timestamp = new Date().toISOString();
  const uptime = Date.now() - startTime;
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp,
    uptime,
    requestId
  };
  
  // Cache health responses for 5 minutes
  c.header('Cache-Control', 'public, max-age=300');
  
  return c.json(health);
});

// Readiness probe - for container orchestration
app.get("/ready", (c) => {
  c.header('Cache-Control', 'public, max-age=60');
  return c.json({
    ready: true,
    timestamp: new Date().toISOString(),
    requestId: c.get('requestId')
  });
});

// Liveness probe - minimal response
app.get("/live", (c) => {
  c.header('Cache-Control', 'public, max-age=300');
  return c.json({ alive: true });
});

// Metrics endpoint - basic performance tracking
app.get("/metrics", (c) => {
  const uptime = Date.now() - startTime;
  const timestamp = new Date().toISOString();
  
  c.header('Cache-Control', 'public, max-age=60');
  
  return c.json({
    uptime,
    timestamp,
    requestId: c.get('requestId'),
    environment: c.env?.ENVIRONMENT || 'unknown'
  });
});

// Main message endpoint
app.get("/message", (c) => {
  const requestId = c.get('requestId');
  
  // Cache for 5 minutes
  c.header('Cache-Control', 'public, max-age=300');
  
  return c.json({
    message: "Hello Hono!",
    timestamp: new Date().toISOString(),
    requestId
  });
});

// POST message endpoint
app.post("/message", async (c) => {
  const requestId = c.get('requestId');
  
  try {
    const body = await c.req.json();
    
    return c.json({
      message: "Message received",
      data: body,
      timestamp: new Date().toISOString(),
      requestId
    });
  } catch {
    return c.json({
      error: "Invalid JSON",
      requestId,
      timestamp: new Date().toISOString()
    }, 400);
  }
});

// Performance test endpoint
app.get("/perf", (c) => {
  const start = Date.now();
  
  // Simulate minimal processing
  const data = {
    timestamp: new Date().toISOString(),
    requestId: c.get('requestId'),
    processingTime: Date.now() - start
  };
  
  c.header('Cache-Control', 'public, max-age=60');
  return c.json(data);
});

// Batch health check for multiple services
app.get("/status", (c) => {
  const timestamp = new Date().toISOString();
  const uptime = Date.now() - startTime;
  
  c.header('Cache-Control', 'public, max-age=120');
  
  return c.json({
    server: {
      status: 'healthy',
      uptime,
      timestamp
    },
    services: {
      api: 'operational',
      database: 'operational' // Update based on actual checks
    },
    requestId: c.get('requestId')
  });
});


export default app;