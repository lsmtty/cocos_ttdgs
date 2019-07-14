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
  watchMonster() {
    const monster = cc.find('Canvas/background/monsterBox')
    if (monster) {
      const r = mathUtil.getRotation({ x: this.node.x + 273, y: this.node.y + 272 }, { x: monster.x, y: monster.y })
      const rotation = cc.rotateTo(0.2, r - 90)
      const callback = cc.callFunc(this.watchMonster, this)
      this.node.runAction(cc.sequence(rotation, callback))
    }
  },

  rowAnimate() {
    const beSmall = cc.scaleTo(0.2, 1, 0.8)
    const beLarge = cc.scaleTo(0.2, 1, 1)
    this.node.runAction(cc.sequence(beSmall, beLarge))
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
