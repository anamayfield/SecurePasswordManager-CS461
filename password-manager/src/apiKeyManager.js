import { useState, useEffect } from 'react';

let currentApiKey = process.env.START_API_KEY;

const getApiKey = () => currentApiKey;

const setApiKey = (newKey) => {
  currentApiKey = newKey;
};

const refreshApiKey = async () => {
  try {
    const response = await fetch('/getapikeyexp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: currentApiKey })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch API key expiration data');
    }
    const data = await response.json();

    if (data.timeLeftMs <= 21600000) {
      const newKeyResponse = await fetch('/getlatestapikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: currentApiKey })
      });
      if (!newKeyResponse.ok) {
        throw new Error('Failed to fetch latest API key');
      }
      const newKeyData = await newKeyResponse.json();
      setApiKey(newKeyData.latestApiKey);
    }
  } catch (error) {
    console.error("Error refreshing API key: ", error);
  }
};

const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState(currentApiKey);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshApiKey().then(() => {
        setApiKeyState(currentApiKey);
      });
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return apiKey;
};

export { getApiKey, setApiKey, useApiKey };
