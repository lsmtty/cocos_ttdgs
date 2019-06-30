import mathUtil from './utils/mathUtil';
cc.Class({
    extends: cc.Component,

    properties: {
        sceneId: {
            default: 1,
            type: cc.Integer
        },
        monsterId: {
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

    onLoad () {
        this.refreshNew()
        let bloodCtx = this.node.getChildByName('bloodParent').getComponent(cc.Graphics)
        bloodCtx.fillColor = new cc.Color(255,255,255)
        bloodCtx.roundRect(-105, -17, 210, 34, 17)
        bloodCtx.fill()
        bloodCtx.fillColor = new cc.Color().fromHEX('#d8d8d8')
        bloodCtx.roundRect(-100, -12, 200, 24, 12)
        bloodCtx.fill()
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

    // 停止走动
    stopRun() {
        this.node.stopAllActions()
    },

    hurt(damage) {
        let bleedingAnim = this.blooding.getComponent(cc.Animation)
        bleedingAnim.play('blooding')
        let bloodNode = new cc.Node('blood node')
        let bloodLabel = bloodNode.addComponent(cc.Label)
        let outline = bloodNode.addComponent(cc.LabelOutline)
        outline.color = new cc.color(255,255,255)
        outline.width = 4
        bloodLabel.fontSize = 42
        bloodLabel.string = '-' + damage
        bloodNode.color = cc.color(255,85,85)
        bloodNode.parent = this.node
        bloodNode.y = 170

        let moveAction = cc.moveTo.call(bloodNode, 0.5, cc.v2(0, 260))
        let fadeAction = cc.fadeOut(0.5);
        let callback = cc.callFunc(() => {
            bloodNode.destroy()
        }, this)
        bloodNode.runAction(fadeAction)
        bloodNode.runAction(cc.sequence(moveAction, callback)) 
    },

    refreshNew() {
        let _this = this
        this.node.active = true
        this.monsterId = mathUtil.getRandomNum(1, 8)
        this.monster.monsterId = this.monsterId
        let monsterData = cc.find('Canvas').getComponent('catchmonster').getMonsterData(this.sceneId, this.monsterId)
        let monsterScript = this.monster.getComponent('monster')
        monsterScript.fullBlood = monsterScript.currentBlood = monsterData.blood
        monsterScript.refreshNew()
        let loadUrl = `monsters/scene${this.sceneId}/s${this.sceneId}_monster${this.monsterId}`
        cc.loader.loadRes(loadUrl, cc.SpriteFrame, (err, spriteFrame) => {
            this.monster.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
        this.randomRun()
    },
    showCard() {
        this.node.stopAllActions()
        let root = cc.find('Canvas')
        root.getComponent('catchmonster').showCard(this.sceneId, this.monsterId)
    }
});
