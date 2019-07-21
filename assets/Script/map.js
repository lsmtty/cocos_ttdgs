// 底图
cc.Class({
    extends: cc.Component,

    properties: {
        mapDetail: [],
        entry1: {
            default: null,
            type: cc.Node
        },
        entry2: {
            default: null,
            type: cc.Node
        },
        entry3: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        let mosters = [
            {
                scene: 'scene1',
                number: 6
            },
            {
                scene: 'scene2',
                number: 0
            },
            {
                scene: 'scene3',
                number: 0
            }
        ]
        let limit = [
            {
                scene: 'scene1',
                limit: 5,
                nextScene: 'scene2'
            },
            {
                scene: 'scene2',
                limit: 5,
                nextScene: 'scene3'
            },
            {
                scene: 'scene3',
                limit: 5,
                nextScene: null
            },
        ]
        this.mapDetail.push("scene1")
        this.showMapDetail(mosters, limit)
    },

    showMapDetail (mosters, limit) {
        mosters.map((item, index) => {
            if (item.number >= limit[index].limit) {
                this.mapDetail.push(limit[index].nextScene)
            }
        })

        this.mapDetail.map(item => {
            let index = /\d+/.exec(item)[0]
            let entryId = 'entry' + index

            this.node.getChildByName(entryId).opacity = 255
        })
        this.node.getChildByName('entry2').on('touchstart', (e) => { console.log(e)}, this)
        this.node.getChildByName('entry3').on('touchstart', (e) => { console.log(e)}, this)
    },

    catchedMonster() {
        this.node.getChildByName('monsterBox')
    },

    getANewMonster() {
        if (this.monsterParent) {
            this.monsterParent.refreshNew()
        }
    },

    // called every frame
    update: function (dt) {

    }
});
