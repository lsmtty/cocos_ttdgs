import { App } from '../utils/App'
import constant from '../utils/constant'

cc.Class({
  extends: cc.Component,

  properties: {
    progress: {
        default: null,
        type: cc.Node
    },
    progressNumber: {
        default: null,
        type: cc.Label
    },
    progressCount: 0,
    initSceneCount: 2
  },

  onLoad () {
    App.adjustScreen(this.node)
    App.login()
    cc.Camera.main.backgroundColor = new cc.Color().fromHEX('#0C413E')
    const progressDraw = this.progress.getComponent(cc.Graphics)
    progressDraw.fillColor = new cc.Color(255, 255, 255)
    progressDraw.roundRect(-256, -26, 512, 52, 26)
    progressDraw.fill()
    progressDraw.fillColor = new cc.Color().fromHEX('#6d2a08')
    progressDraw.roundRect(-250, -20, 500, 40, 20)
    progressDraw.fill()
    this.loadRemoteAssets()
  },

  drawProgress(progress) {
    const percent = progress / (this.initSceneCount * 2 *  8)
    const progressDraw = this.progress.getChildByName('progressContent').getComponent(cc.Graphics)
    progressDraw.fillColor = new cc.Color().fromHEX('#FFEB1F')
    progressDraw.roundRect(-250, -20, 500 * percent, 40, 20)
    progressDraw.fill()

    this.progressNumber.string = Math.ceil(percent * 100) + '%'
    if (progress >= this.initSceneCount * 8) {
        cc.director.loadScene('catchmonster')
    }
  },
    /**
     * 加载远程资源
     * wx.env.USER_DATA_PATH： 这个是小游戏在手机上的临时目录
     **/
    loadRemoteAssets () {
        const self = this
        const that = this
        for (var i = 1; i <= this.initSceneCount;i++) {
            for(var j = 1; j <= 8;j++) {
                App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${i}/s${i}_monster${j}.png`)
                .then(url => {
                    cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
                       that.drawProgress(++that.progressCount) 
                    })
                })
                App.getResourceRealUrl(`${constant.rootWxCloudPath}monsters/scene${i}/s${i}_monster${j}_shadow.png`)
                .then(url => {
                    cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
                       that.drawProgress(++that.progressCount) 
                    })
                })
            }
        } 
    }
})
