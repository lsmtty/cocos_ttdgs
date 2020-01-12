import { App } from '../Script/utils/App'
import constant from '../Script/utils/constant'
import request from './utils/request'

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
    },
    confirmDialog: {
      type: cc.Prefab,
      default: null
    },
    isCatchMonster: true
  },

  onLoad () {
    let _this = this
    // this.drawBackground()
    this.root = cc.find('Canvas')
    if (this.root.getComponent('catchmonster')) { // 判断是捕捉页
      this.handbookControlBox.active = false
    } else {
      this.isCatchMonster = false
      this.catchControlBox.active = false
    }
    this.onCatchSendBtn.on('touchend', () => {
      _this.confirmDialog.active = true
      let confirmScript =  _this.confirmDialog.getComponent('confirmDialog')
      confirmScript.confirm = _this.handleSend.bind(_this)
      confirmScript.cancel = () => {
        this.node.parent.parent.active = false
      }
    })
    this.onCatchSaveBtn.on('touchend', this.handleSave)
    this.onSendToFriendButton.on('touchend', () => {
      _this.confirmDialog.active = true
      let confirmScript = _this.confirmDialog.getComponent('confirmDialog')
      confirmScript.confirm = _this.sendToFriend.bind(_this)
      confirmScript.cancel = () => {
        this.node.parent.parent.active = false
      }
    })
    this.confirmDialog = cc.instantiate(this.confirmDialog)
    this.confirmDialog.setPosition(cc.v2(-375, -667))
    this.root.addChild(this.confirmDialog)
    this.confirmDialog.active = false
    this.node.parent.parent.getChildByName('close').on('touchend', this.handleClose.bind(this))
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
    this.node.parent.parent.active = true
    this.node.monsterData = monsterData
    const labelName = this.node.getChildByName('monster_name').getComponent(cc.Label)
    const labelOwn = this.node.getChildByName('monster_own').getComponent(cc.Label)
    if (monsterData.own > 0) {
      this.node.getChildByName('icon_new').active = false
    }
    labelName.string = `捕获${monsterData.name}`
    labelOwn.string = `我拥有${monsterData.own}只`
    console.log(`${constant.rootWxCloudPath}monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}.png`)
    App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}.png`)
      .then(url => {
        cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
          const fra = this.monster.getComponent(cc.Sprite)
          const sframe = new cc.SpriteFrame(texture)
          fra.spriteFrame = sframe
        })
      })
  },
  handleSave(e) {
    const cardRoot = e.target.parent.parent
    const { monsterData } = cardRoot
    const { name, sceneId, monsterId } = monsterData
    wx && wx.showToast({
      title: `捕获${name}`,
      icon: 'success',
      duration: 3000
    })
    cc.find('Canvas').getComponent('catchmonster').saveMonster(sceneId, monsterId)
    cardRoot.getComponent('cardParent').refreshMonster()
  },
  handleSend(e) {
    let _this = this
    const { monsterData } = _this.node;
    const { name, sceneId, monsterId } = monsterData
    if (typeof wx != 'undefined') {
      let openId = App.getOpenId();
      const { nickName } = App.getUserInfo();
      request.sendMonster({monsterId, sceneId, openId}).then(data => {
        let { shareId } = data
        const gameData = App.getGameData()
        let { rabbit } = gameData.tools
        App.getResourceRealUrl(`cloud://ttdgs-test-c6724c.7474-ttdgs-test-c6724c/images/common/share1.png`)
        .then(url => {
          if (typeof wx != 'undefined') {
            wx.shareAppMessage({
              title: `${nickName}给你送来一个${name},快来领取吧~`, //转发标题
              imageUrlId: 'GLGHCXgaQpikpE4SDNRm7w',
              imageUrl: url,    //转发图片
              query: `senderId=${openId}&sceneId=${sceneId}&monsterId=${monsterId}&shareId=${shareId}`
            })
          }
        })
      }).catch(() => {

      })
      
    }
    _this.node.getComponent('cardParent').refreshMonster()
  },
  sendToFriend(e) {
    let _this = this
    const { monsterData } = _this.node;
    const { name, monsterId, sceneId } = monsterData;
    if (typeof wx != 'undefined') {
      let openId = App.getOpenId();
      const { nickName } = App.getUserInfo();
      request.sendMonster({monsterId, sceneId, openId}).then((data) => {
        let { shareId } = data
        const gameData = App.getGameData()
        let { rabbit } = gameData.tools
        App.getResourceRealUrl(`cloud://ttdgs-test-c6724c.7474-ttdgs-test-c6724c/images/common/share1.png`)
        .then(url => {
          if (typeof wx != 'undefined') {
            wx.shareAppMessage({
              title: `${nickName}给你送来一个${name},快来领取吧~`, //转发标题
              imageUrl: url,    //转发图片
              imageUrlId: 'GLGHCXgaQpikpE4SDNRm7w',
              query: `senderId=${openId}&sceneId=${sceneId}&monsterId=${monsterId}&shareId=${shareId}`
            })
          }
        })
      }).catch(() => {
        
      });
    }
    _this.node.parent.parent.active = false;
  },
  refreshMonster() {
    this.node.parent.parent.active = false
    cc.find('Canvas').getComponent('catchmonster').showRefreshInterval()
  },
  handleClose() {
    if (this.isCatchMonster) {
      const { monsterData } = this.node;
      const { name, sceneId, monsterId } = monsterData
      wx && wx.showToast({
        title: `捕获${name}`,
        icon: 'success',
        duration: 3000
      })
      let catchmonster = cc.find('Canvas').getComponent('catchmonster')
      catchmonster.saveMonster(sceneId, monsterId)
      catchmonster.showRefreshInterval()
    }
    this.node.parent.parent.active = false
  }
})
