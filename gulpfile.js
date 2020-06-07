var gulp = require('gulp');
var rename = require('gulp-rename');

var isProd = (process.env.NODE_ENV == 'prod');3

gulp.task('copylib', function () {
  return gulp.src(['subpackage-pipe.js'])
    .pipe(gulp.dest('build/wechatgame/libs'))
})

gulp.task('copy_cloud',  function() {
  return gulp.src(['cloud/**/*', '!cloud/cloudfunction/node_modules/**/*', '!cloud/gameJs/**/*'])
    .pipe(gulp.dest('build/wechatgame'))
});

gulp.task('copy_gameJs', function() {
  return gulp.src(`cloud/gameJs/game_${isProd ? 'build': 'dev'}.js`)
    .pipe(rename('game.js'))
    .pipe(gulp.dest('build/wechatgame'))
});

gulp.task('pack', gulp.series(['copy_cloud', 'copy_gameJs'], async function() {
  console.log('pack fininshed');
}));

/**
 * 拷贝测试过后build中的的云函数到cloud
 */
gulp.task('copy-func', function () {
  return gulp.src('build/wechatgame/cloudfunction')
    .pipe(gulp.dest('cloud/cloudfunction'))
});