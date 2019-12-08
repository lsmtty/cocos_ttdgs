// card mask 重构 以后会替换 cardMask
import { App } from '../utils/App'
import request from '../utils/request'

cc.Class({
  extends: cc.Component,

  properties: {
    cardContianer: {
      type: cc.Prefab,
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
    // handleBtnClick: {
    //   type: cc.callFunc,
    //   default: () => {}
    // },
    // handleClose: {
    //   type: cc.callFunc,
    //   default: () => {}
    // },
    btnText: '收下',
    isBigBtn: false,
    needBtn: true
  },

  onLoad () {
    this.btnLarge.on('touchend', this.handleBtnClick.bind(this))
    this.btnString.getComponent(cc.Label).string = this.btnText
    // if (needBtn) {
    //   if (this.isBigBtn) {
    //     this.btnLarge.opacity = 255
    //   } else {
    //     this.btn.opacity = 255
    //   }
    // }
  },
  close() {
    this.node.active = false
  },
  handleBtnClick() {
    let _this = this
    request.updateTools({ toolsName: 'rabbit',  toolsCount: 3}).then(() => {
      let gameData = App.getGameData()
      gameData.tools.rabbit += 3
      App.setGameData(gameData)
      App.setLoginGetRabbitStatus(true)
      cc.sys.localStorage.setItem('lastGetRabbitDate', new Date().getDate())
      _this.close()
    })
  }
})
