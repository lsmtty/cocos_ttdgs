/*
  调用
  wx.cloud.callFunction({
    name: 'getShareId',
    data: {
      shareId: {shareId},
    },
    complete: res => {
      res.success,
      shareId: {shareId}
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
  let return_data = {
    success: false,
    shareId: null,
    data: 'init',
  }
  let shareId = event.shareId
  let shareId_data
  try {
    shareId_data = await db.collection('share_data').doc(shareId).get()
  } catch (err){
    shareId_data = {}
    shareId_data.errCode = 404
    shareId_data.errMsg = err
  }
  if (shareId_data.errCode) {
    return_data.data = shareId_data.errMsg
  } else if (shareId_data) {
    return_data.success = true
    return_data.shareId = shareId
  } else {
    return_data.data = '无'
  }
  return return_data;
}

