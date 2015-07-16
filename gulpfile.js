var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    jade         = require('gulp-jade'),
    stylus       = require('gulp-stylus'),
    fileinclude  = require('gulp-file-include'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    livereload   = require('gulp-livereload'),
    lr           = require('tiny-lr'),
    connect      = require('gulp-connect'),
    plumber      = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer')
    server       = lr(),
    path         = require('path');

var paths = {
  templates: './templates/',
  stylus: './src/*.styl'
};

gulp.task('fileinclude', function() {
  return gulp.src(path.join(paths.templates, '*.jade'))
    .pipe(fileinclude())
    .pipe(rename({
      extname: ""
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('./'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Includes: included' }));
});

gulp.task('jade', function() {
  return gulp.src(path.join(paths.templates, '*.jade'))
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('./build/'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Jade files have reloaded' }));
});

gulp.task('stylus', function() {
  gulp.src('./build/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./build'));
});

/*gulp.task('stylus', function() {
  return gulp.src(path.join(paths.stylus, '*.styl'))
    .pipe(plumber())
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 version', "> 1%", 'ie 8', 'ie 9'],
      cascade: false
      }))
    .pipe(gulp.dest('./build/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Stylus files have reloaded' }));
});*/

gulp.task('connect', function() {
  connect.server({
    port: 1337,
    root: [__dirname],
    livereload: false
  });
});

function watchStuff(task) {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }; 
    gulp.watch(path.join(paths.stylus, '**/*.stylus'), [task]);
    gulp.watch(path.join(paths.templates, '**/*.jade'), ['fileinclude']);
    // NOTE: If above doesn't work try switching jade to html
  });
};

gulp.task('watch', function() {
  watchStuff('stylus');
});

gulp.task('default', ['fileinclude', 'stylus', 'connect', 'watch'], function() {
});

// test
