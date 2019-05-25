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
        this.showNet = false // 保证只有一个抓捕网兜
    },

    start () {

    },

    onCollisionEnter: function (other) {
        let arrow = other.getComponent('arrow')
        if (arrow) {
            this.currentBlood = this.currentBlood - arrow.attack
            this.node.parent.getComponent('monsterParent').hurt(arrow.attack)
            this.progressBar.progress = this.currentBlood / this.fullblood
            if (this.currentBlood <= 0 && !this.showNet) {
                this.onCatched()
                this.showNet = true
            }
        }
    },

    onCatched() {
        let parent = this.node.parent
        parent.getComponent('monsterParent').stopRun()
        this.progressBar.node.active = false
        // 创建捕捉效果
        cc.loader.loadRes('monster_net', cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                cc.error(err)
                return
            }
            let rootBg = cc.find('Canvas/background')
            // 背景图片设置
            let bgNode = new cc.Node()
            // 背景图片透明度
            bgNode.setPosition(cc.v2(parent.x, 1334))
            bgNode.width = 400
            bgNode.height = 700
            bgNode.setAnchorPoint(0.5 , 0)
            let bgSprite = bgNode.addComponent(cc.Sprite)
            bgSprite.spriteFrame = spriteFrame
            let bgLayout = bgNode.addComponent(cc.Layout)
            bgLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER
            rootBg.addChild(bgNode)
            let netDown = cc.moveTo(2, parent.x, parent.y - 90)
            let netUp = cc.moveTo(1, parent.x, 1334)
            bgNode.runAction(cc.sequence(netDown, netUp))
            let timer1 =  setTimeout(() => {
                this.hideMonster()
                clearTimeout(timer1)
            }, 2000)
            let timer2 = setTimeout(() => {
                this.showCard()
                this.showNet = false
                clearTimeout(timer2)
            }, 3000)
        })
    },
    hideMonster() {
        let parent = this.node.parent
        parent.active = false
    },
    showCard() {
        let parent = this.node.parent
        parent.getComponent('monsterParent').showCard()
    },
    refreshNew() {
        if (this.progressBar) {
            this.progressBar.node.active = true
            this.progressBar.progress = this.currentBlood / this.fullblood
        }
    }
});
