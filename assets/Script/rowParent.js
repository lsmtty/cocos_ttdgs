// 弓箭整体父级
import mathUtil from './utils/mathUtil'
import { App } from '../Script/utils/App'
cc.Class({
  extends: cc.Component,

  properties: {
    arrowrPrefab: {
      default: null,
      type: cc.Prefab
    },
    row: {
      default: null,
      type: cc.Node
    },
    shootAudio: {
      default: null,
      type: cc.AudioClip
    },
    lagongAudio: {
      default: null,
      type: cc.AudioSource
    },
    shootInterval: {
      default: 500,
      type: cc.Integer
    },
    validShoot: {
      default: false,
      type: cc.Boolean
    }
  },

  onLoad () {
    this.arrow = null
    this.arrowCreateTime = null
    this.createArrow()
    // this.node.on('touchmove', App.debounce((e) => {
    //   console.log('touchmove')
    //   this.rowRotate(e)
    //   this.arrowStretch(e)
    //   // this.node.getComponent(cc.AudioSource).play()
    // }, 50))
    this.node.on('touchmove', App.throttle(e => {
      console.log('touchmove')
      this.rowRotate(e)
      this.arrowStretch(e)
      // this.node.getComponent(cc.AudioSource).play()
    }, 50))
    this.node.on('touchend', (e) => {
      this.shootArrow(e)
    }, this)
    this.node.on('touchcancel', (e) => {
      this.shootArrow(e)
    }, this)
  },

  createArrow() {
    const newArrow = cc.instantiate(this.arrowrPrefab)
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newArrow)
    this.arrow = newArrow
    newArrow.setAnchorPoint(0.5, 0)
    newArrow.setScale(0.5, 0.5)
    newArrow.setPosition(cc.v2(0, -73))
  },

  playShootAudio: function() {
    cc.audioEngine.playEffect(this.shootAudio, false)
  },
  rowRotate(e) {
    const { _prevPoint, _startPoint } = e.touch
    if (_prevPoint.x != _startPoint.x || _prevPoint.y != _startPoint.y) {
      const r = mathUtil.getRotation({ x: _prevPoint.x, y: _prevPoint.y }, { x: _startPoint.x, y: _startPoint.y })
      this.node.rotation = r - 90
    }
  },
  arrowStretch(e) {
    const { _prevPoint, _startPoint } = e.touch
    if (!this.arrow) return
    let moveLength = Math.sqrt(Math.pow(_prevPoint.x
       - _startPoint.x, 2) + Math.pow(_prevPoint.y - _startPoint.y, 2))
    moveLength = moveLength < 100 ? moveLength : 100
    this.arrow && this.arrow.setPosition(cc.v2(0, -73 - moveLength / 2))
    this.row.getComponent('row').drawLines(-60 - moveLength / 2)
  },
  shootArrow(e) {
    const { _prevPoint, _startPoint } = e.touch
    const moveLength = Math.sqrt(Math.pow(_prevPoint.x - _startPoint.x, 2) + Math.pow(_prevPoint.y - _startPoint.y, 2))
    if (this.arrow && this.validShoot) {
      if (moveLength < 50) { // 拉动距离太小恢复位置
        this.replaceArrow()
        return
      }
      this.playShootAudio()
      this.arrow.getComponent('arrow').shooting()
      this.row.getComponent('row').drawLines(-60)
      this.arrow = null
      const timer = setTimeout(() => {
        this.createArrow()
        clearTimeout(timer)
      }, this.shootInterval)
    }
  },
  replaceArrow() {
    this.arrow.setPosition(cc.v2(0, -73))
    this.row.getComponent('row').drawLines(-60)
  }
})
