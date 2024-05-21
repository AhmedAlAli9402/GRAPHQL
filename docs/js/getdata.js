import * as view from './presentdata.js'
import * as functions from './graphqlquery.js'

export async function GetData(JWTToken){
    let dataGraphQL ={}
    if (JWTToken.value == ''){
        return
    }
        dataGraphQL = await AccessGraphQLData(JWTToken)
         view.userdata(dataGraphQL.allUserData)
         view.BarGraph(dataGraphQL.pointsPerMonth)
         view.PieChart(dataGraphQL.auditsDoneCount, dataGraphQL.auditsMissed, dataGraphQL.failCount)
         for (let i=0;i<12;i++){
            let monthButton = document.getElementById(`bar${String(i)}`)
            if (monthButton !== null){
             monthButton.addEventListener("click", () => view.PresentMonthDetails(dataGraphQL.projectsDetails, i))

            }
         }     
         let show = document.getElementById("showButton")
         if (show !== null){
         show.addEventListener("click", () => view.AuditData(dataGraphQL.auditedPeople, true))
         }
    console.log(dataGraphQL.pointsPerMonth)
}

async function AccessGraphQLData(JWTToken){ 
    var allUserData = await functions.LoginDetails(JWTToken)
    
    var XPpointsData = await functions.UserXpPoints(JWTToken)
    
    var auditData = await functions.AuditDetails(JWTToken)

    let auditsMissedPercent = auditData.auditsMissed*100/auditData.allAudits.length
    
    let Alldata = {auditsDoneCount:auditData.auditsDoneCount, auditsMissed:(auditData.auditsMissed),
         auditedPeople:auditData.auditedPeople, totalXp:XPpointsData.totalXp, jsPiscineXp:XPpointsData.jsPiscineXp, goPiscineXp:XPpointsData.goPiscineXp,
         auditsMissedPercent, pointsPerMonth:XPpointsData.pointsPerMonth, failCount:auditData.fail, allUserData, projectsDetails:XPpointsData.projectsDetails}

    return Alldata
    }