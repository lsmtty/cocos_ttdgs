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
