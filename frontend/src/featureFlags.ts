import { UnleashClient } from 'unleash-proxy-client';

export const unleash = new UnleashClient({
  url: import.meta.env.VITE_UNLEASH_URL || 'http://localhost:4242/api/frontend',
  clientKey: import.meta.env.VITE_UNLEASH_CLIENT_KEY || 'default-key',
  appName: 'taskplanner-frontend',
});

unleash.on('error', console.error);
unleash.on('ready', () => {
  console.log('Unleash client ready (frontend)');
});

unleash.start();
