const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const args = ['expo', 'start', ...process.argv.slice(2)];
const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : 'npx';
const commandArgs = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npx.cmd', ...args]
  : args;

const env = {
  ...process.env,
  EXPO_HOME: path.join(__dirname, '.expo-home'),
  XDG_CACHE_HOME: path.join(__dirname, '.expo-cache'),
};

fs.mkdirSync(env.EXPO_HOME, { recursive: true });
fs.mkdirSync(env.XDG_CACHE_HOME, { recursive: true });

const getPort = () => {
  const portArgIndex = process.argv.findIndex((arg) => arg === '--port' || arg === '-p');
  if (portArgIndex >= 0 && process.argv[portArgIndex + 1]) {
    return Number(process.argv[portArgIndex + 1]);
  }

  const inlinePort = process.argv.find((arg) => arg.startsWith('--port='));
  if (inlinePort) {
    return Number(inlinePort.split('=')[1]);
  }

  return 8081;
};

const checkPort = (port) => new Promise((resolve) => {
  const server = net.createServer();
  server.once('error', () => resolve(false));
  server.once('listening', () => {
    server.close(() => resolve(true));
  });
  server.listen(port, '0.0.0.0');
});

const start = async () => {
  const port = getPort();
  const isPortFree = await checkPort(port);

  if (!isPortFree) {
    console.error(`Port ${port} is already in use. Stop the service using ${port}, then run npm start -- -c again.`);
    console.error(`Check it with: netstat -ano | findstr :${port}`);
    process.exit(1);
  }

  const child = spawn(command, commandArgs, {
    stdio: 'inherit',
    env,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
};

start();
