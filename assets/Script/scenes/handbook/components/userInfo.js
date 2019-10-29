
import request from '../../../utils/request'
import { App } from '../../../utils/App'

cc.Class({
  extends: cc.Component,

  properties: {
    userImg: {
      type: cc.Node,
      default: null
    },
    userName: {
      type: cc.Label,
      default: null
    },
    userEarnCount: {
      type: cc.Label,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    request.getUserInfo().then(data => this.initData(data))
  },

  initData(userInfo) {
    const _this = this
    this.userName.string = userInfo.nickName
    cc.loader.load(userInfo.avatarUrl + '?aa=aa.jpg', (err, texture) => {
      const fra = _this.userImg.getComponent(cc.Sprite)
      const sframe = new cc.SpriteFrame(texture)
      fra.spriteFrame = sframe
    })
    let ownerCount = 0
    const gameData = App.getGameData()
    const { scenes } = gameData
    scenes.forEach(scene => {
      const { monsters } = scene
      monsters.forEach(monster => {
        ownerCount += monster.own != 0
      })
    })
    this.userEarnCount.string = `${ownerCount}种神兽`
  }
})
