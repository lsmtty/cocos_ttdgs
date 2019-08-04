// 抓捕怪兽 主场景
import * as constant from './utils/constant'
import globalUtil from '../Script/utils/globalUtil'
import request from './utils/request';
import { resolve } from 'path';
cc.Class({
  extends: cc.Component,

  properties: {
    rowParent: {
      default: null,
      type: cc.Node
    },
    monsterParent: {
      default: null,
      type: cc.Node
    },
    cardParent: {
      default: null,
      type: cc.Node
    },
    refreshMask: {
      default: null,
      type: cc.Node
    }
  },

  // use this for initialization
  onLoad: function () {
    this.initGameData()
    this.initSceneData()
    const c = this.node.getComponent(cc.Canvas)
    c.fitHeight = true
    c.fitWidth = false

    const h = 750 * cc.winSize.height / cc.winSize.width

    c.designResolution = new cc.Size(750, h)
    this.node.setContentSize(750, h)

    // 适配解决方案
    const _canvas = cc.Canvas.instance
    // 设计分辨率比
    const _rateR = _canvas.designResolution.height / _canvas.designResolution.width
    // 显示分辨率比
    const _rateV = cc.winSize.height / cc.winSize.width
    console.log('winSize: rateR: ' + _rateR + ' rateV: ' + _rateV)
    if (_rateV > _rateR) {
      _canvas.fitHeight = false
      _canvas.fitWidth = true
    } else {
      _canvas.fitHeight = true
      _canvas.fitWidth = false
    }
    this.monsterParent = this.node.getChildByName('monsterBox')

    this.serverTime = Date.now()
    this.serverTimeGap = 0
    this.getUserData()
    this.login()
    this.schedule(() => {
      if ((Date.now() + this.serverTimeGap) % (3600 * 1000) < 1500) {
        this.getANewMonster()
      }
    }, 1000, Infinity)
  },

  adjustTime() {
    request.getServerTime((res) => {
      this.serverTime = res
      this.serverTimeGap = this.serverTime - Date.now() // 默认服务器时间大于本地时间
    })
  },

  catchedMonster() {
    this.node.getChildByName('monsterBox')
  },

  getANewMonster() {
    cc.find('Canvas/background/monsterBox').getComponent('monsterParent').refreshNew()
  },

  showCard(sceneId, monsterId) {
    const root = cc.find('Canvas')
    const monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
    this.cardParent.getComponent('cardParent').showCard(monsterData)
  },
  showRefreshInterval() {
    this.refreshMask.getComponent('refreshMask').show()
  },
  saveMonster(sceneId, monsterId) {
    const { scenes } = this.monsterData.result.data
    let targetScene = {}
    scenes.forEach(scene => {
      if (scene.id === `scene${sceneId}`) {
        targetScene = scene
      }
    })
    targetScene.monsters.forEach(monster => {
      if (monster.id == `s${sceneId}_monster${monsterId}`) {
        monster.own++
      }
    })
    cc.sys.localStorage.setItem('monsterData', JSON.stringify(this.monsterData))
  },
  getMonsterData(sceneId, monsterId) {
    const { scenes } = this.monsterData.result.data
    let targetScene = {}
    scenes.forEach(scene => {
      if (scene.id === `scene${sceneId}`) {
        targetScene = scene
      }
    })
    let targetMonster = {}
    const targetId = `s${sceneId}_monster${monsterId}`
    targetScene.monsters.forEach(monster => {
      if (monster.id == targetId) {
        targetMonster = monster
      }
    })
    return {
      blood: targetMonster.life,
      name: targetMonster.name,
      own: targetMonster.own,
      sceneId,
      monsterId
    }
  },
  initGameData() {
    let monsterData = cc.sys.localStorage.getItem('monsterData')
    if (!monsterData || (constant.isDebug && constant.needRefreshStorage)) {
      monsterData = require('./mockData/gameData')
      cc.sys.localStorage.setItem('monsterData', JSON.stringify(monsterData))
    } else {
      monsterData = JSON.parse(monsterData)
    }
    this.monsterData = monsterData
  },
  initSceneData() {
    const { sceneId } = globalUtil.getSceneParams('catchmonster') || { sceneId: '1' }
    this.monsterParent.getComponent('monsterParent').sceneId = sceneId
    const bgLoadUrl = `background/bg_scene${sceneId}`
    const showLoadUrl = `background_shadow/shadow_scene${sceneId}`
    cc.loader.loadRes(bgLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
    cc.loader.loadRes(showLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background/bg_shadow').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
  },
  login() {
    request.login()
      .then(() => { 
        console.log('login Success'); 
        request.getUserInfo().then((data) => { console.log('userData', data)}).catch(() => { this.showUserInfoButton()})
      })
      .catch(() => {console.log('login Failed');});
  },
  getUserData() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getUserData',
      // 传递给云函数的参数
      data: {
        x: 1,
        y: 2,
      },
      success: res => {
        console.log('getUserData', res)
        // output: res.result === 3
      },
      fail: err => {
        // handle error
      },
      complete: () => {
        // ...
      }
    })
  },
  showUserInfoButton() {
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
})
