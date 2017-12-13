const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject("tsconfig.build.json");
const del = require('del');

gulp.task('clean-dist', () => {
  return del(['dist/**'])
});

gulp.task('build-src', () => {
  // Generate sourcemaps and js from ts
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write('.', {
      sourceRoot: (file) => { return file.cwd + '/src'; }
}))
.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  // TS source
  gulp.watch('src/**/*.ts', ['default']);
});

gulp.task('default', ['clean-dist', 'build-src']);