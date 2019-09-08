import { App } from '../Script/utils/App'
import request from '../Script/utils/App'

cc.Class({
  extends: cc.Component,

  properties: {
    refreshButton: {
      default: null,
      type: cc.Node
    },
    refreshLabel: {
      default: null,
      type: cc.Label
    },
    refreshTool: {
      default: null,
      type: cc.Node
    }
  },

  onLoad () {
    const ctx = this.refreshButton.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color(242, 48, 111, 255)
    ctx.roundRect(0, 0, 284, 90, 45)
    ctx.fill()
    this.refreshButton.on('touchend', () => {
      this.refreshByRabbit()
    })
    this.node.active = false
    this.root = cc.find('Canvas').getComponent('catchmonster')
  },

  show() {
    this.node.active = true
    const label = this.refreshLabel.getComponent(cc.Label)
    this.showRefreshToolCount()
    const showRefreshTime = function() {
      if (App.getRealTime() % (3600 * 1000) < 1500) {
        this.refresh()
        return
      }
      const date = App.getRealTime()
      const overTime = 3600 * 1000 - date % (3600 * 1000)
      const minutes = parseInt((overTime % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = parseInt((overTime % (1000 * 60)) / 1000)
      label.string = `${minutes}分${seconds}秒后会有新怪物出现喔！！！`
    }
    showRefreshTime.call(this)
    this.timer = setInterval(() => {
      showRefreshTime.call(this)
    }, 1000)
  },

  hide() {
    clearInterval(this.timer)
    this.node.active = false
  },

  refreshByRabbit() {
    const gameData = this.root._getGameData()
    let { rabbit } = gameData.tools
    if (rabbit) {
      this.refresh()
    }
    request.updateTools({ toolsName: 'rabbit',  toolsCount: -1}).then(() => {
      rabbit--
      gameData.tools.rabbit = rabbit
      this.root._setGameData(gameData)
    })
  },
  refresh() {
    if (this.timer) clearInterval(this.timer)
    this.root.getANewMonster()
    this.node.active = false
  },
  showRefreshToolCount() {
    const gameData = this.root._getGameData()
    const refToolCount = this.refreshTool.getChildByName('refToolCount')
    const refToolCountLable = refToolCount.getChildByName('refCountLabel')
    const { rabbit } = gameData.tools
    const ctx = refToolCount.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color(255, 89, 0, 255)
    ctx.circle(15, 15, 15)
    ctx.fill()
    refToolCountLable.getComponent(cc.Label).string = rabbit
  }
})
