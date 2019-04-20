import globalUtil from './utils/globalUtil'
cc.Class({
    extends: cc.Component,

    properties: {
        monsterId: {
            default: 1,
            type: cc.Integer
        },
        fullblood: {
            default: 100,
            type: cc.Integer
        },
        currentBlood: {
            default: 100,
            type: cc.Integer
        }
    },

    onLoad () {
        let beSmall = cc.scaleTo(0.25, 1, 0.9)
        let beLarge = cc.scaleTo(0.25, 1, 1)
        this.node.runAction(cc.repeatForever(cc.sequence(beSmall, beLarge))) 

        // 添加碰撞检测
        cc.director.getCollisionManager().enabled = true
        cc.director.getCollisionManager().enabledDebugDraw = globalUtil.isDebug
        cc.director.getCollisionManager().enabledDrawBoundingBox = globalUtil.isDebug
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
        parent.active = false
        parent.getComponent('monsterParent').showCard()
    },
    refreshNew() {
        if (this.progressBar) {
            this.progressBar.progress = this.currentBlood / this.fullblood
        }
    },

    update (dt) {
    },
});
