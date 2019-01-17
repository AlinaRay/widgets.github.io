'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const paths = {
    allSrcJs: 'src/js/**/*.js',
    distDir: 'dist'

};


gulp.task('scripts', () =>
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist/js'))
);
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('/src/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('default',gulp.series('sass', 'scripts', function () {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
}));