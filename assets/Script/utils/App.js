// 唯一的游戏控制主类
import request from './request';

class AppMain {

  constructor() {
    this.globalData = {
      appId: '',
      userInfo: {}
    }
  }

  login() {
    request.login()
      .then(() => { 
        console.log('login Success'); 
        request.getUserInfo().then(data => { 
          console.log('userData', data)
          this.globalData.userInfo = data;
        }).catch(this.showUserInfoButton())
      })
      .catch(console.log('login Failed'));
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
    if(typeof wx == 'undefined') return;
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
}

export var App = new AppMain();