// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    lineWidth: 120,
    bowLeftWidth: 200,
    ballWrapPositionY: 520,
    ballWrapPositionX: -20,
    arrowPrefab: {
      default: null,
      type: cc.Prefab
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
      default: 200,
      type: cc.Integer
    },
    validShoot: {
      default: false,
      type: cc.Boolean
    }
  },

  onLoad () {
    this.arrow = null
    this.createArrow()

    let touchPoint;
    let bowLeft = this.bowLeft = this.node.getChildByName("bowLeft")
    let bowRight = this.bowRight = this.node.getChildByName("bowRight")
    let lineLeft = this.lineLeft = cc.find("bowLeft/lineLeft", this.node)
    let lineRight = this.lineRight = cc.find("bowRight/lineRight", this.node)
    let ballWrap = this.ballWrap = cc.find("ballWrap", this.node)

    let wrap = this.wrap = cc.find("ballWrap/wrap", this.node)
    let ball = this.ball = cc.find("ballWrap/ball", this.node)

    this.rightHand = cc.find("rightHand", this.node)

    this.node.on('touchstart', e => {
      touchPoint = e.getLocation()
      this.ballWrapPositionY = 520
    })

    this.node.on('touchmove', e => {
      let deltaX = e.getLocation().x - touchPoint.x
      let deltaY = e.getLocation().y - touchPoint.y
      this.setbow(deltaX, deltaY)
    })
    this.node.on('touchend', e => {
      this.shoot(e)
    })
    this.node.on('touchcancel', e => {
      this.shoot(e)
    })

  },

  setbow (x, y) {
    let deltaX = x
    let deltaY = y
    //范围控制
    deltaX = deltaX > 300 ? 300 : (deltaX < -300 ? -300 : deltaX)
    deltaY = deltaY < -400 ? -400 : (deltaY > 200 ? 200 : deltaY)

    let moveX = this.ballWrapPositionX + deltaX / 4
    let bowRotation = - deltaY / 70
    let lineRotation = bowRotation * 8

    this.bowRight.rotation = bowRotation
    this.bowLeft.rotation = -bowRotation

    this.lineRight.rotation = -lineRotation

    let lineRightWidth = this.lineWidth / Math.cos(lineRotation / 180 * Math.PI) + this.bowLeftWidth * Math.cos((53 - bowRotation) / 180 * Math.PI) - this.lineWidth
    let lineLeftWidth = this.lineWidth / Math.cos(lineRotation / 180 * Math.PI) + this.bowLeftWidth * Math.cos((53 - bowRotation) / 180 * Math.PI) - this.lineWidth
    let ballDeltaY = lineLeftWidth * Math.sin(lineRotation / 180 * Math.PI)
    let ballWrapY = this.ballWrapPositionY - ballDeltaY
    let lineLeftHorizon = Math.cos(lineRotation / 180 * Math.PI) * lineLeftWidth + moveX
    let lineRightHorizon = Math.cos(-lineRotation / 180 * Math.PI) * lineRightWidth - moveX

    this.lineLeft.width = Math.sqrt(lineLeftHorizon * lineLeftHorizon + ballDeltaY * ballDeltaY * .9)
    this.lineRight.width = Math.sqrt(lineRightHorizon * lineRightHorizon + ballDeltaY * ballDeltaY * .86)
    let sign = bowRotation > 0 ? 1 : -1
    this.lineLeft.rotation = sign * (Math.acos(lineLeftHorizon / this.lineLeft.width)) / Math.PI * 180
    this.lineRight.rotation = -sign * (Math.acos(lineRightHorizon / this.lineRight.width)) / Math.PI * 180 * 1.25

    this.ballWrap.y = ballWrapY
    this.ballWrap.x = moveX

    this.rightHand.y = ballWrapY
    this.rightHand.x = moveX

    // 球的角度
    let ballRotation = -Math.atan((moveX + 10) / ballWrapY) / Math.PI * 180 * 1.5
    this.ballWrap.rotation = ballRotation
    this.arrow && (this.arrow.rotation = ballRotation > 10 || ballRotation < -10 ? ballRotation * 2 : ballRotation)
    this.arrow && (this.arrow.setPosition(cc.v2(moveX, ballWrapY)))
  },

  shoot (e) {
    //
    const { _prevPoint, _startPoint } = e.touch
    const moveLength = Math.sqrt(Math.pow(_prevPoint.x - _startPoint.x, 2) + Math.pow(_prevPoint.y - _startPoint.y, 2))
    if (this.arrow && this.validShoot) {
      // if (moveLength < 50) { // 拉动距离太小恢复位置
      //   this.replaceArrow()
      //   this.resetbow()
      //   return
      // }
      // UI
      this.ball.opacity = 0
      this.wrap.opacity = 255
      this.rightHand.opacity = 0
      this.resetbow()
      setTimeout(e => {
        this.setbow(0,60)
      }, 40)
      setTimeout(e => {
        this.resetbow()
      }, 80)
      setTimeout(e => {
        this.setbow(0,30)
      }, 120)
      setTimeout(e => {
        this.resetbow()
      }, 160)
      // setTimeout(e => {
      // }, 400)

      this.arrow.opacity = 255
      // FUNC
      this.playShootAudio()
      this.arrow.getComponent('arrow').shooting()
      this.arrow = null
      const timer = setTimeout(() => {
        this.wrap.opacity = 0
        this.ball.opacity = 255
        this.createArrow()
        this.rightHand.y = this.ballWrapPositionY
        this.rightHand.x = this.ballWrapPositionX
        this.rightHand.opacity = 255
        clearTimeout(timer)
      }, this.shootInterval)
    } else {
      this.resetbow()
    }

  },

  resetbow () {
    this.bowRight.rotation = 0
    this.bowLeft.rotation = 0
    this.lineLeft.width = this.lineWidth - 20
    this.lineLeft.rotation = 0
    this.lineRight.width = this.lineWidth - 20
    this.lineRight.rotation = 0

    this.ballWrap.y = this.ballWrapPositionY
    this.ballWrap.x = this.ballWrapPositionX
    this.ballWrap.rotation = 0
  },
  // 旧逻辑
  createArrow() {
    const newArrow = cc.instantiate(this.arrowPrefab)
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newArrow)
    this.arrow = newArrow
    newArrow.setAnchorPoint(0.5, 0)
    newArrow.setScale(0.5, 0.5)
    newArrow.y = this.ballWrapPositionY
    newArrow.x = this.ballWrapPositionX
    newArrow.rotation = 0
    newArrow.opacity = 0
  },
  playShootAudio: function() {
    cc.audioEngine.playEffect(this.shootAudio, false)
  },
  replaceArrow() {
    this.arrow.setPosition(cc.v2(this.ballWrapPositionX, this.ballWrapPositionY))
    this.arrow.rotation = 0
  },

  // update (dt) {},
});
