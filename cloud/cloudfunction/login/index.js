// 云函数入口函数
exports.main = async (event, context) => {
  return {
    success: true,
    data: {
      serverTime: Date.now(),
      openid: event.userInfo.openId,
    }
  }
}