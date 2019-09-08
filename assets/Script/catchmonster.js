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
    const card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-291, -387))
    this.cardParent = card
    this.node.addChild(this.cardParent)
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
