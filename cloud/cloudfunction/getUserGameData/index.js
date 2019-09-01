// 获取用户的游戏数据
// 云函数入口文件
const cloud = require('wx-server-sdk')
// 与小程序端一致，均需调用 init 方法初始化
cloud.init()

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command
// wx.cloud = false

// 云函数入口函数
exports.main = async (event, context) => {

  // 以 openid-data 作为记录 id
  const docId = `${event.userInfo.openId}-data`

  let userRecord
  let gameRecord

  try {
    const gameResult = await db.collection('game_data').doc('game_data').get()
    gameRecord = gameResult.data
  } catch (err) {
    // 游戏数据库读取失败
  }

  try {
    const userResult = await db.collection('user_data').doc(docId).get()
    userRecord = userResult.data
  } catch (err) {
    // 用户第一次上传分数
  }
  let userFinalSceneData = gameRecord.scenes

  if (userRecord) {
    let log = '';
    // 返回用户记录
    let userSceneData = userRecord.scenes
    userSceneData.forEach(userSceneItem => {
      userFinalSceneData.forEach(sceneItem => {
        if (userSceneItem.id == sceneItem.id) {
          let monsterMap = new Map()
          userSceneItem.monsters.forEach((monsterItem) => {
            monsterMap.set(monsterItem.id, monsterItem.own);
          })
          sceneItem.forEach((monsterItem) => {
            if (monsterMap.has(monsterItem.id)) {
              monsterItem.own = monsterMap.get(monsterItem.id)
            }
          })
        }
      })
    })
    
    userRecord.scenes = userFinalSceneData
    userRecord.log = log
    return {
      data: userRecord
    }

  } else {
    // 创建新的用户记录, 同时返回原始游戏数据
    return {
      data: gameRecord
    }
  }
}
