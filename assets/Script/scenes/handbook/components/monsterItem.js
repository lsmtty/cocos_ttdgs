
cc.Class({
  extends: cc.Component,

  properties: {
    sceneId: {
      type: cc.String,
      default: '1'
    },
    monsterData: {
      type: cc.Object,
      default: {}
    }
  },

  onLoad () {
    this.node.on('touchend', this.showCard)
  },

  showCard(e) {
    const data = e.target.getComponent('monsterItem')
    const { sceneId, monsterData } = data
    monsterData.sceneId = sceneId.split('scene')[1]
    monsterData.monsterId = monsterData.id.split('monster')[1]
    if (monsterData.own != 0) {
      const root = cc.find('Canvas')
      root.getComponent('handbook').showCard(monsterData)
    }
  }
})
