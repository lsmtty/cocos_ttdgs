// card mask 重构 以后会替换 cardMask
import { App } from '../Script/utils/App'
import constant from '../Script/utils/constant'
import request from './utils/request'

cc.Class({
  extends: cc.Component,

  properties: {
    card: {
      type: cc.Node,
      default: null
    },
    cardBg: {
      type: cc.Node,
      default: null
    },
    onReceiveBtn: {
      type: cc.Node,
      default: null
    },
    userImg: {
      type: cc.Node,
      default: null
    }
  },

  onLoad () {
    this.drawBackground()
    this.onReceiveBtn.on('touchend', this.handleReceive)
  },
  drawBackground() {
    const ctx = this.cardBg.getComponent(cc.Graphics)
    this.cardBg.opacity = 153
    this.cascadeOpacity = false
    this.cardBg.on('touchend', () => { return false })
    // ctx.fillColor = new cc.Color().fromHEX('#000000')
    // ctx.rect(0, 0, 750, 1334)
    // ctx.fill()
  },
  handleReceive(e) {
    const cardRoot = e.target.parent.parent
    const { monsterData, senderId } = cardRoot
    request.receiveMonster({
      openId: senderId,
      sceneId: monsterData.sceneId,
      monsterId: monsterData.monsterId
    }).then(() => {
      console.log('接收成功');
      cardRoot.active = false
    }).catch(() => {
      console.log('接收失败');
    })
  },
   /**
     * 展示收藏卡片
     * @param {Object} monsterData
     * @param {string} sender openId
     */
  showCard(monsterData, senderId) {
    let _this = this
    this.node.active = true
    const beLarge = cc.scaleTo(0.8, 1, 1)
    this.card.runAction(beLarge);
    this.node.monsterData = monsterData
    this.node.senderId = senderId
    console.log('here', monsterData, senderId, request.getUserInfo);
    request.getUserInfo({
      openId: senderId
    }).then(res => {
      console.log(res);
      _this.card.getChildByName('senderText').getComponent(cc.Label).string = `${res.nickName}送你一只`
      _this.card.getChildByName('monsterName').getComponent(cc.Label).string = monsterData.name
      App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}.png`)
      .then(url => {
        cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
          const fra = _this.card.getChildByName('monster').getComponent(cc.Sprite)
          const sframe = new cc.SpriteFrame(texture)
          fra.spriteFrame = sframe
        })
      })
      cc.loader.load(res.avatarUrl + '?aa=aa.jpg', (err, texture) => {
        const fra = _this.userImg.getComponent(cc.Sprite)
        const sframe = new cc.SpriteFrame(texture)
        fra.spriteFrame = sframe
      })
    });
  }
})
