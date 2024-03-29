import constant from './utils/constant'
cc.Class({
  extends: cc.Component,

  properties: {
    speed: {
      default: 600,
      type: cc.Integer
    },
    attack: {
      default: 10,
      type: cc.Integer
    }
  },

  onLoad () {
    this.isShooting = false
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = constant.isDebug
    cc.director.getCollisionManager().enabledDrawBoundingBox = constant.isDebug
  },

  getMonsterDistance() {
    // 根据 monster 节点位置判断距离
    const monsterPos = this.monster.getPosition()
    // 根据两点位置计算两点之间距离
    const dist = this.node.position.sub(monsterPos).mag()
    return dist
  },

  onCollisionEnter: function (other) {
    if (other.node._name == 'monster') { // 需要判断碰撞的是什么元素
      cc.Object.prototype.destroy.call(this.node)
      this.active = false
    }
  },

  update (dt) {
    if (this.isShooting) {
      this.node.x += this.speed * dt * Math.sin(this.node.rotation * Math.PI / 180)
      this.node.y += this.speed * dt * Math.cos(Math.abs(this.node.rotation) * Math.PI / 180)
      // 移动超出屏幕后应该被销毁
      if (Math.abs(this.node.x) > 500 || this.node.y > 1700) {
        cc.Object.prototype.destroy.call(this.node)
      }
    }
  },
  shooting() {
    this.isShooting = true
    const beSmall = cc.scaleBy(0.95, 0.6, 0.6)
    this.node.runAction(beSmall)
  }
})
