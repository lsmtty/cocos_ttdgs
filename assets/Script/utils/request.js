// 服务器的每个返回应该都要带时间戳 serverTime

import api from './api'
import { App } from './app'

const wxLogin = () => {
  return solveRequest(api.login)
}

const updateUserInfo = (data) => {
  return solveRequest(api.updateUserInfo, data)
}

const getUserInfo = (data) => {
  return solveRequest(api.getUserInfo, data)
}

const sendMonster = (data) => {
  return solveRequest(api.sendMonster, data);
}

const receiveMonster = (data) => {
  return solveRequest(api.receiveMonster, data);
}

const getUserGameData = () => {
  return solveRequest(api.getUserGameData)
}

/**
 * 捕获一个怪兽
 * @param {data} { sceneId, monsterId} 
 */
const catchMonster = (data) => {
  return solveRequest(api.catchMonster, data);
}

/**
 * 更新消耗道具
 * @param {data} { 消耗品名称, 数量}  例子: { 'rabbit', - 1}
 */
const updateTools = (data) => {
  return solveRequest(api.updateTools, data);
}

const solveRequest = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    typeof wx != 'undefined' && wx.cloud.callFunction({
      // 要调用的云函数名称
      name: url,
      // 传递给云函数的参数
      data
    }).then(res => {
      if (res.errMsg == 'cloud.callFunction:ok' && (res.result && res.result.success)) {
        if (res.result.data && res.result.data.serverTime) {
          App.setServerTime(res.result.data.serverTime);
        }
        resolve(res.result.data)
      } else {
        reject(res)
      }
    }).catch(err => reject(err))
  })
}

export default {
  updateUserInfo,
  solveRequest,
  login: wxLogin,
  getUserInfo,
  getUserGameData,
  catchMonster,
  sendMonster,
  receiveMonster,
  updateTools
}
