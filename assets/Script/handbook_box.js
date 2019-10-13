// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { App } from './utils/App'

cc.Class({
  extends: cc.Component,

  properties: {
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.node.on('touchend', () => {
      cc.find('Canvas').getComponent('catchmonster').saveMonsterData()
      App.ttdgsLoadScene('handbook', {
        test: 'test'
      })
    })
    const ctx = this.node.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color(108, 80, 59, 252)
    ctx.rect(0, 0, 127, 94)
    ctx.fill()
    ctx.roundRect(0, 0, 174, 94, 47)
    ctx.fill()
  }
})
