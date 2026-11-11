import { createApp } from './app.js';
import { allowedOrigins, clover, orderingEnabled, port } from './config/index.js';

createApp().listen(port, () => {
  console.log(`Bella Cucina API on http://localhost:${port} (Clover ${clover.sandbox ? 'sandbox' : 'production'})`);
  console.log(`Ordering ${orderingEnabled ? 'ENABLED' : 'disabled (menus only)'}`);
  console.log(`CORS origins: ${[...allowedOrigins].join(', ')}`);
});
