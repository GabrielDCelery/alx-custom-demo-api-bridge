'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const concatcss = require('gulp-concat-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('css', function () {
    gulp
        .src('css/*.css')
        .pipe(autoprefixer())
        .pipe(concatcss('customstyle.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('javascript', function () {
    gulp
        .src(['js/form-buy-product.js', 'js/getdata-faq.js'])
        .pipe(uglify())
        .pipe(gulp.dest('minjs'))
        .pipe(gulp.dest('dist/minjs'));
});

gulp.task('html', function () {
    gulp
        .src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function () {
    gulp
        .src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function () {
    gulp.watch('sass/*.scss', ['sass', 'css']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('js/*.js', ['javascript']);
    gulp.watch('images', ['imagemin']);
    gulp.watch('php', ['php']);
    gulp.watch('settings.php', ['settings']);
    gulp.watch('*.html', ['htmlmin']);
});

gulp.task('default', [
    'css',
    'javascript',
    'html',
    'imagemin'
]);