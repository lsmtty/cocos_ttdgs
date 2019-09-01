/*
  调用
  wx.cloud.callFunction({
    name: 'sendMonster',
    data: {
      monsterId: {monsterId},
      sceneId: {sceneId}
    },
    complete: res => {
      res.success 
    }
  })
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //event = `"monsterId": 1, "userInfo": { "appId": "wx0a0123077cd71432", "openId": "o4_IJ4_1HLHUF0ajkpmUJnBVs3fw" }`
  // get = {"data":{"_id":"o4_IJ4_1HLHUF0ajkpmUJnBVs3fw-data","_openid":"o4_IJ4_1HLHUF0ajkpmUJnBVs3fw","info":"","monsters":[3,4],"scenes":[1,3,0],"updateTime":55},"errMsg":"document.get:ok"}
  const docId = `${event.userInfo.openId}-data`
  let monsterId = event.monsterId
  let sceneId = event.sceneId
  let return_data = {
    success: false
  }
  let user_data = await db.collection('user_data').doc(docId).get()
  if (user_data.errCode) {
    return_data.data = user_data.errMsg
    return return_data
  }
  if (!user_data.data) {
    return_data.data = '无兽'
    return return_data
  }
  let { scenes } = user_data.data
  let targetScene = {}
  let hasMonster = false
  scenes.forEach(scene => {
    if (scene.id === `scene${sceneId}`) {
      targetScene = scene
    }
  })
  targetScene.monsters.forEach(monster => {
    if (monster.id == `s${sceneId}_monster${monsterId}` && monster.own) {
      hasMonster = true
      return_data.success = true
    }
  })
  if (hasMonster) {
    let log = user_data.data.log || []
    log.push({
      type: 'SEND_MONSTER',
      data: `send a monster. scene:${sceneId}, monster:${monsterId}`,
      time: new Date(),
    })
    let updateData = await db.collection('user_data').doc(docId).update({
      data: {
        log
      }
    })
  }
  return return_data
}

