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
        let { name, monsters } = sceneData
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(scene)
        scene.setAnchorPoint(0, 1)
        scene.setScale(1, 1)
        scene.setPosition(cc.v2(0, -464 * (index - -1)))
        let sceneHeader = scene.getChildren()[0]
        let sceneName = sceneHeader.getChildByName('SceneName')
        // sceneName.string = ` ${sceneData.name}`
        let sceneMonster = sceneHeader.getChildByName('SceneMonsters')
        let ownCount = 0
        monsters.forEach(monster => {
            ownCount += monster.own != 0
        })
        sceneName.string = ` ${name} (${ownCount} / ${monsters.count})`
        //monsters.string = `(${ownCount} / ${monsters.count})`
    },

    start () {

    },

    // update (dt) {},
});
