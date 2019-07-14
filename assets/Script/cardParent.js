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
    const ctx = this.node.getComponent(cc.Graphics)
    ctx.fillColor = new cc.Color().fromHEX('#FFF4D9')
    ctx.roundRect(0, 0, 582, 774, 20)
    ctx.fill()
  },

  /**
     * 展示收藏卡片
     * @param {Object} monsterData
     */
  showCard(monsterData) {
    this.node.parent.active = true
    this.node.monsterData = monsterData
    const labelName = this.node.getChildByName('monster_name').getComponent(cc.Label)
    const labelOwn = this.node.getChildByName('monster_own').getComponent(cc.Label)
    if (monsterData.own > 0) {
      this.node.getChildByName('icon_new').active = false
    }
    labelName.string = `捕获${monsterData.name}`
    labelOwn.string = `我拥有${monsterData.own}只`
    const loadUrl = `monsters/scene${monsterData.sceneId}/s${monsterData.sceneId}_monster${monsterData.monsterId}`
    cc.loader.loadRes(loadUrl, cc.SpriteFrame, (err, spriteFrame) => {
      this.monster.getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
  },
  handleSave(e) {
    const { monsterData } = e.target.parent
    const { name, sceneId, monsterId } = monsterData
    Toast.makeText(`保存一个${name}`, Toast.LENGTH_SHORT).show()
    cc.find('Canvas').getComponent('catchmonster').saveMonster(sceneId, monsterId)
    e.target.parent.getComponent('cardParent').refreshMonster()
  },
  handleSend(e) {
    const { monsterData } = e.target.parent
    const { name } = monsterData
    Toast.makeText(`送出一个${name}`, Toast.LENGTH_SHORT).show()
    e.target.parent.getComponent('cardParent').refreshMonster()
  },
  refreshMonster() {
    this.node.parent.active = false
    cc.find('Canvas/background/monsterBox').getComponent('monsterParent').refreshNew()
  }
})
