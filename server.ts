import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api.js';
import { dbManager } from './server/database.js';
import { ensureDefaultAdmin } from './server/auth.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 80MB limit for high-res images & direct field video clips
  app.use(express.json({ limit: '80mb' }));
  app.use(express.urlencoded({ extended: true, limit: '80mb' }));

  // Initialize DB and default admin
  dbManager.init();
  ensureDefaultAdmin();

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Explicit route for service worker to ensure correct headers and immediate updates
  app.get('/sw.js', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/javascript');
    next();
  });

  // Serve uploaded images and media statically
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

  // Mount API Router
  app.use('/api', apiRouter);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AL-ARRIQI INVERCOOL server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
