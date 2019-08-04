// 服务器的每个返回应该都要带时间戳 serverTime

import api from './api'

const getServerTime = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Date.now())
    }, 100)
  })
}

const wxLogin = () => {
  return solveRequest(api.login);
}

const updateUserInfo = (data) => {
  return solveRequest(api.updateUserInfo, data);
}

const getUserInfo = () => {
  return solveRequest(api.getUserInfo);
}

const solveRequest = (url, data = {}) => {
  let _this = this
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: url,
      // 传递给云函数的参数
      data,
      success: res => {
        _this && (_this.serverTime = res.result.serverTime) // 统一封装绑定serverTime
        if (res.errMsg == 'cloud.callFunction:ok' && (res.result && res.result.success)) {
          resolve(res.result.data)
        } else {
          reject(res)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  }) 
}

export default {
  getServerTime,
  updateUserInfo,
  solveRequest,
  login: wxLogin,
  getUserInfo
}