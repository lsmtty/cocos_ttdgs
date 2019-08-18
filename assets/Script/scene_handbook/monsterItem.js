
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
        let data = e.target.getComponent('monsterItem')
        let { sceneId, monsterData} = data
        monsterData.sceneId = sceneId
        if (monsterData.own != 0) {
            const root = cc.find('Canvas')
            root.getComponent('handbook').showCard(monsterData)
        }
    }
});