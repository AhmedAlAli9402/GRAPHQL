import { splitString } from "./graphqlquery.js"

export function userdata(allUserData){
  let fillData = document.getElementById("userdata")
  fillData.innerHTML = `<h2>Welcome ${allUserData.attrs.firstName} ${allUserData.attrs.lastName}</h2>
  <h3>Email: ${allUserData.attrs.email}</h3>
  <h3>Username: ${allUserData.login}</h3>
  <h3>Created At: ${splitString(allUserData.createdAt, 0, 10)}</h3>
  <h3>Audit Ratio: ${allUserData.auditRatio.toFixed(3)}</h3>`
}

export function BarGraph(pointsPerMonth){
    var bars = document.getElementById('bargraph')
    var lines = document.getElementById('lines')
    let i = 4
    let x=0
    let barsHtml = `<figure>
    <figcaption>A bar graph showing XP points per month</figcaption><br>
  <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" class="chart" width="620" height="600" aria-labelledby="title asc" role="img">
    <title id="title">A bar graph showing XP points per month</title>`
  while(i < 12) {
    barsHtml += `<g id="bar${i}" class="bar">
      <rect width="35" height="${pointsPerMonth[i]*500/pointsPerMonth["max"]}" x="${x}" y="${500-(500*(pointsPerMonth[i]/pointsPerMonth["max"]))}" id="month${String(i)}"></rect>`
      if (pointsPerMonth[i] !== 0){
        barsHtml += `<text x="${x-35}" y="${520-(500*(pointsPerMonth[i]/pointsPerMonth["max"]))}">${(pointsPerMonth[i]/1000).toFixed(1)}KB</text></g>`
      }
    if (i === 11){
      i = 0
    } else {
      i++
    }
    x += 40
    if (i === 4){
      barsHtml += `</svg>`
      bars.innerHTML = barsHtml
      break
    }
  }
  lines.innerHTML = `<svg version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="graph"  width="600" height="550" aria-labelledby="title" role="img">
  <title id="title">A line chart showing some information</title>
<g class="grid x-grid" id="xGrid">
  <line x1="50" x2="590" y1="500" y2="500"></line>
</g>
<g class="grid y-grid" id="yGrid">
  <line x1="50" x2="50" y1="0" y2="500"></line>
</g>
  <g class="labels x-labels">
  <text x="66" y="510" dy=".35em">May</text>
  <text x="106" y="510" dy=".35em">Jun</text>
  <text x="146" y="510" dy=".35em">Jul</text>
  <text x="186" y="510" dy=".35em">Aug</text>
  <text x="226" y="510" dy=".35em">Sep</text>
  <text x="266" y="510" dy=".35em">Oct</text>
  <text x="306" y="510" dy=".35em">Nov</text>
  <text x="346" y="510" dy=".35em">Dec</text>
  <text x="386" y="510" dy=".35em">Jan</text>
  <text x="426" y="510" dy=".35em">Feb</text>
  <text x="466" y="510" dy=".35em">Mar</text>
  <text x="506" y="510" dy=".35em">Apr</text>

  <text x="80" y="550">2023--></text>
  <text x="400" y="550">2024--></text>
  <text x="200" y="570" class="label-title">Year</text>
</g>
<g class="labels y-labels">
  <text x="40" y="500">0</text>
  <text x="50" y="15">${pointsPerMonth["max"]}</text>
  <text x="50" y="220" class="label-title">Points</text>
  <text x="30" y="205" class="label-title">XP</text>
  </g>
</svg> `
}

export function PieChart(done, missed, failed){
  const total = done+missed
  const passedPer = ((done-failed)*100)/total
  const failedPer = (failed*100)/total
  const missedPer = Math.round(missed*100)/total
  const pieChart = document.getElementById("piechart")
  pieChart.innerHTML = `<figcaption>A pie chart showing the distribution of students you audited</figcaption><br><br><br><svg viewBox="0 0 64 64" class="pie">
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${missedPer} 100">
  </circle>
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${passedPer} 100; stroke: rgb(0, 102, 31); stroke-dashoffset: -${missedPer}; animation-delay: 0.25s">
  </circle>
  <circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: ${failedPer} 100; stroke: rgb(116, 0, 0); stroke-dashoffset: -${missedPer+passedPer}; animation-delay: 1s">
  </circle>
</svg><br><br>
<h4>audits passed ≈ ${Math.round(passedPer)}%  (${done-failed} audits)</h4><i class="gg-border-all" style="color:rgb(0, 102, 31); background-color:rgb(0, 102, 31); margin-top:-2.5rem"></i>
  <h4>audits failed ≈ ${Math.round(failedPer)}%  (${failed} audits)</h4><i class="gg-border-all" style="color:rgb(116, 0, 0); background-color:rgb(116, 0, 0); margin-top:-2.5rem; margin-right:3rem"></i>
  <h4>audits missed ≈ ${Math.round(missedPer)}%  (${missed} audits)</h4><i class="gg-border-all" style="color:rgb(56, 52, 52); background-color:rgb(56, 52, 52); margin-top:-2.5rem"></i><br><br><button id="showButton">Show the students you most audited</button>`
}

export function AuditData(auditedPeople){
  const audits = document.getElementById("auditData")
  let auditData = ``
  if (audits.innerHTML === ``){
  let keys = Object.keys(auditedPeople)
  let values = Object.values(auditedPeople)
  let count = 0
  for (let i=keys.length-1;i>=0;i--){
    auditData += `<h3>${keys[i]}: ${values[i]} </h3>`
    count++
    if (count>9){
      break
    } 
  }
} 
  audits.innerHTML = auditData
}

export function PresentMonthDetails(projectDetails, month){
  let addUpData = `<h3>Projects for the Month of ${GetMonthName(month)}</h3>`
  let keys = Object.keys(projectDetails)
  let values = Object.values(projectDetails)
  let count = 0
  const data = document.getElementById("auditData")
  for (let i=0;i < keys.length;i++){
    let check = values[i]
    if (check !== undefined && check["month"] === month){
      addUpData += `<h5>${keys[i]}: ${values[i].xp} </h5>`
      count++
      if (count>9){
      break
    }
    }
  }
  data.innerHTML = addUpData
}

function GetMonthName(month){
  switch(month){
    case 0: return "January"
    case 1: return "February";
    case 2: return "March";
    case 3: return "April";
    case 4: return "May";
    case 5: return "June"; 
    case 6: return "July";
    case 7: return "August";
    case 8: return "September";
    case 9: return "October";
    case 10: return "November";
    case 11: return "December";
    }
}