import { App } from '../Script/utils/App';
import constant from '../Script/utils/constant';

cc.Class({
  extends: cc.Component,

  properties: {
    cardType: {
      default: 'monsterCard'
    },
    monster: {
      type: cc.Node,
      default: null
    },
    handbookControlBox: {
      type: cc.Node,
      default: null
    },
    catchControlBox: {
      type: cc.Node,
      default: null
    },
    onCatchSendBtn: {
      type: cc.Node,
      default: null
    },
    onCatchSaveBtn: {
      type: cc.Node,
      default: null
    },
    onSendToFriendButton: {
      type: cc.Node,
      default: null
    }
  },

  onLoad () {
    this.drawBackground()
    this.root = cc.find('Canvas')
    if (this.root.getComponent('catchmonster')) { // 判断是捕捉页
      this.handbookControlBox.active = false
    } else {
      this.catchControlBox.active = false
    }
    this.onCatchSendBtn.on('touchend', this.handleSend)
    this.onCatchSaveBtn.on('touchend', this.handleSave)
    this.onSendToFriendButton.on('touchend', this.sendToFriend)
  },

  drawBackground() {
    const ctx = this.node.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color().fromHEX('#FFF4D9')
    ctx.roundRect(0, 0, 582, 774, 20)
    ctx.fill()
  },

  /**
     * 展示收藏卡片
     * @param {Object} monsterData
     */
  showCard(monsterData) {
    this.node.parent.active = true
    this.node.monsterData = monsterData
    const labelName = this.node.getChildByName('monster_name').getComponent(cc.Label)
    const labelOwn = this.node.getChildByName('monster_own').getComponent(cc.Label)
    if (monsterData.own > 0) {
      this.node.getChildByName('icon_new').active = false
    }
    labelName.string = `捕获${monsterData.name}`
    labelOwn.string = `我拥有${monsterData.own}只`
    App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}.png`)
      .then(url => {
        cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
          let fra = this.monster.getComponent(cc.Sprite)
          let sframe = new cc.SpriteFrame(texture)
          fra.spriteFrame = sframe;
        })
      })
  },
  handleSave(e) {
    const { monsterData } = e.target.parent
    const { name, sceneId, monsterId } = monsterData
    Toast.makeText(`保存一个${name}`, Toast.LENGTH_SHORT).show()
    cc.find('Canvas').getComponent('catchmonster').saveMonster(sceneId, monsterId)
    e.target.parent.getComponent('cardParent').refreshMonster()
  },
  handleSend(e) {
    const { monsterData } = e.target.parent
    const { name } = monsterData
    Toast.makeText(`送出一个${name}`, Toast.LENGTH_SHORT).show()
    e.target.parent.getComponent('cardParent').refreshMonster()
  },
  sendToFriend(e) {
    this.node.parent.active = false
  },
  refreshMonster() {
    this.node.parent.active = false
    cc.find('Canvas').getComponent('catchmonster').showRefreshInterval()
  }
})
