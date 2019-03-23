// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import globalUtil from './utils/globalUtil'
cc.Class({
    extends: cc.Component,

    properties: {
        fullblood: {
            default: 100,
            type: cc.Integer
        },
        currentBlood: {
            default: 100,
            type: cc.Integer
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let beSmall = cc.scaleTo(0.25, 1, 0.9)
        let beLarge = cc.scaleTo(0.25, 1, 1)
        this.node.runAction(cc.repeatForever(cc.sequence(beSmall, beLarge))) 

        // 添加碰撞检测
        cc.director.getCollisionManager().enabled = true
        cc.director.getCollisionManager().enabledDebugDraw = globalUtil.isDebug
        cc.director.getCollisionManager().enabledDrawBoundingBox = globalUtil.isDebug
         // 也可以用 find('progress', this)
        this.progressBar = this.node.parent.getChildByName('bloodbar').getComponent(cc.ProgressBar)
    },

    start () {

    },

    onCollisionEnter: function (other) {
        let arrow = other.getComponent('arrow')
        if (arrow) {
            this.currentBlood = this.currentBlood - arrow.attack
            this.node.parent.getComponent('monsterParent').hurt(arrow.attack)
            this.progressBar.progress = this.currentBlood / this.fullblood
            if (this.currentBlood <= 0) {
                this.onCatched()
            }
        }
    },

    onCatched() {
        let parent = this.node.parent
        // 直接调用destory报错
        cc.Object.prototype.destroy.call(parent)
        parent.active = false
    },

    update (dt) {
    },
});
