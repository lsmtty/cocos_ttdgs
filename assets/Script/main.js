class GameMain{
  static userInfo = null;
  static openid = '';
  static servertime = ''
  mainclass = null;

  login() {
    return new Promise((resolve, reject) => {
      wx.login()
    })
  }
  showUserInfoButton() {

  }

  static getMainClass() {
    if (this.mainclass) {
      return this.mainclass
    } else {
      this.mainclass = new GameMain();
      return this.mainclass;
    }
  }
}

exports.default = GameMain;