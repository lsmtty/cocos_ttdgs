// 抓捕怪兽 主场景
import constant from './utils/constant'
import { App } from './utils/app';
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
    refreshMask: {
      default: null,
      type: cc.Node
    },
    cardPrefab: {
      default: null,
      type: cc.Prefab
    },
  },

  // use this for initialization
  onLoad: function () {
    App.adjustScreen(this.node);
    this.init();
  },

  init() {
    this.serverTime = Date.now()
    this.serverTimeGap = 0

    App.login();
    this.initGameData()
    this.initSceneData()
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
    this.cardParent.getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
  },
  showRefreshInterval() {
    this.refreshMask.getComponent('refreshMask').show()
  },
  saveMonster(sceneId, monsterId) {
    const { scenes } = this.gameData.result.data
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
    cc.sys.localStorage.setItem('monsterData', JSON.stringify(this.gameData))
  },
  getMonsterData(sceneId, monsterId) {
    const { scenes } = this.gameData.result.data
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
    let gameData = cc.sys.localStorage.getItem('gameData')
    if (!gameData || (constant.isDebug && constant.needRefreshStorage)) {
      gameData = require('./mockData/gameData')
      cc.sys.localStorage.setItem('monsterData', JSON.stringify(gameData))
    } else {
      gameData = JSON.parse(gameData)
    }
    this.gameData = gameData
  },
  initSceneData() {
    const { sceneId } = App.getSceneParams('catchmonster') || { sceneId: '1' }
    this.monsterParent.getComponent('monsterParent').sceneId = sceneId
    const bgLoadUrl = `background/bg_scene${sceneId}`
    const showLoadUrl = `background_shadow/shadow_scene${sceneId}`
    cc.loader.loadRes(bgLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
    cc.loader.loadRes(showLoadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      cc.find('Canvas/background/bg_shadow').getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
    let card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-291, -387))
    this.cardParent = card
    this.node.addChild(this.cardParent)
  },

  // 供其他组件调用的公共函数

  // 游戏数据封装

  _setGameData(newGameData) {
    this.gameData = newGameData;
    cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData))
  },

  _getGameData() {
    return this.gameData;
  }
})
