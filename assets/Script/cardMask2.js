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
    const { monsterData, senderId, shareId } = cardRoot
    request.receiveMonster({
      openId: senderId,
      shareId,
      sceneId: monsterData.sceneId,
      monsterId: monsterData.monsterId
    }).then(() => {
      console.log('接收成功');
      wx && wx.showToast({
        title: '获得小怪兽',
        icon: 'none',
        duration: 3000
      })
      cardRoot.active = false
    }).catch(() => {
      wx && wx.showToast({
        title: '怪兽已被领取',
        icon: 'none',
        duration: 3000
      })
      console.log('接收失败');
      cardRoot.active = false
    })
  },
   /**
     * 展示收藏卡片
     * @param {Object} monsterData
     * @param {string} sender openId
     * @param {string} shareId shareId
     */
  showCard(monsterData, senderId, shareId) {
    let _this = this
    this.node.active = true
    const beLarge = cc.scaleTo(0.8, 1, 1)
    this.card.runAction(beLarge);
    this.node.monsterData = monsterData
    this.node.senderId = senderId
    this.node.shareId = shareId
    request.getUserInfo({
      openId: senderId
    }).then(res => {
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
