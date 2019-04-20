// 弓箭整体父级
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
            this.arrowStretch(e)
        })
        this.node.on('touchend', (e) => {
            this.shootArrow()
        }, this)
        this.node.on('touchcancel', (e) => {
            this.shootArrow()
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
        newArrow.setPosition(cc.v2(0, -73))
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
    },
    arrowStretch(e) {
        let {_prevPoint, _startPoint} = e.touch
        let moveLength = Math.sqrt(Math.pow(_prevPoint.x - _startPoint.x, 2) + Math.pow(_prevPoint.y - _startPoint.y, 2))
        moveLength = moveLength < 100 ? moveLength : 100
        this.arrow.setPosition(cc.v2(0, -73 - moveLength / 2))
        this.row.getComponent('row').drawLines(-60 - moveLength / 2)
    },
    shootArrow() {
        if (this.arrow) {
            this.playShootAudio()
            this.arrow.getComponent('arrow').shooting()
            this.row.getComponent('row').drawLines(-60)
        }
        let timer = setTimeout(() => {
            this.createArrow()
            clearTimeout(timer)
        }, 200)  
    }
});
