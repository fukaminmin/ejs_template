var gulp = require('gulp'),

    //コンパイル中にエラーが起きたらそれを感知、desktopにnotificationを飛ばす
    plumber  = require('gulp-plumber'),
    notify   = require('gulp-notify'),

    // auto reaload
    browserSync = require('browser-sync'),

    // 現在のディレクトリを参照できる
    path     = require('path'),

    // sass, compassをcssにコンパイル、autoprefixerでベンダープレフィックス対応

    sass         = require('gulp-sass'),
    autoprefixer = require("gulp-autoprefixer"),

    // ejsを使用
    ejs = require('gulp-ejs'),
    fs  = require('fs'),

    frontends_path = 'frontends/',
    assets_path    = 'assets/';

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('compass',function(){
  gulp.src(frontends_path + 'scss/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest('./assets/stylesheets') )
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('ejs', function() {
  gulp.src(
    ['./frontends/ejs/*.ejs', '!./frontends/ejs/_*.ejs']
  )
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(ejs('', {ext: '.html'})
  )
  .pipe(gulp.dest('./views/'))
});


gulp.task('default', function(){
  browserSync({
    server: {
      baseDir: __dirname,
      root: './views/index.html'
    }
  });
  gulp.watch(frontends_path + 'ejs/**/*.ejs', ['ejs']);
  gulp.watch(frontends_path + 'es6/**/*.es6', ['babel']);
  gulp.watch(frontends_path + 'scss/**/*.scss', ['compass']);
  gulp.watch([
      './*.html',
      assets_path + 'stylesheets/**/**.css',
      assets_path + 'javascripts/**/*.js'
    ],['bs-reload']
  );
})