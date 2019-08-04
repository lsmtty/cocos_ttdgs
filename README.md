# 云平台构建方式

1.根据后台环境修改cloud/game.js 33行  后台环境为ttdgs_test 或者 ttdgs_release
2.cocos creator build之后 复制cloud 到build/wechatgame下
3. 再次构建的时候请务必关闭微信开发工具，不然build 目录因为cloudFunction文件夹被引用无法清除，build出错

