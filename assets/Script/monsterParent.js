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
        sceneId: {
            default: 1,
            type: cc.Integer
        },
        monster: {
            default: null,
            type: cc.Node
        },
        blood: {
            default: null,
            type:cc.Node
        },
        blooding: {
            default: null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.refreshNew()
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
        let bleedingAnim = this.blooding.getComponent(cc.Animation)
        bleedingAnim.play('blooding')

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
        // tosolve bug 应为血量文字移动，现在 this.node指向了怪兽本身
        // this.node.runAction(cc.sequence(moveAction, callback)) 
    },

    start () {

    },

    refreshNew() {
        let _this = this
        let monsterId = mathUtil.getRandomNum(1, 8)
        let monsterData = this.getMonsterData()
        this.monster.getComponent('monster').fullBlood = this.monster.getComponent('monster').currentBlood = monsterData.blood
        let loadUrl = `monsters/scene${_this.sceneId}/s${_this.sceneId}_monster${monsterId}.png`
        cc.loader.loadRes(loadUrl, cc.SpriteFrame, function (err, spriteFrame) {
            _this.monster.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    },
    getMonsterData() {
        return {
            blood: 100,
            name: '比卡丘',
            id: 1
        }
    }

    // update (dt) {},
});
