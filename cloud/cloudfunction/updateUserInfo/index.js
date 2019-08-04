// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const docId = `${event.userInfo.openId}`
  
  let userRecord

  try {
    const queryResult = await db.collection('user_info').doc(docId).get()
    userRecord = queryResult.data
  } catch (err) {
    // 用户第一次保存用户信息
  }

  if (userRecord) {
    // 更新用户身份信息

    let nickName = event.nickName || userRecord.nickName
    let avatarUrl = event.avatarUrl || userRecord.avatarUrl
    let lastLoginTime = event.lastLoginTime || userRecord.lastLoginTime || Date().now()
    let gender = event.gender || userRecord.gender

    const updateResult = await db.collection('user_info').doc(docId).update({
      data: {
        updateTime: _.inc(1),
        nickName,
        avatarUrl,
        gender,
        lastLoginTime,
      }
    })

    if (updateResult.stats.updated === 0) {
      // 没有更新成功，更新数为 0
      return {
        success: false,
        servertime: Date.now()
      }
    } else {
      return {
        success: true,
        updated: true,
        servertime: Date.now()
      }
    }
  } else {
    // 创建新的用户记录
   await db.collection('user_info').add({
     // data 是将要被插入到 score 集合的 JSON 对象
     data: {
       _id: docId,
       _openid: event.userInfo.openId,
       niceName: event.nickName || '',
       avatarUrl: event.avatarUrl || '',
       lastLoginTime: Date.now(),
       gender: event.gender,
       updateTime: 1,
     }
   })

   return {
     success: true,
     updated: true,
     servertime: Date.now()
   }
 }
}