import {GetData}  from "./getdata.js"

var JWTToken = CheckStorage()

function CheckStorage(){
    return localStorage.getItem('JWTToken')
}

if (JWTToken === null){
var JWTToken = ""
var Logged = false
StartPage()
} else {
    var Logged = true
    StartPage()
}

function StartPage(){
    var startPage = document.getElementById('startpage')
    if (!Logged){
        startPage.innerHTML = `<h2>Log in</h2>
        <input id="loginemail" class="loginemail" type="text" name="email" autocomplete="on" required class="input" title="Enter your Email or ID"/>
    <label class="user-email" >Email/Username</label><br><br>
        <input type="password" name="password" id="passIn" autocomplete="on" class="input" minlength="6" maxlength="25"
            required title="Your password must be between 6 to 25 long"/>
            <label class="user-pass">Password</label><br><br><br><button id="submitBtn">SIGN IN</button>`
        let submit = document.getElementById("submitBtn")
        submit.addEventListener("click", checkingData);
    } else {
    startPage.innerHTML = `<button id="logoutBtn">Log Out</button>
    `
    document.getElementById("logoutBtn").addEventListener("click", Logout);
    if (JWTToken === null){ 
        JWTToken = getToken()
    }
        GetData(JWTToken)
}
}

function checkingData(){
var username = document.getElementById("loginemail").value
var password = document.getElementById("passIn").value
console.log(username)
JWTToken = getToken(username, password)
}

async function Logout(){
    JWTToken = undefined
    Logged = false
    const data = {
    "headers": {
    "x-jwt-token": localStorage.getItem('JWTToken') || '',
    },
    "method": 'GET',
    } 
    await fetch(`https://learn.reboot01.com/api/auth/expire`, data);
          
    data.method = 'POST';
    await fetch(`https://learn.reboot01.com/api/auth/signout`, data);
    localStorage.removeItem("JWTToken");        
    document.getElementById("bargraph").innerHTML = ``
    document.getElementById("piechart").innerHTML = ``
    document.getElementById("lines").innerHTML = ``
    document.getElementById("userdata").innerHTML = ``
    document.getElementById("auditData").innerHTML = ``
    StartPage()
}


async function getToken(username, password){
    var encodedUserData = "Basic " + btoa(username+":"+password) 
    var loginUrl = "https://learn.reboot01.com/api/auth/signin"
    const requestOptions = {
        method:'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': encodedUserData
        },
        body: JSON.stringify({ title: 'Fetch POST Request Example' })
    }
     await fetch(loginUrl, requestOptions)
    .then(response =>response.json())
    .then(data => {
        JWTToken = data
    })
    if (JWTToken.error === undefined){
        document.getElementById('errorMsg').innerHTML = ``
        Logged = true
        StartPage()
        localStorage.setItem('JWTToken', JWTToken);
        return JWTToken
    } else {
        username = null
        password = null
        document.getElementById('errorMsg').innerHTML = `<span>${JWTToken.error}<span>`
        StartPage()
    }
}
