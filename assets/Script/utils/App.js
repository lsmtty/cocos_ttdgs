// 唯一的游戏控制主类,以后整理到根目录，根目录的情景js分别
import request from './request'
import { setInterval } from 'timers';
import constant from './constant'

class AppMain {
  constructor() {
    this.globalData = {
      appId: '',
      gameData: {}, // 云端请求gameData
      userInfo: {},
      resoureMap: new Map(),
      serverTime: 0,
      serverTimeGap: 0
    }
    this.setGameData = this.setGameData.bind(this)
    this.getGameData = this.getGameData.bind(this)
  }

  setGameData = (gameData) => {
    this.globalData.gameData = gameData
    cc.sys.localStorage.setItem('monsterData', JSON.stringify(gameData))
  }

  getGameData = () => {
    return this.globalData.gameData
  }

  setServerTime = (serverTime) => {
    this.globalData.serverTime = serverTime;
    this.globalData.serverTimeGap = Date.now() - serverTime;
  }

  getRealTime = () => {
    return Date.now() - this.globalData.serverTimeGap
  }

  /**
   * 负责获取用户个人信息 和 游戏数据
   */
  login() {
    // 使用缓存数据 避免数据开始未同步时出错
    let gameData = cc.sys.localStorage.getItem('gameData')
    if (!gameData || (constant.isDebug && constant.needRefreshStorage)) {
      gameData = require('../mockData/gameData')
      cc.sys.localStorage.setItem('monsterData', JSON.stringify(gameData))
    } else {
      gameData = JSON.parse(gameData)
    }
    this.setGameData(gameData.result.data)

    // 
    request.login()
      .then(() => {
        console.log('login Success')
        request.getUserInfo().then(data => {
          console.log('userInfo', data)
          this.globalData.userInfo = data
        }).catch(this.showUserInfoButton)

        request.getUserGameData().then(data => {
          console.log('userGameData', data)
          this.setGameData(data)
        }).catch(() => {
          console.log('获取用户数据失败');
        })
      })
      .catch(() => {
        console.log('login Failed')
      }
    )
  }

  // 功能相关

  adjustScreen(rootNode) {
    const c = rootNode.getComponent(cc.Canvas)
    c.fitHeight = true
    c.fitWidth = false

    const h = 750 * cc.winSize.height / cc.winSize.width

    c.designResolution = new cc.Size(750, h)
    rootNode.setContentSize(750, h)

    // 适配解决方案
    const _canvas = cc.Canvas.instance
    // 设计分辨率比
    const _rateR = _canvas.designResolution.height / _canvas.designResolution.width
    // 显示分辨率比
    const _rateV = cc.winSize.height / cc.winSize.width
    if (_rateV > _rateR) {
      _canvas.fitHeight = false
      _canvas.fitWidth = true
    } else {
      _canvas.fitHeight = true
      _canvas.fitWidth = false
    }
  }

  showUserInfoButton() {
    if (typeof wx == 'undefined') return
    const button = wx.createUserInfoButton({
      type: 'text',
      text: '获取用户信息',
      style: {
        left: 175,
        top: 76,
        width: 200,
        height: 40,
        lineHeight: 40,
        backgroundColor: '#ff0000',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 4
      }
    })
    button.show()
    button.onTap((res) => {
      if (res.errMsg == 'getUserInfo:ok') {
        const { userInfo } = res
        const { nickName, gender, avatarUrl } = userInfo

        request.updateUserInfo({
          nickName,
          gender,
          avatarUrl
        }).then(() => { button.hide() }).catch(() => { button.show() })
      }
    })
  }

  // 进入情景
  ttdgsLoadScene(sceneName, params) {
    const tempNode = new cc.Node()
    tempNode.name = sceneName
    tempNode.paramsData = params
    cc.game.addPersistRootNode(tempNode)
    cc.director.loadScene(sceneName)
  }

  // 进入情景
  getSceneParams(sceneName) {
    const tempNode = cc.find(sceneName)
    if (tempNode) {
      const targetData = tempNode.paramsData
      cc.game.removePersistRootNode(tempNode)
      return targetData
    } else {
      return null
    }
  }

  getResourceRealUrl(fileID) {
    const { resoureMap } = this.globalData
    const targetFileUrl = resoureMap.get(fileID)
    return new Promise((resolve, reject) => {
      if (targetFileUrl) {
        resolve(targetFileUrl)
      }
      typeof wx != 'undefined' && wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: res => {
          if (res.errMsg = 'cloud.getTempFileURL:ok') {
            const targetFile = res.fileList[0]
            if (targetFile.tempFileURL) {
              resoureMap.set(fileID, res.fileList[0].tempFileURL)
              resolve(res.fileList[0].tempFileURL)
            } else {
              reject('Image Not Found')
            }
          } else {
            reject(res.errMsg)
          }
        },
        fail: err => {
          console.error()
          reject(err)
        }
      })
    })
  }
}

export var App = new AppMain()
