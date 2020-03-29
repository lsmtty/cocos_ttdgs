// 唯一的游戏控制主类,以后整理到根目录，根目录的情景js分别
import request from './request'
import constant from './constant'

class AppMain {
  constructor() {
    this.globalData = {
      isEnter: true,
      appId: '',
      openId: '',
      gameData: {}, // 云端请求gameData
      userInfo: {},
      resoureMap: new Map(),
      serverTime: 0,
      launchOptions: {},
      serverTimeGap: 0,
      getedDayRabbit: false  // 是否登录领取了萝卜
    }
    this.setIsEnter = this.setIsEnter.bind(this)
    this.getIsEnter = this.getIsEnter.bind(this)
    this.setGameData = this.setGameData.bind(this)
    this.getGameData = this.getGameData.bind(this)
    this.setServerTime = this.setServerTime.bind(this)
    this.getRealTime = this.getRealTime.bind(this)
    this.getOpenId = this.getOpenId.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.setLaunchOptions = this.setLaunchOptions.bind(this)
    this.getLaunchOptions = this.getLaunchOptions.bind(this)
  }

  setIsEnter(value) {
    this.globalData.isEnter = value
  }

  getIsEnter() {
    return this.globalData.isEnter
  }

  setLoginGetRabbitStatus(status) {
    this.globalData.getedDayRabbit = status
  }

  getLoginGetRabbitStatus() {
    return this.globalData.getedDayRabbit;
  }

  setGameData = (gameData) => {
    this.globalData.gameData = gameData
    cc.sys.localStorage.setItem('monsterData', JSON.stringify(gameData))
  }

  getGameData = () => {
    return this.globalData.gameData
  }

  getOpenId = () => {
    return this.globalData.openId
  }

  setUserInfo = (userInfo) => {
    this.globalData.userInfo = userInfo;
  }

  getUserInfo = () => {
    return this.globalData.userInfo;
  }

  setLaunchOptions = () => {
    return this.globalData.launchOptions;
  }

  getLaunchOptions = (launchOptions) => {
    this.globalData.launchOptions = launchOptions;
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
    
    let lastGetRabbitDate = cc.sys.localStorage.getItem('lastGetRabbitDate');
    if (lastGetRabbitDate && lastGetRabbitDate == new Date().getDate()) {
      this.globalData.getedDayRabbit = true
    } else {
      this.globalData.getedDayRabbit = false
    }
    // 
    request.login()
      .then((res) => {
        this.globalData.openId = res.openid;
        // request.getUserInfo().then(data => {
        //   console.log('userInfo', data)
        //   this.globalData.userInfo = data
        // })

        request.getUserGameData().then(data => {
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

  getResourceRealUrlArray(fileIdArrays) {
    const { resoureMap } = this.globalData
    let targetFileUrlArrays = []
    let requestIds = [];
    if(Array.isArray(fileIdArrays)) {
      fileIdArrays.forEach(fileIDItem => {
        if(resoureMap.has(fileIDItem)) {
          targetFileUrlArrays.push(resoureMap.get(fileIDItem));
        } else {
          requestIds.push(fileIDItem);
        }
      });
      return new Promise((resolve, reject) => {
        typeof wx != 'undefined' && wx.cloud.getTempFileURL({
          fileList: requestIds,
          success: res => {
            if (res.errMsg = 'cloud.getTempFileURL:ok') {
              const { fileList } = res
              fileList.forEach((fileItem) => {
                const { fileID, tempFileURL } = fileItem;
                resoureMap.set(fileID, tempFileURL);
                targetFileUrlArrays.push(tempFileURL);
              });
              resolve(fileList);
            } else {
              reject(res.errMsg)
            }
          },
          fail: err => {
            reject(err)
          }
        })
      })
    } else {
      Promise.resolve(targetFileUrlArrays);
    }
  }

  getResourceRealUrl(fileID) {
    const { resoureMap } = this.globalData
    const targetFileUrl = resoureMap.get(fileID)
    return new Promise((resolve, reject) => {
      if (targetFileUrl) {
        resolve(targetFileUrl)
        return;
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

  throttle(func, wait) {
    var context, args;
    var previous = 0;

    return function() {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
  }
}

export const App = new AppMain()
