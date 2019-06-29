export default {
  ttdgsLoadScene(sceneName, params) {
    let tempNode = new cc.Node();
    tempNode.name = sceneName;
    tempNode.paramsData = params;
    cc.game.addPersistRootNode(tempNode);
    cc.director.loadScene(sceneName);
  },

  getSceneParams(sceneName) {
    let tempNode = cc.find(sceneName);
    if (tempNode) {
      let targetData = tempNode.paramsData;
      cc.game.removePersistRootNode(tempNode);
      return targetData
    } else {
      return null;
    }
  }
}