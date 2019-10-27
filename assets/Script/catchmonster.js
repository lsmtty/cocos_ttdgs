// 抓捕怪兽 主场景
import constant from './utils/constant'
import { App } from './utils/App'
import request from './utils/request'
import { resolve } from 'path'

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
    }
  },

  // use this for initialization
  onLoad: function () {
    App.adjustScreen(this.node)
    this.init()
  },

  init() {
    App.login()
    this.initSceneData()
    if (App.getIsEnter()) {
      this.initShareData()
      App.setIsEnter(false)
    }
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
    this.cardParent.getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
  },

  showSharedCard(sceneId, monsterId, senderId) {
    const root = cc.find('Canvas')
    const monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
    this.cardParent.getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
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
    let sceneId = '1'
    if (App.getSceneParams('catchmonster') && App.getSceneParams('catchmonster')['sceneId']) {
      sceneId = App.getSceneParams('catchmonster').sceneId
    } else if (cc.sys.localStorage.getItem('lastSceneId')) {
      sceneId = cc.sys.localStorage.getItem('lastSceneId')
    }
    cc.sys.localStorage.setItem('lastSceneId', sceneId);
    this.monsterParent.getComponent('monsterParent').sceneId = sceneId
    const bgLoadUrl = `background/bg_scene${sceneId}`
    const showLoadUrl = `background_shadow/shadow_scene${sceneId}`
    cc.loader.loadRes(bgLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
    cc.loader.loadRes(showLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background/bg_shadow').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
    const card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-291, -387))
    this.cardParent = card
    this.node.addChild(this.cardParent)
  },

  initShareData() {
    if (wx) {
      let launchOptions = wx.getLaunchOptionsSync()
      App.setLaunchOptions(launchOptions);
      const { scene, query } = launchOptions;
      if (query.senderId) {
        const { sceneId, monsterId, senderId } = query;
        const card = cc.instantiate(this.shareCardPrefab)
        card.setPosition(cc.v2(-381, -667))
        let monsterData = this.getMonsterData(sceneId, monsterId);
        card.getComponent('cardMask2').showCard(monsterData, senderId);
        this.node.addChild(card);
        // senderId=o4_IJ41rSf9ipugKulGmgMe49KaU&sceneId=1&monsterId=1
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
  }
})
