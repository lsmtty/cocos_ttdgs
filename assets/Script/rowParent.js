import mathUtil from './utils/mathUtil'
cc.Class({
    extends: cc.Component,

    properties: {
        arrowrPrefab: {
            default: null,
            type: cc.Prefab
        },
        row : {
            default: null,
            type: cc.Node
        },
        shootAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad () {
        this.arrow = null
        this.createArrow()
        this.node.on('touchmove', (e) => {
            this.rowRotate(e)
        })
        this.node.on('touchend', (e) => {
            if (this.arrow) {
                this.playShootAudio()
                this.arrow.getComponent('arrow').shooting()
            }
            let timer = setTimeout(() => {
                this.createArrow()
                clearTimeout(timer)
            }, 30)  
        }, this)
    },

    createArrow() {
        let newArrow = cc.instantiate(this.arrowrPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newArrow)
        this.arrow = newArrow
        let monster = cc.find('Canvas/background/monsterBox')
        newArrow.setAnchorPoint(0.5, 0)
        newArrow.setScale(0.5, 0.5)
        // newArrow.getComponent('arrow').monster = monster
        newArrow.setPosition(cc.v2(0, -73))
    },

    start () {

    },

    playShootAudio: function() {
        cc.audioEngine.playEffect(this.shootAudio, false)
    },
    rowRotate(e) {
        let {_prevPoint, _startPoint} = e.touch
        if (_prevPoint.x != _startPoint.x || _prevPoint.y != _startPoint.y) {
            let r = mathUtil.getRotation({ x: _prevPoint.x, y: _prevPoint.y}, { x: _startPoint.x, y:_startPoint.y})
            let rotation = cc.rotateTo(0.05, r - 90)
            this.node.runAction(rotation)
        }
    }
});
