const { spawn } = require('child_process');
const { join } = require('path');

let backendProcess;
let frontendProcess;

async function startBackend() {
  console.log('Starting backend...');
  backendProcess = spawn('cmd', ['/c', 'cd F:\\MoneyMate\\backend && F:\\MoneyMate\\.venv\\Scripts\\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000'], {
    stdio: 'pipe',
    windowsHide: true
  });
  await new Promise(resolve => setTimeout(resolve, 3000));
  return backendProcess;
}

async function startFrontend() {
  console.log('Starting frontend...');
  frontendProcess = spawn('cmd', ['/c', 'cd F:\\MoneyMate && npx vite --host 0.0.0.0 --port 5173'], {
    stdio: 'pipe',
    windowsHide: true
  });
  await new Promise(resolve => setTimeout(resolve, 5000));
  return frontendProcess;
}

async function stopAll() {
  if (backendProcess) {
    backendProcess.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Backend stopped');
  }
  if (frontendProcess) {
    frontendProcess.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Frontend stopped');
  }
}

process.on('SIGTERM', stopAll);
process.on('SIGINT', stopAll);
process.on('exit', stopAll);

startBackend().then(() => {
  startFrontend().then(() => {
    console.log('All services started');
  }).catch(err => {
    console.error('Failed to start frontend:', err);
    stopAll();
    process.exit(1);
  });
}).catch(err => {
  console.error('Failed to start backend:', err);
  stopAll();
  process.exit(1);
});