// 抓捕怪兽 主场景
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
        },
        cardParent: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
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
        console.log("winSize: rateR: "+_rateR+" rateV: "+_rateV);
        if (_rateV > _rateR)
        {
            _canvas.fitHeight = false;
            _canvas.fitWidth = true;
            // console.log("tttttt","winSize: fitWidth");
        }
        else
        {
            _canvas.fitHeight = true;
            _canvas.fitWidth = false;
            // console.log("tttttt","winSize: fitHeight");
        }
        this.monsterParent = this.node.getChildByName('monsterBox')
    },

    catchedMonster() {
        this.node.getChildByName('monsterBox')
    },

    getANewMonster() {
        if (this.monsterParent) {
            this.monsterParent.refreshNew()
        }
    },

    showCard(sceneId, monsterId) {
        let root = cc.find('Canvas')
        let monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
        this.cardParent.getComponent('cardParent').showCard(monsterData, 0)
    },

    // called every frame
    update: function (dt) {

    },
    getMonsterData(sceneId, monsterId) {
        // cc.sys.localStorage.getItem('monsterData');
        return {
            blood: 100,
            name: '比卡丘',
            id: 1,
            sceneId,
            monsterId
        }
    }
});
