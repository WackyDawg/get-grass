// File path: scripts/test_proxies.js

const axios = require('axios');
const { SocksProxyAgent, HttpsProxyAgent } = require('axios-socks5-agent');

// List of proxies to test
const proxies = [
  "109.236.83.153:8888",
  "62.182.204.81:88",
  "179.49.116.48:8080",
  "165.232.129.150:80",
  "168.119.53.93:80",
  "23.247.136.253:80",
  "31.40.248.2:8080",
  "185.49.31.207:8081",
  "79.110.200.148:8081",
  "212.127.93.44:8081",
  "158.255.77.166:80",
  "143.110.232.177:80",
  "157.245.95.247:443",
  "172.232.180.108:80",
  "91.26.124.18:3128",
  "194.247.173.17:8080"
];

// Test URL
const TEST_URL = 'http://www.google.com'; // You can replace with any publicly accessible URL

// Function to test a single proxy
async function testProxy(proxy) {
  const [host, port] = proxy.split(':');

  // Configure the proxy agent based on the port type
  const proxyAgent = port == 443
    ? new HttpsProxyAgent({ host, port: parseInt(port) })
    : { host, port };

  const config = {
    method: 'get',
    url: TEST_URL,
    timeout: 5000, // 5 seconds timeout
    proxy: proxyAgent,
  };

  try {
    const response = await axios(config);
    console.log(`Proxy ${proxy} is working. Status: ${response.status}`);
    return { proxy, status: 'success' };
  } catch (error) {
    console.error(`Proxy ${proxy} failed. Error: ${error.message}`);
    return { proxy, status: 'failed', error: error.message };
  }
}

// Test all proxies and summarize results
async function testAllProxies() {
  const results = [];
  for (const proxy of proxies) {
    const result = await testProxy(proxy);
    results.push(result);
  }

  // Display a summary of results
  console.log('\nSummary:');
  results.forEach((result) => {
    console.log(`Proxy: ${result.proxy} - Status: ${result.status}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
  });
}

// Run the script
testAllProxies();
