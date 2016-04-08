var gulp = require('gulp'),

    //catch error and notify it.
    plumber  = require('gulp-plumber'),
    notify   = require('gulp-notify'),

    // auto reaload when file changed
    browserSync = require('browser-sync'),

    // refer current dir
    path     = require('path'),

    //use sass syntax and autoprefixer
    sass         = require('gulp-sass'),
    autoprefixer = require("gulp-autoprefixer"),

    // ejs
    ejs = require('gulp-ejs'),
    fs  = require('fs'),

    // defined common pathes
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
    [frontends_path + 'ejs/*.ejs', '!./frontends/ejs/_*.ejs']
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