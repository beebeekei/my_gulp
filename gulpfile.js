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
    sassInput: './scss/**/*.scss',
    sassOutput: './css',
    iconFontInput: './fonts/icons/',
    iconFontTemplates: './scss/global/',
    iconFontOutput: './fonts/',
    iconFontName: 'iconFontName',
    spriteInput: './images/sprite/*.*',
    spriteOutputImage: './images/',
    spriteOutputSass: './scss/global/'
}

gulp.task('default', function() {
    gulp.src(settings.sassInput)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outFile: settings.sassOutput,
        outputStyle: 'expanded'
    }))
    .on('end', function() {
        process.argv[process.argv.length-1] == '--beep' ? beep() : console.log('success');
    })
    .pipe(sourcemaps.write('../css')) //path relative to the gulp.dest()
    .pipe(gulp.dest(settings.sassOutput));
});

gulp.task('sasswatch', function() {
    gulp.watch(settings.sassInput, ['default']);
});

gulp.task('iconfont', function() {
    gulp.src([settings.iconFontInput + '*.svg'])
        .pipe(iconfont({
            fontName: settings.iconFontName, // required
            appendCodepoints: true, // recommended option
            normalize: true
        }))
        .on('codepoints', function(codepoints, options) {
            gulp.src(settings.iconFontTemplates + '_icons.tpl')
                .pipe(
                    consolidate('lodash', {
                        fontName: options.fontName,
                        glyphs: codepoints
                    }))
                .pipe(rename('_icons.scss'))
                .pipe(gulp.dest(settings.iconFontTemplates));
            gulp.src(settings.iconFontTemplates + '_fonts.tpl')
                .pipe(
                    consolidate('lodash', {
                        fontPath: '../fonts/',
                        fontName: options.fontName,
                    }))
                .pipe(rename('_fonts_icons.scss'))
                .pipe(gulp.dest(settings.iconFontTemplates));
        })
        .pipe(gulp.dest(settings.iconFontOutput));
});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src(settings.spriteInput)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprites.scss',
                cssFormat: 'scss',
                padding: 2
            }));
    spriteData.img.pipe(gulp.dest(settings.spriteOutputImage));
    spriteData.css.pipe(gulp.dest(settings.spriteOutputSass));
});
