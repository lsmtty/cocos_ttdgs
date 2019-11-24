import { App } from '../Script/utils/App'
import request from '../Script/utils/request'

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
    this.refreshButton.on('touchend', () => {
      this.refreshByRabbit()
    })
    this.node.active = false
    this.root = cc.find('Canvas').getComponent('catchmonster')
  },

  show() {
    const label = this.refreshLabel.getComponent(cc.Label)
    this.showRefreshToolCount()
    this.node.active = true
    const showRefreshTime = function() {
      if (App.getRealTime() % (3600 * 1000) < 1500) {
        this.refresh()
        return
      }
      const date = App.getRealTime()
      var nextHours = new Date(date).getHours()
      if (nextHours == 23) {
        nextHours = 0
      } else {
        nextHours += 1
      }
      const overTime = 3600 * 1000 - date % (3600 * 1000)
      const minutes = parseInt((overTime % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = parseInt((overTime % (1000 * 60)) / 1000)
      label.string = `距离下次${nextHours}点 还有${minutes}分${seconds}秒`
    }
    showRefreshTime.call(this)
    this.timer = setInterval(() => {
      this.node && this.node.active && showRefreshTime.call(this)
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
    const gameData = App.getGameData()
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
