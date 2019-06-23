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
        entries: [],
        monsterData: []
    },

    onLoad () {
        this.entries = this.getEntries();

        this.cleanEntries()

        this.setEntryActive(this.entries[0])
        this.setEntryActive(this.entries[1])

        this.showArrow(this.entries[0])
        this.showArrow(this.entries[1])

        this.entries.forEach((item, index) => {
            let arrow = item.children[0]
            let title = item.children[1]

            arrow.on('touchend', () => {
                this.showTitle(item)
            })
            title.on('touchend', () => {
                this.showArrow(item)
            })
            title.children[3].on('touchend', (e) => {
                e.stopPropagation()
                alert(`点击进入场景${index}`)
            })
        })

    },

    cleanEntries () {
        this.entries.forEach(item => {
            item.isActive = false
            let arrow = item.children[0]
            let title = item.children[1]
            arrow.active = false
            title.active = false
            title.opacity = 255
            arrow.opacity = 255
        })
    },

    getEntries () {
        let monsterData = cc.sys.localStorage.getItem('monsterData')
        monsterData = monsterData ? monsterData : monsterData = require('./mockData/gameData')
        monsterData = JSON.parse(monsterData)
        console.log(monsterData)
        this.monsterData = monsterData.result.data
        let scenes = this.monsterData.scenes
        let entries = this.node.children.filter(item => /entry/.test(item._name))
        entries.forEach((item, index) => {
            if (scenes[index]) {
                item.children[1].children[0].getComponent(cc.Label).string = scenes[index].name;
                item.children[1].children[1].getComponent(cc.Label).string = 0;
                item.children[1].children[2].getComponent(cc.Label).string = '/' + scenes[index].monsters.length;
            }
        })
        return entries
    },
    setEntryActive (entry) {
        entry.isActive = true;
    },

    showArrow (entry) {
        this.entries.forEach(item => {
            let arrow = item.children[0]
            let title = item.children[1]

            let isActive = item.isActive

            if (item != entry) {
                arrow.active = isActive ? true : false
                title.active = false
            } else {
                arrow.active = true
                title.active = false
            }
        })
    },
    showTitle (entry) {
        this.entries.forEach(item => {
            let arrow = item.children[0]
            let title = item.children[1]

            let isActive = item.isActive

            if (item != entry) {
                arrow.active = isActive ? true : false
                title.active = false
            } else {
                arrow.active = false
                title.active = true
            }
        })
    },

    goBack() {
        cc.director.loadScene("catchmonster")
    },

    start () {

    }
});
