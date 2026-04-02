import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import cors from 'cors';
import { registerRoutes } from './routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const httpServer = http.createServer(app);

  // Register API routes
  await registerRoutes(httpServer, app);

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
