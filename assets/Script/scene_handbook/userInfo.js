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
        userImg: {
            type: cc.Node,
            default: null
        },
        userName: {
            type: cc.Label,
            default: null
        },
        userEarnCount: {
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initData(); 
    },

    start () {

    },

    initData() {
        let userInfo = require('../mockData/userInfoData')
        this.userName.string = userInfo.userName;
        // cc.loader.loadRes(userInfo.avatarUrl, cc.SpriteFrame, (err, spriteFrame) => {
        //     this.userImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        // })
        let ownerCount = 0
        let gameData = JSON.parse(cc.sys.localStorage.getItem('monsterData'))
        let { scenes } =  gameData.result.data
        scenes.forEach(scene => {
            let { monsters } = scene
            monsters.forEach(monster => {
                ownerCount += monster.own != 0
            })
        });
        this.userEarnCount.string = `${ownerCount}种神兽`
    }

    // update (dt) {},
});
