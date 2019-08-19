import { App } from '../utils/App'

cc.Class({
  extends: cc.Component,

  properties: {
    cardPrefab: {
      default: null,
      type: cc.Prefab
    }
  },

  onLoad () {
    App.adjustScreen(this.node)
    cc.Camera.main.backgroundColor = new cc.Color(89, 81, 78)
    const returnBtn = cc.find('Canvas/background/返回按钮@2x')
    returnBtn.on('touchend', this.goback)
    const card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-291, -387))
    this.cardParent = card
    this.node.addChild(this.cardParent)
  },

  showCard(monsterData) {
    this.cardParent.getChildByName('cardParent').getComponent('cardParent').showCard(monsterData)
  },

  goback() {
    cc.director.loadScene('catchmonster')
  }
})
