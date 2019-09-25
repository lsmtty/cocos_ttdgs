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
  },

  onLoad () {
    this.drawBackground()
    this.onReceiveBtn.on('touchend', this.handleReceive)
  },
  drawBackground() {
    const ctx = this.cardBg.getComponent(cc.Graphics)
    this.cardBg.opacity = 153;
    // ctx.fillColor = new cc.Color().fromHEX('#000000')
    // ctx.rect(-325, -667, 750, 1334)
    // ctx.fill()
  },
  handleReceive(e) {
    // const cardRoot = e.target.parent.parent
    // const { monsterData } = cardRoot
    // const { name, sceneId, monsterId } = monsterData
    // Toast.makeText(`保存一个${name}`, Toast.LENGTH_SHORT).show()
    // cc.find('Canvas').getComponent('catchmonster').saveMonster(sceneId, monsterId)
    // cardRoot.getComponent('cardParent').refreshMonster()
  },
   /**
     * 展示收藏卡片
     * @param {Object} monsterData
     * @param {string} sender openId
     */
  showCard(monsterData, senderId) {
    this.node.active = true
    this.node.monsterData = monsterData
    request.getUserInfo({
      openId: senderId
    }).then(res => {

    });
  }
})
