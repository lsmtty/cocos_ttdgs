
cc.Class({
  extends: cc.Component,

  properties: {
    cardParent: {
      type: cc.Node,
      default: null
    }
  },

  onLoad () {
    // this.drawBackground()
    this.node.active = false
  },
  drawBackground() {
    const ctx = this.node.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color().fromHEX('#ffffff')
    ctx.roundRect(0, 0, 602, 794, 25)
    ctx.fill()
  }
})
