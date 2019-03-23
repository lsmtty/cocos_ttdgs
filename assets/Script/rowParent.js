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
        arrowrPrefab: {
            default: null,
            type: cc.Prefab
        },
        row : {
            default: null,
            type: cc.Node
        },
        shootAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad () {
        let _this = this
        this.node.on('touchstart',() => {
            _this.row.getComponent('row').rowAnimate()
        },this);
        this.node.on('touchend', function() {
            _this.createArrow()
        }, this)
    },

    createArrow() {
        let newArrow = cc.instantiate(this.arrowrPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newArrow);
        this.playShootAudio()
        let monster = cc.find('Canvas/background/monster')
        newArrow.setAnchorPoint(0.5, 0)
        newArrow.getComponent('arrow').monster = monster;
        newArrow.rotation = this.row.rotation
        newArrow.setPosition(cc.v2(100, 15));
    },

    start () {

    },

    playShootAudio: function() {
        cc.audioEngine.playEffect(this.shootAudio, false)
    }
});
