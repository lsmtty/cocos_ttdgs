// 抓捕怪兽 主场景
import * as globalUtil from './utils/globalUtil';
cc.Class({
    extends: cc.Component,

    properties: {
        rowParent: {
            default: null,
            type: cc.Node
        },
        monsterParent: {
            default: null,
            type: cc.Node
        },
        cardParent: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.initGameData()
        let c = this.node.getComponent(cc.Canvas);
        c.fitHeight = true;
        c.fitWidth = false;

        let h = 750 * cc.winSize.height / cc.winSize.width;

        c.designResolution = new cc.Size(750, h);
        this.node.setContentSize(750, h);

        // 适配解决方案
        let _canvas = cc.Canvas.instance;
        // 设计分辨率比
        let _rateR = _canvas.designResolution.height/_canvas.designResolution.width;
        // 显示分辨率比
        let _rateV = cc.winSize.height/cc.winSize.width;
        console.log("winSize: rateR: "+_rateR+" rateV: "+_rateV);
        if (_rateV > _rateR)
        {
            _canvas.fitHeight = false;
            _canvas.fitWidth = true;
        }
        else
        {
            _canvas.fitHeight = true;
            _canvas.fitWidth = false;
        }
        this.monsterParent = this.node.getChildByName('monsterBox')
    },

    catchedMonster() {
        this.node.getChildByName('monsterBox')
    },

    getANewMonster() {
        if (this.monsterParent) {
            this.monsterParent.refreshNew()
        }
    },

    showCard(sceneId, monsterId) {
        let root = cc.find('Canvas')
        let monsterData = root.getComponent('catchmonster').getMonsterData(sceneId, monsterId)
        this.cardParent.getComponent('cardParent').showCard(monsterData)
    },
    saveMonster(sceneId, monsterId) {
        let { scenes } =  this.monsterData.result.data
        let targetScene = {}
        scenes.forEach(scene => {
            if (scene.id === `scene${sceneId}`) {
                targetScene = scene
            }
        })
        targetScene.monsters.forEach(monster => {
            if (monster.id == `s${sceneId}_monster${monsterId}`) {
                monster.own++;
            }
        })
        cc.sys.localStorage.setItem('monsterData', JSON.stringify(this.monsterData))
    },
    getMonsterData(sceneId, monsterId) {
        let { scenes } =  this.monsterData.result.data
        let targetScene = {}
        scenes.forEach(scene => {
            if (scene.id === `scene${sceneId}`) {
                targetScene = scene
            }
        })
        let targetMonster = {}
        let targetId = `s${sceneId}_monster${monsterId}`
        targetScene.monsters.forEach(monster => {
            if (monster.id == targetId) {
                targetMonster = monster
            }
        })
        return {
            blood: targetMonster.life,
            name: targetMonster.name,
            own: targetMonster.own,
            sceneId,
            monsterId
        }
    },
    initGameData() {
        let monsterData = JSON.parse(cc.sys.localStorage.getItem('monsterData'));
        if (monsterData && globalUtil.isDebug && globalUtil.needRefreshStorage) {
            monsterData = require('./mockData/gameData')
            cc.sys.localStorage.setItem('monsterData', JSON.stringify(monsterData))
        }
        this.monsterData = monsterData;
    }
});
