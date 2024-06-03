import { useState, useEffect } from 'react';

let currentApiKey = 'f9e75c23b47f385a89eafdb420c87fe0';

const getApiKey = () => currentApiKey;

const setApiKey = (newKey) => {
  currentApiKey = newKey;
};

const refreshApiKey = async () => {
  try {
    const newKeyResponse = await fetch('https://cs463.dimedash.xyz/getlatestapikey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: currentApiKey }),
    });

    if (!newKeyResponse.ok) {
      throw new Error('Failed to fetch latest API key');
    }

    const newKeyData = await newKeyResponse.json();
    setApiKey(newKeyData.latestApiKey);
    return newKeyData.latestApiKey;
  } catch (error) {
    console.error('Error refreshing API key: ', error);
    return currentApiKey;
  }
};

const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState(currentApiKey);

  useEffect(() => {
    const fetchAndSetApiKey = async () => {
      const newKey = await refreshApiKey();
      setApiKeyState(newKey);
    };

    fetchAndSetApiKey();
    
    const interval = setInterval(fetchAndSetApiKey, 3600000);

    return () => clearInterval(interval);
  }, []);

  return apiKey;
};

export { getApiKey, setApiKey, useApiKey };
