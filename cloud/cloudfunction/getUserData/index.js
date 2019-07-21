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
    // 返回用户记录
    return {
      data: userRecord
    }

  } else {
    // 创建新的用户记录
    return {
      data: null
    }
  }
}
