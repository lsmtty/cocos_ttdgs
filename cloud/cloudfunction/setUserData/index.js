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

  try {
    const querResult = await db.collection('user_data').doc(docId).get()
    userRecord = querResult.data
  } catch (err) {
    // 用户第一次上传分数
  }

  if (userRecord) {
    // 更新用户分数
    // {
    //   scenes: [1,2],
    //   monsters: ["id","id"],
    //   updateTime: 1
    // }
    let uMonsters = event.monsters || [];
    let cMonsters = userRecord.monsters || [];
    let monsters = uniqueArr(uMonsters, cMonsters);
    let uScenes = event.scenes || [];
    let cScenes = userRecord.scenes || [];
    let scenes = uniqueArr(uScenes, cScenes);
    let info = event.info || "";
    const updateResult = await db.collection('user_data').doc(docId).update({
      data: {
        updateTime: _.inc(1),
        monsters,
        scenes,
        info,
      }
    })

    function uniqueArr(arr1=[], arr2=[]) {
      arr1.push(...arr2)
      return Array.from(new Set(arr1))
    }

    if (updateResult.stats.updated === 0) {
      // 没有更新成功，更新数为 0
      return {
        success: false
      }
    }

    return {
      success: true,
      updated: true
    }

  } else {
    // 创建新的用户记录
    await db.collection('user_data').add({
      // data 是将要被插入到 score 集合的 JSON 对象
      data: {
        _id: docId,
        _openid: event.userInfo.openId,
        scenes: event.scenes || [],
        monsters: event.monsters || [],
        updateTime: 1,
      }
    })

    return {
      success: true,
      created: true,
    }
  }
}
