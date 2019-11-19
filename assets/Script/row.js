import mathUtil from './utils/mathUtil'
cc.Class({
  extends: cc.Component,

  properties: {
    leftLine: {
      type: cc.Node,
      default: null
    },
    rightLine: {
      type: cc.Node,
      default: null
    }
  },

  onLoad () {
    this.leftGra = this.leftLine.getComponent(cc.Graphics)
    this.rightGra = this.rightLine.getComponent(cc.Graphics)
    this.drawLines()
  },

  drawLines(bottom = -60) {
    this.leftGra.clear()
    this.rightGra.clear()
    this.leftGra.moveTo(0, 0)
    this.leftGra.lineTo(170, bottom)
    this.rightGra.moveTo(0, 0)
    this.rightGra.lineTo(-170, bottom)
    new cc.Graphics().lineTo()
    this.leftGra.stroke()
    this.rightGra.stroke()
  }
})
