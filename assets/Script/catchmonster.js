// 抓捕怪兽 主场景
import constant from './utils/constant'
import { App } from './utils/App'
import request from './utils/request'

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
    refreshMask: {
      default: null,
      type: cc.Node
    },
    cardPrefab: {
      default: null,
      type: cc.Prefab
    },
    shareCardPrefab: {
      default: null,
      type: cc.Prefab
    },
    CardCommonPrefab: {
      default: null,
      type: cc.Prefab
    },
    mapBtn: {
      default: null,
      type: cc.Node
    },
    handBookBtn: {
      default: null,
      type: cc.Node
    }
  },

  onLoad: function () {
    cc.macro.ENABLE_TRANSPARENT_CANVAS = true // 开启透明通道
    cc.macro.ENABLE_CULLING = true
    App.adjustScreen(this.node)
    this.init()
    this.mapBtn.on('touchend', () => {
      cc.find('Canvas').getComponent('catchmonster').saveMonsterData()
      cc.director.loadScene('map')
    })
    this.handBookBtn.on('touchend', () => {
      cc.find('Canvas').getComponent('catchmonster').saveMonsterData()
      cc.director.loadScene('handbook')
    })
  },

  init() {
    let _this = this
    this.initSceneData()
    // 暂时注释掉获取分享怪兽的弹框
    if (App.getIsEnter()) {
      this.initShareData()
      App.setIsEnter(false)
    }
    if(!App.getLoginGetRabbitStatus()) {
      this.showRadish()
    }
    setInterval(() => {
      if (App.getRealTime() % (3600 * 1000) < 1500) {
        _this.getANewMonster('time')
        this.refreshMask.getComponent('refreshMask').hide()
      }
    }, 1000); 
  },

  showRadish() {
    const card = cc.instantiate(this.CardCommonPrefab)
    card.setPosition(cc.v2(-375, -667))
    this.node.addChild(card)
    // let script = card.getComponent('cardParent3_box')
    // script.handleBtnClick = function() {
    //   request.updateTools({ toolsName: 'rabbit',  toolsCount: 3}).then(() => {
    //     let gameData = App.getGameData()
    //     gameData.tools.rabbit += 3
    //     App.setGameData(gameData)
    //     script.close()
    //   })
    // }
  },

  catchedMonster() {
    this.node.getChildByName('monsterBox')
  },

  getANewMonster(type = 'time') {
    cc.find('Canvas/background/monsterBox').getComponent('monsterParent').refreshNew(type)
  },

  showCard(sceneId, monsterId) {
    const root = cc.find('Canvas')
    const monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
    this.cardParent.getChildByName('cardMask').getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
    // 暂时清除缓存项目
    let lastMonsterData = cc.sys.localStorage.getItem('lastMonsterData')
    lastMonsterData[sceneId].currentBlood = 0
    cc.sys.localStorage.setItem('lastMonsterData', lastMonsterData)
  },

  showSharedCard(sceneId, monsterId, senderId) {
    const root = cc.find('Canvas')
    const monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
    this.cardParent.getChildByName('cardMask').getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
  },
  showRefreshInterval() {
    this.refreshMask.getComponent('refreshMask').show()
  },
  saveMonster(sceneId, monsterId) {
    // todo 保存到云端， 并更新本地
    request.catchMonster({
      sceneId, monsterId
    }).then((data) => {
      const { scenes } = App.getGameData()
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
    })
  },
  getMonsterData(sceneId, monsterId) {
    const { scenes } = App.getGameData()
    let targetScene = {}
    scenes.forEach(scene => {
      if (scene.id === `scene${sceneId}`) {
        targetScene = scene
      }
    })
    let targetMonster = {}
    const targetId = `s${sceneId}_monster${monsterId}`
     if (targetScene && targetScene.monsters && targetScene.monsters.length) {
      targetScene.monsters.forEach(monster => {
        if (monster.id == targetId) {
          targetMonster = monster
        }
      })
     } else {
       return false;
     }
    return {
      blood: targetMonster.life,
      name: targetMonster.name,
      own: targetMonster.own,
      sceneId,
      monsterId
    }
  },
  initSceneData() {
    let sceneId = cc.sys.localStorage.getItem('lastSceneId') || '1' 
    this.monsterParent.getComponent('monsterParent').sceneId = sceneId
    App.getResourceRealUrl(`cloud://ttdgs-test-c6724c.7474-ttdgs-test-c6724c-1257970977/images/maps/background/bg_scene${sceneId}.jpg`)
    .then(url => {
      cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
        const sframe = new cc.SpriteFrame(texture)
        cc.find('Canvas/bg').getComponent(cc.Sprite).spriteFrame = sframe
      })
    })
    App.getResourceRealUrl(`cloud://ttdgs-test-c6724c.7474-ttdgs-test-c6724c-1257970977/images/maps/background_shadow/shadow_scene${sceneId}.png`)
    .then(url => {
      cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
        const sframe = new cc.SpriteFrame(texture)
        cc.find('Canvas/bg_shadow').getComponent(cc.Sprite).spriteFrame = sframe
      })
    })
    const card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-375, -667))
    this.cardParent = card
    card.active = false
    this.node.addChild(this.cardParent)
  },

  initShareData() {
    if (typeof wx != 'undefined') {
      let launchOptions = wx.getLaunchOptionsSync()
      App.setLaunchOptions(launchOptions)
      const { scene, query } = launchOptions
      if (query.senderId && query.shareId) {
        const { sceneId, monsterId, senderId, shareId } = query
        request.getShareId({sceneId, shareId}).then(() => {
          const card = cc.instantiate(this.shareCardPrefab)
          card.setPosition(cc.v2(-375, -667))
          let monsterData = this.getMonsterData(sceneId, monsterId);
          card.getComponent('cardMask2').showCard(monsterData, senderId, shareId)
          this.node.addChild(card);
        }).catch(() => {
          wx && wx.showToast({
            title: '怪兽已被领取',
            icon: 'none',
            duration: 3000
          })
        });
        // senderId=o4_IJ4_ff7krEskbdQnrwJj-dxSw&sceneId=10&monsterId=7&shareId=o4_IJ4_ff7krEskbdQnrwJj-dxSw_6_1580996847466
      }
    } 
  },

  saveMonsterData() {
    cc.find('Canvas/background/monsterBox').getComponent('monsterParent').saveMonsterData()
  },

  // 供其他组件调用的公共函数

  // 游戏数据封装

  _setGameData(newGameData) {
    App.setGameData(newGameData)
  },

  _getGameData() {
    return App.getGameData()
  },

  // 整点刷怪
  _refreshByTime() {
    // 刷新当前关卡怪，清除所有其他关卡怪的缓存
  }
})
