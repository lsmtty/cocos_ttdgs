import { App } from '../../utils/App'

const BASE_CONDITION_COUNT = 5

cc.Class({
  extends: cc.Component,

  properties: {
    entries: [],
    monsterData: [],
    BASE_CONDITION_COUNT
  },

  onLoad () {
    // 获取数据
    this.monsterData = App.getGameData()

    // 获取UI上的入口
    this.entries = this.getEntries()

    // 重置入口状态
    this.cleanEntries()

    // 根据条件设置入口状态
    this.setEntries()

    // 绑定点击事件
    this.entries.forEach((item, index) => {
      const arrow = item.children[0]
      const title = item.children[1]
      const enterBtn = title.children[3]

      arrow.on('touchend', () => {
        this.showTitle(item)
      })
      title.on('touchend', () => {
        this.showArrow(item)
      })
      enterBtn.on('touchend', e => {
        e.stopPropagation()
        cc.sys.localStorage.setItem('lastSceneId', '' + (index + 1))
        cc.director.loadScene('catchmonster')
      })
    })
  },

  setEntries () {
    const scenes = this.monsterData.scenes
    this.showArrow(this.entries[0])
    this.setEntryActive(this.entries[0])
    scenes.forEach((item, index) => {
      let monstersCount = 0
      item.monsters.forEach(monster => {
        if (monster.own > 0) {
          monstersCount++
        }
      })
      this.entries[index].children[1].children[1].getComponent(cc.Label).string = monstersCount
      if (monstersCount > this.BASE_CONDITION_COUNT && this.entries[index + 1]) {
        this.setEntryActive(this.entries[index + 1])
        this.showArrow(this.entries[index + 1])
      }
    })
  },

  cleanEntries () {
    this.entries.forEach(item => {
      item.isActive = false
      const arrow = item.children[0]
      const title = item.children[1]
      arrow.active = false
      title.active = false
      title.opacity = 255
      arrow.opacity = 255
    })
  },

  getEntries () {
    const scenes = this.monsterData.scenes
    const entries = this.node.children.filter(item => (/entry/).test(item._name))
    entries.forEach((item, index) => {
      if (scenes[index]) {
        item.children[1].children[0].getComponent(cc.Label).string = scenes[index].scene_name
        item.children[1].children[1].getComponent(cc.Label).string = 0
        item.children[1].children[2].getComponent(cc.Label).string = '/' + scenes[index].monsters.length
      }
    })
    return entries
  },
  setEntryActive (entry) {
    entry.isActive = true
  },

  showArrow (entry) {
    this.entries.forEach(item => {
      const arrow = item.children[0]
      const title = item.children[1]

      const isActive = item.isActive

      if (item != entry) {
        arrow.active = !!isActive
        title.active = false
      } else {
        arrow.active = true
        title.active = false
      }
    })
  },
  showTitle (entry) {
    this.entries.forEach(item => {
      const arrow = item.children[0]
      const title = item.children[1]

      const isActive = item.isActive

      if (item != entry) {
        arrow.active = !!isActive
        title.active = false
      } else {
        arrow.active = false
        title.active = true
      }
    })
  },

  goBack() {
    cc.director.loadScene('catchmonster')
  },

  start () {

  }
})
