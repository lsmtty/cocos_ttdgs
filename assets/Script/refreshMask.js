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
    this.isRunning = false
    this.root = cc.find('Canvas').getComponent('catchmonster')
    this.schedule = cc.director.getScheduler()
  },

  show() {
    this.node.active = true
    this.isRunning = true
    this.showRefreshToolCount()
    this.schedule.schedule(this.showRefreshTime, this, 1, !this.isRunning)
  },

  showRefreshTime() {
    if(!this.node.active) {
      this.unschedule(this.showRefreshTime)
      return
    }
    const label = this.refreshLabel.getComponent(cc.Label)
    const date = App.getRealTime()
    let nextHours = new Date(date).getHours()
    if (nextHours == 23) {
      nextHours = 0
    } else {
      nextHours += 1
    }
    const overTime = 3600 * 1000 - date % (3600 * 1000)
    const minutes = parseInt((overTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = parseInt((overTime % (1000 * 60)) / 1000)
    label.string = `距离下次${nextHours}点 还有${minutes}分${seconds}秒`
  },

  hide() {
    this.node.active = false
    this.isRunning = false
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
    this.root.getANewMonster('refresh')
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
