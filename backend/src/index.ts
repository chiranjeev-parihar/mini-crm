import app from './app';
import { env } from './config/env';

const start = () => {
  try {
    app.listen(env.port, () => {
      console.log(`\n🚀 Mini CRM Backend running on http://localhost:${env.port}`);
      console.log(`📋 Environment: ${env.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${env.port}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
