const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const url = require('url');
const proxyMiddleware = require('http-proxy-middleware');
const useref = require('gulp-useref');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

var proxy = proxyMiddleware('/api', {target: 'http://localhost:9080/BankWar'});

gulp.task('serve', function() {
    browsersync.init({
        port: 3000,
        server: {
            baseDir: "./dist",
            middleware: [proxy]
        }
    });
});

gulp.task('clean', function () {
    return gulp.src("./dist", {read: false})
        .pipe(clean());
});

gulp.task('build:concat', function () {
    return gulp.src('./*.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist'))
        .pipe(browsersync.reload({ stream:true }))
});

gulp.task('build:views', function () {
    return gulp.src('./views/*.html')
        .pipe(gulp.dest('./dist/views'))
        .pipe(browsersync.reload({ stream:true }))
});

gulp.task('build:images', function () {
    return gulp.src('./img/**')
        .pipe(gulp.dest('./dist/img'))
        .pipe(browsersync.reload({ stream:true }))
});

gulp.task('build', function () {
    runSequence('clean', ['build:concat', 'build:views', 'build:images'])
});

gulp.task('watch', function () {
    gulp.watch(['./*.html', 'css/*.css', '*.js', './services/*.js', './controllers/*.js'], ['build:concat']);
    gulp.watch(['./views/*.html'], ['build:views']);
});

gulp.task('dev', function () {
    runSequence('build', 'serve', 'watch')
});

gulp.task('default', ['dev']);