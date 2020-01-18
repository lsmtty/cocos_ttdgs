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
        confirm: () => {},
        cancel: () => {},
        title: '确定送出这只怪兽吗?',
        maskBg: {
            type: cc.Node,
            default: null
        },
        dialog: {
            type: cc.Node,
            default: null
        },
        confirmBtn: {
            type: cc.Node,
            default: null
        },
        cancelBtn: {
            type: cc.Node,
            default: null
        }
    },

    onLoad () {
        let _this = this
        this.confirmBtn.on('touchend', () => {
            _this.confirm()
            _this.node.active = false
        });
        this.maskBg.on('touchend', function() {
            return false;
        })
        this.cancelBtn.on('touchend', () => {
            _this.cancel()
            _this.node.active = false
        })
        const ctx = this.dialog.getComponent(cc.Graphics)
        ctx.fillColor = new cc.Color().fromHEX('#ffffff')
        ctx.roundRect(0, 0, 602, 346, 20);
        ctx.fill()
        ctx.fillColor = new cc.Color().fromHEX('#FFF4D9');
        ctx.roundRect(10, 10, 582, 326, 18);
        ctx.fill();
    }
});
