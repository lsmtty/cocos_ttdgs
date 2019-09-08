// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const docId = `${event.userInfo.openId}-data`
  let userRecord

  try {
    const queryResult = await db.collection('user_data').doc(docId).get()
    userRecord = queryResult.data
  } catch (err) {
    // 没有查到用户信息
  }

  if (userRecord) {
    let monsterId = event.monsterId
    let sceneId = event.sceneId
    let { scenes: userScenes } = userRecord
    let hasScene = false

    userScenes.forEach(sceneItem => {
      if (sceneItem.id == `scene${sceneId}`) {
        hasScene = true
        let hasMonster = false
        sceneItem.monsters.forEach(monsterItem => {
          if (monsterItem.id == `s${sceneId}_monster${monsterId}`) {
            monsterItem.own ? monsterItem.own++ : monsterItem.own = 1
            hasMonster = true
          }
        })
        if (!hasMonster) {
          sceneItem.monsters.push({
            id: `s${sceneId}_monster${monsterId}`,
            own: 1
          })
        }
      }
    });
    if (!hasScene) {
      userScenes.push({
        id: `scene${sceneId}`,
        monsters:[{
          id: `s${sceneId}_monster${monsterId}`,
          own: 1
        }]
      })
    }
    await db.collection('user_data').doc(docId).update({
      data: {
        scenes: userScenes
      }
    })
    return {
      success: true,
      data: {
        serverTime: Date.now()
      }
    }
  } else {
    return {
      success: false,
      data: {
        serverTime: Date.now()
      }
    }
  }
}