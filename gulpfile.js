const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


gulp.task('cleanDist', function(){
    return gulp.src("dist/*")
        .pipe(clean());
  });

gulp.task('styles', function(){
    return gulp.src(['src/reset/*.scss', 'src/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function(){
    return gulp.src('src/*.js')
        .pipe(concat('common.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

  
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    
});

function browserReload(done) {
    browserSync.reload();
    done();
}

gulp.task('watch', function() {
    gulp.watch("src/*.scss", gulp.series('styles', browserReload));
    gulp.watch("src/reset/*.scss", gulp.series('styles', browserReload));
    gulp.watch("src/*.js", gulp.series('scripts', browserReload));
})

gulp.task('build', gulp.series(
    'cleanDist', 
    gulp.parallel(['styles', 'scripts', 'images'])
));

gulp.task('dev',  gulp.parallel('browser-sync', 'watch'))
