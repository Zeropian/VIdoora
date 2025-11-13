// config.js
const environments = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    debug: true
  },
  production: {
    apiBaseUrl: 'vidoorabackend-761y03btm-dr-ks-projects.vercel.app',
    debug: false
  },
  staging: {
    apiBaseUrl: 'vidoorabackend-git-main-dr-ks-projects.vercel.app',
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