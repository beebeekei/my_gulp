var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    beep = require('beepbeep'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    lodash = require('lodash'),
    consolidate = require('gulp-consolidate'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber')
;

var settings = require('./package.json').settings;

gulp.task('sass', function() {
    var onError = function(err) {
        notify.onError({
                    title:    "Gulp",
                    subtitle: "Failure!",
                    message:  "Error: <%= error.message %>",
                    sound:    "Beep"
                })(err);

        this.emit('end');
    };
    gulp.src(settings.sass.input)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outFile: settings.sass.output,
        outputStyle: 'expanded'
    }))
    .on('end', function() {
        process.argv[process.argv.length-1] == '--beep' ? beep() : console.log('success');
    })
    .pipe(sourcemaps.write('../css')) //path relative to the gulp.dest()
    .pipe(gulp.dest(settings.sass.output))
    .pipe(livereload());
});

gulp.task('sasswatch', function() {
    livereload.listen();
    gulp.watch(settings.sass.input, ['sass']);
});

gulp.task('iconfont', function(){
    var runTimestamp = Math.round(Date.now()/1000);

    return gulp.src([settings.iconfont.input + '*.svg'])
        .pipe(iconfontCss({
            fontName: settings.iconfont.fontName,
            path: settings.iconfont.template + '_iconfont.scss',
            targetPath: settings.iconfont.outputScss + '_icons.scss',
            fontPath: '../fonts/',
            firstGlyph: 0xf120 // Codes for glyphs should be in area where are no icons by default on iOS and Android
        })).pipe(iconfont({
            fontName: settings.iconfont.fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            prependUnicode: true,
            fontHeight: 1001,
            timestamp: runTimestamp
        })).pipe(gulp.dest(settings.iconfont.outputFont));

});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src(settings.spritesmith.input)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprites.scss',
                cssFormat: 'scss',
                padding: 2
            }));
    spriteData.img.pipe(gulp.dest(settings.spritesmith.outputImage));
    spriteData.css.pipe(gulp.dest(settings.spritesmith.outputSass));
});

// http://loige.co/gulp-and-ftp-update-a-website-on-the-fly/

// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
    return ftp.create({
        host: settings.vinylFtp.host,
        port: settings.vinylFtp.port,
        user: settings.vinylFtp.user,
        password: settings.vinylFtp.password,
        parallel: 5,
        log: gutil.log
    });
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function() {

    var conn = getFtpConnection();

    return gulp.src([settings.vinylFtp.localWatchFolder + '/**/*'], { base: settings.vinylFtp.localWatchFolder, buffer: false })
        .pipe(conn.newer(settings.vinylFtp.remoteFolder)) // only upload newer files
        .pipe(conn.dest(settings.vinylFtp.remoteFolder));
});

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function() {

    var conn = getFtpConnection();

    gulp.watch([settings.vinylFtp.localWatchFolder + '/**/*'])
        .on('change', function(event) {
            console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);

            return gulp.src([event.path], { base: settings.vinylFtp.localWatchFolder, buffer: false })
                .pipe(conn.newer(settings.vinylFtp.remoteFolder)) // only upload newer files
                .pipe(conn.dest(settings.vinylFtp.remoteFolder));
        });
});
