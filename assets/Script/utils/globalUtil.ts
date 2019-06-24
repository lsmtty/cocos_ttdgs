export class globalUtil{
  ccLoadScene(sceneName: string, params: Object) : void {
    let tempNode = new cc.Node();
    tempNode.name = sceneName;
    tempNode.paramsData = params;
    cc.game.addPersistRootNode(tempNode);
  }

  getScenesParams(sceneName: string) : any {
    let tempNode = cc.find('Canvas').getChildByName(sceneName);
    if (tempNode !== undefined) {
      let targetData = tempNode.paramsData;
      cc.game.removePersistRootNode(tempNode);
      return targetData
    } else {
      return null;
    }
  }
}