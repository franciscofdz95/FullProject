export const environment = {
  production: false,
  apiUrl: '',
  hostApi: '',
  biaUrl: '',
  encryptionKey: 'SfabraTeam#1'
  };

export async function fetchEnvironmentConfig() {
  try {

    let hostApi = '';
    let biaUrl = '';
    const host = window.location.hostname.toLowerCase();    

    if (host.includes('localhost')) {
      hostApi = 'https://localhost:44375';
      biaUrl = 'https://biaalpha.inside.ups.com/home/';
    } else if (host.includes('alpha')) {
      hostApi = 'https://sfabra.biaalpha.inside.ups.com';
      biaUrl = 'https://biaalpha.inside.ups.com/home/';
    } else if (host.includes('ams1907')) {
      hostApi = 'https://sfabra.biadev.inside.ams1907.com';
      biaUrl = 'https://biadev.inside.ams1907.com/home/';
    } else if (host.includes('bia.inside.ups.com')) {
      hostApi = 'https://sfabra.bia.inside.ups.com';
       biaUrl = 'https://bia.inside.ups.com/home/';
      environment.production = true;
    } else {
      hostApi = 'https://localhost:44375';
      biaUrl = 'https://biaalpha.inside.ups.com/home/'; // Fallback BIA URL
    }

    const response = await fetch(`${hostApi}/api/Environment`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    environment.apiUrl = config.apiBaseUrl;
    environment.hostApi = hostApi;
    environment.biaUrl = biaUrl; // Assign the determined BIA URL
    environment.production = config.environment === 'Production' || environment.production; 
    
    console.log('Environment configuration loaded:', {
      environment: environment.production ? 'Production' : 'Development/Alpha',
      hostApi: environment.hostApi,
      apiUrl: environment.apiUrl,
      biaUrl: environment.biaUrl
    });
  } catch (error) {
    console.error('Failed to load environment configuration:', error);
    // Fallback to a default or handle the error appropriately
    environment.apiUrl = 'https://localhost:44375'; // Fallback for development
    environment.hostApi = 'https://localhost:44375'; // Fallback for development
    environment.biaUrl = 'https://biaalpha.inside.ups.com/home/'; // Fallback BIA URL
  }
}

