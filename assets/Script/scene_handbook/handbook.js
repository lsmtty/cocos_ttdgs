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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let c = this.node.getComponent(cc.Canvas);
        c.fitHeight = true;
        c.fitWidth = false;

        let h = 750 * cc.winSize.height / cc.winSize.width;

        c.designResolution = new cc.Size(750, h);
        this.node.setContentSize(750, h);

        // 适配解决方案
        let _canvas = cc.Canvas.instance;
        // 设计分辨率比
        let _rateR = _canvas.designResolution.height/_canvas.designResolution.width;
        // 显示分辨率比
        let _rateV = cc.winSize.height/cc.winSize.width;
        if (_rateV > _rateR)
        {
            _canvas.fitHeight = false;
            _canvas.fitWidth = true;
        }
        else
        {
            _canvas.fitHeight = true;
            _canvas.fitWidth = false;
        }
        cc.director.setClearColor(new cc.Color(89,81,78));
        let returnBtn = cc.find('Canvas/background/返回按钮@2x')
        returnBtn.on('touchend', this.goback)
        this.showUserInfoButton()
    },

    goback() {
        cc.director.loadScene('catchmonster')
    },
    showUserInfoButton() {
        // let button = wx.createUserInfoButton({
        //     type: 'text',
        //     text: '获取用户信息',
        //     style: {
        //         left: 175,
        //         top: 76,
        //         width: 200,
        //         height: 40,
        //         lineHeight: 40,
        //         backgroundColor: '#ff0000',
        //         color: '#ffffff',
        //         textAlign: 'center',
        //         fontSize: 16,
        //         borderRadius: 4
        //     }
        // })
        // button.show();
        // button.onTap((res)=>{
        //     if (res.errMsg = 'getUserInfo:ok') {
        //         this.userInfo = res.userInfo
        //         this.drawUserData()
        //     }
        // });
    }
});
