// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { App } from '../utils/App';

cc.Class({
  extends: cc.Component,

  properties: {
    cardPrefab: {
      default: null,
      type: cc.Prefab
    }
  },

  onLoad () {
    App.adjustScreen(this.node);
    cc.Camera.main.backgroundColor = new cc.Color(89, 81, 78)
    const returnBtn = cc.find('Canvas/background/返回按钮@2x')
    returnBtn.on('touchend', this.goback)
    let card = cc.instantiate(this.cardPrefab)
    card.setPosition(cc.v2(-291, -387))
    this.cardParent = card
    this.node.addChild(this.cardParent)
  },

  goback() {
    cc.director.loadScene('catchmonster')
  }
})
