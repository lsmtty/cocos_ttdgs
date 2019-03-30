import mathUtil from './utils/mathUtil'
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.watchMonster()
    },
    watchMonster() {
        let monster = cc.find('Canvas/background/monsterBox')
        if (monster) {
            let r = mathUtil.getRotation({ x: this.node.x + 273, y: this.node.y + 272}, { x: monster.x, y: monster.y})
            let rotation = cc.rotateTo(0.2, r - 90)
            let callback = cc.callFunc(this.watchMonster, this)
            this.node.runAction(cc.sequence(rotation, callback))
        }
    },
    start () {

    },

    rowAnimate() {
        let beSmall = cc.scaleTo(0.2, 1, 0.8)
        let beLarge = cc.scaleTo(0.2, 1, 1)
        this.node.runAction(cc.sequence(beSmall, beLarge))
    },

    update (dt) {
        
    }
});
