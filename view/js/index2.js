
import * as charts from './charts.js'
import * as functions from './functions.js'

var loginUrl = "https://learn.reboot01.com/api/auth/signin"

if (JWTToken === undefined){
var JWTToken = ""
StartPage()
} else {
    StartPage(true)
}

function StartPage(Logged){
    var startPage = document.getElementById('startpage')
    if (!Logged){
        let submit = document.getElementById("submitBtn")
        submit.addEventListener("click", checkingData);
    } else {
    startPage.innerHTML = `<button id="logoutBtn">Log Out</button>
    `
    document.getElementById("logoutBtn").addEventListener("click", Logout);
    // document.getElementById("showData").addEventListener("click", GetData);

}
}

function checkingData(){
var username = document.getElementById("loginemail").value
var password = document.getElementById("passIn").value
console.log(username)
JWTToken = getToken(username, password)
}

 async function getToken(username, password){
    var encodedUserData = "Basic " + btoa(username+":"+password) 
    console.log(encodedUserData)
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
        StartPage(true)
    } else {
        username = null
        password = null
        document.getElementById('errorMsg').innerHTML = `<span>${JWTToken.error}<span>`
        StartPage(false)
    }
    SendData(JWTToken)
}

async function SendData(JWTToken){
    let dataGraphQL ={}
    if (JWTToken.value == ''){
        return
    }
        dataGraphQL = await getData(JWTToken)
         userdata(dataGraphQL.allUserData)
         charts.BarGraph(dataGraphQL.pointsPerMonth)
         charts.PieChart(dataGraphQL.auditsDoneCount, dataGraphQL.auditsMissed, dataGraphQL.failCount)
    console.log(dataGraphQL.pointsPerMonth)
}


async function getData(JWTToken){ 
    var allUserData = await functions.LoginDetails(JWTToken)
    var auditRatio = allUserData.auditRatio
    console.log("Full name: ", allUserData.attrs.firstName, allUserData.attrs.lastName)
    console.log("user login: ", allUserData.login)
    
    var XPpointsData = await functions.UserXpPoints(JWTToken)
      console.log(XPpointsData.pointsPerMonth)
      console.log("totalXp: ", XPpointsData.totalXp)
      console.log("Js Piscine Xp: ", XPpointsData.jsPiscineXp)
      console.log("go Piscine Xp: ", XPpointsData.goPiscineXp)
    
    var auditData = await functions.AuditDetails(JWTToken)
    console.log("audited people", auditData.auditedPeople)
    console.log("audits done: ", auditData.auditsDoneCount)
    console.log("audits Missed:", auditData.auditsMissed)
    console.log("percentage of audits missed:", auditData.auditsMissed/auditData.allAudits.length)
    let failPercentage = auditData.fail*100/auditData.auditsDoneCount
    console.log("fail percentage: ", failPercentage)
    let auditsMissedPercent = auditData.auditsMissed*100/auditData.allAudits.length
    
    let Alldata = {auditsDoneCount:auditData.auditsDoneCount, auditsMissed:(auditData.auditsMissed), auditedPeople:auditData.auditedPeople, totalXp:XPpointsData.totalXp, jsPiscineXp:XPpointsData.jsPiscineXp, goPiscineXp:XPpointsData.goPiscineXp, auditRatio, auditsMissedPercent, pointsPerMonth:XPpointsData.pointsPerMonth, failCount:auditData.fail, allUserData}
    console.log(Alldata)
    return Alldata
    }

function Logout(){
    JWTToken = undefined
    var startPage = document.getElementById('startpage')
    startPage.innerHTML = `<input id="loginemail" class="loginemail" type="text" name="email" autocomplete="on" required class="input" title="Enter your Email or ID"/>
    <label class="user-email" >Email/Username</label><br><br>
        <input type="password" name="password" id="passIn" autocomplete="on" class="input" minlength="6" maxlength="25"
            required title="Your password must be between 6 to 25 long"/>
            <label class="user-pass">Password</label><br><br><br><button id="submitBtn">SIGN IN</button>`
    document.getElementById("bargraph").innerHTML = ``
    document.getElementById("piechart").innerHTML = ``
    document.getElementById("lines").innerHTML = ``
    document.getElementById("userdata").innerHTML = ``
    StartPage(false)
}

function userdata(allUserData){
    let fillData = document.getElementById("userdata")
    fillData.innerHTML = `<h2>Welcome ${allUserData.attrs.firstName} ${allUserData.attrs.lastName}</h2>`
}
