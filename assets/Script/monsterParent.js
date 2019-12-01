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
    }
  },

  onLoad () {
    console.log('onload')
    this.refreshNew('load')
    const bloodCtx = this.node.getChildByName('bloodParent').getComponent(cc.Graphics)
    bloodCtx.fillColor = new cc.Color(255, 255, 255)
    bloodCtx.roundRect(-105, -17, 210, 34, 17)
    bloodCtx.fill()
    bloodCtx.fillColor = new cc.Color().fromHEX('#d8d8d8')
    bloodCtx.roundRect(-100, -12, 200, 24, 12)
    bloodCtx.fill()
    this.blooding = cc.find("blooding", this.node)
  },

  randomRun() {
    let originMoveSpeed = 90
    const monsterScript = this.monster.getComponent('monster')
    const { fullBlood, currentBlood }  = monsterScript
    // originMoveSpeed *= 1 / (currentBlood / fullBlood )
    let timer = 0.5
    const minX = Math.max(50 + originMoveSpeed, this.node.x - originMoveSpeed)
    const maxX = Math.min(750 - 50 - originMoveSpeed, this.node.x + originMoveSpeed)
    const minY = Math.max(750, this.node.y - originMoveSpeed)
    const maxY = Math.min(750 + 300, this.node.y + originMoveSpeed)
    const moveAction = cc.moveTo(timer * currentBlood / fullBlood, cc.v2(mathUtil.getRandom(minX, maxX), mathUtil.getRandom(minY, maxY)))
    const callback = cc.callFunc(this.randomRun, this)
    this.node.runAction(cc.sequence(moveAction, callback))
  },

  monsterCatched() {
    this.stopRun()
  },

  // 停止走动
  stopRun() {
    this.node.stopAllActions()
  },

  hurt(damage) {
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
    this.blooding = cc.find("blooding", this.node)
  },

  /**
   * 刷新类型 
   * @param {string} type  load:初始化 time： 到时刷新 refresh: 手动刷新 default: 不刷新，载入缓存
   */
  // refreshNew(useStorage = false) {
  //   this.node.active = true
  //   // 使用缓存中的上一个怪物

  //   let storageLastMonster = cc.sys.localStorage.getItem('lastMonsterData')
  //   let currentBlood = 100

  //   if (useStorage && storageLastMonster && storageLastMonster[this.sceneId]) {
  //     // 大于24 小时就更新
  //     const { isFreshing = false, refreshTime, monsterId, currentBlood: lastCurrentBlood } = storageLastMonster[this.sceneId]
  //     if (isFreshing) {
  //       setTimeout(() => {
  //         cc.find('Canvas').getComponent('catchmonster').showRefreshInterval()
  //       }, 0);
  //       this.node.active = false
  //       return;
  //     }
  //     if((App.getRealTime() - refreshTime) <  60 * 60 * 1000) {
  //       this.monsterId = monsterId || 1 // 给了默认的id和 血量 此处可能有bug 
  //       currentBlood =  lastCurrentBlood || 100
  //     } else {
  //       this.monsterId =  mathUtil.getRandomNum(8)
  //     }
  //   } else {
  //     this.monsterId =  mathUtil.getRandomNum(8)
  //   }
  //   this.monster.monsterId = this.monsterId
  //   const monsterData = cc.find('Canvas').getComponent('catchmonster').getMonsterData(this.sceneId, this.monsterId)
  //   const monsterScript = this.monster.getComponent('monster')
  //   monsterScript.fullBlood = monsterData.blood
  //   monsterScript.currentBlood = currentBlood
  //   monsterScript.refreshNew()
  //   App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${this.sceneId}/s${this.sceneId}_monster${this.monsterId}.png`)
  //     .then(url => {
  //       cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
  //         const fra = this.monster.getComponent(cc.Sprite)
  //         const sframe = new cc.SpriteFrame(texture)
  //         fra.spriteFrame = sframe
  //       })
  //     })
  //   this.randomRun()
  //   this.saveMonsterData()
  // },

  // /**
  //  * 刷新类型 
  //  * @param {string} type  load:初始化 time： 到时刷新 refresh: 手动刷新 default: 不刷新，载入缓存
  //  */
  refreshNew(type = false) {
    this.node.active = true
    // 考虑点 初始化： 血量和 id

    // 读取缓存
    let saveDataType = 'clear'
    let storageLastMonster = cc.sys.localStorage.getItem('lastMonsterData')
    let monsterBlood = 100
    let storageMonster = {}
    if (storageLastMonster && storageLastMonster[this.sceneId]) {
      storageMonster = storageLastMonster[this.sceneId]
    }
    switch(type = 'default') {
      
      case 'time': {
        this.monsterId =  mathUtil.getRandomNum(8)
        monsterBlood = 100
        break;
      }
      case 'refresh': {
        // 清除所有怪物的缓存
        this.monsterId =  mathUtil.getRandomNum(8)
        monsterBlood = 100
        saveDataType = 'no'
        break
      }
      case 'load':
      case 'default':
      default: {
        let realTime = App.getRealTime()
        let lastHour = realTime -  realTime % (60 * 60 * 1000) // 上一个整点的时间
        if (storageMonster.refreshTime && storageMonster.refreshTime >= lastHour) { // 这个整点刚刷新的，载入缓存
          saveDataType = 'no'
          this.monsterId = storageMonster.monsterId
          monsterBlood = storageLastMonster.currentBlood
          if (monsterBlood <= 0) {
            setTimeout(() => {
              cc.find('Canvas').getComponent('catchmonster').showRefreshInterval()
            }, 0);
            this.node.active = false
          }
        } else {
          this.monsterId =  mathUtil.getRandomNum(8)
          monsterBlood = 100
        }
        break
      }
    }
    this.monster.monsterId = this.monsterId
    const monsterData = cc.find('Canvas').getComponent('catchmonster').getMonsterData(this.sceneId, this.monsterId)
    const monsterScript = this.monster.getComponent('monster')
    monsterScript.fullBlood = monsterData.blood
    monsterScript.currentBlood = monsterBlood
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
    this.saveMonsterData(saveDataType)
  },

  showCard() {
    this.node.stopAllActions()
    const root = cc.find('Canvas')
    root.getComponent('catchmonster').showCard(this.sceneId, this.monsterId)
  },
  /**
   * 
   * @param {string} type clear: 清除所有其他场景缓存 no: 只更新当前场景
   */
  saveMonsterData(type) {
    let storageLastMonster = cc.sys.localStorage.getItem('lastMonsterData')
    if(!storageLastMonster || type == 'clear') {
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
