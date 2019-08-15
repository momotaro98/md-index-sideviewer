const gulp = require('gulp');
const {merge} = require('event-stream');
const map = require('map-stream');
const $ = require('gulp-load-plugins')();
const version = require('./package.json').version;
const replaceExt = require('replace-ext');

gulp.task('clean', () => {
  return pipe(
    './tmp',
    $.clean()
  );
});

gulp.task('style', () => {
  return pipe(
    './src/styles/mdisviewer.less',
    $.plumber(),
    $.less({relativeUrls: true}),
    $.autoprefixer({cascade: true}),
    './tmp'
  );
});

gulp.task('template', () => {
  const LOTS_OF_SPACES = new Array(500).join(' ');

  return pipe(
    './src/template.html',
    $.replace('__SPACES__', LOTS_OF_SPACES),
    html2js('const TEMPLATE = \'$$\''),
    './tmp'
  );
});

gulp.task('js', gulp.series('template', () => {
  const src = [
    './tmp/template.js',
    './src/constants.js',
    './src/adapters/adapter.js',
    './src/adapters/gistmd.js',
    './src/view.index.js',
    './src/view.options.js',
    './src/util.async.js',
    './src/util.storage.js'
  ].concat(['./src/config/overrides.js'])
   .concat('./src/mdisviewer.js');

  return pipe(
    src,
    $.concat('mdisviewer.js'),
    './tmp'
  );
}));

gulp.task('devdist', gulp.series('js', (cb) => {
   merge(
    pipe('./icons/**/*', './tmp/app/icons'),
    pipe(['./libs/**/*', './tmp/mdisviewer.*'], './tmp/app/'),
    pipe('./src/config/background.js', './tmp/app/'),
    pipe('./src/config/manifest.json', $.replace('$VERSION', version), './tmp/app/')
  );
  cb(); // Need this callback after Gulp4 because `return merge()` doesn't returns stream
}));

gulp.task('build', gulp.series(
  'clean',
  'style',
  'template',
  'js',
  'devdist'
));

gulp.task('default', gulp.series('build', () => {
  gulp.watch(['./libs/**/*', './src/**/*'], gulp.task('default'));
}));

// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string';
    return stream.pipe(isDest ? gulp.dest(transform) : transform);
  }, gulp.src(src));
}

function html2js(template) {
  return map(escape);

  function escape(file, cb) {
    const path = replaceExt(file.path, '.js');
    const content = file.contents.toString();
    /* eslint-disable quotes */
    const escaped = content
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, "\\n' +\n    '");
    /* eslint-enable */
    const body = template.replace('$$', escaped);

    file.path = path;
    file.contents = Buffer.from(body);
    cb(null, file);
  }
}
