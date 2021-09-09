const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const zip = require('gulp-zip');
//const advzip = require('gulp-advzip');
const { src, series, parallel, dest, watch } = require('gulp');

const htmlPath = 'src/*.html';
const mediaPath = 'src/m/*.*';
const jsPath = ['./src/j/script.js', './src/j/mk.js', './src/j/sel.js', './src/j/game.js'];
//const audioPath = 'src/a/*.*';



function copyHtml() {
  return src(htmlPath).pipe(gulp.dest('dist'));
}

function copyMedia() {
  return src(mediaPath).pipe(gulp.dest('dist/src/m'));
}

// function copyAudio() {
//   return src(audioPath).pipe(gulp.dest('dist/src/a'));
// }

function jsConCat() {
  return gulp.src(jsPath)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/src/j/'));

}

function miniJS() {
  return gulp.src('./dist/src/j/script.js')
    .pipe(terser())
    .pipe(gulp.dest('./dist/src/j/'));
}

function zipAll() {

  return src('dist/**/*.*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'))

  // return src(zipPath)
  // .pipe(zip('archive.zip'))
  // .pipe(advzip())
  // .pipe(gulp.dest('out'));

}

// function watchTask() {
//   watch([htmlPath, jsPath, picPath], { interval: 1000 }, parallel( copyHtml, jsConCat));
// }

exports.default = series(
  copyHtml,
  copyMedia,
  //copyAudio,
  jsConCat,
  miniJS,
  zipAll
);

//exports.copyHtml = copyHtml;
//exports.jsConCat = jsConCat;
//exports.zipAll = zipAll;
//exports.default = series(
//   parallel(copyHtml,  jsTask, zipAll),
//   watchTask
// );

//copy folder to C:, rename *_local

//create dist folder

//npm install --save-dev gulp

//test copyHtml  , exports.default = copyHtml , terminal type gulp return

//in js files, remove import / export, except three & vr button (occurs only once at start)

//npm install --save-dev gulp-concat

//test, exports.default = parallel(copyHtml, jsConCat);, terminal type gulp return

//npm install gulp-terser --save-dev  , it is different to all others

//test, now in series, exports.default = series(copyHtml, jsConCat, miniJS);, terminal type gulp return

//npm install --save-dev gulp-zip

//npm install --save-dev gulp-advzip
