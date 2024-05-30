const chatbotToggler = document.querySelector(".chatbot-toggler");


const msalConfig = {
    auth: {
        clientId: 'eed1ccf8-2fbc-4a80-a550-cf310dd46e46',
        authority: 'https://login.microsoftonline.com/b49816e8-d18d-4ab0-8878-3ac2f3baf1c3',
        redirectUri: 'http://localhost:5000/',
       allowRedirectInIframe: true,
    }
    ,
    cache: {
        cacheLocation: 'localStorage', // Configures cache location to localStorage
    //    storeAuthStateInCookie: false, // Set to true for IE 11 or Edge
    }
};

const loginRequest = {
  scopes: ['user.read'] 
};



const msalInstance = new msal.PublicClientApplication(msalConfig);

async function checkIfUserIsLoggedIn() {
    console.log('popup running');
    try {
        const msalInstance1 = new msal.PublicClientApplication(msalConfig);
        const account = msalInstance1.getAllAccounts()[0];
        if (account) {
          const accessToken = await msalInstance1.acquireTokenSilent({
            account: account,
            scopes: ['openid', 'profile', 'email'],
          });
          console.log('User is logged in:', accessToken);
          // Perform actions for logged-in user
          // window.location.href = 'http://localhost:5000/';
          return true
        } else {
          console.log('User is not logged in');
          // Perform actions for logged-out user
          //window.location.href = 'http://localhost:5000/login';
           // Handle redirect response
           try {
            // Specify the scopes/permissions your app needs
            const request = {
                scopes: ['openid', 'profile', 'email'],
            };
            // Initiate login process
            const loginResponse = await msalInstance.loginPopup(request);
            console.log('Login successful:', loginResponse);
            return true
            } catch (error) {
                console.error('Login failed:', error);
                return false
            }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        return false
      }
  }

// $(document).ready(function() {
//   console.log('ready function in index  is running');
//    checkIfUserIsLoggedIn()
// });

chatbotToggler.addEventListener("click", () => {  
    let val = checkIfUserIsLoggedIn()
    
    val.then((res)=>{
       console.log(res);
       if(res){
        let uname=printNameFromLocalStorage()
        $(".loggedusername").html(uname)
        document.body.classList.toggle("show-chatbot")
       }
    }).catch((err)=>{
       console.log(err);
    })
       
    
});

function printNameFromLocalStorage() {
    for (const key in localStorage) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            if (value && value.name) {
                let uname=value.name.replace(/\s+/g, ' ')
                console.log(`Name found in localStorage: ${uname}`);
                const formattedName = `<strong>${value.name.replace(/\s+/g, ' ')}</strong>`;                
                return formattedName
            }
        } catch {
            return 'Buddy'
        }
    }
    console.log("Name not found in localStorage.");
}