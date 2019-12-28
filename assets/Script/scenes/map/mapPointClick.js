import { App } from '../../utils/App'

const BASE_CONDITION_COUNT = 4
const entriesPosition = [
  {
    name: '第1关',
    x: -231,
    y: -77
  },
  {
    name: '第2关',
    x: -87,
    y: -153
  },
  {
    name: '第3关',
    x: -157,
    y: -237
  },
  {
    name: '第4关',
    x: -215,
    y: -337
  },
  {
    name: '第5关',
    x: 53,
    y: -447
  },
  {
    name: '第6关',
    x: 293,
    y: 251
  },
  {
    name: '第7关',
    x: 284,
    y: 358
  },
  {
    name: '第8关',
    x: 130,
    y: 408
  },
  {
    name: '第9关',
    x: -70,
    y: 324
  },
  {
    name: '第10关',
    x: -210,
    y: 456
  },
  {
    name: '第11关',
    x: -100,
    y: 40
  },
  {
    name: '第12关',
    x: -10,
    y: -60
  },
  {
    name: '第13关',
    x: 150,
    y: 40
  },
  {
    name: '第14关',
    x: 70,
    y: 168
  },
  {
    name: '第15关',
    x: -38,
    y: 88
  },
]

cc.Class({
  extends: cc.Component,

  properties: {
    entries: [],
    monsterData: [],
    BASE_CONDITION_COUNT,
    entryPrefab: {
      default: null,
      type: cc.Prefab
    },
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
      const arrow_red = item.children[2]
      const enterBtn = title.children[3]

      arrow_red.on('touchend', () => {
        if (!item.isActive) {
          wx.showModal({
            // title: '提示',
            showCancel: false,
            content: `你必须在前一关捉住至少${BASE_CONDITION_COUNT}只小怪兽，才可以探索本关哦~`,
            success (res) {
              console.log(res)
            }
          })
        }
      })
      arrow.on('touchend', () => {
        this.showTitle(item)
      })
      title.on('touchend', e => {
        // this.showArrow(item)
        e.stopPropagation()
        cc.sys.localStorage.setItem('lastSceneId', '' + (index + 1))
        cc.director.loadScene('catchmonster')
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
    this.setEntryActive(this.entries[0])
    scenes.forEach((item, index) => {
      let monstersCount = 0
      item.monsters.forEach(monster => {
        if (monster.own > 0) {
          monstersCount++
        }
      })
      this.entries[index].children[1].children[1].getComponent(cc.Label).string = monstersCount
      if (monstersCount >= this.BASE_CONDITION_COUNT && this.entries[index + 1]) {
        this.setEntryActive(this.entries[index + 1])
      }
    })
    this.showArrow(this.entries[0])
  },

  cleanEntries () {
    this.entries.forEach(item => {
      item.isActive = false
      const arrow = item.children[0]
      const title = item.children[1]
      const arrow_red = item.children[2]
      arrow.active = false
      title.active = false
      arrow_red.active = true
      title.opacity = 255
      arrow.opacity = 255
      arrow_red.opacity = 255
    })
  },

  getEntries () {
    let entries = []
    let scenes = this.monsterData.scenes

    entriesPosition.forEach((item ,index) => {
      let entry = cc.instantiate(this.entryPrefab)
      this.node.addChild(entry)
      entry.setPosition(cc.v2(item.x, item.y))
      if (scenes[index]) {
        entry.children[1].children[0].getComponent(cc.Label).string = scenes[index].scene_name
        entry.children[1].children[1].getComponent(cc.Label).string = 0
        entry.children[1].children[2].getComponent(cc.Label).string = '/' + scenes[index].monsters.length
      }
      entries.push(entry)
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
      const arrow_red = item.children[2]

      const isActive = item.isActive

      arrow_red.active = isActive ? false : true
      arrow.active = isActive ? true : false
      title.active = false
    })
  },
  showTitle (entry) {
    this.entries.forEach(item => {
      const arrow = item.children[0]
      const title = item.children[1]
      const arrow_red = item.children[2]

      const isActive = item.isActive

      if (item != entry) {
        arrow_red.active = isActive ? false : true
        arrow.active = isActive ? true : false
        title.active = false
      } else {
        arrow.active = false
        arrow_red.active = false
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
