// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let monsterData = JSON.parse(cc.sys.localStorage.getItem('monsterData'))
        let { scenes } = monsterData.result.data
        scenes.forEach((scene, index) => {
            this.createScene(scene, index)
        })
    },

    createScene(sceneData, index) {
        let scene = cc.instantiate(this.sceneItem);
        let { name, monsters,id } = sceneData
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(scene)
        scene.setAnchorPoint(0, 1)
        scene.setScale(1, 1)
        scene.setPosition(cc.v2(0, -464 * (index - -1)))
        let sceneHeader = scene.getChildren()[0]
        let sceneName = sceneHeader.getChildByName('SceneName').getComponent(cc.Label)
        let sceneMonster = scene.getChildByName('SceneMonsters')
        let ownCount = 0
        monsters.forEach(monster => {
            ownCount += monster.own != 0
        })
        sceneName.string = `${name} (${ownCount}/${monsters.length})`
        this.createMonsters(monsters, sceneMonster, id)
    },

    createMonsters(monsters, sceneMonster, sceneId) {
        monsters.forEach(item => {
            let { id : monsterId, own } = item
            let monster = cc.instantiate(this.monsterItem)
            let ctx = monster.getComponent(cc.Graphics);
            ctx.fillColor = new cc.Color().fromHEX('#FFFFFF')
            ctx.roundRect(0, 0 , 150, 150, 20);
            ctx.fill();

            sceneMonster.addChild(monster)
            let monsterImg = monster.getChildByName('MonsterImg')
            let monsterCount = monster.getChildByName('MonsterLableParent').getChildByName('MonsterCount')
            if (own != 0) {
                let countStringCtx = monster.getChildByName('MonsterLableParent').getComponent(cc.Graphics);
                monster.getChildByName('MonsterLableParent').opacity = 255
                countStringCtx.fillColor = new cc.Color().fromHEX('#FF5900')
                countStringCtx.roundRect(0, 0, 55, 28, 14)
                countStringCtx.fill()
                let countLabel = monsterCount.getComponent(cc.Label)
                countLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT
                countLabel.string = own
            }
            let loadUrl = `monsters/${sceneId}/${monsterId}${own == 0 ? '_shadow' : ''}`
            cc.loader.loadRes(loadUrl, cc.SpriteFrame, (err, spriteFrame) => {
                monsterImg.getComponent(cc.Sprite).spriteFrame = spriteFrame
            })
        })
    },

    start () {

    },

    // update (dt) {},
});
