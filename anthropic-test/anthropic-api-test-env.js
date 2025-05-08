// anthropic-api-test-env.js
// A script to test Anthropic API authentication using an .env file

require('dotenv').config();
const fetch = require('node-fetch');

// Get the API key from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

console.log('API Key from .env (first 10 chars):', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'Not found');

// Test function to make a simple API call to Anthropic
async function testAnthropicAuthentication() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ No ANTHROPIC_API_KEY found in .env file!');
    return;
  }

  console.log('Testing Anthropic API authentication with key from .env...');
  
  try {
    // Using the messages API endpoint
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message to verify API key authentication from .env file.'
          }
        ]
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Authentication successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Authentication failed!');
      console.log('Status:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error making API request:', error);
  }
}

testAnthropicAuthentication(); 