
cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad () {
    this.node.on('touchend', () => {
      cc.find('Canvas').getComponent('catchmonster').saveMonsterData()
      cc.director.loadScene('map')
    })
    const ctx = this.node.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color(108, 80, 59, 252)
    ctx.rect(47, 0, 127, 94)
    ctx.fill()
    ctx.roundRect(0, 0, 174, 94, 47)
    ctx.fill()
  }
})
