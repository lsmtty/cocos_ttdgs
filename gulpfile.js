var gulp = require('gulp');

gulp.task('copy',  function() {
  return gulp.src(['cloud/**/*', '!cloud/cloudfunction/node_modules/**/*'])
    .pipe(gulp.dest('build/wechatgame'))
});
 