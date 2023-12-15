const {series, parallel} = require('gulp');
const gulp = require('gulp');
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const image = require("fix-esm").require('gulp-image');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

function tarefasCSS(cb){
    gulp.src([
            './node_modules/bootstrap/dist/css/bootstrap.css',
            './node_modules/owlcarousel/owl-carousel/owl.carousel.css',
            './node_modules/font-awesome/css/font-awesome.css',
            './node_modules/jquery-ui/dist/themes/base/jquery-ui.css',
            './src/css/style.css'
        ])
        .pipe(concat('libs.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))  // libs.min.css
        .pipe(gulp.dest('./dist/css'))
    
    return cb()
}

function tarefasJS(callback){
    gulp.src([
            './node_modules/jquery/dist/jquery.js',
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './node_modules/owlcarousel/owl-carousel/owl.carousel.js',
            './node_modules/jquery-mask-plugin/dist/jquery.mask.js',
            './node_modules/jquery-ui/dist/jquery-ui.js',
            './src/js/custom.js'
        ])
        .pipe(babel({
            comments: false,
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'})) //libs.min.js
        .pipe(gulp.dest('./dist/js'))
        
    return callback()
}

function tarefasImagem(){
    return gulp.src('./src/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/images'))
}

// POC - Proof of concept
function tarefasHTML(callback){
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
    
    return callback()
}

gulp.task('server', function(){
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
    gulp.watch('./src/**/*').on('change', process) //Repete o processo quando algo em src for alterado
    gulp.watch('./src/**/*').on('change', reload)
})

function end(cb){
    console.log('Tarefas concluidas')
    return cb()
}

const process = series(tarefasHTML, tarefasJS, tarefasCSS, end)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem
exports.default = process