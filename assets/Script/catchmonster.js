cc.Class({
    extends: cc.Component,

    properties: {
        rowParent: {
            default: null,
            type: cc.Node
        },
        monsterParent: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        let c = this.node.getComponent(cc.Canvas);
        console.log('tttttt', cc.winSize.height, cc.winSize.width)
        c.fitHeight = true;
        c.fitWidth = false;

        let h = 960 * cc.winSize.height / cc.winSize.width;

        c.designResolution = new cc.Size(960, h);
        this.node.setContentSize(960, h);

        // 适配解决方案
        let _canvas = cc.Canvas.instance;
        // 设计分辨率比
        let _rateR = _canvas.designResolution.height/_canvas.designResolution.width;
        // 显示分辨率比
        let _rateV = cc.winSize.height/cc.winSize.width;
        console.log("winSize: rateR: "+_rateR+" rateV: "+_rateV);
        if (_rateV > _rateR)
        {
            _canvas.fitHeight = false;
            _canvas.fitWidth = true;
            console.log("tttttt","winSize: fitWidth");
        }
        else
        {
            _canvas.fitHeight = true;
            _canvas.fitWidth = false;
            console.log("tttttt","winSize: fitHeight");
        }
    },

    // called every frame
    update: function (dt) {

    }
});
