var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var autoprefixer = require('autoprefixer')
var sourcemaps   = require('gulp-sourcemaps')
var postcss      = require('gulp-postcss')
var cleanCSS     = require('gulp-clean-css')
var iconfont     = require('gulp-iconfont');
var iconfontCss  = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);
var concat       = require('gulp-concat');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var minifycss    = require('gulp-minify-css');
var cache        = require('gulp-cache')
var imagemin     = require('gulp-imagemin')
var fontName     = 'icon';

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        //.pipe(cleanCSS())
        .pipe(minifycss())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
})

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('iconfont', function(){
  gulp.src(['src/assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      targetPath: '../../scss/basic/_icons.scss',
      //fontPath: '../../build/assets/fonts/'
      fontPath: '../../../../build/assets/fonts/'
    }))
    .pipe(iconfont({
      prependUnicode: false, // Recommended option 
      fontName: fontName, // Name of the font
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // The font file formats that will be created
      normalize: true,
      timestamp: runTimestamp // Recommended to get consistent builds when watching files
     }))
    .pipe(gulp.dest('build/assets/fonts/'));
})

gulp.task('imagemin', function(){
    gulp.src('src/assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/assets/img'))
})

gulp.task('browser-sync', function() {
    //browserSync.init(['src/scss/**/*.scss', 'src/js/*.js'], {
    browserSync.init({
    	open: false,
        server: {
            baseDir: "./"
        }
    });
})

gulp.task('clear', function() {
    cache.clearAll()
})

gulp.task('default', ['sass', 'scripts', 'iconfont', 'imagemin', 'browser-sync'], function () {
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});