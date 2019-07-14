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
        refreshButton: {
           default: null,
           type: cc.Node 
        },
        refreshLabel: {
            default: null,
            type: cc.Label
        }
    },

    onLoad () {
        const ctx = this.refreshButton.getComponent(cc.Graphics)
        ctx.fillColor = new cc.Color(242,48,111,1)
        ctx.roundRect(0, 0, 284, 90, 45)
        ctx.fill()
        this.refreshButton.on('touchend', () => {
            this.refreshByRabbit()
        })
        this.node.active = false
        this.root = cc.find('Canvas').getComponent('catchmonster')
    },

    start () {

    },

    show() {
        this.node.active = true
        const label = this.refreshLabel.getComponent(cc.Label)
        setInterval(() => {
            let date = Date.now() + this.root.serverTimeGap
            let overTime = 3600 * 1000 - date % (3600 * 1000)
            let minutes = parseInt((overTime % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = parseInt((overTime % (1000 * 60)) / 1000);
            label.string = `${minutes}分${seconds}秒后会有新怪物出现喔！！！`
        }, 1000)
    },

    hide() {
        this.node.active = false
    },

    refreshByRabbit() {
        cc.find('Canvas').getComponent('catchmonster').getANewMonster()
        this.node.active = false
    }

    // update (dt) {},
});
