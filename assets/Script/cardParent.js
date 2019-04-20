
cc.Class({
    extends: cc.Component,

    properties: {
        cardType: {
            default: 'monsterCard'
        },
        monster: {
            type: cc.Node,
            default: null
        },
        sendBtn: {
            type: cc.Node,
            default: null
        },
        saveBtn: {
            type: cc.Node,
            default: null
        }
    },

    onLoad () {
        this.drawBackground()
        this.sendBtn.on('touchend', this.handleSend)
        this.saveBtn.on('touchend', this.handleSave)
    },

    start () {

    },

    drawBackground() {
        let ctx = this.node.getComponent(cc.Graphics);
        ctx.fillColor = new cc.Color().fromHEX('#FFF4D9')
        ctx.rect(0, 0, 582, 774)
        ctx.fill()
    },

    /**
     * 展示收藏卡片
     * @param {Object} monsterData 
     * @param {Integer} type 1: 新加 2：重复添加
     */
    showCard(monsterData, currentCount = 0) {
        this.node.parent.active = true
        this.node.monsterData = monsterData
        let labelName =this.node.getChildByName('monster_name').getComponent(cc.Label)
        let monster = this.node.getChildByName('monster_pic').getComponent(cc.Label)
        let labelOwn = this.node.getChildByName('monster_own').getComponent(cc.Label)
        if (currentCount > 0) {
            this.node.getChildByName('icon_new').active = false
        }
        labelName.string = `捕获${monsterData.name}`
        labelOwn.string = `我拥有${currentCount}只`
        let loadUrl = `monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}.png`
        cc.loader.loadRes(loadUrl, cc.SpriteFrame, (err, spriteFrame) => {
            this.monster.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    },
    handleSave(e) {
        console.log(`保存一个${e.target.parent.monsterData.name}`)
        e.target.parent.getComponent('cardParent').refreshMonster()
    },
    handleSend(e) {
        console.log(`送出一个${e.target.parent.monsterData.name}`)
        e.target.parent.getComponent('cardParent').refreshMonster()
    },
    refreshMonster() {
        this.node.parent.active = false
        cc.find('Canvas/background/monsterBox').getComponent('monsterParent').refreshNew()
    }
});
