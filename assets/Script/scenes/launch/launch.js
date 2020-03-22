import { App } from '../../utils/App'
import constant from '../../utils/constant'
import request from '../../utils/request'

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
    initSceneCount: 1,
    launch1: {
        default: null,
        type: cc.Node
    },
    launch2: {
        default: null,
        type: cc.Node
    },
    launchButton: {
        default: null,
        type: cc.Node
    },
    isLoad: false
    },

    onLoad () {
        App.adjustScreen(this.node)
        App.login()
        this.initProgressParent()
        this.loadRemoteAssets()
    },
    initProgressParent() {
        cc.Camera.main.backgroundColor = new cc.Color().fromHEX('#0C413E')
        const progressDraw = this.progress.getComponent(cc.Graphics)
        progressDraw.fillColor = new cc.Color(255, 255, 255)
        progressDraw.roundRect(-256, -26, 512, 52, 26)
        progressDraw.fill()
        progressDraw.fillColor = new cc.Color().fromHEX('#6d2a08')
        progressDraw.roundRect(-250, -20, 500, 40, 22)
        progressDraw.fill()
    },

    drawProgress(progress) {
        if (!this.isLoad) {
            const percent = progress / (this.initSceneCount * 2 *  8)
            const progressDraw = this.progress.getChildByName('progressContent').getComponent(cc.Graphics)
            progressDraw.fillColor = new cc.Color().fromHEX('#FFCA00')
            progressDraw.roundRect(-248, -20, 498 * percent, 40, 20)
            progressDraw.fill()

            this.progressNumber.string = Math.ceil(percent * 100) + '%'
            if (progress >= (this.initSceneCount * 8 * 2)) {
                this.isLoad = true
                this.showStartButton()
            }
        }
    },
    /**
     * 加载远程资源
     **/
    loadRemoteAssets () {
        const that = this
        // 优化 并发控制 每次最多10个请求
        let resourceUrl = []
        for (var i = 1; i <= this.initSceneCount;i++) {
            for(var j = 1; j <= 8;j++) {
                resourceUrl.push(`${constant.rootWxCloudPath}monsters/scene${i}/s${i}_monster${j}.png`);
                resourceUrl.push(`${constant.rootWxCloudPath}monsters/scene${i}/s${i}_monster${j}_shadow.png`);
            }
        }
        App.getResourceRealUrlArray(resourceUrl).then((fileList) => {
            Array.isArray(fileList) && fileList.forEach((fileItem) => {
                const { tempFileURL: url } = fileItem
                cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
                    that.drawProgress(++that.progressCount) 
                })
            });
        });
    },
    showStartButton() {
        this.launch1.active = false
        this.launch2.active = true

        request.getUserInfo().then(data => {
            console.log('userInfo', data)
            App.setUserInfo(data)
            this.showPlayButton()
        }).catch(this.showUserInfoButton)
    },
    showPlayButton() {
        this.launchButton.active = true
        const ctx = this.launchButton.getChildByName('bg').getComponent(cc.Graphics)
        ctx.fillColor = new cc.Color().fromHEX('#0799e3')
        ctx.roundRect(-165, -50.5, 330, 101, 50)
        ctx.fill()
        
        this.launchButton.on('touchend', () => {
            cc.director.loadScene('catchmonster')  
        })
    },
    showUserInfoButton() {
        if (typeof wx == 'undefined') return
        const button = wx.createUserInfoButton({
          type: 'text',
          text: '开始游戏',
          style: {
            left: 110,
            top: 590,
            width: 170,
            height: 65,
            lineHeight: 65,
            backgroundColor: '#0799e3',
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 24,
            borderRadius: 65
          }
        })
        button.show()
        button.onTap((res) => {
          if (res.errMsg == 'getUserInfo:ok') {
            const { userInfo } = res
            const { nickName, gender, avatarUrl } = userInfo
            App.setUserInfo(userInfo)
            request.updateUserInfo({
              nickName,
              gender,
              avatarUrl
            }).then(() => { button.hide() }).catch(() => { button.show() })
            cc.director.loadScene('catchmonster')
          }
        })
    }
})
