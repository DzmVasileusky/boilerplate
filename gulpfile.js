//'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const inlinesource = require('gulp-inline-source');
const htmlmin = require('gulp-htmlmin');
const spritesmith = require('gulp.spritesmith');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

/* Scripts
***********************************************/
gulp.task('scripts', () =>
  gulp.src(['_src/js/vendor/*.js', '_src/js/**/*.js', '_src/js/*.js'])
      .pipe(sourcemaps.init())
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(concat('js/script.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('/'))
      .pipe(rename('script.min.js'))
      .pipe(gulp.dest('js/'))
      .pipe(browserSync.stream())
);


/* Styles
***********************************************/

// critical css
gulp.task('styles-critical', () =>
  gulp.src('_src/scss/critical.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['> 1%', 'Android 3', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9'],
        cascade: false
      }))
      .pipe(rename('critical.css'))
      .pipe(gulp.dest('css/'))
      .pipe(csso())
      .pipe(sourcemaps.write('/'))
      .pipe(rename('critical.min.css'))
      .pipe(gulp.dest('css/'))
);

// all styles
gulp.task('styles-dev', () =>
  gulp.src('_src/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['> 1%', 'Android 3', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 9'],
        cascade: false
      }))
      .pipe(rename('style.css'))
      .pipe(gulp.dest('css/'))
      .pipe(csso())
      .pipe(sourcemaps.write('/'))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('css/'))
      .pipe(browserSync.stream())
);

// styles beatify on deploy
gulp.task('styles-prod', ['styles-critical', 'styles-dev'], () =>
  gulp.src(['css/style.css', 'css/critical.css'])
      .pipe(csscomb())
      .pipe(gulp.dest('css/'))
);


/* Html
***********************************************/
gulp.task('html', () =>
  gulp.src('_src/html/*.html')
      .pipe(inlinesource({compress: false}))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('.'))
      .pipe(browserSync.stream())
);


/* Sprites
***********************************************/
gulp.task('sprites', () =>
  gulp.src('img/sprites/*.png')
      .pipe(spritesmith({
          imgName: 'sprite.png',
          cssName: 'sprite.scss',
          imgPath: '../img/sprite.png',
          padding: 1
      }))
      .pipe(gulpif('*.png', gulp.dest('img/')))
      .pipe(gulpif('*.scss', gulp.dest('_src/scss/vendor/')))
);


/* Common
***********************************************/

// server and watcher
gulp.task('server', function() {
  browserSync.init({
    port : 3100,
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(['_src/**/*.js', '_src/*.js'], ['scripts']);
  gulp.watch(['_src/scss/*.scss', '_src/scss/**/*.scss', '_src/scss/**/**/*.scss'], ['styles-critical', 'styles-dev']);
  gulp.watch(['css/critical.min.css', '_src/html/*.html'], ['html']);
  gulp.watch(['img/sprites/*.png'], ['sprites']);
});

// default
gulp.task('default', [ 'scripts', 'styles-prod', 'html' ]);