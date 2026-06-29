import { BrowserCacheLocation } from '@azure/msal-browser';
import { environment } from '../environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

// Authentication configurations for different environments
const authConfigurations = {
  // Alpha/Development configuration (existing)
  development: {
    clientId: '045eb502-39dc-4693-ab23-8ddb5a9f1549',
    apiClientId: '3dd05298-4196-4cab-8148-677841a1cf1e'
  },
  testnet: {
    clientId: '78e0c1ef-ab98-4cda-9156-7497c0039243',
    apiClientId: 'e56ad167-8884-4398-b563-61bb1c30f6e4'
  },
  // Production configuration (new)
  production: {
    clientId: '67d6659e-129d-41f0-ac60-be926ac2c010',
    apiClientId: '0064a8d3-b4e0-45f8-b0a9-b21498e2dbf9'
  }
};

// Helper function to get current auth config based on environment
function getCurrentAuthConfig() {
  // Check if we're in testnet environment
  if (environment.hostApi && environment.hostApi.includes('ams1907')) {
    return authConfigurations.testnet;
  }
  
  return environment.production ? authConfigurations.production : authConfigurations.development;
}

// Functions that will be called after environment is loaded
export function getAzureAdConfig() {
  const authConfig = getCurrentAuthConfig();
  
  // Determine environment for logging
  let envName = 'Development/Alpha';
  if (environment.hostApi && environment.hostApi.includes('ams1907')) {
    envName = 'TestNet';
  } else if (environment.production) {
    envName = 'Production';
  }
  
  console.log(`Loading ${envName} auth configuration`);
  console.log(environment.hostApi);
  
  return {
    auth: {
      clientId: authConfig.clientId, // Dynamic based on environment
      tenatntId: 'e7520e4d-d5a0-488d-9e9f-949faae7dce8',
      authority: 'https://login.microsoftonline.com/e7520e4d-d5a0-488d-9e9f-949faae7dce8/v2.0',
      redirectUri: environment.hostApi || window.location.origin,
      postLogoutRedirectUri: environment.hostApi || window.location.origin
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE  
    },
    authRequest: {
      scopes: ['openid', 'profile'],
      //prompt: 'login'
    }
  };
}

export function getProtectedResources() {
  const authConfig = getCurrentAuthConfig();
  
  return {
    userAPI: {
      endpoint: `${environment.hostApi || window.location.origin}/api/`,
      scopes: {
        read: [`api://${authConfig.apiClientId}/User.Read`],
        create: [`api://${authConfig.apiClientId}/User.Write`],
        update: [`api://${authConfig.apiClientId}/User.Update`],
        delete: [`api://${authConfig.apiClientId}/User.Delete`]
      },
    }
  };
}

export function getLoginRequest() {
  const authConfig = getCurrentAuthConfig();
  
  return {
    scopes: ['openid', 'profile', `api://${authConfig.apiClientId}/User.Read`],
    //prompt: 'login'
  };
}

// Legacy exports for backward compatibility (will use fallbacks)
//export const azureAdConfig = getAzureAdConfig();
//export const protectedResources = getProtectedResources();
//export const loginRequest = getLoginRequest();
