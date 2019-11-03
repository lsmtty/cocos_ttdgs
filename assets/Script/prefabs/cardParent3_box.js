// card mask 重构 以后会替换 cardMask
import { App } from '../Script/utils/App'
import constant from '../Script/utils/constant'
import request from './utils/request'

cc.Class({
  extends: cc.Component,

  properties: {
    cardContianer: {
      type: cc.Prefab,
      default: null
    },
    btn: {
      type: cc.Node,
      default: null
    },
    btnLarge: {
      type: cc.Node,
      default: null
    },
    btnString: {
      type: cc.Label,
      default: null
    },
    handleBtnClick: {
      type: cc.callFunc,
      default: () => {}
    },
    handleClose: {
      type: cc.callFunc,
      default: () => {}
    },
    btnText: '领取',
    isBigBtn: false,
    needBtn: true
  },

  onLoad () {
    this.zIndex = 100
    this.drawBackground()
    this.btn.on('touchend', this.handleBtnClick)
    this.btnLarge.on('touchend', this.handleBtnClick)
    this.btnString.getComponent(cc.Label).string = this.btnText
    if (needBtn) {
      if (this.isBigBtn) {
        this.btnLarge.opacity = 255
      } else {
        this.btn.opacity = 255
      }
    }
  },
  drawBackground() {
    const ctx = this.cardBg.getComponent(cc.Graphics)
    this.cardBg.opacity = 153
    this.cascadeOpacity = false
    this.cardBg.on('touchend', () => { return false })
  }
})
