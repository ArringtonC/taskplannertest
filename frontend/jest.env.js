Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:5001/api'
    }
  }
});

process.env.VITE_API_BASE_URL = 'http://localhost:5001/api'; 