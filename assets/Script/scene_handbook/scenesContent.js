import { App } from '../utils/App'
import constant from '../utils/constant'

cc.Class({
  extends: cc.Component,

  properties: {
    sceneItem: {
      default: null,
      type: cc.Prefab
    },
    monsterItem: {
      default: null,
      type: cc.Prefab
    }
  },

  onLoad () {
    const monsterData = JSON.parse(cc.sys.localStorage.getItem('monsterData'))
    const { scenes } = monsterData.result.data
    scenes.forEach((scene, index) => {
      this.createScene(scene, index)
    })
  },

  createScene(sceneData, index) {
    const scene = cc.instantiate(this.sceneItem)
    const { name, monsters, id } = sceneData
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(scene)
    scene.setAnchorPoint(0, 1)
    scene.setScale(1, 1)
    scene.setPosition(cc.v2(0, -464 * (index - -1)))
    const sceneHeader = scene.getChildren()[0]
    const sceneName = sceneHeader.getChildByName('SceneName').getComponent(cc.Label)
    const sceneMonster = scene.getChildByName('SceneMonsters')
    let ownCount = 0
    monsters.forEach(monster => {
      ownCount += monster.own != 0
    })
    sceneName.string = `${name} (${ownCount}/${monsters.length})`
    this.createMonsters(monsters, sceneMonster, id)
  },

  createMonsters(monsters, sceneMonster, sceneId) {
    monsters.forEach(item => {
      const { id: monsterId, own } = item
      const monster = cc.instantiate(this.monsterItem)
      const monsterScript = monster.getComponent('monsterItem')
      monsterScript.sceneId = sceneId
      monsterScript.monsterData = item
      const ctx = monster.getComponent(cc.Graphics)
      ctx.fillColor = new cc.Color().fromHEX('#FFFFFF')
      ctx.roundRect(0, 0, 150, 150, 20)
      ctx.fill()

      sceneMonster.addChild(monster)
      const monsterImg = monster.getChildByName('MonsterImg')
      const monsterCount = monster.getChildByName('MonsterLableParent').getChildByName('MonsterCount')
      if (own != 0) {
        const countStringCtx = monster.getChildByName('MonsterLableParent').getComponent(cc.Graphics)
        monster.getChildByName('MonsterLableParent').opacity = 255
        countStringCtx.fillColor = new cc.Color().fromHEX('#FF5900')
        countStringCtx.roundRect(0, 0, 55, 28, 14)
        countStringCtx.fill()
        const countLabel = monsterCount.getComponent(cc.Label)
        countLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT
        countLabel.string = own
      }
      const loadUrl = `monsters/${sceneId}/${monsterId}${own == 0 ? '_shadow' : ''}`

      App.getResourceRealUrl(`${constant.rootWxCloudPath}${loadUrl}.png`)
        .then(url => {
          cc.loader.load(`${url}?aa=aa.jpg`, (err, texture) => {
            const fra = monsterImg.getComponent(cc.Sprite)
            const sframe = new cc.SpriteFrame(texture)
            fra.spriteFrame = sframe
          })
        })
    })
  }
})
