export default {
  ttdgsLoadScene(sceneName, params) {
    const tempNode = new cc.Node()
    tempNode.name = sceneName
    tempNode.paramsData = params
    cc.game.addPersistRootNode(tempNode)
    cc.director.loadScene(sceneName)
  },

  getSceneParams(sceneName) {
    const tempNode = cc.find(sceneName)
    if (tempNode) {
      const targetData = tempNode.paramsData
      cc.game.removePersistRootNode(tempNode)
      return targetData
    } else {
      return null
    }
  }
}
