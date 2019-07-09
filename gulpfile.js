var gulp = require("gulp"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps"),
	uglify = require("gulp-uglifyjs"),
	concat = require("gulp-concat"),
	gulpIf = require("gulp-if"),
	imagemin = require("gulp-imagemin"),
	pngquant = require("imagemin-pngquant"),
	livereload = require("gulp-livereload");

var paths = {
	styles: {
		src: "./assets/scss/**/*.scss",
		dest: "./assets/css"
	},
	scripts: {
		src: "./assets/lib/**/*.js",
		dest: "./assets/js"
	},
	images: {
		src: "./assets/imagery/**/*.+(jpg|png|jpeg)",
		dest: "./assets/img"
	},
	markup: {
		src: [
			"./**/*.+(php|html)",
			"!./node_modules/**/*.+(php|html)"
		]
	}
};

function style(){
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: "compressed"}))
		.on("error", sass.logError)
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write())
		.pipe(concat("app.css"))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(livereload());
}

function script(){
	return gulp
		.src(paths.scripts.src)
		.pipe(gulpIf("*.js", uglify("app.min.js")))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(livereload());
}

function imagery(){
	return gulp
		.src(paths.images.src)
		.pipe(imagemin({progressive: true, svgoPlugins: [{removeViewBox: false}], use: [pngquant()]}))
		.pipe(gulp.dest(paths.images.dest))
		.pipe(livereload());
}

function reload(){
	return gulp
		.src(paths.markup.src)
		.pipe(livereload());
}

function watch(){
	livereload.listen();
	gulp.watch(paths.styles.src, style);
	gulp.watch(paths.scripts.src, script);
	gulp.watch(paths.images.src, imagery);
	gulp.watch(paths.markup.src, reload);
}

exports.watch = watch;
exports.style = style;
exports.script = script;
exports.imagery = imagery;

var build = gulp.parallel(style, script, imagery);
gulp.task("build", build);

gulp.task("default", watch);