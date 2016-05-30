var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    beep = require('beepbeep'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    lodash = require('lodash'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp')    
;

var settings = require('./package.json').settings;

gulp.task('default', function() {
    gulp.src(settings.sass.input)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outFile: settings.sass.output,
        outputStyle: 'expanded'
    }))
    .on('end', function() {
        process.argv[process.argv.length-1] == '--beep' ? beep() : console.log('success');
    })
    .pipe(sourcemaps.write('../css')) //path relative to the gulp.dest()
    .pipe(gulp.dest(settings.sass.output));
});

gulp.task('sasswatch', function() {
    gulp.watch(settings.sass.input, ['default']);
});

gulp.task('iconfont', function() {
    gulp.src([settings.iconfont.input + '*.svg'])
        .pipe(iconfont({
            fontName: settings.iconfont.fontName, // required
            appendCodepoints: true, // recommended option
            normalize: true
        }))
        .on('codepoints', function(codepoints, options) {
            gulp.src(settings.iconfont.templates + '_icons.tpl')
                .pipe(
                    consolidate('lodash', {
                        fontName: options.fontName,
                        glyphs: codepoints
                    }))
                .pipe(rename('_icons.scss'))
                .pipe(gulp.dest(settings.iconfont.templates));
            gulp.src(settings.iconfont.templates + '_fonts.tpl')
                .pipe(
                    consolidate('lodash', {
                        fontPath: '../fonts/',
                        fontName: options.fontName,
                    }))
                .pipe(rename('_fonts_icons.scss'))
                .pipe(gulp.dest(settings.iconfont.templates));
        })
        .pipe(gulp.dest(settings.iconfont.output));
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
