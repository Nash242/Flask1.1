const msalConfig = {
    auth: {
        clientId: 'eed1ccf8-2fbc-4a80-a550-cf310dd46e46',
        authority: 'https://login.microsoftonline.com/b49816e8-d18d-4ab0-8878-3ac2f3baf1c3',
        redirectUri: 'http://localhost:5000/',
    },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

async function checkIfUserIsLoggedIn() {
    try {
        const msalInstance1 = new msal.PublicClientApplication(msalConfig);
        // Attempt to acquire token silently
        const account = msalInstance1.getAllAccounts()[0];
        if (account) {
          const accessToken = await msalInstance1.acquireTokenSilent({
            account: account,
            scopes: ['openid', 'profile', 'email'],
          });
          console.log('User is logged in:', accessToken);
          // Perform actions for logged-in user
          // window.location.href = 'http://localhost:5000/';
        } else {
          console.log('User is not logged in');
          // Perform actions for logged-out user
          window.location.href = 'http://localhost:5000/login';
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
  }

$(document).ready(function() {
  console.log('ready function in index  is running');
    checkIfUserIsLoggedIn()
});

