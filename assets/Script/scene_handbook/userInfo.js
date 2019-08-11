

import request from '../utils/request';

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
    let _this = this
    this.userName.string = userInfo.nickName
    cc.loader.load(userInfo.avatarUrl + '?aa=aa.jpg', (err,texture) => {
      let fra = _this.userImg.getComponent(cc.Sprite);
      let sframe = new cc.SpriteFrame(texture)
      fra.spriteFrame = sframe;
    })
    let ownerCount = 0
    const gameData = JSON.parse(cc.sys.localStorage.getItem('monsterData'))
    const { scenes } = gameData.result.data
    scenes.forEach(scene => {
      const { monsters } = scene
      monsters.forEach(monster => {
        ownerCount += monster.own != 0
      })
    })
    this.userEarnCount.string = `${ownerCount}种神兽`
  }
})
