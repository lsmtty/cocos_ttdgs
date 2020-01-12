/*
  调用
  wx.cloud.callFunction({
    name: 'receiveMonster',
    data: {
      openId: {发送方的openid},
      sceneId: {monsterId},
      monsterId: {monsterId},
      shareId: {shareId}
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

// 云函数入口函数
exports.main = async (event, context) => {
  const docId = `${event.userInfo.openId}-data`, monsterId = event.monsterId, senderId = `${event.openId}-data`, sceneId = event.sceneId
  let return_data = {
    success: false,
    data: 'init'
  }
  let shareId = event.shareId
  let shareId_data
  try {
    shareId_data = await db.collection('share_data').doc(shareId).get()
  } catch (err) {
    return_data.data = err
    return return_data
  }
  if (shareId_data) {
    await db.collection('share_data').doc(shareId).remove()
  }
  let sender_data = await db.collection('user_data').doc(senderId).get()
  let user_data = await db.collection('user_data').doc(docId).get()
  if (user_data.errCode || sender_data.errCode) {
    return_data.data = user_data.errCode || sender_data.errCode
    return return_data
  }

  let { scenes } = sender_data.data
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
      monster.own--
    }
  })
  if (hasMonster) {
    let senderUpdate = await db.collection('user_data').doc(senderId).update({
      data: {
        scenes
      },
      success () {
        // receive
        let log = user_data.data.log || []
        log.push({
          type: 'RECEIVE_MONSTER',
          data: `recerve a monster. scene:${sceneId}, monster:${monsterId}, from: ${senderId}`,
          time: new Date(),
        })
        let user_scenes = user_data.data.scenes
        let user_targetScene = {}
        let user_hasMonster = false
        user_scenes.forEach(scene => {
          if (scene.id === `scene${sceneId}`) {
            user_targetScene = scene
          }
        })
        user_targetScene.monsters.forEach(monster => {
          if (monster.id == `s${sceneId}_monster${monsterId}`) {
            monster.own++
          }
        })
        let receiveUpdate = db.collection('user_data').doc(docId).update({
          data: {
            scenes: user_scenes,
            log
          }
        })
        return_data.success = true
      }
    })
  }
  return return_data
}