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
    // 有用户数据
  }
  const { scenes: gameSceneData } = gameRecord

  if (userRecord) {
    // 返回用户记录
    let { scenes: userSceneData } = userRecord
    userSceneData.forEach(userSceneItem => {
      gameSceneData.forEach(sceneItem => {
        if (userSceneItem.id == sceneItem.id) {
          let monsterMap = new Map()
          userSceneItem.monsters.forEach((monsterItem) => {
            monsterMap.set(monsterItem.id, monsterItem.own);
          })

          sceneItem.monsters.forEach((monsterItem) => {
            if (monsterMap.has(monsterItem.id)) {
              monsterItem.own = monsterMap.get(monsterItem.id)
            }
          })
        }
      })
    })
    
    userRecord.scenes = gameSceneData
    return {
      success: true,
      data: {
        ...userRecord,
        serverTime: Date.now()
      }
    }

  } else {
    // 创建新的用户记录, 同时返回原始游戏数据
    let newRecord = {
      scenes: gameSceneData,
      tools: {"rabbit": 100}
    }
    await db.collection('user_data').add({
      // data 是将要被插入到 score 集合的 JSON 对象
      data: {
        _id: docId,
        _openid: event.userInfo.openId,
        scenes: [],
        tools: {"rabbit": 100},
        updateTime: 1,
      }
    })

    return {
      success: true,
      data: {
        ...newRecord,
        serverTime: Date.now()
      }
    }
  }
}
