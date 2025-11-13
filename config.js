// config.js
const environments = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    debug: true
  },
  production: {
    apiBaseUrl: 'https://vidoorabackend-git-main-dr-ks-projects.vercel.app/',
    debug: false
  },
  staging: {
    apiBaseUrl: 'https://vercel.com/login?next=%2Fsso-api%3Furl%3Dhttps%253A%252F%252Fvidoorabackend-git-main-dr-ks-projects.vercel.app%252F%26nonce%3Dfd10087febf83a6f712e8b0d9cd59102a119fe2bc0dca032cf071c66f839da42',
    debug: true
  }
};

// Detect environment
const getEnvironment = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname.includes('staging')) {
    return 'staging';
  } else {
    return 'production';
  }
};

const currentEnv = getEnvironment();
const config = environments[currentEnv];

console.log(`Running in ${currentEnv} mode, API: ${config.apiBaseUrl}`);

export default config;