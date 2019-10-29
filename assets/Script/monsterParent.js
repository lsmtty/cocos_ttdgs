import mathUtil from './utils/mathUtil'
import { App } from '../Script/utils/App'
import constant from '../Script/utils/constant'
cc.Class({
  extends: cc.Component,

  properties: {
    sceneId: {
      default: 1,
      type: cc.Integer
    },
    monsterId: {
      default: 1,
      type: cc.Integer
    },
    monster: {
      default: null,
      type: cc.Node
    },
    blood: {
      default: null,
      type: cc.Node
    },
    blooding: {
      default: null,
      type: cc.Node
    }
  },

  onLoad () {
    this.refreshNew(true)
    const bloodCtx = this.node.getChildByName('bloodParent').getComponent(cc.Graphics)
    bloodCtx.fillColor = new cc.Color(255, 255, 255)
    bloodCtx.roundRect(-105, -17, 210, 34, 17)
    bloodCtx.fill()
    bloodCtx.fillColor = new cc.Color().fromHEX('#d8d8d8')
    bloodCtx.roundRect(-100, -12, 200, 24, 12)
    bloodCtx.fill()
  },

  randomRun() {
    var originMoveSpeed = 90
    const monsterScript = this.monster.getComponent('monster')
    const { fullBlood, currentBlood }  = monsterScript
    // originMoveSpeed *= 1 / (currentBlood / fullBlood )
    var timer = 0.5
    const minX = Math.max(50 + originMoveSpeed, this.node.x - originMoveSpeed)
    const maxX = Math.min(750 - 50 - originMoveSpeed, this.node.x + originMoveSpeed)
    const minY = Math.max(672, this.node.y - originMoveSpeed)
    const maxY = Math.min(672 + 300, this.node.y + originMoveSpeed)
    const moveAction = cc.moveTo(timer * currentBlood / fullBlood, cc.v2(mathUtil.getRandom(minX, maxX), mathUtil.getRandom(minY, maxY)))
    const callback = cc.callFunc(this.randomRun, this)
    this.node.runAction(cc.sequence(moveAction, callback))
  },

  monsterCatched() {
    this.stopRun()
    // 🏹停止射击
    this.node.parent.getChildByName('弓箭按钮@2x').getComponent('rowParent').validShoot = false
    // 记录捕捉了怪兽
    // const root = cc.find('Canvas')
    // root.getComponent('catchmonster').saveMonster(this.sceneId, this.monsterId)
  },

  // 停止走动
  stopRun() {
    this.node.stopAllActions()
  },

  hurt(damage) {
    const bleedingAnim = this.blooding.getComponent(cc.Animation)
    bleedingAnim.play('blooding')
    const bloodNode = new cc.Node('blood node')
    const bloodLabel = bloodNode.addComponent(cc.Label)
    const outline = bloodNode.addComponent(cc.LabelOutline)
    outline.color = new cc.color(255, 255, 255)
    outline.width = 4
    bloodLabel.fontSize = 42
    bloodLabel.string = '-' + damage
    bloodNode.color = cc.color(255, 85, 85)
    bloodNode.parent = this.node
    bloodNode.y = 170

    const moveAction = cc.moveTo.call(bloodNode, 0.5, cc.v2(0, 260))
    const fadeAction = cc.fadeOut(0.5)
    const callback = cc.callFunc(() => {
      bloodNode.destroy()
    }, this)
    bloodNode.runAction(fadeAction)
    bloodNode.runAction(cc.sequence(moveAction, callback))
  },

  refreshNew(useStorage = false) {
    this.node.active = true
    // 使用缓存中的上一个怪物

    let storageLastMonster = cc.sys.localStorage.getItem('lastMonsterData')
    let currentBlood = 100

    if (useStorage && storageLastMonster && storageLastMonster[this.sceneId]) {
      // 大于24 小时就更新
      if((App.getRealTime() - storageLastMonster[this.sceneId].refreshTime) <  24 * 60 * 60 * 100) {
        this.monsterId = storageLastMonster[this.sceneId].monsterId || storageLastMonster[this.sceneId]
        currentBlood =  storageLastMonster[this.sceneId].currentBlood || 100
      } else {
        this.monsterId =  mathUtil.getRandomNum(8)
      }
    } else {
      this.monsterId =  mathUtil.getRandomNum(8)
    }
    this.monster.monsterId = this.monsterId
    const monsterData = cc.find('Canvas').getComponent('catchmonster').getMonsterData(this.sceneId, this.monsterId)
    if (!monsterData) {
      return;
    }
    const monsterScript = this.monster.getComponent('monster')
    monsterScript.fullBlood = monsterData.blood
    monsterScript.currentBlood = currentBlood
    monsterScript.refreshNew()
    App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${this.sceneId}/s${this.sceneId}_monster${this.monsterId}.png`)
      .then(url => {
        cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
          const fra = this.monster.getComponent(cc.Sprite)
          const sframe = new cc.SpriteFrame(texture)
          fra.spriteFrame = sframe
        })
      })
    this.randomRun()

    // 让弓箭继续可以射击
    this.node.parent.getChildByName('弓箭按钮@2x').getComponent('rowParent').validShoot = true

    // 缓存中保存这个怪兽

    this.saveMonsterData()
  },
  showCard() {
    this.node.stopAllActions()
    const root = cc.find('Canvas')
    root.getComponent('catchmonster').showCard(this.sceneId, this.monsterId)
  },
  saveMonsterData() {
    let storageLastMonster = cc.sys.localStorage.getItem('lastMonsterData') 
    if(!storageLastMonster) {
      storageLastMonster = {}
    }
    const monsterScript = this.monster.getComponent('monster')
    storageLastMonster[this.sceneId] =  {
      monsterId: this.monsterId,
      currentBlood: monsterScript.currentBlood,
      refreshTime: App.getRealTime()
    }
    cc.sys.localStorage.setItem('lastMonsterData', storageLastMonster)
  }
})
