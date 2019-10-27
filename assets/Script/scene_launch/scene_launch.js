import { App } from '../utils/App'

cc.Class({
  extends: cc.Component,

  properties: {
  },

  onLoad () {
    App.adjustScreen(this.node)
    App.login()
    setTimeout(() => {
        cc.director.loadScene('catchmonster')
    }, 4000)
  }
})
