const { UnleashClient } = require('unleash-client');

const unleash = new UnleashClient({
  url: process.env.UNLEASH_URL || 'http://localhost:4242/api/',
  appName: 'taskplanner-backend',
  instanceId: 'backend-1',
});

unleash.on('error', console.error);
unleash.on('ready', () => {
  console.log('Unleash client ready');
});

unleash.start();

module.exports = unleash; 