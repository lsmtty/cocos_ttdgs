var gulp = require('gulp');

gulp.task('copylib', function () {
  return gulp.src(['subpackage-pipe.js'])
    .pipe(gulp.dest('build/wechatgame/libs'))
})

gulp.task('copy',  function() {
  return gulp.src(['cloud/**/*', '!cloud/cloudfunction/node_modules/**/*'])
    .pipe(gulp.dest('build/wechatgame'))
});

/**
 * 拷贝测试过后build中的的云函数到cloud
 */
gulp.task('copy-func', function () {
  return gulp.src('build/wechatgame/cloudfunction')
    .pipe(gulp.dest('cloud/cloudfunction'))
});