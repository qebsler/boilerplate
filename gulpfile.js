const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const prefixer = require('gulp-autoprefixer')
const concatCSS = require('gulp-concat-css')
const uglifyCss = require('gulp-uglifycss')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const tinifyImg = require('gulp-tinify')
const htmlMin = require('gulp-html-minifier2')
const browsersync = require('browser-sync').create()
const webpack = require('webpack-stream')

gulp.task('bs-server', () => {
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('css', () => {
  return gulp.src('src/css/**/*.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(prefixer({
      browsers: ['last 2 versions', 'safari >= 8', 'ie >= 11'],
      cascade: false
    })).pipe(concatCSS('bundle.css'))
    .pipe(uglifyCss({
      maxLineLen: 1000,
      uglyComments: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.stream())
})

gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(webpack({output: {filename: 'bundle.js'}, mode: 'production'}))
    .pipe(babel({
      presets: ['env']
    })).pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browsersync.stream())
})

gulp.task('img', () => {
  return gulp.src('src/assets/**/*.jpg' || 'src/assets/**/*.png')
    .pipe(tinifyImg('6Iw24mzvAIja1nqbsb8yY2eFcwamF7KH'))
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('html', () => {
  return gulp.src('src/index.html')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream())
})

gulp.task('assets', () => {
  return gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('watch', [ 'bs-server', 'js', 'css', 'html', 'assets' ], () => {
  gulp.watch('src/js/*.js', ['js'])
  gulp.watch('src/css/*.css', ['css'])
  gulp.watch('src/index.html', ['html'])
})

gulp.task('default', [ 'html', 'css', 'js' ]) // IF I ADD A PICTURE, RUN THE "IMG" TASK

gulp.task('git', ['default'], () => {
  gulp.src('dist/**/*.*')
    .pipe(gulp.dest('build'))
})
