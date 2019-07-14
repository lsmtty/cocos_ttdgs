import constant from './utils/constant'
cc.Class({
  extends: cc.Component,

  properties: {
    monsterId: {
      default: 1,
      type: cc.Integer
    },
    fullblood: {
      default: 100,
      type: cc.Integer
    },
    currentBlood: {
      default: 100,
      type: cc.Integer
    }
  },

  onLoad () {
    const beSmall = cc.scaleTo(0.25, 1, 0.9)
    const beLarge = cc.scaleTo(0.25, 1, 1)
    this.node.runAction(cc.repeatForever(cc.sequence(beSmall, beLarge)))

    // 添加碰撞检测
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = constant.isDebug
    cc.director.getCollisionManager().enabledDrawBoundingBox = constant.isDebug
    this.progressBar = this.node.parent.getChildByName('bloodParent').getChildByName('bloodbar').getComponent(cc.ProgressBar)
    this.showNet = false // 保证只有一个抓捕网兜
  },

  start () {

  },

  onCollisionEnter: function (other) {
    const arrow = other.getComponent('arrow')
    if (arrow) {
      this.currentBlood = this.currentBlood - arrow.attack
      this.node.parent.getComponent('monsterParent').hurt(arrow.attack)
      this.progressBar.progress = this.currentBlood / this.fullblood
      if (this.currentBlood <= 0 && !this.showNet) {
        this.onCatched()
        this.showNet = true
      }
    }
  },

  onCatched() {
    const parent = this.node.parent
    parent.getComponent('monsterParent').monsterCatched()
    this.progressBar.node.active = false
    // 创建捕捉效果
    cc.loader.loadRes('monster_net', cc.SpriteFrame, (err, spriteFrame) => {
      if (err) {
        cc.error(err)
        return
      }
      const rootBg = cc.find('Canvas/background')
      // 背景图片设置
      const bgNode = new cc.Node()
      // 背景图片透明度
      bgNode.setPosition(cc.v2(parent.x, 1334))
      bgNode.width = 400
      bgNode.height = 700
      bgNode.setAnchorPoint(0.5, 0)
      const bgSprite = bgNode.addComponent(cc.Sprite)
      bgSprite.spriteFrame = spriteFrame
      const bgLayout = bgNode.addComponent(cc.Layout)
      bgLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER
      rootBg.addChild(bgNode)
      const netDown = cc.moveTo(2, parent.x, parent.y - 90)
      const netUp = cc.moveTo(1, parent.x, 1370)
      bgNode.runAction(cc.sequence(netDown, netUp))
      const timer1 = setTimeout(() => {
        this.hideMonster()
        clearTimeout(timer1)
      }, 2000)
      const timer2 = setTimeout(() => {
        // 移除网兜 让怪兽销毁
        this.showCard()
        this.showNet = false
        if (cc.isValid(bgNode)) {
          bgNode.destroy()
        }
        clearTimeout(timer2)
      }, 3000)
    })
  },
  hideMonster() {
    const parent = this.node.parent
    parent.active = false
  },
  showCard() {
    const parent = this.node.parent
    parent.getComponent('monsterParent').showCard()
  },
  refreshNew() {
    if (this.progressBar) {
      this.progressBar.node.active = true
      this.progressBar.progress = this.currentBlood / this.fullblood
    }
  }
})
