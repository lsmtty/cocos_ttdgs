import globalUtil from './utils/globalUtil'
cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 600,
            type: cc.Integer
        },
        attack: {
            default: 10,
            type: cc.Integer
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isShooting = false
        cc.director.getCollisionManager().enabled = true
        cc.director.getCollisionManager().enabledDebugDraw = globalUtil.isDebug
        cc.director.getCollisionManager().enabledDrawBoundingBox = globalUtil.isDebug
    },

    getMonsterDistance() {
        // 根据 monster 节点位置判断距离
        let monsterPos = this.monster.getPosition();
        // 根据两点位置计算两点之间距离
        let dist = this.node.position.sub(monsterPos).mag();
        return dist;
    },

    onCollisionEnter: function (other) {
        // cc.Object.prototype.destroy.call(this.node)
        // this.active = false  // 会导致
    },

    update (dt) {
        if (this.isShooting) {
            this.node.x += this.speed * dt * Math.sin(this.node.rotation * Math.PI / 180)
            this.node.y += this.speed * dt * Math.cos(Math.abs(this.node.rotation) * Math.PI / 180)
        }
    },
    shooting() {
        this.isShooting = true
    }
});
