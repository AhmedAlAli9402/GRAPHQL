export async function LoginDetails(JWTToken){
    var data = JSON.stringify({
      query:`{
          user{
              attrs
              login
              auditRatio
              createdAt
          }
      }`
    })
    
    var response = await fetch(
      'https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWTToken}`,
          }, 
      }
    )
    var json = await response.json();
    console.log(json, "json")
    // console.log(data)
    const login = json.data
    return json.data.user[0]
  }


export async function UserXpPoints(JWTToken){
    let data = JSON.stringify({
        query:`{ 
          xp_view(order_by:{
             amount:desc
         }){
             amount
             path
                    pathByPath{
              results{
                createdAt
              }
            }
         }
         }`
      })
      
      let response = await fetch(
        'https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
            method: 'post',
            body: data,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${JWTToken}`,
            }, 
        }
      )
     let json = await response.json();


  let allXpView = json.data.xp_view
  let totalXp =0
  let jsPiscineXp = 0
  let goPiscineXp = 0
  let pointsPerMonth = {}
  let projectDetails = {}
  pointsPerMonth["max"] = 5
  for (let i=0;i<allXpView.length;i++){
    if (splitString(allXpView[i].path, 0, 20) ==="/bahrain/bh-piscine/"){
      goPiscineXp += allXpView[i].amount
    }else if (splitString(allXpView[i].path, 0, 30)==="/bahrain/bh-module/piscine-js/"){
      jsPiscineXp += allXpView[i].amount
    } else {
    totalXp += allXpView[i].amount
    const month = new Date(allXpView[i].pathByPath.results[0].createdAt).getMonth()
    if (pointsPerMonth[month] === undefined){
      pointsPerMonth[month] = 0
    }
    let path =(splitString(allXpView[i].path, 21, 50))
    projectDetails[month] = path
    projectDetails[month] = allXpView[i].amount
    pointsPerMonth[month] += allXpView[i].amount
    if (pointsPerMonth["max"] < pointsPerMonth[month]){
      pointsPerMonth["max"] = pointsPerMonth[month]
    }
    }
  }
  console.log(projectDetails)
  return {pointsPerMonth:pointsPerMonth, totalXp:totalXp, jsPiscineXp:jsPiscineXp, goPiscineXp:goPiscineXp}
}

export async function AuditDetails(JWTToken){
let data = JSON.stringify({
    query:`{
      user{
        audits{
          private{
            audit{
              grade
              group{
                members{
                  userLogin
                }
              }
            }     
          }
        }
      }
    }`
  })
  
  let response = await fetch(
    'https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWTToken}`,
        }, 
    }
  )
  let json = await response.json();
  let allAudits =json.data.user[0].audits
  let auditedPeople = {}
  let auditsDoneCount = 0
  let auditsMissed = 0
  let fail = 0
  for (let i=0;i<allAudits.length;i++){
    if (allAudits[i].private.audit.grade === null){
      auditsMissed++
      continue
    }
    if (allAudits[i].private.audit.grade === 0){
      fail++
    }  
    auditsDoneCount++
    let membersAudited = allAudits[i].private.audit.group.members
    // console.log(membersAudited)
    for (let j=0;j<membersAudited.length;j++){
      let foundMatch = false
      let keys = Object.keys(auditedPeople)
      // console.log(keys)
      for (let k=0;k<keys.length;k++){
        if (keys[k] == membersAudited[j].userLogin){
          auditedPeople[keys[k]]++
          foundMatch = true
          break
        }
      }
      if (!foundMatch){
        auditedPeople[membersAudited[j].userLogin] = 1
      }
    }
  }
  let keys = Object.keys(auditedPeople)
  let values = Object.values(auditedPeople)
  let sortedAuditedPeople = {}
  for (let j=1;j < values.length;j++){
    console.log("test")
  for (let i=0;i<keys.length;i++){
      if (values[i] === j){
        console.log("text")
        sortedAuditedPeople[keys[i]] = values[i]
      }
  }
  if (sortedAuditedPeople.length >= values.length){
    break
  }
}

  return {auditedPeople:sortedAuditedPeople, auditsDoneCount:auditsDoneCount, auditsMissed:auditsMissed, allAudits:allAudits, fail:fail}
}

export function splitString(word, from, to){
    var finalWord = ""
    for (let i=from;i<word.length;i++){
      if (i>= to){
        break
      }
      finalWord += word[i]
    }
    return finalWord
  }