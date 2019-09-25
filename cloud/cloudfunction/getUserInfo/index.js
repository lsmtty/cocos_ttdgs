// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let docId = ''
  if (event.openId) {
    docId = `${event.openId}`
  } else {
    docId = `${event.userInfo.openId}`
  }
  let userInfo

  try {
    const queryResult = await db.collection('user_info').doc(docId).get()
    userRecord = queryResult.data
  } catch (err) {
    // 没有查到用户信息
  }

  if (userRecord) {
    return {
      success: true,
      data: Object.assign(userRecord, { serverTime: Date.now()})
    }
  } else {
    return {
      success: false,
      data: {}
    }
  }
}