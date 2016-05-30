var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    beep = require('beepbeep'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    lodash = require('lodash'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith')
;

var settings = {
    sass: {
        input: './scss/**/*.scss',
        output: './css'
    },
    iconfont: {
        input: './fonts/icons/',
        templates: './scss/global/',
        output: './fonts/',
        fontName: 'iconFontName'
    },
    spritesmith: {
        input: './images/sprite/*.*',
        outputImage: './images/',
        outputSass: './scss/global/'
    }
}

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
