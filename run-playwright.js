const { spawn } = require('child_process');

async function run() {
  const backend = spawn('F:\\MoneyMate\\.venv\\Scripts\\python.exe', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
    cwd: 'F:\\MoneyMate\\backend',
    stdio: 'pipe',
    detached: true
  });

  const backendReady = new Promise((resolve) => {
    backend.stdout?.on('data', (data) => {
      if (data.toString().includes('Application startup complete')) {
        resolve();
      }
    });
  });

  const frontendBuild = spawn('F:\\MoneyMate\\.venv\\Scripts\\node.exe', ['-r', 'dotenv/config', 'npx', 'vite', 'build'], {
    cwd: 'F:\\MoneyMate',
    stdio: 'pipe',
  });

  await backendReady;
  await new Promise(resolve => setTimeout(resolve, 1000));

  const frontendServer = spawn('F:\\MoneyMate\\.venv\\Scripts\\python.exe', ['-m', 'http.server', '8080', '--directory', 'F:\\MoneyMate\\dist'], {
    stdio: 'pipe',
    detached: true
  });

  console.log('\n=== All services ready ===');
  console.log('Backend: http://localhost:8000');
  console.log('Frontend: http://localhost:8080');
  console.log('\nRunning Playwright tests...\n');

  const testProcess = spawn('F:\\MoneyMate\\.venv\\Scripts\\node.exe', ['node_modules/.bin/playwright', 'test', '--reporter=line'], {
    cwd: 'F:\MoneyMate',
    stdio: 'inherit'
  });

  await new Promise((resolve) => {
    testProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Tests failed with code ${code}`);
      }
      process.exit(code);
    });
  });
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});