// Node.js script to start MoneyMate services
const { spawn } = require('child_process');

let backendStarted = false;
let frontendStarted = false;

function startBackend() {
  console.log('[BACKEND] Starting backend on port 8000...');
  const backend = spawn('F:\\MoneyMate\\.venv\\Scripts\\python.exe', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: 'F:\\MoneyMate\\backend',
    stdio: 'pipe',
    detached: true
  });

  backend.on('error', (err) => {
    console.error('[BACKEND] Error:', err);
  });

  backend.stdout?.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Application startup complete')) {
      backendStarted = true;
      console.log('[BACKEND] Successfully started');
      if (frontendStarted) {
        console.log('[BACKEND] Starting frontend');
        startFrontend();
      }
    }
    process.stdout.write(`[BACKEND] ${output}`);
  });

  backend.stderr?.on('data', (data) => {
    process.stderr.write(`[BACKEND] ${data}`);
  });

  return backend;
}

function startFrontend() {
  console.log('[FRONTEND] Building static app...');
  const buildProcess = spawn('F:\\MoneyMate\\.venv\\Scripts\\node.exe', ['-r', 'dotenv/config', 'npx', 'vite', 'build'], {
    cwd: 'F:\\MoneyMate',
    stdio: 'pipe',
  });

  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('[FRONTEND] Build completed');
      startFrontendServer();
    } else {
      console.error(`[FRONTEND] Build failed with code ${code}`);
      process.exit(1);
    }
  });

  buildProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    if (output.includes('✓ built in')) {
      console.log('[FRONTEND] Build ready');
      if (backendStarted) {
        console.log('[FRONTEND] Starting static server');
        startFrontendServer();
      }
    }
    process.stdout.write(`[BUILD] ${output}`);
  });
}

function startFrontendServer() {
  console.log('[FRONTEND] Starting static server on port 8080...');
  const frontend = spawn('F:\\MoneyMate\\.venv\\Scripts\\python.exe', ['-m', 'http.server', '8080', '--directory', 'F:\\MoneyMate\\dist'], {
    stdio: 'pipe',
    detached: true
  });

  frontend.on('error', (err) => {
    console.error('[FRONTEND] Error:', err);
  });

  frontend.stdout?.on('data', (data) => {
    process.stdout.write(`[SERVER] ${data}`);
  });

  frontend.stderr?.on('data', (data) => {
    process.stderr.write(`[SERVER] ${data}`);
  });

  frontendStarted = true;

  if (backendStarted) {
    console.log('\n=== All services ready ===');
    console.log('Backend: http://localhost:8000');
    console.log('Frontend: http://localhost:8080');
    console.log('\nAvailable frontend routes:');
    console.log('  - http://localhost:8080/ (Landing page)');
    console.log('  - http://localhost:8080/login (Login)');
    console.log('  - http://localhost:8080/register (Register)');
    console.log('  - http://localhost:8080/dashboard (Dashboard)');
    console.log('  - http://localhost:8080/income (Income)');
    console.log('  - http://localhost:8080/expenses (Expenses)');
    console.log('  - http://localhost:8080/budget (Budget)');
    console.log('  - http://localhost:8080/savings-goals (Savings Goals)');
    console.log('  - http://localhost:8080/analytics (Analytics)');
    console.log('  - http://localhost:8080/transactions (Transactions)');
    console.log('  - http://localhost:8080/profile (Profile)');
    console.log('\nPlaywright tests are configured to use the frontend server.');
  }
}

function cleanup() {
  console.log('\nShutting down services...');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

const backend = startBackend();
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});