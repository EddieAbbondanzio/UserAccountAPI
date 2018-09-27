var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var project = ts.createProject("tsconfig.json");

/**
 * Handles the building of Typescript files (ts) into their
 * appropriate Javascript counterparts. This is called via the
 * package.json build script.
 */
gulp.task("build", function() {
    return project.src()
        .pipe(sourcemaps.init())
        .pipe(project())
        .pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest("dist"));
});
