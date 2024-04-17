---
title: "Front-end Strategy with a sprinkling of ExpressionEngine"
date: 2014-12-13T14:30:00+00:00
permalink: "/front-end-strategy-with-a-sprinkling-of-expressionengine/"
layout: layouts/post.njk
tags:
- javascript
- css
---

My aim in the past while has been pointed towards front-end development, and exploring the different ways in which to produce a tidy result.

These examples point to ExpressionEngine paths, but you can customise them to any project you’re working on. I’m relatively new to the ExpressionEngine game, and some of what I’m going to outline will be eventually replaced by Niall O’Brien’s [EE Foundation generator](https://github.com/niallobrien/generator-ee-foundation), so that’s definitely something to keep an eye on.

As with many things, we start with Gulp. This will handle our assets and do some nifty things such as generating our critical CSS and automatically injecting our Bower components whenever we update them. See below for an example setup:


``` js
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var penthouse = require('penthouse');
var cleanCSS = require('clean-css');
var fs = require('fs');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('penthouse', ['styles'], function () {
  penthouse({
    url: ['http://yoursite.dev', 'http://yoursite.dev/anotherpage'],
    css: 'assets/styles/css/main.css',
    width: 1280,
    height: 800
  }, function (err, critical) {
    var clean = new cleanCSS().minify(critical);
    fs.writeFile('system/templates/default_site/critical.group/index.html', '<style>' + clean + '</style>');
  });
});

gulp.task('autoreload', function () {
    // Store current process if any
    var p;
    gulp.watch('./gulpfile.js', spawnChildren);
    // Comment the line below if you start your server by yourself anywhere else
    spawnChildren();

    function spawnChildren() {
        if(p) {
            p.kill();
        }

        p = spawn('gulp', ['watch'], {stdio: 'inherit'});
    }
});

gulp.task('styles', function () {
    return gulp.src('./assets/styles/scss/main.scss')
        .pipe($.plumber())
        .pipe($.sass({
          errLogToConsole: true
        }))
        .on('error', $.util.log)
        .pipe($.autoprefixer('last 1 version, Explorer >= 8'))
        .pipe($.pixrem())
        .pipe(gulp.dest('./assets/styles/css'))
        .pipe(reload({stream:true}))
        .pipe($.size())
        .pipe($.notify("Compilation complete."));
});

gulp.task('scripts', function () {
    return gulp.src('./assets/scripts/main.js')
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.browserify())
        .on('error', $.util.log)
        .pipe(reload({stream:true}))
        .pipe($.size())
        .pipe(gulp.dest('./assets/scripts/build'));
});

gulp.task('images', function () {
    return gulp.src('assets/graphics/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('assets/graphics/'))
        .pipe(reload({stream:true, once:true}))
        .pipe($.size());
});

gulp.task('build', function() {
    runSequence('wiredep', 'scripts', 'styles');
});

gulp.task('default', function () {
    gulp.start('build');
});

gulp.task('serve', ['styles', 'scripts', 'wiredep'], function () {
    browserSync.init(null, {
        proxy: "yoursite.dev",
        logInfo: 'info',
        open: 'external',
        hostnameSuffix: ".xip.io"
    }, function (err, bs) {
        require('opn');
        console.log('Started connect web server on ' + bs.options.urls.external);
    });
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('./system/templates/default_site/layouts.group/*.html')
        .pipe(wiredep({
            devDependencies: true,
            ignorePath:"../../../..",
            exclude: "/assets/lib/jquery/dist/jquery.js"
        }))
        .pipe(gulp.dest('./system/templates/default_site/layouts.group/'));
});

gulp.task('watch', ['serve'], function () {

    // watch for changes
    gulp.watch(['./system/templates/default_site/**/*.html'], reload);

    gulp.watch('assets/styles/scss/**/*.scss', ['styles']);
    gulp.watch('assets/scripts/**/*.js', ['scripts']);
    gulp.watch('bower.json', ['wiredep']);
});
```

This is just the standard-fare Gulp setup. We’ve got tasks for watching and compiling our assets. It’s the structure of these assets that I want to talk about.

## Styles

I’m using Sass (SCSS syntax), and I’m borrowing heavily from MVCSS for the structure. It’s a simplified version (i.e. I’ve left things out) to a point where I find it easier to manage.

## Core

This is the foundation of the project, where we establish defaults on tag-level elements, define variables, layouts, mixins… The files in here might go as follows:

- _base.scss — our tag-level styles.
- _config.scss — definition of our variables, fonts etc…
- _helpers.scss — mixins, placeholders, utility classes.
- _layout.scss — grid-type classes.
- _reset.scss — I like to use normalize.css
