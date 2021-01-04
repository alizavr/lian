let preprocessor = 'scss';

const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean_css = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');
const iconfont = require('gulp-iconfont');
const gulpCleanCss = require('gulp-clean-css');
const iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);
var fontName = 'Icon';

function scripts() {
    return  src([
        'src/js/app.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js/'))
}

function styles() {
    return src('src/' + preprocessor + '/main.' + preprocessor)
    .pipe(eval(preprocessor)())
    .pipe(concat('app.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'], 
        grid: true
    }))
    .pipe(clean_css((
        {level: {
            1: {
                specialComments: 0
            }
        }
    }
    )))
    .pipe(dest('src/css/'))
}

function optimizeImg() {
    return src('src/img/src/**/*')
    .pipe(newer('src/img/dist'))
    .pipe(imagemin())
    .pipe(dest('src/img/dist'))
}

function cleanImg(){
    return del('src/img/dist/**/*', 
    {
        force: true
    })
}

function cleanDist(){
    return del('dist/**/*', 
    {
        force: true
    })
}

function buildCopy(){
    return src([
        'src/css/**/*.min.css',
        'src/js/**/*min.js',
        'src/img/dist/**/*',
        'src/**/*.html',
    ],
    {
       base: 'src' 
    })
    .pipe(dest('dist'))
}

function startWatch() {
    watch('src/img/src/**/*', optimizeImg);
    watch('src/**/' + preprocessor + '/**/*', styles);
    watch(['src/js/app.js', '!src/js/app.min.js'], scripts);
}

function iconFont() {
  return src(['src/icon/*.svg'])
    .pipe(iconfontCss({
        fontName: fontName,
        targetPath: '../scss/fonts.scss',
        fontPath: 'src/fonts'
    }) )
    .pipe(iconfont({
      fontName: 'Icon', 
      prependUnicode: true, 
      formats: ['ttf', 'eot', 'woff'], 
      timestamp: runTimestamp, 
      normalize: 'true',
      fontHeight: '1001',

    }))
      .on('glyphs', function(glyphs, options) {
        console.log(glyphs, options);
      })
    .pipe(dest('src/fonts/'));
    }   
exports.iconFont = iconFont;
exports.scripts = scripts;
exports.styles = styles;
exports.optimizeImg = optimizeImg;
exports.cleanImg = cleanImg;
exports.build = series(cleanDist, styles, scripts, optimizeImg, buildCopy);
exports.default = parallel(styles, scripts, startWatch);