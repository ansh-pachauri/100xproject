//it may take sometime so create an asyn funcion

//const { allowedNodeEnvironmentFlags } = require("process");


async function signup(){
    const username = document.getElementById(signup_username).value;
    const password = document.getElementById(signup_password).value;
    
    await axios.post("http://localhost:3000/signup",{
        username:username,
        password:password
    })
    alert("hey! you are succefully signup");
}

async function signin(){
    const username = document.getElementById(signin_username).value;
    const password = document.getElementById(signin_password).value;

    const response = await axios.post("http://localhost:3000/signup",{
        username:username,
        password:password
    })
    //data store in localStorage
    localStorage.setItem("token",response.data.token);
    alert("hey! you are succefully signed");
}

async function gettingUserInfo() {
    // const token = localStorage.getItem("token");

    // if(!token){
    //     alert("pls sign in first");
    //     return;
    // }
    // try{
    //     const response = await axios.get("http://localhost:3000/me",{
    //         headers:{
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    //     document.getElementById("information").innerHTML = "Welcome" + response.data.username;
    // }catch(error){
    //     console.log(error);
    //     alert("Unauthroized access in sign in");
    // }
     const response = await axios.get("http://localhost:3000/me",{
        headers:{
            token: localStorage.getItem("token")
        }
     })
     document.getElementById("information").innerHTML = "Welcome" + response.data.username;
}
gettingUserInfo();
// Call this function when the page loads to check if user is logged in
// window.onload = function() {
//     gettingUserInfo();
// };


// function logout(){
//     localStorage.removeItem("token");
// }