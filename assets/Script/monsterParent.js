// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import mathUtil from './utils/mathUtil'
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
        monster: {
            default: null,
            type: cc.Node
        },
        blood: {
            default: null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.randomRun()
    },

    randomRun() {
        let minX = Math.max(50 + 90, this.node.x - 90),
        maxX = Math.min(750 - 50 - 90, this.node.x + 90),
        minY = Math.max(672, this.node.y - 90),
        maxY = Math.min(672 + 300, this.node.y + 90)
        let moveAction = cc.moveTo(0.5, cc.v2(mathUtil.getRandom(minX, maxX), mathUtil.getRandom(minY, maxY)))
        let callback = cc.callFunc(this.randomRun, this)
        this.node.runAction(cc.sequence(moveAction, callback))
    },

    hurt(damage) {
        let bloodNode = new cc.Node('blood node')
        let bloodLabel = bloodNode.addComponent(cc.Label)
        bloodLabel.fontSize = 42
        bloodLabel.string = '-' + damage
        bloodNode.color = cc.color(255,85,85)
        bloodNode.parent = this.node
        bloodNode.y = 170
        let moveAction = cc.moveTo.call(bloodNode, 0.5, cc.v2(0, 260))
        let callback = cc.callFunc(() => {
            bloodNode.destroy()
        }, this)
        // tosolve bug 应为血量移动，现在 this.node指向了怪兽本身
        // this.node.runAction(cc.sequence(moveAction, callback)) 
    },

    start () {

    },

    // update (dt) {},
});
