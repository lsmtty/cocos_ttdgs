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
    let toolName = event.toolsName
    let changeCount = event.toolsCount // 正为 加 ，负为减少
    let { scenes: userTools } = userRecord

    if (userTools[toolName]) {
      if (changeCount >= 0) {
        userTools[toolName] += changeCount
      } else {
        let currentCount = userTools[toolName] + changeCount
        if (currentCount < 0) {
          return {
            success: false,
            data: {
              message: '道具不足',
              serverTime: Date.now()
            }
          }
        } else {
          userTools[toolName] = currentCount
        }
      }
    } else {
      // 没有这种道具
      if (changeCount >= 0) {
        userTools[toolName] = changeCount
      } else {
        return {
          success: false,
          data: {
            message: '道具不足',
            serverTime: Date.now()
          }
        }
      }
    }
    
    await db.collection('user_data').doc(docId).update({
      data: {
        tools: userTools
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